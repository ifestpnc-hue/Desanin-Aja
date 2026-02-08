

## Update Midtrans Sandbox Keys

### Masalah
Key Midtrans yang tersimpan saat ini menggunakan format production (`Mid-server-...`), sehingga sistem selalu mengarah ke API production dan menghasilkan error "Access denied".

### Rencana
1. Update secret `MIDTRANS_SERVER_KEY` dengan key sandbox baru (format `SB-Mid-server-xxx`)
2. Update secret `MIDTRANS_CLIENT_KEY` dengan key sandbox baru (format `SB-Mid-client-xxx`)
3. Test pembayaran untuk memastikan popup Midtrans Snap muncul

### Detail Teknis
- Menggunakan tool `add_secret` untuk meminta input key baru dari Anda
- Setelah key diupdate, Edge Function `create-midtrans-transaction` akan otomatis mendeteksi prefix `SB-` dan menggunakan endpoint sandbox (`https://app.sandbox.midtrans.com/snap/v1/transactions`)
- Tidak ada perubahan kode yang diperlukan — logika deteksi sandbox sudah benar di kode saat ini

