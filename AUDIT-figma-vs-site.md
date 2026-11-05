# Audit: Unictive Design System 1.0 (Figma) vs unictive-for-designer

Tanggal: 2026-10-26
Sumber Figma: `sdgeykOfCNdBzYR9Dr8KAg`, dibaca langsung lewat Plugin API (component set, axis varian, properti boolean/text/swap).
Sumber situs: `src/pages`, `src/data`, `src/scripts`, `src/components`, plus riwayat git.

## Ringkasan

- Di file Figma saat ini tidak ada varian Date Picker yang hilang. Isinya 5 component set dengan total 23 varian, dan situs memuat semuanya.
- Riwayat git situs tidak pernah menghapus varian. Satu-satunya penghapusan besar ada di commit `bec22aa`: panel "On this page" (TOC kanan) dibuang dari semua 40 halaman.
- Yang benar-benar kurang di situs ada tiga:
  1. Properti boolean Figma yang tidak bisa diatur di playground.
  2. Empat halaman komponen yang belum ada sama sekali.
  3. Komponen Avatar yang belum didokumentasikan.
- Label jumlah varian di Figma sudah basi: section Calendar dan Date Picker menulis "3 Variants", padahal isinya 4 dan 8.

Catatan: Plugin API tidak bisa membaca version history. Kalau dulu memang ada varian lain (misalnya multi-select), varian itu sudah tidak ada di file sekarang. Untuk memastikannya, cek File → Show version history di Figma.

## Date Picker (page `488:3598`)

| Component set | Varian | Axis / properti | Di situs |
|---|---|---|---|
| Date-picker | 8 | Alight=Right/Left, Calendar=false/true, Multiple=false/true | Lengkap (playground + Alignment + Types) |
| Calendar | 4 | Type=Single/Multiple, Date Range=false/true; boolean Time, Action-button, Date-preset; text Edit Info | Keempat varian tampil; **boolean tidak bisa diatur** |
| Date-number | 5 | State=Default/Hover/Select/Today/Off | Lengkap |
| Select | 4 | Type=01/02, Select=false/true | Lengkap |
| Select-years | 2 | Dropdown=false/true | Lengkap |

Yang kurang:
- Playground cuma punya toggle Label, Required, dan Date range. Toggle **Time**, **Action button**, dan **Date preset** belum ada, padahal `Calendar.astro` sudah mendukung props `time`, `actions`, dan `presets`.
- Tile Calendar Single selalu menampilkan Time dan Presets. Tidak ada contoh kombinasi lain, misalnya tanpa Time atau tanpa Action-button.
- Figma: label section "Calendar — 3 Variants" dan "Date Picker — 3 Variants" seharusnya 4 dan 8.

## Halaman komponen yang belum ada di situs

| Page Figma | Component set (varian) |
|---|---|
| Accordion | Accordion (6): State=Default/Active/Disable, Type=Arrow/Plus |
| Avatar | Avatar (16): Size × Indicator × Verified × Plus; Avatar Group (12): Total=2/3/3+ × Size; Caracter (160): Type=Default/Background/Initials/Icon × 10 karakter × 4 size |
| Dividers | Dividers (8): Type=With Label/With Title/With Icon/With Button, Left=false/true |
| Table | Table-header-cell (6), Table-row-cell (16): Type=Text/Checkbox/Radio Button/Profile/Switch/Label/Avatar Group/Custom |

Halaman Assets → Avatars cuma memuat 20 karakter (01–10, polos dan dengan background). Type **Initials** dan **Icon**, komponen **Avatar** (indicator, verified, plus), serta **Avatar Group** belum ada.

## Halaman lain

Untuk setiap halaman, semua axis varian Figma sudah dicek dengan pencocokan nama opsi terhadap source situs, lalu yang tidak cocok diperiksa manual.

| Halaman | Status | Catatan |
|---|---|---|
| Alert | Lengkap | Boolean `Button-01` (tombol kedua) tidak punya toggle sendiri |
| Badge | Lengkap | Boolean Left Icon / Right Icon tidak punya toggle |
| Banner | Lengkap | |
| Breadcrumbs | Lengkap | |
| Button, Icon, Link, Compact, Social Button | Lengkap | Button: boolean Left Icon / Right Icon tidak punya toggle |
| Checkbox, Radio Group, Switch | Lengkap | |
| Dropdown | Lengkap | |
| File Upload | Lengkap | Boolean `Mandatory` tidak ada di upload area |
| Modal | Lengkap | Boolean `Show Close` tidak punya toggle |
| Pagination | Lengkap | |
| Popover | Lengkap | Show Arrow/Header/Footer tersedia dengan nama lain |
| Progress Bar | Lengkap | Semua 11 step dan 3 ukuran lingkaran dibuat oleh data |
| Rating | Lengkap | |
| Stepper | Lengkap | Show Bar-02 dipetakan ke layout h03/h04 |
| Tab Menu | Lengkap | Base-item per jenis tidak ditampilkan sebagai set tersendiri |
| Text Input | Lengkap | |
| Text Area | Hampir | Boolean `Info` (ikon info di label) tidak punya toggle |
| Tooltip | Lengkap | |

## Prioritas perbaikan

1. Date Picker: tambahkan toggle Time / Action button / Date preset di playground, dan tile Calendar untuk kombinasi boolean-nya.
2. Buat halaman Accordion, Avatar, Dividers, dan Table.
3. Kembalikan TOC "On this page" kalau penghapusannya di `bec22aa` tidak disengaja.
4. Perbaiki label "3 Variants" di page Date Picker Figma.
