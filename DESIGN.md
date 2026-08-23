---
name: "NeoRealm LAB Graphite Cinema"
description: "Selected Direction B: cinematic scroll, ice-ripple navigation, layered work streams, and restrained Acid Signal controls."
colors:
  b-ink: "#f2f1eb"
  b-muted: "#b0aea5"
  b-black: "#11110f"
  b-surface: "#1b1b18"
  b-accent: "#d9f45f"
  b-line: "rgba(242, 241, 235, 0.2)"
  kv-black: "#080908"
  studio-surface: "#20211e"
  status-success: "#315c16"
  status-error: "#8d211a"
typography:
  display:
    fontFamily: '"Marcellus", "Zen Old Mincho", serif'
    fontSize: "clamp(58px, 7vw, 96px)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Marcellus", "Zen Old Mincho", serif'
    fontSize: "clamp(48px, 6vw, 88px)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  body:
    fontFamily: '"Zen Old Mincho", "Noto Serif TC", serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  navigation:
    fontFamily: '"Marcellus", "Zen Old Mincho", serif'
    fontSize: "12px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.03em"
  label:
    fontFamily: '"Marcellus", "Zen Old Mincho", serif'
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sharp: "0px"
spacing:
  section-inline: "clamp(22px, 6vw, 96px)"
  section-block: "clamp(92px, 12vw, 176px)"
components:
  button-primary:
    backgroundColor: "{colors.b-accent}"
    textColor: "{colors.b-black}"
    rounded: "{rounded.sharp}"
    height: "48px"
  ice-ripple-navigation:
    backgroundColor: "rgba(12, 13, 12, 0.16)"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
    height: "72px"
  waterfall-card:
    backgroundColor: "{colors.b-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
  kv-stage:
    backgroundColor: "{colors.kv-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
    height: "178dvh"
  studio-story:
    backgroundColor: "{colors.b-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
  instagram-field:
    backgroundColor: "{colors.b-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
  archive-filter-waterfall:
    backgroundColor: "{colors.b-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
  archive-editor:
    backgroundColor: "{colors.b-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
  project-inquiry-dialog:
    backgroundColor: "{colors.b-black}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.sharp}"
    width: "100vw"
    height: "100dvh"
  project-proposal-sheet:
    backgroundColor: "{colors.b-ink}"
    textColor: "{colors.b-black}"
    rounded: "{rounded.sharp}"
---

# Design System: NeoRealm LAB Graphite Cinema

## Creative direction

**North Star: The Realm Becomes Real.** Direction B is authoritative and loads by default. Direction A remains only as a concealed prototype comparison, opened from the small “Compare modes” control at the lower-right.

The public narrative does not explain internal strategy or present the new site as a case-study diagram. The site itself demonstrates current web craft through typography, responsive composition, authored scroll, layered media and precise interaction. Historical websites are supporting provenance.

Customer-facing sequence:

1. Supplied moving-image KV and primary promise.
2. Sticky Studio introduction with three generated abstract scenes.
3. `Worlds in motion` — ten selected 4:5 visual works in a three-depth gallery.
4. A horizontal low-chroma field containing all twenty supplied Instagram works; it restores color on hover or focus.
5. AI visual, motion and web service sequence.
6. `Selected web archive` — four real cases plus two detail crops in a flowing evidence wall.
7. Generated cinematic studio contact scene and project CTA.

## Identity

- Use `prototype/assets/logo.svg` as the master wordmark.
- Marcellus carries English display, navigation, captions and controls.
- Zen Old Mincho carries Chinese and sustained reading.
- Production geometry is sharp. Prototype controls may differ but must stay visually recessive.
- Graphite neutrals carry the world; Acid Signal is reserved for action, sequence and links.

## Navigation — Ice Ripple

The B navigation is fixed throughout the page. Its translucent field follows the Ice Ripple material with 6px backdrop blur, restrained saturation and contrast, and a higher-frequency turbulence/displacement filter (`baseFrequency 0.025`, two octaves, seed 92, scale 65). One fine bottom rule defines the edge; the material carries no inner glow, outer glow or decorative highlight.

The wordmark is centered on the viewport, `Studio → Work → Services` anchors occupy the left field, and `Start a Project` occupies the right. The anchor matching the current scroll section receives Projection White text and one Acid Signal underline; the project action opens the same pricing-and-inquiry dialog used by the footer CTA.

