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

Implemented production flow:

1. Keep the Instagram account as a professional Business or Creator account.
2. Create a Meta app and authorize only the permissions required to read the account's own media.
3. Store the access token in the GitHub Actions repository secret `INSTAGRAM_ACCESS_TOKEN`; the public Instagram user ID is configured in the workflow.
4. GitHub Actions runs every six hours and on every `main` deployment.
5. Request recent media with the caption, media type, media or thumbnail URL, permalink and timestamp fields.
6. Download the newest media into the temporary GitHub Pages artifact so expiring Instagram CDN URLs are never shipped to the browser.
7. Publish a sanitized `data/instagram-feed.json` containing no token or private account data.
8. Render the newest 20 posts in the horizontal feed and select 10 for the layered waterfall. Preserve the current static wall whenever the endpoint is unavailable, empty or malformed.

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

## Active behavior

- The newest 20 posts are synchronized; the page randomizes their order on every visit.
- The gallery selects 10 of those posts for the layered waterfall presentation.
- The horizontal feed always uses a uniform 4:5 frame. Reel posters are cropped inside that frame and open as controlled 9:16 video in the lightbox. The lightbox prefers a cached MP4 and falls back to Instagram's official embed when Meta withholds the video file.
- Carousel children are synchronized when Meta returns them and can be browsed with visible previous/next controls or the left/right arrow keys in the lightbox.
- If synchronization fails, GitHub Pages keeps the previous successful deployment. Local development and an empty feed use the curated demo images.

Official starting points:

- <https://developers.facebook.com/docs/instagram-platform/>
- <https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/>
