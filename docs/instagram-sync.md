# Instagram → Worlds in motion

## Feasibility

The work wall can update from NeoRealm LAB's Instagram posts. The access token must never be shipped in browser JavaScript or committed to Git. A production adapter should retrieve Instagram data on a trusted server or scheduled job, sanitize it, and publish a small cache for the website.

## Recommended architecture

```text
@neorealmlab professional account
          ↓ Meta Instagram API
scheduled serverless job (token in secret storage)
          ↓ validate, crop and cache
public feed.json + optimized media cache
          ↓
Worlds in motion adapter
          ↘ static curated fallback if sync fails
```

Recommended production implementation:

1. Keep the Instagram account as a professional Business or Creator account.
2. Create a Meta app and authorize only the permissions required to read the account's own media.
3. Store the Instagram account ID and long-lived access token as deployment secrets, never in this repository.
4. Run a Cloudflare Worker/Cron Trigger or equivalent scheduled function every 1–6 hours.
5. Request recent media with the caption, media type, media or thumbnail URL, permalink and timestamp fields.
6. Cache or proxy the media through owned storage/CDN rather than depending indefinitely on temporary Instagram media URLs.
7. Publish a sanitized `feed.json` containing no token or private account data.
8. Render the newest 12–18 approved items into the two waterfall columns. Preserve the current static wall whenever the endpoint is unavailable, empty or malformed.

## Editorial rules

- A new post may enter the wall automatically, but featured titles and commercial case-study status remain curated.
- Reels use their thumbnail in the wall and open the original permalink for playback until the site has an approved video-hosting strategy.
- Carousel posts use the cover by default; child media can be enabled later.
- Captions are optional display data and must be truncated safely.
- Deleted or archived posts disappear on the next successful refresh.

## Deployment secrets

Suggested names:

```text
INSTAGRAM_ACCOUNT_ID
INSTAGRAM_ACCESS_TOKEN
```

Do not add real values to `.env`, source files, GitHub Actions YAML, screenshots or issue text. Configure them directly in the chosen hosting provider's secret manager or GitHub Actions repository secrets.

## What remains before activation

- Choose hosting/serverless provider.
- Create and authorize the Meta app.
- Supply the Instagram account ID and access token through secret storage.
- Decide refresh frequency and maximum number of retained posts.
- Confirm whether Reels play on-site or link to Instagram.

Official starting points:

- <https://developers.facebook.com/docs/instagram-platform/>
- <https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/>

