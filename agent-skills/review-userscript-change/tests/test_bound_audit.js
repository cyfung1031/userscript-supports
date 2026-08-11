#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createFixtureRepo, cleanupFixtureRepo } = require('./fixture_repo');

const root = path.resolve(__dirname, '..');
const binder = path.join(root, 'scripts', 'bind_review_target.js');
const auditor = path.join(root, 'scripts', 'audit_userscript_change.js');
const base = fs.readFileSync(path.join(__dirname, 'fixtures', 'generic-good.user.js'), 'utf8');
const head = `${base}\nconst observer = new ResizeObserver(() => {});\n`;
const repo = createFixtureRepo(base, head);
const spacedRepo = createFixtureRepo(base, head, 'space path.user.js');
const divergentBase = '// ==UserScript==\n// @name divergent\n// ==/UserScript==\n';
const divergentRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'userscript-review-divergent-'));
function divergentGit(args) {
    const result = spawnSync('git', ['-C', divergentRepo, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return result.stdout.trim();
}
fs.writeFileSync(path.join(divergentRepo, '.fixture-anchor'), 'anchor\n');
fs.writeFileSync(path.join(divergentRepo, 'candidate.user.js'), divergentBase);
divergentGit(['init', '-q']);
divergentGit(['config', 'user.email', 'review@example.test']);
divergentGit(['config', 'user.name', 'Review Fixture']);
divergentGit(['add', '-A']);
divergentGit(['commit', '-qm', 'base']);
divergentGit(['branch', 'feature']);
divergentGit(['checkout', '-q', 'feature']);
fs.writeFileSync(path.join(divergentRepo, 'candidate.user.js'), `${divergentBase}\nfetch('/feature');\n`);
divergentGit(['add', '-A']);
divergentGit(['commit', '-qm', 'feature']);
divergentGit(['branch', 'base', 'HEAD~1']);
divergentGit(['checkout', '-q', 'base']);
fs.writeFileSync(path.join(divergentRepo, 'candidate.user.js'), `${divergentBase}\nnew ResizeObserver(() => {});\n`);
divergentGit(['add', '-A']);
divergentGit(['commit', '-qm', 'base diverged']);
divergentGit(['checkout', '-q', 'feature']);
const boundManifest = path.join(os.tmpdir(), `userscript-review-manifest-${process.pid}.json`);
const tamperedManifest = path.join(os.tmpdir(), `userscript-review-manifest-tampered-${process.pid}.json`);
const missingBaseManifest = path.join(os.tmpdir(), `userscript-review-manifest-missing-base-${process.pid}.json`);
const wrongPathManifest = path.join(os.tmpdir(), `userscript-review-manifest-wrong-path-${process.pid}.json`);
const deletedManifest = path.join(os.tmpdir(), `userscript-review-manifest-deleted-${process.pid}.json`);
const spacedManifest = path.join(os.tmpdir(), `userscript-review-manifest-spaced-${process.pid}.json`);
const divergentManifest = path.join(os.tmpdir(), `userscript-review-manifest-divergent-${process.pid}.json`);

try {
    const bound = spawnSync(process.execPath, [binder, '--repo', repo, '--base', 'HEAD~1', '--head', 'HEAD', '--path', 'candidate.user.js', '--json'], { encoding: 'utf8' });
    assert.equal(bound.status, 0, bound.stderr || bound.stdout);
    fs.writeFileSync(boundManifest, bound.stdout);
    const audited = spawnSync(process.execPath, [auditor, '--manifest', boundManifest, '--json'], { encoding: 'utf8' });
    assert.equal(audited.status, 0, audited.stderr || audited.stdout);
    const result = JSON.parse(audited.stdout);
    assert.equal(result.binding.status, 'BOUND');
    assert.equal(result.baseline !== null, true);
    assert.equal(result.evidence_tier, 'SOURCE_DETERMINISTIC');
    assert.equal(result.written_source_status, 'SOURCE_READY');
    assert.equal(result.review_disposition, 'NOT_READY');
    assert.equal(result.runtime_validation, 'UNVERIFIED');
    assert.ok(result.differential.changed_modules.includes('dom-css'));
    assert.ok(result.differential.changed_modules.includes('async-state'));

    const spacedBound = spawnSync(process.execPath, [binder, '--repo', spacedRepo, '--base', 'HEAD~1', '--head', 'HEAD', '--path', 'space path.user.js', '--json'], { encoding: 'utf8' });
    assert.equal(spacedBound.status, 0, spacedBound.stderr || spacedBound.stdout);
    fs.writeFileSync(spacedManifest, spacedBound.stdout);
    const spacedAudited = spawnSync(process.execPath, [auditor, '--manifest', spacedManifest, '--json'], { encoding: 'utf8' });
    assert.equal(spacedAudited.status, 0, spacedAudited.stderr || spacedAudited.stdout);

    const divergentBound = spawnSync(process.execPath, [binder, '--repo', divergentRepo, '--base', 'base', '--head', 'feature', '--path', 'candidate.user.js', '--json'], { encoding: 'utf8' });
    assert.equal(divergentBound.status, 0, divergentBound.stderr || divergentBound.stdout);
    fs.writeFileSync(divergentManifest, divergentBound.stdout);
    const divergentAudited = spawnSync(process.execPath, [auditor, '--manifest', divergentManifest, '--json'], { encoding: 'utf8' });
    assert.equal(divergentAudited.status, 0, divergentAudited.stderr || divergentAudited.stdout);
    const divergentResult = JSON.parse(divergentAudited.stdout);
    assert.deepEqual(divergentResult.differential.changed_modules, ['async-state', 'dom-css', 'network-storage']);

    const tampered = { ...JSON.parse(bound.stdout), head_blob: '0'.repeat(40) };
    fs.writeFileSync(tamperedManifest, JSON.stringify(tampered));
    const rejected = spawnSync(process.execPath, [auditor, '--manifest', tamperedManifest, '--json'], { encoding: 'utf8' });
    assert.equal(rejected.status, 2);
    assert.match(rejected.stderr, /AUDIT_FAILED/);

    const missingBase = { ...JSON.parse(bound.stdout) };
    delete missingBase.base_blob;
    fs.writeFileSync(missingBaseManifest, JSON.stringify(missingBase));
    const missingBaseResult = spawnSync(process.execPath, [auditor, '--manifest', missingBaseManifest, '--json'], { encoding: 'utf8' });
    assert.equal(missingBaseResult.status, 2);
    assert.match(missingBaseResult.stderr, /AUDIT_FAILED/);

    const wrongPath = { ...JSON.parse(bound.stdout), path: 'unrelated.user.js' };
    fs.writeFileSync(wrongPathManifest, JSON.stringify(wrongPath));
    const wrongPathResult = spawnSync(process.execPath, [auditor, '--manifest', wrongPathManifest, '--json'], { encoding: 'utf8' });
    assert.equal(wrongPathResult.status, 2);
    assert.match(wrongPathResult.stderr, /AUDIT_FAILED/);

    const deletedRepo = createFixtureRepo(base, null, 'deleted.user.js');
    try {
        const deletedBinding = spawnSync(process.execPath, [binder, '--repo', deletedRepo, '--base', 'HEAD~1', '--head', 'HEAD', '--path', 'deleted.user.js', '--json'], { encoding: 'utf8' });
        assert.equal(deletedBinding.status, 0, deletedBinding.stderr || deletedBinding.stdout);
        fs.writeFileSync(deletedManifest, deletedBinding.stdout);
        const deletedAudit = spawnSync(process.execPath, [auditor, '--manifest', deletedManifest, '--json'], { encoding: 'utf8' });
        assert.equal(deletedAudit.status, 1, deletedAudit.stderr || deletedAudit.stdout);
        const deletedResult = JSON.parse(deletedAudit.stdout);
        assert.equal(deletedResult.binding.change_type, 'DELETED');
        assert.equal(deletedResult.audit_result, 'INSUFFICIENT_EVIDENCE');
        assert.equal(deletedResult.review_disposition, 'BLOCKED_ON_ORACLE');
        assert.equal(deletedResult.written_source_status, 'SOURCE_NOT_READY');
    } finally {
        cleanupFixtureRepo(deletedRepo);
    }
} finally {
    cleanupFixtureRepo(repo);
    cleanupFixtureRepo(spacedRepo);
    cleanupFixtureRepo(divergentRepo);
    fs.rmSync(boundManifest, { force: true });
    fs.rmSync(tamperedManifest, { force: true });
    fs.rmSync(missingBaseManifest, { force: true });
    fs.rmSync(wrongPathManifest, { force: true });
    fs.rmSync(deletedManifest, { force: true });
    fs.rmSync(spacedManifest, { force: true });
    fs.rmSync(divergentManifest, { force: true });
}

console.log('test_bound_audit: PASS');
