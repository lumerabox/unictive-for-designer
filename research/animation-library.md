# Unictive Motion — riset animation library

Status: riset, belum ada kode. Data support browser diambil dari MDN browser-compat-data (Okt 2026).

## 1. Kesimpulan cepat

- Pisahkan library jadi **3 tier**: `system` (UI produk), `landing` (marketing/scroll), `expressive` (Awwwards-style). Tier 1–2 harus jalan **tanpa dependency** (CSS + sedikit JS vanilla). Tier 3 boleh pakai GSAP.
- **CSS scroll-driven animation sekarang sudah didukung 3 engine** (Chrome 115, Safari 26, Firefox 159). Reveal-on-scroll, parallax, progress bar bisa pure CSS, dengan fallback IntersectionObserver untuk browser lama.
- **GSAP 3.15 gratis total** (termasuk SplitText, ScrollTrigger, MorphSVG, Flip) sejak diakuisisi Webflow. Pakai untuk split-text, pin/scrub kompleks, timeline panjang. Tetap optional peer dependency, bukan wajib.
- Token motion yang sekarang (`--ease`, `--fast/--base/--slow`) cukup untuk UI, tapi kurang untuk landing. Perlu tambahan kurva ekspresif dan durasi panjang.
- Semua animasi wajib menghormati `prefers-reduced-motion` (ganti jadi fade pendek atau tanpa animasi).

## 2. Motion tokens yang diusulkan

### Easing

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--ease` (sudah ada) | `cubic-bezier(0.2, 0, 0, 1)` | default UI, hover, state change |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` (out-quint) | elemen masuk (enter), dropdown, toast |
| `--ease-in` | `cubic-bezier(0.64, 0, 0.78, 0)` (in-quint) | elemen keluar (exit) — exit selalu lebih cepat |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` (in-out-cubic) | pindah posisi, slider, morph |
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo) | reveal landing, text naik, image reveal — "rasa Awwwards" |
| `--ease-expo-in-out` | `cubic-bezier(0.87, 0, 0.13, 1)` | curtain/wipe, page transition, mask reveal |
| `--ease-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | pop-in kecil (badge, checkmark, like) |
| `--ease-spring` | `linear(...)` hasil generator | spring tanpa JS, untuk toggle/sheet/drag release |

`linear()` sudah aman di semua browser modern (Chrome 113, Firefox 112, Safari 17.2), jadi spring bisa jadi token CSS biasa.

### Durasi

| Token | Nilai | Konteks |
|---|---|---|
| `--instant` | 80ms | press feedback, focus ring |
| `--fast` (ada) | 120ms | hover, warna |
| `--base` (ada) | 160ms | tooltip, popover, toggle |
| `--slow` (ada) | 260ms | drawer, modal |
| `--slower` | 400ms | section reveal kecil, card stagger |
| `--reveal` | 700ms | text/image reveal di landing |
| `--cinematic` | 1200ms | hero intro, page transition |

### Stagger & jarak
- `--stagger`: 40ms (list UI), 60–80ms (kata/card landing), 15–25ms (per huruf).
- `--distance-sm/md/lg`: 8 / 24 / 64px untuk translate fade-up.

Aturan dasar: UI produk ≤ 300ms. Landing boleh 600–1200ms tapi interaksi (klik, hover) tetap cepat.

## 3. Katalog animasi

Kolom **Teknik**: CSS = pure CSS, SDA = CSS scroll-driven, IO = IntersectionObserver, WAAPI = Web Animations API, GSAP = butuh GSAP.

### Tier 1 — System (UI produk)

| # | Nama | Deskripsi | Teknik |
|---|---|---|---|
| 1 | Fade | opacity 0→1 | CSS |
| 2 | Fade + scale (pop) | scale .96→1 + fade, origin dari trigger | CSS + `@starting-style` |
| 3 | Slide in (4 arah) | toast, drawer, sheet | CSS |
| 4 | Collapse/expand | accordion pakai `interpolate-size: allow-keywords` / grid-rows 0fr→1fr | CSS |
| 5 | Press | scale .97 saat `:active` | CSS |
| 6 | Shake | error input | CSS keyframes |
| 7 | Skeleton shimmer | loading | CSS |
| 8 | Spinner / progress indeterminate | loading | CSS |
| 9 | Number ticker | angka KPI naik | JS (rAF) / `@property` integer |
| 10 | Checkmark draw | stroke-dashoffset SVG | CSS |
| 11 | Tab indicator slide | indicator pindah ke tab aktif | CSS anchor positioning / JS FLIP |
| 12 | Layout shift (FLIP) | list reorder, filter grid | View Transitions (same-document) / GSAP Flip |
| 13 | Toast stack | stack + swipe dismiss ala Sonner | CSS + JS |
| 14 | Modal/dialog enter-exit | `<dialog>` + `@starting-style` + `transition-behavior: allow-discrete` | CSS |

