// Refreshed credentials live in a private bucket, never in the public feed.
export async function resolveInstagramToken({ seedToken, supabaseUrl, serviceRoleKey, fetcher = fetch }) {
  if (!seedToken) throw new Error('INSTAGRAM_ACCESS_TOKEN is missing. Reauthorize Instagram and update the repository secret.');
  if (!supabaseUrl || !serviceRoleKey) return seedToken;
  const headers = { apikey: serviceRoleKey, 'Content-Type': 'application/json' };
  if (serviceRoleKey.split('.').length === 3) headers.Authorization = `Bearer ${serviceRoleKey}`;
  const bucket = 'instagram-sync-private';
  const endpoint = `${supabaseUrl}/storage/v1`;
  const bucketResponse = await fetcher(`${endpoint}/bucket/${bucket}`, { headers });
  const bucketInfo = await bucketResponse.json();
  if (bucketResponse.status === 404 || (bucketResponse.status === 400 && /bucket not found/i.test(bucketInfo.message || ''))) {
    const created = await fetcher(`${endpoint}/bucket`, {
      method: 'POST', headers, body: JSON.stringify({ id: bucket, name: bucket, public: false }),
    });
    if (!created.ok) throw new Error(`Cannot create private credential storage (${created.status}).`);
  } else if (!bucketResponse.ok) {
    throw new Error(`Cannot inspect private credential storage (${bucketResponse.status}).`);
  } else if (bucketInfo.public !== false) {
    throw new Error('Credential bucket must be private. Refusing to store Instagram credentials.');
  }
  const objectUrl = `${endpoint}/object/${bucket}/token.json`;
  const stored = await fetcher(objectUrl, { headers });
  let cached;
  if (stored.ok) cached = await stored.json();
  else if (stored.status !== 404 && stored.status !== 400) throw new Error(`Cannot read private credential storage (${stored.status}).`);
  // A changed repository secret intentionally replaces the previous authorization.
  const seedHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seedToken));
  const fingerprint = Buffer.from(seedHash).toString('hex');
  const active = cached?.seedFingerprint === fingerprint ? cached : null;
  const token = active?.access_token || seedToken;
  if (active?.refreshedAt && Date.now() - Date.parse(active.refreshedAt) < 7 * 86400000) return token;
  const refreshUrl = new URL('https://graph.instagram.com/refresh_access_token');
  refreshUrl.searchParams.set('grant_type', 'ig_refresh_token');
  refreshUrl.searchParams.set('access_token', token);
  const response = await fetcher(refreshUrl);
  const result = await response.json();
  if (!response.ok || !result.access_token) {
    if (result.error?.code === 190) throw new Error('Instagram authorization expired or was revoked. Reauthorize Instagram and replace INSTAGRAM_ACCESS_TOKEN in GitHub Secrets.');
    // Fresh tokens may not yet be eligible for refresh. The media call validates them.
    console.warn(`Instagram token refresh unavailable (${response.status}); attempting the existing token.`);
    return token;
  }
  const saved = await fetcher(objectUrl, {
    method: 'POST', headers: { ...headers, 'x-upsert': 'true' },
    body: JSON.stringify({ access_token: result.access_token, seedFingerprint: fingerprint, refreshedAt: new Date().toISOString() }),
  });
  if (!saved.ok) throw new Error(`Cannot persist refreshed Instagram credential (${saved.status}).`);
  return result.access_token;
}
