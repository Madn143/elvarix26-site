# ELVARIX'26 Registration Portal

The ELVARIX'26 registration website for the Department of Computer Science Engineering, Grace College of Engineering. The event is scheduled for September 23, 2026.

Live site: https://elvarix26.web.app
Admin dashboard: https://elvarix26.web.app/admin
GitHub repository: https://github.com/Madn143/elvarix26-site

## Stack

- React 18 and TypeScript
- Vite
- React Router
- Tailwind CSS
- Firebase Firestore
- Firebase Hosting
- Tesseract.js for payment screenshot amount checking

## Requirements

- Node.js 20 or newer
- npm
- A Firebase CLI login with access to the `elvarix26` project
- Git access to the repository for pushing changes

## First-Time Setup

```bash
git clone https://github.com/Madn143/elvarix26-site.git
cd elvarix26-site
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Do not commit `.env`, `.env.local`, access tokens, passwords, `node_modules`, `dist`, `.firebase`, or `*.tsbuildinfo`. These are excluded by `.gitignore`.

## Project Structure

```text
src/
  components/             Shared UI components
  context/                Registration state
  pages/public/           Home, events, and public event details
  pages/register/         Registration and payment steps
  pages/admin/            Admin dashboard
  services/api/           Firestore registration and feedback operations
  services/firebase/      Firebase client configuration
  styles/                 Global CSS
  types/                  Shared TypeScript types
  utils/                  Payment and registration helpers
firebase.json             Hosting and Firestore deployment configuration
firestore.rules           Firestore security rules
.firebaserc               Firebase project alias: elvarix26
```

## Important Routes

- `/` - Home page
- `/events` - Event catalogue
- `/events/:slug` - Event details
- `/register` - Registration type selection
- `/register/personal` - Personal details
- `/register/college` - College details
- `/register/events` - Event selection
- `/register/team` - Team details
- `/register/payment` - QR payment and screenshot verification
- `/register/success` - Confirmation and downloads
- `/admin` - Registration dashboard

## Local Validation

Run these commands before deploying:

```bash
npm run build
npm run lint
```

`npm run build` runs TypeScript checking and creates the production bundle in `dist/`. The project currently has no automated test suite, so manually check the registration flow and admin dashboard in the browser as well.

To preview the production bundle locally:

```bash
npm run build
npm run preview
```

## Firebase Deployment

The project is already configured for Firebase project `elvarix26` in `.firebaserc`.

1. Install or run the Firebase CLI:

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

   If a global install is not available, use `npx firebase-tools@latest` in the commands below.

2. Confirm the selected project:

   ```bash
   firebase use elvarix26
   firebase projects:list
   ```

3. Build the site:

   ```bash
   npm run build
   ```

4. Deploy Hosting and Firestore rules:

   ```bash
   firebase deploy --only hosting,firestore:rules --project elvarix26
   ```

   With `npx`:

   ```bash
   npx firebase-tools@latest deploy --only hosting,firestore:rules --project elvarix26
   ```

5. Verify the deployment:

   - Open https://elvarix26.web.app
   - Open https://elvarix26.web.app/admin
   - Submit a test registration or inspect an existing record
   - Confirm the admin table shows the transaction ID

Firebase Hosting serves `dist/` and rewrites unknown routes to `index.html` so React Router works on direct navigation.

## Firestore Data

The browser writes to these collections:

- `registrations` - Registration records and payment proof
- `feedback` - Feedback submitted from the confirmation page
- `counters/registrationId` - Counter used for sequential registration IDs

`firestore.rules` allows registration creation, dashboard reads, counter operations, and feedback creation. Updates and deletes are blocked.

The current admin login is a client-side password gate, not Firebase Authentication. Anyone who can inspect the deployed JavaScript can discover or bypass it. Before using this dashboard for sensitive data, replace it with Firebase Authentication and restrict Firestore reads to authenticated admin users.

## Updating Events and Payments

- Event catalogue: `src/services/api/events.ts`
- Payment UPI ID, QR images, and fees: `src/utils/payment.ts`
- Payment QR assets: `src/assets/payment-200.jpeg` and `src/assets/payment-250.jpeg`
- Admin table and CSV export: `src/pages/admin/Admin.tsx`
- Firestore persistence: `src/services/api/registrations.ts`

After changing events, fees, payment details, Firestore rules, or Firebase configuration, run the build and deploy again.

## Git Workflow

Create a feature branch for changes:

```bash
git checkout -b feature/short-description
```

Validate and commit:

```bash
npm run build
git status
git add .
git commit -m "Describe the change"
```

Push the branch:

```bash
git push -u origin feature/short-description
```

Merge to `main` only after reviewing the change and confirming the production build. Deploy from the reviewed `main` branch.

Never put a GitHub token in a remote URL, source file, README, or commit. Use Git Credential Manager, SSH keys, or GitHub CLI authentication instead.

## Known Limitations

- Payment screenshot OCR only checks the visible amount; it does not verify the actual UPI transaction.
- Registration IDs are generated by a browser transaction in Firestore.
- The admin dashboard currently exposes registration reads to support the client-only admin flow.
- There is no automated test suite yet.