`@starting-style` sudah didukung semua (Chrome 117, Firefox 129, Safari 17.5), jadi enter animation untuk elemen yang baru muncul/`display:none` tidak perlu JS lagi.

### Tier 2 — Landing (entrance & scroll)

| # | Nama | Deskripsi | Teknik |
|---|---|---|---|
| 15 | Fade up | translateY(24px)+fade saat masuk viewport | SDA `view()` / IO fallback |
| 16 | Fade down/left/right | variasi arah | SDA / IO |
| 17 | Blur in | `filter: blur(12px)`→0 + fade (tren 2024–26) | SDA / IO |
| 18 | Scale in | .9→1 untuk card/mockup | SDA / IO |
| 19 | Stagger children | anak muncul berurutan via `--i` index | CSS + IO |
| 20 | Line reveal (heading) | tiap baris naik dari mask `overflow:hidden` | JS split baris / GSAP SplitText |
| 21 | Word reveal | per kata naik + fade | JS split / SplitText |
| 22 | Char reveal | per huruf naik dari bawah, stagger 20ms, `--ease-expo` | SplitText |
| 23 | Image reveal — clip-path | `clip-path: inset(100% 0 0 0)`→`inset(0)` | SDA / IO |
| 24 | Image reveal — curtain | blok warna menutup lalu menyingkap | CSS / GSAP |
| 25 | Image reveal — zoom out | scale 1.2→1 di dalam frame yang di-clip | SDA |
| 26 | Parallax | gambar bergerak lebih lambat dari scroll | SDA `view()` |
| 27 | Scroll progress bar | bar di atas halaman | SDA `scroll()` |
| 28 | Sticky stacking cards | card menumpuk + mengecil saat scroll | `position: sticky` + SDA |
| 29 | Horizontal scroll section | section di-pin, konten jalan horizontal | GSAP ScrollTrigger (pin) |
| 30 | Marquee / logo ticker | infinite loop, pause on hover | CSS |
| 31 | Counter on view | angka statistik naik saat terlihat | IO + JS |
| 32 | Highlight text on scroll | kata berubah warna dari abu ke hitam mengikuti scroll | SDA per kata |

### Tier 3 — Expressive (Awwwards-style)

| # | Nama | Deskripsi | Teknik |
|---|---|---|---|
| 33 | Text scramble / decode | huruf acak lalu terkunci ke teks asli | JS / GSAP ScrambleText |
| 34 | Mask text over video/image | teks sebagai jendela ke media | CSS `background-clip:text` / SVG mask |
| 35 | Magnetic button | tombol tertarik ke kursor | JS (pointermove) |
| 36 | Custom cursor + follower | cursor lerp, membesar di link/gambar | JS |
| 37 | Image trail | gambar muncul mengikuti gerak kursor | JS / GSAP |
| 38 | Hover distortion | gambar distort/RGB split saat hover | WebGL (OGL/Three) atau SVG filter |
| 39 | Tilt 3D card | rotateX/Y mengikuti kursor + glare | JS |
| 40 | Smooth scroll | inertia scroll | Lenis 1.3 (pasangan standar dengan GSAP) |
| 41 | Page transition | antar halaman tanpa kedip | View Transitions (cross-document) |
| 42 | Shared element transition | thumbnail jadi hero di halaman detail | View Transitions `view-transition-name` |
| 43 | Preloader + hero intro | counter 0–100, lalu hero tersingkap | GSAP timeline |
| 44 | SVG path draw on scroll | garis/ilustrasi tergambar mengikuti scroll | SDA / GSAP DrawSVG |
| 45 | Morph shape | blob/ikon berubah bentuk | GSAP MorphSVG |
| 46 | Gradient / mesh bergerak | background hidup | CSS `@property` / WebGL shader |
| 47 | Grid / tile stagger reveal | grid gambar tersingkap acak/diagonal | GSAP stagger `grid` |
| 48 | Velocity skew | konten miring sesuai kecepatan scroll | GSAP ScrollTrigger / Lenis velocity |

