const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function git(repo, args) {
    const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || `git ${args.join(' ')} failed`);
    return result.stdout.trim();
}

function createFixtureRepo(baseSource, headSource, file = 'candidate.user.js') {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'userscript-review-repo-'));
    git(repo, ['init', '-q']);
    git(repo, ['config', 'user.email', 'review@example.test']);
    git(repo, ['config', 'user.name', 'Review Fixture']);
    fs.writeFileSync(path.join(repo, '.fixture-anchor'), 'anchor\n');
    if (baseSource !== null) fs.writeFileSync(path.join(repo, file), baseSource);
    git(repo, ['add', '-A']);
    git(repo, ['commit', '-qm', 'base']);
    if (headSource === null) fs.rmSync(path.join(repo, file), { force: true });
    else fs.writeFileSync(path.join(repo, file), headSource);
    git(repo, ['add', '-A']);
    git(repo, ['commit', '-qm', 'head']);
    return repo;
}

function cleanupFixtureRepo(repo) {
    fs.rmSync(repo, { recursive: true, force: true });
}

module.exports = { createFixtureRepo, cleanupFixtureRepo, git };
