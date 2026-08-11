#!/usr/bin/env node

const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createFixtureRepo, cleanupFixtureRepo, git } = require('./fixture_repo');

const binder = path.resolve(__dirname, '..', 'scripts', 'bind_review_target.js');
const base = '// ==UserScript==\n// @name fixture\n// ==/UserScript==\n';
const repositories = [
    ['MODIFIED', createFixtureRepo(base, `${base}\nconst changed = true;\n`, 'modified.user.js'), 'modified.user.js'],
    ['ADDED', createFixtureRepo(null, base, 'added.user.js'), 'added.user.js'],
    ['DELETED', createFixtureRepo(base, null, 'deleted.user.js'), 'deleted.user.js'],
    ['MODIFIED', createFixtureRepo(base, `${base}\nconst changed = true;\n`, 'space path.user.js'), 'space path.user.js']
];
const renameRepo = createFixtureRepo(base, `${base}\n// rename fixture\n`, 'old path.user.js');
git(renameRepo, ['mv', 'old path.user.js', 'renamed path.user.js']);
git(renameRepo, ['commit', '-qm', 'rename fixture']);

try {
    for (const [expected, repo, file] of repositories) {
        const result = spawnSync(process.execPath, [binder, '--repo', repo, '--base', 'HEAD~1', '--head', 'HEAD', '--path', file, '--json'], { encoding: 'utf8' });
        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.equal(JSON.parse(result.stdout).change_type, expected);
    }
    const renamed = spawnSync(process.execPath, [binder, '--repo', renameRepo, '--base', 'HEAD~1', '--head', 'HEAD', '--path', 'renamed path.user.js', '--json'], { encoding: 'utf8' });
    assert.equal(renamed.status, 0, renamed.stderr || renamed.stdout);
    assert.equal(JSON.parse(renamed.stdout).change_type, 'RENAMED_OR_MODIFIED');
} finally {
    for (const [, repo] of repositories) cleanupFixtureRepo(repo);
    cleanupFixtureRepo(renameRepo);
}

console.log('test_bind_review_target: PASS');