## 4. Support browser (Okt 2026)

| Fitur | Chrome | Safari | Firefox | Sikap |
|---|---|---|---|---|
| `animation-timeline: view()/scroll()` | 115 | 26 | 159 | pakai, fallback IO untuk Safari < 26 |
| `@starting-style` | 117 | 17.5 | 129 | pakai |
| `linear()` easing | 113 | 17.2 | 112 | pakai |
| View Transitions (same-document) | 111 | 18 | 144 | pakai |
| View Transitions cross-document (`@view-transition`) | 126 | 18.2 | belum | progressive enhancement |

Fallback rule: bungkus SDA di `@supports (animation-timeline: view())`. Di luar itu, IO menambah class `.is-in` yang memicu transition biasa. Hasilnya sama, hanya beda mesin.

## 5. Library pihak ketiga

| Library | Versi | Peran | Catatan |
|---|---|---|---|
| GSAP | 3.15 | split text, pin, scrub, timeline, Flip, MorphSVG | gratis termasuk plugin; lisensi "Standard no-charge" (tidak boleh dipakai untuk membuat tool kompetitor Webflow) |
| Motion (motion.dev) | 14.7 | spring, gesture, React/Vue | alternatif kalau tim pakai React |
| Lenis | 1.3 | smooth scroll | hanya tier 3, mengganggu kalau dipakai di app produk |

Rekomendasi: core `unictive-motion` nol dependency. Preset GSAP dipisah di entry `unictive-motion/gsap` supaya user yang tidak butuh tidak menanggung ~70kb.

## 6. Aksesibilitas & performa

- `prefers-reduced-motion: reduce` → translate/scale/blur dimatikan, sisakan fade ≤ 150ms. Parallax, smooth scroll, marquee, cursor follower dimatikan total.
- Hanya animasikan `transform`, `opacity`, `filter`, `clip-path`. Hindari `width/height/top/left` (kecuali via `interpolate-size` untuk collapse).
- Split text harus tetap terbaca screen reader: `aria-label` di parent, span hasil split `aria-hidden="true"` (SplitText punya opsi `aria: "auto"`).
- Konten tidak boleh tersembunyi kalau JS gagal: state awal "hidden" hanya di-set saat class `.motion-ready` ada di `<html>`.
- Reveal hanya sekali (`once`) secara default; repeat opt-in.
- Batasi `will-change` dan blur besar di mobile.

## 7. Bentuk API yang diusulkan

Declarative via data attribute, cocok dengan gaya `unictive.css` yang sekarang:

```html
<h1 data-motion="chars-up" data-motion-stagger="20">Design that moves</h1>
<img data-motion="reveal-clip" data-motion-from="bottom" src="…">
<ul data-motion="fade-up" data-motion-children>…</ul>
<section data-motion="parallax" data-motion-speed="0.3">…</section>
```

Override per elemen lewat CSS var: `style="--motion-duration: 900ms; --motion-ease: var(--ease-expo)"`.

Struktur paket:
```
packages/unictive-motion/
  tokens.css        # easing, durasi, stagger
  motion.css        # preset tier 1–2 (SDA + .is-in fallback)
  motion.js         # IO observer, split text ringan, counter (~3kb)
  gsap.js           # preset tier 3, gsap sebagai peer dependency
```

Di site dokumentasi: halaman Foundations → Motion (token + kurva interaktif) dan halaman baru "Animations" berisi tiap preset dengan demo live, tombol replay, slider durasi/easing, dan copy snippet.

## 8. Yang perlu diputuskan

1. Nama paket: masuk ke `unictive-ds` atau paket terpisah `unictive-motion`?
2. Seberapa jauh tier 3: cukup preset GSAP, atau juga WebGL (hover distortion, shader)?
3. Prioritas build pertama — usulan: tokens → tier 2 reveal (fade-up, blur-in, stagger, image clip reveal, chars/words/lines up) → tier 1 → tier 3.
