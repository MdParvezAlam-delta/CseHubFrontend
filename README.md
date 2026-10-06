# CSEHub Frontend

The CSEHub browser application is built with React 19 and Vite. It connects to the Django REST API for subjects, profiles, notes, and to-do lists, and uses Supabase Auth for production sign-in.

## Features

- Subject catalog with search, pagination, and subject detail pages
- Rich-text subject authoring with lists, formatting, and formula support
- Sign-up/sign-in, including Google sign-in through Supabase
- Private notes and to-do lists backed by the API
- Responsive layout, theme toggle, and route-based navigation

## Requirements

- Node.js 22.12 or later (or 20.19 or later) and npm
- A running CSEHub backend
- A Supabase project for production authentication

## Fork and run locally

1. Fork this repository on GitHub, then clone **your fork**:

   ```bash
   git clone https://github.com/<your-account>/<your-frontend-repository>.git
   cd <your-frontend-repository>
   ```

2. Set the following Vite variables in your local development environment:

   | Variable | Purpose |
   |---|---|
   | `VITE_API_URL` | Backend API base URL; for local development use `http://localhost:8000/api` |
   | `VITE_SUPABASE_URL` | Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anonymous key; never use a service-role key in browser code |

   Vite reads these values when starting/building the app. Restart the dev server after changing them. Keep private credentials out of source control.

3. Start the backend. For the local Docker database, follow the backend repository instructions and run the backend with its local database profile.

4. Install frontend dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`.

For local development, the frontend uses the backend's local email/password authentication. Google sign-in requires the corresponding Supabase project setup. Production builds use Supabase Auth for sign-in. Configure the backend's CORS allowlist to include the frontend origin.

The `/admin` route is not currently protected by a frontend role check, and the backend permits public subject writes. Do not treat this route as a secure administration boundary until authorization is enforced by the backend.

## Application routes

| Route | Purpose |
|---|---|
| `/` | Home page and subject catalog |
| `/subjects/:subjectId` | Subject details and learning content |
| `/notes` | Signed-in user's notes |
| `/todo` | Signed-in user's tasks |
| `/admin` | Subject publishing form |
| `/signin`, `/signup` | Authentication screens |

## Project structure

```text
.
├── src/
│   ├── components/         # Shared UI, rich editor, catalog, notes, and tasks
│   ├── context/            # Authentication, subjects, and notes state
│   ├── pages/              # Route-level screens
│   ├── services/           # API, authentication, and Supabase clients
│   ├── utils/              # Content and validation helpers
│   ├── App.jsx              # Routes and shared page layout
│   ├── index.css            # Global styles and editor content styles
│   └── main.jsx             # React application entry point
├── index.html
├── package.json
└── vite.config.js
```

## Scripts

```bash
npm run dev       # Start the local Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Deployment

Build and deploy the frontend with a static hosting service such as Vercel. Configure `VITE_API_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` as build-time variables in the hosting platform. Deploy the backend separately and ensure its host, CORS, and authentication settings permit the deployed frontend origin.

## Contributing

Create a feature branch from your fork, keep changes focused, and run the production build before opening a pull request. Never commit secret keys or credentials.
