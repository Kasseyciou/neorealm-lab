import { createClient } from 'npm:@supabase/supabase-js@2';

const permittedOrigins = new Set([
  'https://neorealmlab.com',
  'https://www.neorealmlab.com',
  'https://kasseyciou.github.io',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
]);

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && permittedOrigins.has(origin)
    ? origin
    : 'https://neorealmlab.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

const respond = (body: Record<string, unknown>, status: number, origin: string | null) => (
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
);

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405, origin);
  if (origin && !permittedOrigins.has(origin)) return respond({ error: 'Origin not allowed.' }, 403, origin);

  const authorization = request.headers.get('authorization') || '';
  const token = authorization.replace(/^Bearer\s+/i, '');
  if (!token) return respond({ error: 'Authentication required.' }, 401, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const githubToken = Deno.env.get('GITHUB_ACTIONS_TOKEN') || '';
  if (!supabaseUrl || !supabaseKey || !githubToken) {
    return respond({ error: 'Instagram refresh is not configured.' }, 500, origin);
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || data.user?.email?.toLowerCase() !== 'kasseyworks@gmail.com') {
    return respond({ error: 'Administrator access required.' }, 403, origin);
  }

  const response = await fetch(
    'https://api.github.com/repos/Kasseyciou/neorealm-lab/actions/workflows/deploy-pages.yml/dispatches',
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NeoRealm-LAB-Instagram-Sync',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: 'main' }),
    },
  );

  if (!response.ok) {
    console.error(`GitHub workflow dispatch failed with status ${response.status}.`);
    return respond({ error: 'Unable to start Instagram synchronization.' }, 502, origin);
  }

  return respond({ accepted: true }, 202, origin);
});
