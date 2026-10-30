# Nadav Shtibel — Lab

Personal site for [lab.nadav-shtibel.com](https://lab.nadav-shtibel.com). It is Hebrew-first (RTL) with an English toggle, and builds to a fully static export.

## Design direction: "Instrument at sea"

The site reads like a precision instrument looking out over open water at dusk: near-black ink, warm bone type, one signal-orange accent and a tide-teal secondary.

- **Type.** Instrument Serif (Latin) and Frank Ruhl Libre Light (Hebrew) set at display scale, IBM Plex Sans Hebrew for body text, and IBM Plex Mono for instrument labels and data.
- **Hero.** A raymarched ocean rendered in a single fragment shader, with a low sun, Fresnel sky reflection, specular glitter and an ACES grade. A lidar-style dot grid follows the cursor and drifts on autopilot when idle.
- **Work.** Project cards each carry a generated topographic "signature" (seeded per project), with tilt, sheen and parallax on hover.
- **Systems.** Replayed agent runs shown in a terminal with a process switcher.
- **Reach.** An interactive globe (drag with inertia) that cycles AWS regions from il-central-1, showing great-circle distance and the fiber round-trip floor for each.
- **Stack and Contact.** The stack is an editorial spec sheet; contact is a mailto form.

## Develop

Requires Node 20.9+.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build and preview the static export

```bash
npm run build        # writes ./out
npm run preview      # serves ./out (gzip) at http://localhost:4173
```

`./out` can be deployed to any static host (S3/CloudFront, Amplify, Cloudflare Pages, Netlify, GitHub Pages).

Checks, as run in CI:

```bash
npm run lint
npm run typecheck
```

## Rendering tiers and fallbacks

Both WebGL scenes, the water and the globe, pick a tier at runtime:

| Condition | Water hero | Globe |
| --- | --- | --- |
| Desktop GPU | Full shader, adaptive resolution | WebGL globe |
| Touch, small screen or ≤4 cores | Lite shader preset | WebGL globe |
| Save-Data, 2G, ≤2 GB memory, no WebGL, software renderer | Painted CSS poster | SVG graticule globe |
| `prefers-reduced-motion` | One still frame | No auto-cycling; snaps to the chosen region |

Both renderers pause when offscreen or when the tab is hidden. If the frame rate stays under 20 fps at minimum resolution, the water freezes to a still frame.

Append `?force-gl` to the URL to allow software WebGL renderers (for example headless Chrome with SwiftShader). This is useful for screenshots and debugging only.

## Structure

```
src/
├── app/              layout, page, global styles, icon
├── components/
│   ├── hero/         water shader + canvas runtime
│   ├── work/         project cards and generative signatures
│   ├── systems/      agent run terminal
│   ├── reach/        globe and region table
│   ├── stack/        spec sheet
│   ├── contact/      contact form
│   └── ui/           shared primitives
├── content/data.ts   projects, runs, stack and regions
├── i18n/             he/en dictionaries and locale context
└── lib/              utilities (render tier, geo math, scroll)
```

## License

MIT — see `LICENSE`. Third-party notices are in `THIRD_PARTY_LICENSES`.
