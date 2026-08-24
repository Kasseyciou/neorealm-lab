import { cp, rm } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('prototype');
const destination = path.resolve('.site-dist');

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });

for (const privateFile of ['admin.html', 'admin.js', 'admin.css']) {
  await rm(path.join(destination, privateFile), { force: true });
}

console.log('Prepared public Pages artifact without the local-only archive editor.');
