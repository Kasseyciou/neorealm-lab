import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const publicRoot = path.resolve('.site-dist');
const forbiddenPublicFiles = new Set(['admin.html', 'admin.js', 'admin.css']);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\bEAA[A-Za-z0-9]{40,}\b/,
  /(?:access[_-]?token|client[_-]?secret)\s*[:=]\s*["'][^"']{16,}["']/i,
];
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.md']);
const findings = [];

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(publicRoot, absolute);
    if (entry.isDirectory()) {
      await scan(absolute);
      continue;
    }
    if (forbiddenPublicFiles.has(relative)) findings.push(`${relative}: private editor file is publicly deployable`);
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const contents = await readFile(absolute, 'utf8');
    secretPatterns.forEach((pattern) => {
      if (pattern.test(contents)) findings.push(`${relative}: possible embedded credential`);
    });
  }
}

await scan(publicRoot);

if (findings.length) {
  console.error(`Security audit failed:\n${findings.map((finding) => `- ${finding}`).join('\n')}`);
  process.exit(1);
}

console.log('Security audit passed: no public admin files or common embedded credential patterns found.');
