#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

function usage() {
    console.error('Usage: node audit_userscript_change.js (--source <file> | --manifest <file>) [--json]');
}

function parseArgs(argv) {
    const args = { source: null, manifest: null, json: false };
    for (let i = 2; i < argv.length; i += 1) {
        if (argv[i] === '--source') args.source = argv[++i];
        else if (argv[i] === '--manifest') args.manifest = argv[++i];
        else if (argv[i] === '--json') args.json = true;
        else throw new Error(`Unknown argument: ${argv[i]}`);
    }
    if ((args.source ? 1 : 0) + (args.manifest ? 1 : 0) !== 1) throw new Error('provide exactly one of --source or --manifest');
    return args;
}

function gitShow(repository, revision, repositoryPath) {
    const result = spawnSync('git', ['-C', repository, 'show', `${revision}:${repositoryPath}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error((result.stderr || result.error?.message || 'git show failed').trim());
    return result.stdout;
}

function gitMaybe(repository, revision, repositoryPath) {
    const result = spawnSync('git', ['-C', repository, 'show', `${revision}:${repositoryPath}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return result.error || result.status !== 0 ? null : result.stdout;
}

function blobSha(content) {
    const body = Buffer.from(content, 'utf8');
    return crypto.createHash('sha1').update(`blob ${body.length}\0`).update(body).digest('hex');
}

function splitNul(output) {
    return output.split('\0').filter(Boolean);
}

function parseNameStatus(output) {
    const fields = splitNul(output);
    const records = [];
    for (let index = 0; index < fields.length;) {
        const status = fields[index++];
        const paths = /^R\d+$/.test(status)
            ? [fields[index++], fields[index++]]
            : [fields[index++]];
        if (paths.some(filePath => filePath === undefined)) throw new Error('malformed Git name-status record');
        records.push({ status, paths });
    }
    return records;
}

function loadManifest(file) {
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const key of ['base_revision', 'head_revision', 'path', 'repository', 'change_type', 'base_path', 'head_path', 'changed_paths']) {
        if (!manifest[key]) throw new Error(`manifest is missing ${key}`);
    }
    for (const key of ['base_blob', 'head_blob']) {
        if (!(key in manifest)) throw new Error(`manifest is missing ${key}`);
    }
    const changedResult = spawnSync('git', ['-C', manifest.repository, 'diff', '--name-only', '-z', `${manifest.base_revision}..${manifest.head_revision}`, '--', manifest.path], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (changedResult.error || changedResult.status !== 0) throw new Error((changedResult.stderr || changedResult.error?.message || 'git changed-path check failed').trim());
    const changedPaths = splitNul(changedResult.stdout);
    if (!Array.isArray(manifest.changed_paths) || JSON.stringify([...manifest.changed_paths].sort()) !== JSON.stringify([...changedPaths].sort())) {
        throw new Error('manifest changed_paths do not match Git');
    }
    const statusResult = spawnSync('git', ['-C', manifest.repository, 'diff', '--name-status', '--find-renames', '-z', `${manifest.base_revision}..${manifest.head_revision}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (statusResult.error || statusResult.status !== 0) throw new Error((statusResult.stderr || statusResult.error?.message || 'git status check failed').trim());
    const status = parseNameStatus(statusResult.stdout).find(record => record.paths.includes(manifest.path));
    if (!status) throw new Error('manifest path is not changed between the bound revisions');
    const renamed = /^R\d+$/.test(status.status);
    const basePath = renamed ? status.paths[0] : manifest.path;
    const headPath = renamed ? status.paths[1] : manifest.path;
    const base = gitMaybe(manifest.repository, manifest.base_revision, basePath);
    const head = gitMaybe(manifest.repository, manifest.head_revision, headPath);
    const changeType = renamed ? 'RENAMED_OR_MODIFIED'
        : base === null ? 'ADDED'
            : head === null ? 'DELETED'
                : 'MODIFIED';
    const expectedBaseBlob = base === null ? null : blobSha(base);
    const expectedHeadBlob = head === null ? null : blobSha(head);
    if (manifest.change_type !== changeType || manifest.base_path !== basePath || manifest.head_path !== headPath
        || manifest.base_blob !== expectedBaseBlob || manifest.head_blob !== expectedHeadBlob) {
        throw new Error('manifest identity does not match Git path, change type, or blob state');
    }
    const diffResult = spawnSync('git', ['-C', manifest.repository, 'diff', '--unified=0', `${manifest.base_revision}..${manifest.head_revision}`, '--', manifest.path], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (diffResult.error || diffResult.status !== 0) throw new Error((diffResult.stderr || diffResult.error?.message || 'git diff failed').trim());
    return {
        binding: {
            status: 'BOUND',
            base_revision: manifest.base_revision,
            head_revision: manifest.head_revision,
            path: manifest.path,
            change_type: manifest.change_type || 'MODIFIED',
            base_blob: manifest.base_blob || null,
            head_blob: manifest.head_blob || null
        },
        base,
        head,
        diff: diffResult.stdout
    };
}

function classify(source) {
    const modules = new Set();
    if (/==UserScript==|@(?:grant|require|match|run-at|inject-into|connect)\b|\bGM(?:_|\.)/.test(source)) modules.add('userscript-runtime');
    if (/\b(?:document|window|Element|Node|querySelector|createElement|MutationObserver|ResizeObserver|IntersectionObserver|PerformanceObserver|addEventListener|dispatchEvent|EventTarget)\b/.test(source)) modules.add('dom-css');
    if (/\b(?:style|CSSStyleSheet|GM_addStyle|insertAdjacentHTML|classList|shadowRoot|theme|appearance|stylesheet|selector|media|css)\b|<style[\s>]/i.test(source)) modules.add('dom-css');
    if (/\b(?:async|await|Promise|setTimeout|setInterval|requestAnimationFrame|AbortController|MutationObserver|ResizeObserver|IntersectionObserver|PerformanceObserver|open|close|teardown|destroy)\b/.test(source)) modules.add('async-state');
    if (/\b(?:fetch|XMLHttpRequest|GM\.xmlHttpRequest|GM_xmlhttpRequest|postMessage|BroadcastChannel)\b/.test(source)) modules.add('network-storage');
    if (/\b(?:GM\.(?:getValue|setValue|deleteValue|listValues)|GM_(?:getValue|setValue|deleteValue|listValues)|localStorage|sessionStorage|indexedDB|cache)\b/i.test(source)) modules.add('network-storage');
    if (/\b(?:eval|Function|innerHTML|outerHTML|insertAdjacentHTML|document\.write|unsafeWindow)\b/.test(source)) modules.add('security-boundary');
    return [...modules].sort();
}

function directives(source) {
    const block = /\/\/ ==UserScript==([\s\S]*?)\/\/ ==\/UserScript==/.exec(source)?.[1] || '';
    const keys = [...block.matchAll(/^\s*\/\/\s+@([^\s]+)/gm)].map(match => match[1]);
    const repeatable = new Set(['grant', 'match', 'connect', 'require', 'exclude', 'include', 'noframes', 'compatible', 'antifeature']);
    const duplicates = [...new Set(keys.filter((key, index) => !repeatable.has(key) && keys.indexOf(key) !== index))];
    return { present: Boolean(block), closed: Boolean(/\/\/ ==\/UserScript==/.test(source)), duplicates };
}

function parseCheck(source) {
    try {
        new vm.Script(source, { filename: 'userscript-review-source.js' });
        return { status: 'PASS' };
    } catch (error) {
        return { status: 'FAIL', detail: error.message };
    }
}

function auditSource(source) {
    const metadata = directives(source);
    const modules = classify(source);
    const checks = [
        { id: 'syntax', ...parseCheck(source) },
        { id: 'userscript-metadata-present', status: metadata.present ? 'PASS' : 'FAIL' },
        { id: 'userscript-metadata-closed', status: metadata.closed ? 'PASS' : 'FAIL' },
        { id: 'duplicate-metadata-directives', status: metadata.duplicates.length ? 'WARN' : 'PASS', detail: metadata.duplicates.join(', ') }
    ];
    return { modules, metadata, checks, pass: checks.every(check => check.status !== 'FAIL') };
}

function main() {
    try {
        const args = parseArgs(process.argv);
        let binding = { status: 'UNBOUND', reason: 'unit fixture source; not an exact review artifact' };
        let head;
        let base = null;
        let diff = '';
        if (args.manifest) {
            const loaded = loadManifest(args.manifest);
            ({ binding, base, head, diff } = loaded);
        } else {
            head = fs.readFileSync(args.source, 'utf8');
        }
        const candidate = head === null
            ? null
            : auditSource(head || '');
        const baseline = base === null ? null : auditSource(base);
        const changedModules = diff ? classify(diff) : [];
        const candidateModules = candidate?.modules || [];
        const unverified = [];
        if (candidateModules.includes('userscript-runtime')) unverified.push('manager/API permissions and injection-world behavior');
        if (candidateModules.includes('dom-css')) unverified.push('browser rendering, navigation, focus, and geometry');
        if (candidateModules.includes('async-state')) unverified.push('event ordering, cancellation, teardown, and late results');
        if (candidateModules.includes('network-storage')) unverified.push('external network/storage integration and failure modes');
        if (candidateModules.includes('security-boundary')) unverified.push('hostile-input and privilege-boundary runtime behavior');
        if (candidate === null) unverified.push('deleted head source is unavailable for written-source verification');
        const result = {
            binding,
            candidate,
            baseline,
            differential: baseline ? {
                added_modules: candidateModules.filter(module => !baseline.modules.includes(module)),
                removed_modules: baseline.modules.filter(module => !candidateModules.includes(module)),
                changed_modules: changedModules
            } : null,
            audit_result: candidate === null ? 'INSUFFICIENT_EVIDENCE' : candidate.pass ? 'NO_GAP_FOUND' : 'POTENTIAL_GAP',
            written_source_status: candidate?.pass && binding.status === 'BOUND' ? 'SOURCE_READY' : 'SOURCE_NOT_READY',
            runtime_validation: unverified.length === 0 ? 'AVAILABLE' : 'UNVERIFIED',
            review_disposition: candidate === null
                ? 'BLOCKED_ON_ORACLE'
                : candidate.pass && binding.status === 'BOUND' && unverified.length === 0 ? 'READY' : 'NOT_READY',
            changed_modules: changedModules,
            evidence_tier: binding.status === 'BOUND' ? 'SOURCE_DETERMINISTIC' : 'FIXTURE_EXECUTED',
            unverified
        };
        if (args.json) console.log(JSON.stringify(result, null, 2));
        else {
            console.log(`binding=${binding.status} modules=${candidateModules.join(',') || 'none'}`);
            for (const check of candidate?.checks || []) console.log(`[${check.status}] ${check.id}`);
            console.log(`${result.audit_result} ${result.review_disposition}`);
        }
        process.exitCode = candidate?.pass ? 0 : 1;
    } catch (error) {
        usage();
        console.error(`AUDIT_FAILED: ${error.message}`);
        process.exitCode = 2;
    }
}

main();
