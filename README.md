**Deskripsi Proyek**
Proyek ini adalah sebuah API untuk platform E-commerce yang memungkinkan pengguna untuk mengelola produk, akun pengguna, keranjang belanja, dan melakukan proses pembayaran.

**Dokumentasi Instalasi Proyek API E-commerce**
**Persyaratan Sistem**
Pastikan sistem Anda memenuhi persyaratan berikut sebelum menginstal proyek API E-commerce:
- Node.js dan npm terinstal (versi terbaru disarankan)
- Database MySQL atau database lain yang didukung telah diatur dan berjalan

**Langkah-langkah Instalasi**
1. Clone Repositori
Clone repositori proyek dari repository GitLab atau GitHub
2. Instal Dependensi
Masuk ke direktori proyek dan instal semua dependensi menggunakan npm
3. Konfigurasi Database
Konfigurasikan koneksi ke database dalam file konfigurasi proyek, database.js. Pastikan untuk mengisi host, nama pengguna, kata sandi, dan nama database yang sesuai.
4. Jalankan Server
Setelah konfigurasi selesai, jalankan server proyek "npm start". Server akan mulai berjalan dan API E-commerce akan dapat diakses pada alamat yang ditentukan (http://localhost:4500).
5. Uji API
Uji API dapat menggunakan perangkat lunak seperti Postman untuk menguji API E-commerce yang telah diinstal.

**Endpoints**
**Manajemen Produk**
GET /products: Mendapatkan daftar semua produk.
POST /products: Menambahkan produk baru.
DELETE /products/:id: Menghapus produk berdasarkan ID.

**Manajemen Akun Pengguna**
POST /users: Mendaftar pengguna baru.
POST /login: Masuk ke akun pengguna.
GET /users: Mendapatkan profil pengguna.

**Keranjang Belanja**
GET /cart/:user_id: Mendapatkan isi keranjang belanja pengguna.
POST /cart/add: Menambahkan produk ke keranjang belanja.
DELETE /cart/items/:id: Menghapus produk dari keranjang belanja.
POST /orders: Melakukan proses checkout dan membuat pesanan.

**Pemrosesan Pembayaran**
POST /orders/pay: Memproses pembayaran pesanan.

**Fungsi Pencarian**
GET /products/search: Mencari produk berdasarkan kata kunci.
