import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID || 'me';
const siteRoot = path.resolve('prototype');
const mediaDirectory = path.join(siteRoot, 'assets', 'instagram-live');
const feedPath = path.join(siteRoot, 'data', 'instagram-feed.json');
const fields = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
  'username',
  'children{media_type,media_url,thumbnail_url}',
].join(',');

if (!token) {
  console.log('INSTAGRAM_ACCESS_TOKEN is not configured; keeping the curated fallback feed.');
  process.exit(0);
}

const endpoint = new URL(`https://graph.instagram.com/${userId}/media`);
endpoint.searchParams.set('fields', fields);
endpoint.searchParams.set('limit', '20');
endpoint.searchParams.set('access_token', token);

const response = await fetch(endpoint, {
  headers: { Accept: 'application/json' },
});

if (!response.ok) {
  const message = await response.text();
  throw new Error(`Instagram API returned ${response.status}: ${message.slice(0, 500)}`);
}

const payload = await response.json();
if (!Array.isArray(payload.data) || !payload.data.length) {
  throw new Error('Instagram API returned no media; the current Pages deployment is left untouched.');
}

await mkdir(mediaDirectory, { recursive: true });
await mkdir(path.dirname(feedPath), { recursive: true });

const retainedFiles = new Set();
const items = [];

for (const media of payload.data.slice(0, 20)) {
  const sourceUrl = media.media_type === 'VIDEO'
    ? media.thumbnail_url || media.media_url
    : media.media_url;
  if (!sourceUrl || !media.id || !media.permalink) continue;

  const mediaResponse = await fetch(sourceUrl);
  if (!mediaResponse.ok) {
    console.warn(`Skipping ${media.id}: media download returned ${mediaResponse.status}.`);
    continue;
  }

  const contentType = mediaResponse.headers.get('content-type') || 'image/jpeg';
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const filename = `${String(media.id).replace(/[^a-zA-Z0-9_-]/g, '')}.${extension}`;
  retainedFiles.add(filename);
  await writeFile(path.join(mediaDirectory, filename), Buffer.from(await mediaResponse.arrayBuffer()));

  let videoSrc = media.media_type === 'VIDEO' ? media.media_url || '' : '';
  if (media.media_type === 'VIDEO' && media.media_url) {
    const videoResponse = await fetch(media.media_url);
    if (videoResponse.ok) {
      const videoFilename = `${String(media.id).replace(/[^a-zA-Z0-9_-]/g, '')}.mp4`;
      retainedFiles.add(videoFilename);
      await writeFile(path.join(mediaDirectory, videoFilename), Buffer.from(await videoResponse.arrayBuffer()));
      videoSrc = `./assets/instagram-live/${videoFilename}`;
    } else {
      console.warn(`Reel ${media.id} will use its poster only: video download returned ${videoResponse.status}.`);
    }
  }

  const caption = String(media.caption || '').replace(/\s+/g, ' ').trim();
  const title = caption.split(/[。！？.!?\n]/)[0].trim().slice(0, 72) || 'NeoRealm LAB Visual';
  const carousel = [];
  for (const [childIndex, child] of (media.children?.data || []).entries()) {
    const childSource = child.media_type === 'VIDEO'
      ? child.thumbnail_url || child.media_url
      : child.media_url;
    if (!childSource) continue;
    const childResponse = await fetch(childSource);
    if (!childResponse.ok) {
      console.warn(`Skipping carousel child ${child.id || childIndex}: download returned ${childResponse.status}.`);
      continue;
    }
    const childType = childResponse.headers.get('content-type') || 'image/jpeg';
    const childExtension = childType.includes('png') ? 'png' : childType.includes('webp') ? 'webp' : 'jpg';
    const childFilename = `${String(media.id).replace(/[^a-zA-Z0-9_-]/g, '')}-slide-${childIndex + 1}.${childExtension}`;
    retainedFiles.add(childFilename);
    await writeFile(path.join(mediaDirectory, childFilename), Buffer.from(await childResponse.arrayBuffer()));
    carousel.push({
      src: `./assets/instagram-live/${childFilename}`,
      mediaType: child.media_type || 'IMAGE',
    });
  }
  items.push({
    id: String(media.id),
    title,
    description: caption.slice(0, 220),
    alt: title,
    mediaType: media.media_type || 'IMAGE',
    src: `./assets/instagram-live/${filename}`,
    videoSrc,
    permalink: media.permalink,
    timestamp: media.timestamp || '',
    carousel,
  });
}

if (!items.length) {
  throw new Error('Instagram media could not be downloaded; the current Pages deployment is left untouched.');
}

for (const filename of await readdir(mediaDirectory)) {
  if (!retainedFiles.has(filename)) await rm(path.join(mediaDirectory, filename));
}

await writeFile(feedPath, `${JSON.stringify({
  account: 'neorealmlab',
  syncedAt: new Date().toISOString(),
  items,
}, null, 2)}\n`);

console.log(`Synced ${items.length} Instagram posts for @neorealmlab.`);
