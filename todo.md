# Project TODO

- [x] Menetapkan shell aplikasi SaaS elegan dengan sidebar, topbar, tema terang/gelap, dan responsif
- [x] Menyiapkan autentikasi pengguna dan tampilan status sesi
- [x] Membuat dashboard ringkas dengan status pemrosesan, jumlah rapat, dan action item aktif
- [x] Membuat daftar rapat dengan pencarian, filter, tambah, edit, detail, arsip, dan duplikasi
- [x] Membuat formulir detail rapat untuk judul, tanggal, peserta, agenda, dan metadata
- [x] Membuat perekaman audio browser dengan timer, pause/resume, stop, indikator mikrofon, dan pemutaran
- [x] Membuat unggah audio dengan drag-and-drop, metadata file, progress, dan validasi format
- [x] Membuat alur transkripsi berbahasa Indonesia dengan timestamp, speaker, confidence, dan koreksi manual
- [x] Membuat analisis AI terstruktur untuk ringkasan, poin pembahasan, keputusan, masalah, follow-up, dan kesimpulan
- [x] Menyiapkan integrasi Gemini yang aman melalui environment variable server-side
- [x] Membuat action item dengan PIC, tenggat, prioritas, status, dan penyuntingan cepat
- [x] Membuat draft notulen terstruktur dan ekspor hasil yang mudah dibagikan
- [x] Menambahkan skema database, query helper, procedure tRPC, dan pengujian Vitest
- [x] Menjalankan pemeriksaan tipe, test, dan verifikasi visual responsive
- [x] Menyimpan checkpoint akhir dan menyiapkan petunjuk menjalankan aplikasi

## Refinement pass

- [x] Hubungkan dashboard, daftar rapat, detail rapat, dan action item ke data backend/tRPC nyata serta hilangkan data demo dari UI utama
- [x] Buat formulir detail rapat lengkap yang tersimpan ke backend untuk judul, tanggal, peserta, agenda, lokasi, penyelenggara, dan departemen
- [x] Implementasikan metadata audio nyata (nama, ukuran, durasi), indikator mikrofon/level audio, dan progress upload sebenarnya
- [x] Tampilkan hasil transkripsi backend, simpan koreksi manual, dan hindari confidence/speaker placeholder
- [x] Render hasil analisis Gemini nyata termasuk masalah, follow-up, kesimpulan, draft notulen, dan ekspor berbasis data AI
- [x] Tambahkan quick edit action item untuk tugas, PIC, tenggat, prioritas, dan status
- [x] Tandai semua refinement pass selesai setelah validasi ulang dan simpan checkpoint akhir

## Final quality pass

- [x] Hapus fallback data demo dari state utama dan tambahkan loading/empty states berbasis hasil tRPC
- [x] Buat form detail rapat editable untuk seluruh field dan simpan melalui mutation backend
- [x] Jelaskan progress recorder sebagai progress pemrosesan bila upload progress byte-level belum tersedia
- [x] Render problems dan follow-up dari AI serta sertakan keduanya dalam ekspor Markdown
- [x] Tandai quality pass selesai setelah validasi final dan checkpoint akhir tersimpan

## Checkpoint blockers

- [x] Hapus localMeetings/localActions fallback dari UI utama dan gunakan loading, empty, serta error states dari query tRPC
- [x] Isi peserta existing pada form detail dan simpan meetingDate bersama field metadata lain melalui mutation backend

## Empty-state refinement

- [x] Tambahkan empty state eksplisit untuk action item dan panel dashboard yang kosong berdasarkan hasil query tRPC

## Activity chart refinement

- [x] Ganti chart aktivitas hardcoded dengan empty state saat belum ada rapat atau data pemrosesan dari backend

## Loading animation enhancement

- [x] Tambahkan state tahap pemrosesan yang jelas untuk upload, transkripsi, dan analisis AI
- [x] Tambahkan animasi loading interaktif, progress visual, dan estimasi status tanpa mengubah alur backend
- [x] Tambahkan dukungan reduced-motion dan pastikan tombol/feedback tidak membingungkan saat proses berjalan
- [x] Validasi tipe, test, build, dan visual preview lalu simpan checkpoint baru

## Dynamic completion estimate

- [x] Buat formula estimasi berdasarkan durasi audio, ukuran file, dan tahap pipeline
- [x] Tampilkan estimasi waktu selesai yang dinamis serta copy penjelas di recorder
- [x] Uji perhitungan, edge case file kecil/besar, reduced-motion, build, dan visual preview lalu simpan checkpoint baru

## Stage-weighted ETA refinement

- [x] Sesuaikan remaining ETA agar memakai bobot berbeda untuk upload, transkripsi, dan analisis AI
- [x] Tambahkan test untuk perbedaan estimasi per tahap dan validasi ulang sebelum checkpoint

## Processing cancellation

- [x] Tambahkan state pembatalan dan AbortController untuk menghentikan request pipeline yang sedang berjalan
- [x] Tambahkan tombol Batalkan dengan copy status yang jelas untuk transkripsi dan analisis AI
- [x] Pastikan pembatalan mencegah langkah berikutnya, mereset ETA/progress, dan memberi feedback tanpa error palsu
- [x] Tambahkan test cancellation behavior, jalankan check/test/build, verifikasi visual, lalu simpan checkpoint baru