Scale is deliberately lower than the 45px Aether CSS demonstration because navigation typography must remain stable. Mobile, reduced-motion and browsers without the SVG/backdrop combination keep a standard blurred translucent fallback. Do not reproduce the effect as a glossy rounded card.

## Layout and motion

### Sticky KV

- Desktop: 178dvh; mobile: 158dvh.
- The supplied `hero-kv.mp4` plays only while B is active, visible and motion is allowed.
- `hero-poster.png` remains until playback passes 6.2 seconds and is the reduced-motion fallback.
- The main promise exits before the secondary `Design × AI × Motion × Web` statement enters.

### Studio story

- Desktop uses a 50/50 grid: sticky visual left, three viewport-height text chapters right.
- The sticky visual begins at the viewport's left edge and extends from the 72px navigation boundary to the viewport bottom; it must not sit inside a decorative outer margin.
- The active generated scene crossfades and updates the `01 / 03` index.
- Active copy enters through a bottom-up typographic crop; completed copy exits upward through the inverse crop. Body text follows the heading by 90ms.
- Mobile holds the visual at 49dvh while chapters pass beneath it.

### Visual work waterfall

- Sticky narrative occupies the left field; three asymmetric media lanes pass it like exhibits in a salon wall.
- On every page load, ten works are sampled and shuffled from the twenty-image pool in a 4 / 3 / 3 near–middle–far distribution while preserving the supplied 4:5 post canvas; `object-fit: contain` prevents subject or typography crop.
- Far work is smaller, quieter and slower; the near lane is larger and faster. The selected gallery uses bounded vertical depth up to 84px and lateral drift up to 38px.
- Deliberately generous vertical intervals and plane-specific soft shadows separate the ten plates: near is strongest, middle is moderate, and far is faint.
- Perspective comes from lane width, scale, speed and position—not from changing or cropping the artwork ratio.
- Middle and far lanes receive bounded optical blur that clears on hover or keyboard focus. Card titles and descriptions stay out of the composition and appear below the full image only after opening the native lightbox.
- Fine-pointer hover shifts the media slightly and feeds pointer velocity into a bounded Canvas refraction brush. Interpolated soft droplets redraw locally displaced image fragments, forming a fluid water trail that decays within roughly 620–880ms without running a permanent animation loop.
- This is perceptual drag, not draggable/reorderable UI.

### Instagram field

- The gallery resolves into one horizontally scrollable, load-shuffled row containing all twenty supplied Instagram works before Services.
- Tiles are grayscale and low-chroma by default; hover and keyboard focus restore the original color and full opacity.
- Every tile keeps a 4:5 frame, uses `object-fit: contain`, lazy-loads its image and shares one baseline. On fine-pointer devices, vertical wheel input anywhere inside the complete `More from @neorealmlab` section eases toward a bounded horizontal target only while more content remains in that direction; reaching either target edge immediately releases normal page scrolling. Touch keeps direct horizontal scrolling and gentle snap, and the browser scrollbar remains visually concealed.

### Web archive waterfall

- Sticky narrative stays secondary to a two-column masonry evidence stream.
- `All Projects` plus `Brand Website`, `Service Platform`, and `Campaign & Content` filters reflow the masonry evidence stream; the active category uses the single Acid Signal rule and reports its project count through a polite live region.
- Four true archived cases are accompanied by two deliberate detail crops; detail crops follow their source project's category and must not be named as extra projects.
- The same bounded depth and image-trail vocabulary connects old web craft to the current interface without turning it into a lengthy case study.

### Web archive editor

- `admin.html` is a restrained Operate-mode editor for adding, editing, deleting, categorizing, uploading and reordering archive projects.
- `web-projects.js` is the replaceable content adapter shared by the editor and public archive. The prototype stores normalized records and compressed image data in `localStorage`; an open front-end tab reloads when that storage changes.
- The local adapter is explicitly labelled as a prototype. Production still requires authentication, durable database records and external object storage; local browser state must never be presented as a deployed CMS.

### Mobile and reduced motion

- Between 721px and 980px, all ten selected plates reflow into two columns while retaining quieter near, middle and far depth treatments.
- At 720px and below, work and archive remain two compact media columns while the narrative becomes a sticky top veil.
- The three desktop lanes collapse through `display: contents` into two compact mobile columns in near → middle → far DOM priority; scroll-speed transforms, depth shifts and image trails are disabled.
- Reduced motion pauses video and removes parallax, displacement animation, depth and trail layers while keeping all information available.
- Reduced motion also removes typographic crops, blur and spatial travel; copy remains immediately visible.

