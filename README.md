# CSEHub React frontend

The React app uses the Django API in `cseHub-python` for admin-managed subject cards
and profile/admin authorization. Supabase Auth signs users in and supplies the JWT
Django validates. Notebook entries and Todo tasks are stored in separate,
user-owned Django database tables.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project's
   public API settings. These are browser-safe project values; never put a service-role
   key in the frontend.
3. Keep `VITE_API_URL=http://localhost:8000/api` for the local Django backend.
4. Start the backend from `cseHub-python`:

   ```powershell
   docker compose --profile localdb up --build backend
   ```

   Django migrations create the separate `workspace_notes` and `workspace_todos`
   tables during startup.

5. Start React from this folder:

   ```powershell
   npm install
   npm run dev
   ```

The local Vite origin `http://localhost:5173` is included in the Docker backend's
CORS settings. Restart Vite after changing `.env.local`.

## Authentication and administration

In local Vite development, email/password sign-up and sign-in use Django's
`/api/auth/` endpoints, so test accounts do not require a deliverable email. Django
stores passwords using its password hashers. This local auth path is disabled when
Django `DEBUG` is false unless explicitly enabled, and should not be enabled in
production. Google sign-in continues to use Supabase.

In production builds, email/password and Google sign-in use Supabase Auth. The
frontend sends the Supabase access token as a bearer token to Django's `/api/me/`
and subjects API. Subject writes are temporarily open without authentication.

Anyone can open the subject publisher from the **Admin** navigation tab or `/admin`.
It supports domain selection, Markdown content, language-specific code examples,
author attribution, and publish date. Django's built-in administration site is at
`http://localhost:8000/admin/` and uses Django admin credentials/session.
