# Venio (Web Manajemen Event) - Installation Guide

Proyek ini adalah aplikasi berbasis Laravel, InertiaJs, dan ReactJs. Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di mesin lokal Anda.

## Prasyarat

Pastikan Anda sudah menginstal:
- PHP >= 8.2
- Composer
- Node.js & pnpm (sangat disarankan untuk menggunakan ppnpm dibanding pnpm karena lebih cepat dan lebih hemat storage, pnpm membuat link jika versi dependansi yg sama berada di direktori yang berbeda, sementara pnpm akan membuat duplikasi walaupun versi dependansinya sama sehingga akan memakan ruang lebih banyak)
- MySQL/MariaDB/SQLite

## Langkah Instalasi

### 1. Clone Repository
```sh
git clone https://github.com/dwmaf/venio.git
cd venio
```

### 2. Instal Dependensi PHP
```sh
composer install
```

### 3. Setup File Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasi database Anda.
```sh
copy .env.example .env
```
*Gunakan `cp` jika menggunakan terminal Git Bash/Linux.*

3. **Izin Firewall (Wajib)**:
   Agar HP bisa memanggil server di laptop, jalankan PowerShell sebagai **Administrator** dan eksekusi perintah berikut satu per satu:
   ```sh
   netsh advfirewall firewall add rule name="Laravel App" dir=in action=allow protocol=TCP localport=8000
   netsh advfirewall firewall add rule name="Laravel Reverb" dir=in action=allow protocol=TCP localport=8081
   ```

### 5. Generate Application Key
```sh
php artisan key:generate
```

### 6. Hubungkan Storage ke Public
Jalankan storage link agar file yang tersimpan di storage bisa diakses:
```sh
php artisan storage:link
```

### 7. Migrasi Database
Pastikan database sudah dibuat di MySQL, lalu jalankan:
```sh
php artisan migrate
```

### 8. Seeding Database
Data dummy sudah tersedia di databaseseeder, jadi anda bisa seeding data untuk lihat datanya:
Copy folder files di folder public ke folder storage/app/public

```sh
php artisan db:seed
```

### 9. Instal Dependensi Frontend
```sh
pnpm install
```

### 10. Menjalankan Aplikasi

1. Jalankan server Laravel:
   ```sh
   php artisan serve
   ```
2. Jalankan pemantau aset Vite (opsional saat pengembangan):
   ```sh
   pnpm run dev
   ```
3. Atau jika ingin jalankan dengan satu perintah saja untuk menjalankan server laravel dan pemantau aset Vite:
   ```sh
   composer run dev
   ```


### 11. Production
1. Jalankan build aset:
    ```sh
    pnpm run build
    ```
2. Kemudian Jalankan server Laravel:
    ```sh
    php artisan serve
    ```

# Future Dev
1. Slicing the design for Pages/Events/OnGoingEvent.jsx based on the design arif made, the controller is EventController.php (the func is ongoingEvents()), the route is /ongoing-events = DONE
2. Slicing the design for Pages/Events/UpcomingEvent.jsx based on the design arif made, the controller is EventController.php (the func is upcomingEvents()), the route is /upcoming-events = DONE
3. Slicing the design for Pages/Events/PastEvent.jsx based on the design arif made, the controller is EventController.php (the func is pastEvents()), the route is /past-events = DONE
4. Slicing the design for Pages/Events/DetailEvent.jsx based on the design arif made, the controller is EventController.php (the func is detailEvents()), the route is /events/{event}.
5. Slicing the design for Pages/Events/Checkin.jsx based on the design arif made (the design hasn't been made yet), the controller is CheckinController.php (the func is index()), the route is /datang.
6. Slicing the design for Pages/Login.jsx based on the design arif made, the controller is AuthController.php (the func is showLoginForm()), the route is /login.