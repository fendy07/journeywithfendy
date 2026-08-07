# Hasil Analisis Web & Implementasi TDD (Test-Driven Development)

## 📌 1. Analisis Bug & Temuan Utama (Phase RED)

Melalui analisis mendalam terhadap `index.html` dan `assets/css/main.css`, ditemukan **4 bug fungsional & keandalan**:

| No | Komponen | Deskripsi Bug | Dampak | Status Perbaikan |
|---|---|---|---|---|
| **1** | Resume Language Switcher | Tombol `English` dan `Indonesia` keduanya memiliki status `is-active`, `primary`, dan `aria-pressed="true"` secara bersamaan saat halaman pertama kali dimuat. | Secara visual kedua tombol terlihat aktif berbarengan, membingungkan pengguna. | **FIXED** ✔ |
| **2** | Project Cards Expand/Collapse | Skrip ekspansi teks proyek (`.toggle-text-btn`) bersarang di dalam blok pengecekan tombol resume, dan ambang batas teks diatur ke `500` karakter. | Teks deskripsi proyek yang panjangnya 200–500 karakter tidak mendapatkan tombol *Read More*. | **FIXED** ✔ |
| **3** | Links / Tombol Aksi | Terdapat 3 tombol aksi pada proyek (NULISING Repository, Automation Scheduling Repository, AI Chatbot Demo Apps) yang memiliki atribut `href=""`. | Mengklik tombol membuka ulang halaman kosong di tab baru. | **FIXED** ✔ |
| **4** | Handling Lib Eksternal | Penggunaan `new MobileDetect(...)` secara langsung tanpa penanganan kondisi ketersediaan pustaka eksternal. | Jika koneksi offline atau CDN pustaka terhambat, dapat terjadi `ReferenceError: MobileDetect is not defined` yang menghentikan seluruh eksekusi JavaScript. | **FIXED** ✔ |

---

## 🧪 2. Implementasi TDD (Test-Driven Development)

Telah dibuat pengujian otomatis berbasis **Node.js Test Runner** (`node --test`) dan **JSDOM** pada berkas [`test/app.test.js`](file:///c:/Users/ThinkPad/project/journeywithfendy/test/app.test.js).

### Siklus TDD:
1. **Phase RED (Fail First)**: Pengujian pertama dijalankan dan menangkap 4 pengujian gagal (*failed*) sesuai bug yang ditemukan.
2. **Phase GREEN (Pass Fixes)**: Dilakukan perbaikan kode pada `index.html` hingga seluruh pengujian lulus 100%.
3. **Phase REFACTOR**: Mengorganisir struktur skrip secara independen dan aman dari potensi *crash runtime*.

---

## 📊 3. Hasil Pengujian Otomatis (Phase GREEN)

```bash
> journeywithfendy@1.0.0 test
> node --test test/*.test.js

✔ TDD 1: Only English button should be active on initial page load (5840ms)
✔ TDD 2: Clicking Indonesia language button toggles grid visibility and attributes (2843ms)
✔ TDD 3: Project cards text length > 200 chars or with lists get Read More toggle (1969ms)
✔ TDD 4: Interactive buttons should not have empty href="" attributes (1479ms)
✔ TDD 5: Referenced image assets exist on disk (24ms)

ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

---

## 🛠 4. Ringkasan Perbaikan Kode

### 1. Perbaikan Inisialisasi Tombol Resume (`index.html`)
- Tombol **Indonesia** diawali dengan status netral (`class="button small resume-language-option"` dan `aria-pressed="false"`), hanya tombol **English** yang aktif pada pemuatan awal.

### 2. Perbaikan Tautan Kosong `href=""` (`index.html`)
- Mengganti tautan `href=""` pada tombol proyek NULISING, Automation Scheduling, dan AI Chatbot dengan URL repositori GitHub yang valid.

### 3. Independensi & Skala Teks Ekspansi Proyek (`index.html`)
- Memisahkan blok skrip ekspansi kartu proyek dari blok resume.
- Mengatur ambang batas teks menjadi **> 200 karakter**, memastikan seluruh deskripsi proyek yang panjang memiliki opsi tombol **"Read more ▼"** / **"Show less ▲"**.

### 4. Eksekusi Aman `MobileDetect` (`index.html`)
- Membungkus pembentukan objek `MobileDetect` dalam pengecekan `if (typeof MobileDetect !== 'undefined')`, mencegah potensi *runtime crash* jika pustaka eksternal terhambat.
