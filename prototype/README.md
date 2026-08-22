# NeoRealm LAB direction prototype

This is the selected Direction B interaction prototype for NeoRealm LAB. Direction A remains only as an in-page comparison archive.

- Direction A: The Mutable Standard, an asymmetric editorial system.
- Direction B: Realms in Motion, a cinematic release sequence using the supplied SVG logo, Marcellus, and Zen Old Mincho.
- Both directions treat the new website as the primary case study.
- The B hero uses the supplied `ok1-1.mp4` with a loading poster, scroll depth, and a second copy state.
- The studio story pairs three temporary abstract images with scroll-switched copy.
- The featured work wall uses an asymmetric floating layout and bounded desktop-only pointer distortion; mobile and reduced-motion modes remove it.
- Featured Instagram items are candidates only. Final selection requires real post-level traffic and content data.
- The Instagram wall currently uses a user-provided profile screenshot crop as temporary source material.

Run locally:

```bash
python3 -m http.server 4173 --directory prototype
```

Open `http://127.0.0.1:4173/`.

Production follow-up:

1. Encode the 13 MB prototype KV into optimized H.264 and WebM derivatives, plus responsive poster sizes.
2. Replace Instagram screenshot crops with original image and video media.
3. Confirm the three featured posts from real Instagram insights.
4. Choose the publishing adapter: Instagram Graph API, CMS with cross-posting, or manual fallback.
5. Confirm contact email, service scope, credits, and media rights.
