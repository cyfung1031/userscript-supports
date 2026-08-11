#!/usr/bin/env node

const crypto = require('node:crypto');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function usage() {
    console.error('Usage: node bind_review_target.js --base <ref> --head <ref> --path <repo-path> [--repo <dir>] [--json]');
}

function parseArgs(argv) {
    const args = { base: null, head: null, path: null, repo: process.cwd(), json: false };
    for (let i = 2; i < argv.length; i += 1) {
        if (argv[i] === '--base') args.base = argv[++i];
        else if (argv[i] === '--head') args.head = argv[++i];
        else if (argv[i] === '--path') args.path = argv[++i];
        else if (argv[i] === '--repo') args.repo = argv[++i];
        else if (argv[i] === '--json') args.json = true;
        else throw new Error(`Unknown argument: ${argv[i]}`);
    }
    return args;
}

function git(repo, args) {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error((result.stderr || result.error?.message || 'git failed').trim());
    return result.stdout;
}

function gitMaybe(repo, args) {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
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

function main() {
    try {
        const args = parseArgs(process.argv);
        if (!args.base || !args.head || !args.path) throw new Error('base, head, and path are required');
        if (path.isAbsolute(args.path) || args.path.includes('..')) throw new Error('path must be repository-relative');
        const baseRevision = git(args.repo, ['rev-parse', '--verify', `${args.base}^{commit}`]).trim();
        const headRevision = git(args.repo, ['rev-parse', '--verify', `${args.head}^{commit}`]).trim();
        const changed = splitNul(git(args.repo, ['diff', '--name-only', '-z', `${baseRevision}..${headRevision}`, '--', args.path]));
        if (!changed.includes(args.path)) throw new Error(`path is not changed between ${args.base} and ${args.head}`);
        const status = parseNameStatus(git(args.repo, ['diff', '--name-status', '--find-renames', '-z', `${baseRevision}..${headRevision}`]))
            .find(record => record.paths.includes(args.path));
        if (!status) throw new Error('target path is not changed between the bound revisions');
        const renamed = /^R\d+$/.test(status.status);
        const basePath = renamed ? status.paths[0] : args.path;
        const headPath = renamed ? status.paths[1] : args.path;
        const baseContent = gitMaybe(args.repo, ['show', `${baseRevision}:${basePath}`]);
        const headContent = gitMaybe(args.repo, ['show', `${headRevision}:${headPath}`]);
        if (baseContent === null && headContent === null) throw new Error('target path has no readable base or head blob');
        const changeType = renamed ? 'RENAMED_OR_MODIFIED'
            : baseContent === null ? 'ADDED'
            : headContent === null ? 'DELETED'
                : 'MODIFIED';
        const manifest = {
            base_revision: baseRevision,
            head_revision: headRevision,
            path: args.path,
            base_path: basePath,
            head_path: headPath,
            change_type: changeType,
            base_blob: baseContent === null ? null : blobSha(baseContent),
            head_blob: headContent === null ? null : blobSha(headContent),
            changed_paths: changed,
            repository: path.resolve(args.repo)
        };
        if (args.json) console.log(JSON.stringify(manifest, null, 2));
        else console.log(`BOUND ${manifest.path}\nbase=${manifest.base_revision} ${manifest.base_blob}\nhead=${manifest.head_revision} ${manifest.head_blob}`);
    } catch (error) {
        usage();
        console.error(`BIND_FAILED: ${error.message}`);
        process.exitCode = 1;
    }
}

main();
