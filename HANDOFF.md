# Notulen AI Aank PRO — Handoff

Notulen AI Aank PRO adalah workspace notulen rapat berbasis AI berbahasa Indonesia. Aplikasi menggunakan React, Tailwind, Express, tRPC, Drizzle, database, autentikasi Manus, object storage, voice transcription, dan server-side LLM analysis.

## Menjalankan aplikasi

Gunakan Node.js dan pnpm yang kompatibel dengan `package.json`. Dari root proyek, jalankan `pnpm install` bila dependency belum tersedia, kemudian `pnpm dev` untuk development. Pemeriksaan tipe dijalankan dengan `pnpm check`, test dengan `pnpm test`, dan production build dengan `pnpm build`.

Environment variable sistem untuk autentikasi, database, storage, transcription, dan LLM sudah disediakan oleh template WebDev. Kredensial AI tetap diproses di server; browser tidak menerima secret server-side.

## Alur fitur utama

Pengguna masuk melalui autentikasi Manus lalu melihat ringkasan workspace. Rapat baru dapat dibuat dari halaman Semua rapat dengan judul, tanggal, agenda, peserta, lokasi, penyelenggara, dan departemen. Daftar rapat mendukung pencarian, filter status, edit judul, duplikasi, arsip, hapus, serta detail rapat editable.

Dari halaman Rekam rapat, pengguna dapat merekam melalui browser atau memilih file audio. File ditinjau dengan nama, ukuran, durasi, preview, dan indikator mikrofon. Tombol Proses dengan AI membuat rapat, menyimpan audio di object storage, menjalankan transkripsi Bahasa Indonesia, lalu menyimpan analisis AI terstruktur. Meter di halaman tersebut menunjukkan tahapan pemrosesan, bukan byte-level upload progress.

Detail rapat menampilkan ringkasan, keputusan, poin pembahasan, permasalahan, tindak lanjut, kesimpulan, transkrip bertimestamp yang bisa dikoreksi, dan action item. Action item mendukung perubahan status dan quick edit untuk tugas, PIC, tenggat, prioritas, dan status. Ekspor menghasilkan file Markdown yang dapat dibagikan.

## Validasi terakhir

Pemeriksaan terakhir berhasil: `pnpm check`, `pnpm test` dengan 2 file test dan 2 test lulus, serta `pnpm build`. Visual verification telah dilakukan pada dashboard, daftar rapat, dan recorder; empty states berasal dari data query backend.

## Catatan operasional

Workspace baru tanpa rapat akan menampilkan angka nol dan empty states yang jujur. Analisis AI hanya menghasilkan data setelah audio berhasil diproses. Jika browser belum memberi izin mikrofon, gunakan unggah file audio atau berikan izin mikrofon saat diminta.
