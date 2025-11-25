# GitHub Actions Workflows

## deploy.yml

Workflow ini otomatis build dan deploy aplikasi ke GitHub Pages setiap kali ada push ke branch `main`.

### Cara Kerja

1. **Trigger**: Push ke branch `main` atau manual via GitHub UI
2. **Build**: 
   - Install dependencies (`npm ci`)
   - Build dengan Vite (`npm run build`)
   - Output di folder `dist/`
3. **Deploy**: Upload `dist/` folder ke GitHub Pages

### Setup GitHub Pages

1. Buka repository di GitHub
2. Settings → Pages
3. Source: **GitHub Actions** (bukan "Deploy from branch")
4. Save

### Manual Trigger

Jika ingin trigger manual:
1. Buka tab "Actions" di GitHub
2. Pilih workflow "Deploy to GitHub Pages"
3. Klik "Run workflow"
4. Pilih branch `main`
5. Klik "Run workflow"

### Monitoring

- Lihat status di tab "Actions"
- Setiap deployment akan tercatat dengan status (✅ success atau ❌ failed)
- Deployment biasanya selesai dalam 2-3 menit

### Deployment URL

Setelah berhasil, aplikasi akan live di:
```
https://yourusername.github.io/puasa-ayyamul-bidh/
```

> **Note**: Ganti `yourusername` dengan username GitHub Anda dan `puasa-ayyamul-bidh` dengan nama repository Anda.

### Troubleshooting

**Build failed?**
- Cek error di log Actions
- Biasanya karena npm dependencies issue
- Run `npm install` dan `npm run build` secara lokal dulu

**Deploy succeed tapi 404?**
- Pastikan `base` di `vite.config.js` sesuai nama repo
- Pastikan GitHub Pages source sudah "GitHub Actions"

**Blank page?**
- Check browser console untuk errors
- Pastikan path assets sudah benar (relative paths)