## Imagery

- Studio scenes are abstract, material and anonymous: optical glass, translucent film, metal, projected light.
- The contact scene uses `prototype/assets/contact-studio.png`: a quiet dark left third for copy, with the anonymous creative figure and projected material activity to the right.
- Generated imagery must include its prompt provenance in the shipping raster.
- Avoid stock-office imagery, visible AI clichés, neon HUDs, purple gradients and readable fake interfaces.

## Interaction and accessibility

- Project actions are at least 44px high and have visible focus treatment.
- The comparison selector exposes `aria-expanded` / `aria-hidden`, closes on outside click or Escape, and returns focus on Escape.
- The Project Inquiry uses the native `<dialog>` top layer. Escape, the close control and a direct backdrop press close it; focus enters at the close control and returns to the exact opener.
- The work lightbox follows the same native-dialog focus contract and reveals the selected full-frame image before its title and description.
- Cards are visual media, not fake controls; use a crosshair cursor only where the fine-pointer trail is available.
- Headings and sticky copy retain adequate contrast over the media fields.
- The page must not introduce horizontal overflow at 390px.

## Components

### Project Inquiry

- **Shell:** A full-viewport native dialog (`100vw × 100dvh`) with a fixed 72px dark header, master wordmark, square 48px close control and independently scrolling body. Opening reveals the sharp shell upward with `clip-path` and restrained vertical settlement; reduced motion removes the reveal and transform entirely.
- **Pricing ledger:** The first act is a dark, three-column editorial ledger separated by hairlines. Plans are not rounded cards. Only the recommended center plan receives a solid Acid Signal field; the other plans stay graphite with outlined actions so the accent keeps its directional role.
- **Proposal sheet:** The second act inverts to Projection White with Cinema Black text. Its copy-and-form split is spacious rather than carded; fields remain transparent with underline-only boundaries, square corners and a strengthened underline on focus.
- **Responsive behavior:** At 720px and below, the ledger stacks into one column with horizontal dividers, the sticky proposal copy becomes static and the form collapses to one column. The dialog header reduces to 64px without losing a minimum 44px close target.
- **Submission states:** The submit action disables and uses restrained `Sending…` copy while in flight. A polite live region reports loading, success and recoverable error states; success uses muted green (`#315c16`), error uses muted red (`#8d211a`) and neither state introduces animation, cards or decorative alerts.
- **Plan handoff:** Choosing a plan preselects the matching service, moves to the proposal sheet and focuses the first field. Smooth scrolling is optional motion and must collapse to an immediate move under reduced-motion preferences.

## Named rules

- **The Site-Is-The-Proof Rule:** demonstrate current web skill through the current experience; never narrate internal strategy to clients.
- **The Sticky Evidence Rule:** copy holds position while enough media passes to establish range and depth.
- **The Perspective Salon Rule:** work changes scale, speed and lateral position by plane; it must never return to equal card columns.
- **The Full-Frame Plate Rule:** preserve the supplied 4:5 post canvas; never crop artwork to manufacture depth.
- **The Optical Depth Rule:** only middle and far planes blur, and direct attention restores full clarity.
- **The Color-on-Approach Rule:** the Instagram field stays quiet until pointer hover or keyboard focus restores color.
- **The Bounded Trail Rule:** hover may leave a soft, velocity-shaped water trace over imagery, but the Canvas runs only while droplets remain and never destabilizes reading or implies free dragging.
- **The One-Signal Rule:** Acid Signal directs attention; it does not become ambient decoration.
- **The Sharp System Rule:** production geometry remains rectangular.
- **The Motion-Off Rule:** mobile and reduced-motion users receive the same content without nonessential transforms.
- **The Filtered Provenance Rule:** archive categories help visitors scan supporting evidence; filtering must reflow the visible masonry stream and announce the resulting count.
- **The Local-Is-Not-Production Rule:** `admin.html` and `localStorage` are prototype tools only; production requires authentication, durable database records and external object storage.
- **The Two-Act Inquiry Rule:** qualify with a dark pricing ledger, then invert to a warm-white proposal sheet; never blend both acts into a generic card grid.
- **The Recommended-Only Signal Rule:** within pricing, Acid Signal belongs to the recommended center plan only.
