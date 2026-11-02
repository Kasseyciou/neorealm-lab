import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveInstagramToken } from './instagram-token.mjs';

const config = { seedToken: 'test-seed', supabaseUrl: 'https://example.invalid', serviceRoleKey: 'test-service' };
const json = (value, status = 200) => new Response(JSON.stringify(value), { status });

test('refreshes and persists credentials only to a private bucket', async () => {
  const calls = [];
  const responses = [json({ public: false }), json({}, 404), json({ access_token: 'renewed' }), json({})];
  const token = await resolveInstagramToken({ ...config, fetcher: async (url, options) => {
    calls.push({ url: String(url), options });
    return responses.shift();
  } });
  assert.equal(token, 'renewed');
  assert.equal(calls[3].options.method, 'POST');
  assert.equal(JSON.parse(calls[3].options.body).access_token, 'renewed');
  assert.match(calls[3].url, /object\/instagram-sync-private\/token.json$/);
});

test('refuses public credential storage', async () => {
  await assert.rejects(resolveInstagramToken({ ...config, fetcher: async () => json({ public: true }) }), /must be private/);
});

test('expired authorization produces actionable error without exposing token', async () => {
  const responses = [json({ public: false }), json({}, 404), json({ error: { code: 190 } }, 400)];
  await assert.rejects(resolveInstagramToken({ ...config, fetcher: async () => responses.shift() }), /Reauthorize Instagram/);
});

test('ineligible fresh token can still be validated by the media endpoint', async () => {
  const responses = [json({ public: false }), json({}, 404), json({ error: { code: 1 } }, 400)];
  assert.equal(await resolveInstagramToken({ ...config, fetcher: async () => responses.shift() }), config.seedToken);
});
