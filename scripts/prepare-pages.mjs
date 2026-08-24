import { cp, rm } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('prototype');
const destination = path.resolve('.site-dist');

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });

// The Supabase-backed editor is safe to publish: authentication and every
// mutation are enforced server-side by Row Level Security.
await rm(path.join(destination, 'admin.js'), { force: true });

console.log('Prepared public Pages artifact with the Supabase-protected editor.');
