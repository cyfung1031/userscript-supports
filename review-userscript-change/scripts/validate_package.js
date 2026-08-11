#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const failures = [];

function requireFile(relativePath) {
    const absolute = path.join(root, relativePath);
    if (!fs.existsSync(absolute)) failures.push(`missing ${relativePath}`);
    return absolute;
}

const skillPath = requireFile('SKILL.md');
const metadataPath = requireFile('agents/openai.yaml');
const packageTextFiles = [];
function collectTextFiles(directory) {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) collectTextFiles(file);
        else if (!entry.name.endsWith('.png') && !entry.name.endsWith('.jpg') && !entry.name.endsWith('.gif')) packageTextFiles.push(file);
    }
}
collectTextFiles(root);
if (fs.existsSync(skillPath)) {
    const skill = fs.readFileSync(skillPath, 'utf8');
    if (!/^---\nname:\s*[a-z0-9-]+\ndescription:\s*.+\n---/s.test(skill)) failures.push('invalid SKILL.md frontmatter');
}
if (fs.existsSync(metadataPath) && !/display_name:\s*".+"[\s\S]*short_description:\s*".+"[\s\S]*default_prompt:\s*".*\$review-userscript-change/.test(fs.readFileSync(metadataPath, 'utf8'))) {
    failures.push('invalid agents/openai.yaml interface');
}

for (const directory of ['scripts', 'tests']) {
    const absolute = path.join(root, directory);
    if (!fs.existsSync(absolute)) continue;
    const stack = [absolute];
    while (stack.length) {
        const current = stack.pop();
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const file = path.join(current, entry.name);
            if (entry.isDirectory()) stack.push(file);
            else if (entry.name.endsWith('.js')) {
                const parsed = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
                if (parsed.status !== 0) failures.push(`syntax failure ${path.relative(root, file)}: ${parsed.stderr.trim()}`);
            }
        }
    }
}

for (const match of fs.readFileSync(skillPath, 'utf8').matchAll(/\]\((references\/[^)]+)\)/g)) requireFile(match[1]);

const taskSpecificPatterns = [/\b(?:pull request|PR|issue|commit)\s*#\d+\b/i, /\bpull\/\d+\b/i];
for (const file of packageTextFiles) {
    if (file === __filename) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (taskSpecificPatterns.some(pattern => pattern.test(content))) failures.push(`package contains task-specific locator ${path.relative(root, file)}`);
}

if (failures.length) {
    console.error(failures.map(failure => `PACKAGE_INVALID: ${failure}`).join('\n'));
    process.exitCode = 1;
} else {
    console.log('PACKAGE_VALID');
}
