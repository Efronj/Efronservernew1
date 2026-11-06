# Efron Server

A responsive React + Vite cloud-storage starter with Supabase and Vercel.

## Included
- Public storage as the landing page (public read; signed-in upload/delete).
- Personal storage with Supabase account authentication, a PIN gate, and per-user private bucket policies.
- Password vault encrypted in the browser with AES-GCM (256-bit) and PBKDF2 (310,000 iterations). Supabase stores ciphertext only.
- Image/video/PDF/other file uploads, file listing, download/open, search, and delete.
- Mobile-friendly premium white UI.

## 1. Create Supabase project
1. Create a project at https://supabase.com/dashboard.
2. Open SQL Editor and run `supabase/setup.sql`.
3. In Project Settings > API, copy the Project URL and publishable/anon key.
4. Copy `.env.example` to `.env` and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Never put a Supabase `service_role` key in this frontend project.

## 2. Run locally
```bash
npm install
npm run dev
```

## 3. Deploy from a phone with Vercel
1. Upload this project folder to a GitHub repository (GitHub mobile website works).
2. Open https://vercel.com/new and import that repository.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. In Vercel Project Settings > Environment Variables, add the two variables from `.env`.
5. Deploy. Redeploy after changing environment variables.

## 4. Create your owner account
Use Sign in > Create an account. If email confirmation is enabled, confirm the email, then sign in. Supabase Auth protects private storage and the vault.

## Security notes
- The example Personal Storage PIN is `5060` because it was requested. Change `PIN` in `src/App.tsx` before deployment. This is a client-side convenience gate and must not be treated as real authentication. Supabase Auth + Storage RLS are the actual access controls.
- The Password Vault master password is separate from your account password. Use a long unique master password. It is never sent to Supabase; losing it means the vault cannot be decrypted.
- The public bucket is readable by anyone. Do not put private documents in Public Storage.
- This starter has no password recovery for the encrypted vault, no multi-factor auth, and no virus scanning. Keep backups of important originals.
- File previews are currently basic file cards; public images/videos/PDFs open/download through the public URL. Private files download securely.
