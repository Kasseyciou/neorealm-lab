import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID || 'me';
const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
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

const extensionFor = (contentType) => contentType.includes('png')
  ? 'png'
  : contentType.includes('webp')
    ? 'webp'
    : contentType.includes('mp4') || contentType.includes('video')
      ? 'mp4'
      : 'jpg';

const cleanId = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '');
const storageUrl = (objectPath) => `${supabaseUrl}/storage/v1/object/public/instagram-media/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
const supabaseHeaders = (extra = {}) => {
  const headers = { apikey: serviceRoleKey, ...extra };
  if (serviceRoleKey.split('.').length === 3) headers.Authorization = `Bearer ${serviceRoleKey}`;
  return headers;
};

async function fetchInstagramMedia() {
  const firstPage = new URL(`https://graph.instagram.com/${userId}/media`);
  firstPage.searchParams.set('fields', fields);
  firstPage.searchParams.set('limit', '100');
  firstPage.searchParams.set('access_token', token);

  const media = [];
  let nextPage = firstPage.toString();
  let pageCount = 0;

  while (nextPage && pageCount < 50) {
    const response = await fetch(nextPage, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Instagram API returned ${response.status}: ${message.slice(0, 500)}`);
    }
    const payload = await response.json();
    if (!Array.isArray(payload.data)) break;
    media.push(...payload.data);
    nextPage = payload.paging?.next || '';
    pageCount += 1;
  }

  if (!media.length) throw new Error('Instagram API returned no media; the current deployment is left untouched.');
  return media;
}

async function uploadRemoteMedia(sourceUrl, objectPath) {
  const mediaResponse = await fetch(sourceUrl);
  if (!mediaResponse.ok) throw new Error(`Media download returned ${mediaResponse.status}.`);
  const contentType = mediaResponse.headers.get('content-type') || 'image/jpeg';
  const extension = extensionFor(contentType);
  const finalPath = `${objectPath}.${extension}`;
  const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/instagram-media/${finalPath.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: supabaseHeaders({ 'Content-Type': contentType, 'x-upsert': 'true' }),
    body: await mediaResponse.arrayBuffer(),
  });
  if (!uploadResponse.ok) throw new Error(`Supabase Storage upload returned ${uploadResponse.status}: ${(await uploadResponse.text()).slice(0, 300)}`);
  return finalPath;
}

async function supabaseRequest(resource, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${resource}`, {
    ...options,
    headers: supabaseHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }),
  });
  if (!response.ok) throw new Error(`Supabase REST returned ${response.status}: ${(await response.text()).slice(0, 500)}`);
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function syncToSupabase(allMedia) {
  const existingRows = await supabaseRequest('instagram_posts?select=media_id,cover_path,video_path,carousel');
  const existingById = new Map((existingRows || []).map((row) => [row.media_id, row]));
  const rows = [];

  for (const media of allMedia) {
    if (!media?.id || !media?.permalink) continue;
    const id = cleanId(media.id);
    const existing = existingById.get(String(media.id));
    const coverSource = media.media_type === 'VIDEO' ? media.thumbnail_url || media.media_url : media.media_url;
    if (!coverSource && !existing?.cover_path) continue;

    let coverPath = existing?.cover_path || '';
    let videoPath = existing?.video_path || null;
    let carousel = Array.isArray(existing?.carousel) ? existing.carousel : [];

    try {
      if (!coverPath) coverPath = await uploadRemoteMedia(coverSource, `${id}/cover`);
      if (!carousel.length && media.children?.data?.length) {
        carousel = [];
        for (const [childIndex, child] of media.children.data.entries()) {
          const childSource = child.media_type === 'VIDEO' ? child.thumbnail_url || child.media_url : child.media_url;
          if (!childSource) continue;
          const childPath = await uploadRemoteMedia(childSource, `${id}/slide-${childIndex + 1}`);
          carousel.push({ path: childPath, mediaType: child.media_type || 'IMAGE' });
        }
      }
    } catch (error) {
      console.warn(`Skipping media assets for ${media.id}: ${error.message}`);
      if (!coverPath) continue;
    }

    const caption = String(media.caption || '').replace(/\s+/g, ' ').trim();
    const title = caption.split(/[。！？.!?\n]/)[0].trim().slice(0, 120) || 'NeoRealm LAB Visual';
    rows.push({
      media_id: String(media.id),
      title,
      description: caption.slice(0, 2200),
      alt_text: title.slice(0, 240),
      media_type: media.media_type || 'IMAGE',
      cover_path: coverPath,
      video_path: videoPath,
      permalink: media.permalink,
      carousel,
      posted_at: media.timestamp || null,
      synced_at: new Date().toISOString(),
    });
  }

  if (!rows.length) throw new Error('No Instagram posts could be archived to Supabase.');
  await supabaseRequest('instagram_posts?on_conflict=media_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows),
  });

  const selected = await supabaseRequest('instagram_posts?visible=eq.true&select=media_id&order=display_order.asc&limit=20');
  if (!selected?.length) {
    const initialSelection = [...rows]
      .sort((a, b) => String(b.posted_at || '').localeCompare(String(a.posted_at || '')))
      .slice(0, 20);
    for (const [index, row] of initialSelection.entries()) {
      await supabaseRequest(`instagram_posts?media_id=eq.${encodeURIComponent(row.media_id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ visible: true, display_order: index }),
      });
    }
  }

  const visibleRows = await supabaseRequest('instagram_posts?visible=eq.true&select=*&order=display_order.asc&limit=20');
  const items = (visibleRows || []).map((row) => ({
    id: row.media_id,
    title: row.title,
    description: row.description,
    alt: row.alt_text || row.title,
    mediaType: row.media_type,
    src: storageUrl(row.cover_path),
    videoSrc: row.video_path ? storageUrl(row.video_path) : '',
    permalink: row.permalink,
    timestamp: row.posted_at || '',
    carousel: (row.carousel || []).map((slide) => ({
      src: storageUrl(slide.path),
      mediaType: slide.mediaType || 'IMAGE',
    })),
  }));

  await mkdir(path.dirname(feedPath), { recursive: true });
  await writeFile(feedPath, `${JSON.stringify({
    account: 'neorealmlab',
    syncedAt: new Date().toISOString(),
    source: 'supabase',
    items,
  }, null, 2)}\n`);
  console.log(`Archived ${rows.length} Instagram posts; ${items.length} are selected for the front end.`);
}

async function syncLatestStatic(allMedia) {
  await mkdir(mediaDirectory, { recursive: true });
  await mkdir(path.dirname(feedPath), { recursive: true });
  const retainedFiles = new Set();
  const items = [];

  for (const media of allMedia.slice(0, 20)) {
    const sourceUrl = media.media_type === 'VIDEO' ? media.thumbnail_url || media.media_url : media.media_url;
    if (!sourceUrl || !media.id || !media.permalink) continue;
    const mediaResponse = await fetch(sourceUrl);
    if (!mediaResponse.ok) continue;
    const contentType = mediaResponse.headers.get('content-type') || 'image/jpeg';
    const filename = `${cleanId(media.id)}.${extensionFor(contentType)}`;
    retainedFiles.add(filename);
    await writeFile(path.join(mediaDirectory, filename), Buffer.from(await mediaResponse.arrayBuffer()));

    let videoSrc = '';
    if (media.media_type === 'VIDEO' && media.media_url) {
      const videoResponse = await fetch(media.media_url);
      if (videoResponse.ok) {
        const videoFilename = `${cleanId(media.id)}.mp4`;
        retainedFiles.add(videoFilename);
        await writeFile(path.join(mediaDirectory, videoFilename), Buffer.from(await videoResponse.arrayBuffer()));
        videoSrc = `./assets/instagram-live/${videoFilename}`;
      }
    }

    const carousel = [];
    for (const [childIndex, child] of (media.children?.data || []).entries()) {
      const childSource = child.media_type === 'VIDEO' ? child.thumbnail_url || child.media_url : child.media_url;
      if (!childSource) continue;
      const childResponse = await fetch(childSource);
      if (!childResponse.ok) continue;
      const childType = childResponse.headers.get('content-type') || 'image/jpeg';
      const childFilename = `${cleanId(media.id)}-slide-${childIndex + 1}.${extensionFor(childType)}`;
      retainedFiles.add(childFilename);
      await writeFile(path.join(mediaDirectory, childFilename), Buffer.from(await childResponse.arrayBuffer()));
      carousel.push({
        src: `./assets/instagram-live/${childFilename}`,
        mediaType: child.media_type || 'IMAGE',
      });
    }

    const caption = String(media.caption || '').replace(/\s+/g, ' ').trim();
    const title = caption.split(/[。！？.!?\n]/)[0].trim().slice(0, 72) || 'NeoRealm LAB Visual';
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

  for (const filename of await readdir(mediaDirectory)) {
    if (!retainedFiles.has(filename)) await rm(path.join(mediaDirectory, filename));
  }
  await writeFile(feedPath, `${JSON.stringify({ account: 'neorealmlab', syncedAt: new Date().toISOString(), source: 'static', items }, null, 2)}\n`);
  console.log(`Synced ${items.length} latest Instagram posts to the static fallback. Add Supabase repository secrets to enable permanent history.`);
}

const allMedia = await fetchInstagramMedia();
if (supabaseUrl && serviceRoleKey) await syncToSupabase(allMedia);
else await syncLatestStatic(allMedia);
