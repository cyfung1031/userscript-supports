#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const auditor = path.join(root, 'scripts', 'audit_userscript_change.js');
const good = path.join(__dirname, 'fixtures', 'generic-good.user.js');

function run(source) {
    return spawnSync(process.execPath, [auditor, '--source', source, '--json'], { encoding: 'utf8' });
}

const passing = run(good);
assert.equal(passing.status, 0, passing.stderr || passing.stdout);
const result = JSON.parse(passing.stdout);
assert.equal(result.binding.status, 'UNBOUND');
assert.deepEqual(result.candidate.modules, [
    'async-state', 'dom-css', 'network-storage', 'security-boundary', 'userscript-runtime'
]);
assert.equal(result.candidate.pass, true);
assert.equal(result.audit_result, 'NO_GAP_FOUND');
assert.equal(result.written_source_status, 'SOURCE_NOT_READY');
assert.equal(result.runtime_validation, 'UNVERIFIED');
assert.equal(result.review_disposition, 'NOT_READY');

const brokenPath = path.join(os.tmpdir(), `userscript-review-${process.pid}.user.js`);
fs.writeFileSync(brokenPath, fs.readFileSync(good, 'utf8').replace('// ==/UserScript==', ''));
try {
    const failing = run(brokenPath);
    assert.notEqual(failing.status, 0);
    const failure = JSON.parse(failing.stdout);
    assert.equal(failure.candidate.checks.find(check => check.id === 'userscript-metadata-closed').status, 'FAIL');
} finally {
    fs.rmSync(brokenPath, { force: true });
}

console.log('test_audit_userscript_change: PASS');
