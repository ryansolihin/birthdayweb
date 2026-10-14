# 💖 Romantic Birthday Landing Page

Website ucapan ulang tahun statis yang elegan, romantis, responsif, dan interaktif sesuai dengan desain referensi yang Anda berikan. Dibangun menggunakan **HTML5**, **Tailwind CSS**, dan **Vanilla JavaScript**.

---

## 🌟 Fitur Utama & Kesesuaian Desain

1. **Header & Navigation**:
   - Logo elegan `Amour ♡` bergaya serif/italic.
   - Menu navigasi: `HOME`, `OUR STORY`, `MEMORIES`, `REASONS`, `WISHES`, `COUPONS`.
   - Tombol audio melody melayang (*floating music trigger*).

2. **Hero Section**:
   - Badge pill: `✨ THE ONE WHO HOLDS MY HEART`.
   - Judul serif romantis: `Happy Birthday, My Love.`
   - Statistik cinta: `7,300+ Days of grace`, `365 Fresh smiles ahead`, `1 Only you`.
   - Tombol CTA: `READ OUR STORY` (buka modal cerita) & `OPEN GIFT NOW` (buka kejutan kado).
   - Kartu potret foto vertikal dengan lencana `★ FOREVER MY FAVORITE`.

3. **A Note From The Heart**:
   - Emblem ikon hati berry `#9B2242`.
   - Tipografi kutipan serif italic: *"Loving you is the easiest, sweetest thing I have ever done."*
   - Teks pesan cinta yang puitis dan tanda tangan romantis.

4. **Captured Stillness (Galeri Foto Kenangan)**:
   - 4 kartu foto berbingkai polaroid aesthetic:
     - `Coffee & Sweet Mornings` - Café Bloom
     - `Golden Coast Whispers` - Jimbaran Bay
     - `Sweet of Summer` - Day trip to seaside
     - `City of Lanterns` - A night to remember
   - **Fitur Interaktif**: Klik pada foto untuk membuka **Lightbox Fullscreen** dengan navigasi Next / Previous.

5. **Why I Adore You (6 Alasan Mencintaimu)**:
   - Kartu grid responsif dengan ikon pastel dan deskripsi mendalam:
     - *Your Soft Smile*
     - *Pure Kindness*
     - *Patient Listener*
     - *Playful Laughter*
     - *Gentle Comfort*
     - *Deep Dedication*

6. **Wishes for This Year & Mini Music Player**:
   - 3 kartu doa dan harapan terbaik.
   - **Mini Music Player Interaktif**:
     - Animasi piringan hitam vinyl yang berputar saat dimainkan.
     - Lagu: *"Sampai Jadi Debu"* - Banda Neira.
     - Progress bar interaktif & timer pemutaran.
     - Kontrol Play / Pause / Next / Prev dengan synthesizer chord romantis Web Audio API (dapat berbunyi langsung di browser tanpa ketergantungan file eksternal!).

7. **Love Coupons (Kupon Cinta Interaktif)**:
   - 3 kupon dengan desain gerigi tiket (*ticket notches*):
     - `Coupon #01: Dinner Date`
     - `Coupon #02: Weekend Escape`
     - `Coupon #03: All-Day Hugs`
   - Tombol **REDEEM TICKET** memicu ledakan konfeti (*confetti cannon*), membuka modal konfirmasi, dan menyimpan status klaim di `localStorage`.

8. **A Real Gift Awaits & WhatsApp CTA**:
   - Kartu ajakan manis untuk membuka kado asli.
   - Tombol WhatsApp crimson: `SEND ME A MSG ON WHATSAPP` dengan pesan otomatis yang sudah dienkode rapi.

9. **Efek Khusus Tambahan**:
   - Efek kelopak bunga mawar melayang (*drifting rose petals canvas*).

---

## 📁 Struktur File

```
e:\birthdayweb\
├── index.html            # Halaman utama landing page
├── style.css             # Styling kustom (tipografi, animasi vinyl, gerigi tiket)
├── script.js             # Logika pemutar musik, konfeti, kupon, lightbox, dan modal
├── README.md             # Panduan penggunaan & kustomisasi
└── assets/               # Foto potret dan memori kenangan
    ├── hero_portrait.png
    ├── memory_coffee.png
    ├── memory_sunset.png
    ├── memory_summer.png
    └── memory_celebration.png
```

---

## 🛠️ Cara Kustomisasi

1. **Mengubah Nomor WhatsApp**:
   - Buka `index.html`, cari `https://wa.me/?text=...` pada tombol `whatsapp-cta`.
   - Ubah menjadi nomor Anda, contoh: `https://wa.me/6281234567890?text=...`.

2. **Mengganti Foto**:
   - Masukkan foto pribadi Anda ke dalam folder `assets/` dengan nama yang sama:
     - `hero_portrait.png`
     - `memory_coffee.png`
     - `memory_sunset.png`
     - `memory_summer.png`
     - `memory_celebration.png`

3. **Menjalankan Secara Lokal**:
   - Anda cukup klik dua kali file `index.html` di File Explorer, atau jalankan via terminal:
     ```bash
     python -m http.server 8080
     ```
   - Buka di browser: `http://localhost:8080/`

4. **Cara Hosting Gratis**:
   - **Vercel / Netlify**: Tarik (*drag-and-drop*) folder `e:\birthdayweb` langsung ke dashboard Netlify Drop atau upload ke GitHub lalu hubungkan ke Vercel.
   - **GitHub Pages**: Buat repository baru di GitHub, unggah file ini, lalu aktifkan GitHub Pages di menu Settings > Pages.
