# Instagram → Worlds in motion

## Feasibility

The work wall can update from NeoRealm LAB's Instagram posts. The access token must never be shipped in browser JavaScript or committed to Git. A production adapter should retrieve Instagram data on a trusted server or scheduled job, sanitize it, and publish a small cache for the website.

## Recommended architecture

```text
@neorealmlab professional account
          ↓ Meta Instagram API
scheduled serverless job (token in secret storage)
          ↓ validate and archive
Supabase Database + Storage
          ↓
admin-selected 20-post public feed
          ↘ static curated fallback if sync fails
```

Implemented production flow:

1. Keep the Instagram account as a professional Business or Creator account.
2. Create a Meta app and authorize only the permissions required to read the account's own media.
3. Store the access token in the GitHub Actions repository secret `INSTAGRAM_ACCESS_TOKEN`; the public Instagram user ID is configured in the workflow.
4. Store the Supabase service-role key in the GitHub Actions repository secret `SUPABASE_SERVICE_ROLE_KEY`.
5. GitHub Actions runs weekly, on every `main` deployment and on manual workflow dispatch.
6. Follow the Instagram API pagination cursor and upsert every available post into `instagram_posts`; existing records are retained.
7. Cache permanent cover images, carousel images and Reel video files in the public `instagram-media` Supabase Storage bucket. Larger Reel source files are optimized to web-ready H.264 MP4s before upload. The public lightbox plays archived Reel files natively; Instagram embed is only the fallback when the source cannot be archived.
8. The first successful import selects the newest 20 posts. Later imports remain hidden until selected in `admin.html`, so new posts never displace an intentional front-end selection.
9. The public page reads the selected, ordered records directly from Supabase and keeps `data/instagram-feed.json` plus the curated demo wall as failure fallbacks.

## Editorial rules

- A new post enters the permanent library automatically but does not enter the public wall until selected in the admin.
- Reels use their thumbnail in the wall and play their archived MP4 in the lightbox; the Instagram embed is a fallback only when Meta withholds the media file.
- Carousel posts use the cover in the wall and expose their synchronized child media in the lightbox.
- Captions are optional display data and must be truncated safely.
- Posts deleted or archived on Instagram remain in the Supabase library unless they are deliberately removed there.

## Deployment secrets

Suggested names:

```text
INSTAGRAM_ACCOUNT_ID
INSTAGRAM_ACCESS_TOKEN
SUPABASE_SERVICE_ROLE_KEY
```

Do not add real values to `.env`, source files, GitHub Actions YAML, screenshots or issue text. Configure them directly in the chosen hosting provider's secret manager or GitHub Actions repository secrets.

## Active behavior

- All media returned through Instagram pagination are archived. The admin selects and orders up to 20 public posts.
- The gallery selects 10 of those public posts for the layered waterfall presentation.
- The horizontal feed always uses a uniform 4:5 frame. Reel posters are cropped inside that frame and open as controlled 9:16 video in the lightbox. The lightbox prefers a cached MP4 and falls back to Instagram's official embed when Meta withholds the video file.
- Carousel children are synchronized when Meta returns them and can be browsed with visible previous/next controls or the left/right arrow keys in the lightbox.
- If synchronization fails, GitHub Pages keeps the previous successful deployment. Local development and an empty feed use the curated demo images.

Official starting points:

- <https://developers.facebook.com/docs/instagram-platform/>
- <https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/>
