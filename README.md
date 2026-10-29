# Nadav Shtibel — Portfolio

Interactive engineering portfolio featuring real-time 3D ocean rendering, animated agent terminals, and global infrastructure visualization.

## Features

- **Real-time 3D Ocean** — WebGL-powered ocean simulation with golden hour lighting and scroll-driven underwater transitions
- **Bilingual Support** — Full Hebrew (RTL) and English localization with seamless language switching
- **Agent Terminal** — Live-style terminal animations showcasing AI agents, automation workflows, and CI/CD pipelines
- **Projects Showcase** — Bento grid layout with spotlight effects and live GitHub star counts
- **Tech Stack Timeline** — Scroll-pinned technology overview with animated shader backgrounds
- **Global Infrastructure** — Interactive 3D globe with AWS region connections from Israel
- **Contact Form** — Styled contact form with email integration

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **Animations:** Framer Motion, GSAP
- **Smooth Scrolling:** Lenis
- **Globe:** Cobe

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

This portfolio is optimized for AWS Amplify deployment. It supports both static export and SSR modes.

### AWS Amplify

1. Connect your repository to AWS Amplify
2. Amplify will auto-detect Next.js and configure the build settings
3. Deploy

### Environment Variables

No environment variables are required for basic deployment. GitHub star counts are fetched client-side with graceful fallback.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/
│   ├── hero/            # Ocean scene and hero section
│   ├── terminal/        # Agent terminal animations
│   ├── projects/        # Projects bento grid
│   ├── timeline/        # Tech stack timeline
│   ├── globe/           # 3D globe visualization
│   ├── contact/         # Contact form
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization
└── lib/                 # Utility functions
```

## Performance

- Lighthouse Performance Score: 80+ (mobile)
- Intersection Observer for lazy loading and animation triggers
- WebGL2 detection with static fallback for unsupported devices
- Reduced motion support for accessibility
- Optimized 3D scene with conditional rendering

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL2 is required for the 3D ocean effect. A static fallback is provided for browsers without WebGL2 support or for users with reduced motion preferences.

## License

MIT License — see LICENSE file for details.

Third-party licenses are documented in THIRD_PARTY_LICENSES.

## Author

**Nadav Shtibel**
- GitHub: [@Shtibel1](https://github.com/Shtibel1)
- Email: nadavshtibel@gmail.com
