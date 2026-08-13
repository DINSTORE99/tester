# DINSTORE API - SETUP

1. Supabase: buat project -> SQL Editor -> jalankan `supabase/schema.sql`.
2. Authentication -> Providers -> Email aktif. Untuk production, gunakan email confirmation.
3. Frontend env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_TURNSTILE_SITE_KEY, VITE_API_BASE_URL=/api.
4. Vercel backend env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY.
5. Cloudflare Turnstile: buat site -> domain Vercel -> Site Key masuk ke VITE_TURNSTILE_SITE_KEY, Secret Key masuk ke TURNSTILE_SECRET_KEY. Secret jangan pernah masuk App.jsx.
6. `npm install` lalu `npm run dev`.
7. Push GitHub -> Import ke Vercel -> isi Environment Variables -> Deploy.
8. Setelah akun kamu register, jadikan admin lewat SQL: `UPDATE public.profiles SET role='admin' WHERE email='email-kamu@example.com';`
9. API key dibuat server-side dengan format `dinstore...`; database hanya menyimpan SHA-256 hash. Raw key ditampilkan saat generate/regenerate.
10. Daftar endpoint demo ada di `src/App.jsx`. Ganti dengan endpoint asli kamu. Endpoint server asli diletakkan di folder `api/`.
