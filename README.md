# ELVARIX'26 Registration Portal

The public registration website for ELVARIX'26, the technical and non-technical symposium hosted
by the Department of Computer Science Engineering, Grace College of Engineering, on September 23,
2026.

## What This Project Does

- Presents the home page, event list, event details, and registration entry point.
- Runs the registration flow: registration type, personal details, college details, event selection,
  team details, payment proof, and success confirmation.
- Uses a fixed event catalogue in `src/data/events.ts`.
- Performs a light, client-side OCR check on the payment screenshot before submission.

This repository currently contains the frontend only. The registration and feedback submission
functions in `src/api/registrations.ts` are backend-agnostic stubs — they build the same data record
the UI expects and resolve successfully so the app's flow works end-to-end, but nothing is persisted
anywhere yet. Wire up a real backend there when you're ready; no other file needs to change to do so.

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Tesseract.js for payment screenshot OCR

## Project Structure

```
elvarix/
├── public/                 Static files and SPA redirects
│   └── assets/             Payment QR image and other public assets
├── src/
│   ├── api/                Registration/feedback submission functions (currently backend-agnostic stubs)
│   ├── components/         Shared layouts, cards, forms, and UI components
│   ├── config/             Payment and application configuration
│   ├── context/            Registration state and draft persistence
│   ├── data/               Static event catalogue
│   ├── pages/              Public pages and registration steps
│   ├── types/              Shared TypeScript types
│   └── utils/              Event icons, team helpers, and OCR verification
├── vite.config.ts          Vite build configuration
└── package.json            Scripts and dependencies
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. No backend configuration is required to view or click
through the site right now — see the note above about connecting a real database in
`src/api/registrations.ts`.

## Application Routes

- `/` - Home page
- `/events` - Event catalogue
- `/events/:slug` - Event details
- `/register` - Registration type selection
- `/register/personal` - Personal details
- `/register/college` - College details
- `/register/events` - Event selection
- `/register/team` - Team details or individual confirmation
- `/register/payment` - QR payment and screenshot verification
- `/register/success` - Registration confirmation and feedback

## Updating Event and Payment Details

- Edit `src/data/events.ts` to change the public event catalogue.
- Edit `src/utils/payment.ts` to change the UPI ID or fee by registration type.
- Internal registrations use `src/assets/payment-200.jpeg`; External registrations use `src/assets/payment-250.jpeg`.

The current fees are INR 200 for Internal, INR 250 for External, and INR 300 for On-Spot
registrations. Team totals multiply the applicable per-person fee by the team size.

## Production Build

```bash
npm run build
npm run preview
```

The production build is generated in `dist` by Vite. Configure your hosting provider to serve
`dist/index.html` as the SPA fallback for React Router routes.

## Notes

- Payment screenshot OCR is a best-effort client-side check, not bank or UPI verification.
- Registration IDs are generated in the browser.
- Registration lookup is not available after submission because there is no connected database yet.
