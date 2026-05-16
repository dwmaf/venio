<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Participant;
use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Factory::create('id_ID');

        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator',
                'email' => 'admin@regist.local',
                'password' => Hash::make('password'),
            ]
        );

        foreach (range(1, 4) as $index) {
            $tipeEvent = $faker->randomElement(['OFFLINE', 'ONLINE','HYBRID']);
            $startHour = rand(7, 14); // Jam 07:00 - 14:00
            $endHour = rand($startHour + 1, 17); // Minimal 1 jam setelah jam mulai, max 17:00
            Event::create([
                'nama_event' => $faker->company() . ' Event ' . $index,
                'lokasi' => $tipeEvent === 'ONLINE' ? null : implode(' ', array_slice(explode(' ', $faker->address), 0, 2)),
                'tanggal_event' => now()->format('Y-m-d'), // Hari Ini
                'jam_mulai' => sprintf('%02d:00:00', $startHour),
                'jam_selesai' => sprintf('%02d:00:00', $endHour),
                'tipe_event' => $tipeEvent,
            ]);
        }

        // 2. BUAT 3 UPCOMING EVENTS (MENDATANG)
        foreach (range(1, 3) as $index) {
            $tipeEvent = $faker->randomElement(['OFFLINE', 'ONLINE','HYBRID']);
            $startHour = rand(7, 14);
            $endHour = rand($startHour + 1, 17);
            Event::create([
                'nama_event' => $faker->company() . ' Event ' . $index,
                'lokasi' => $tipeEvent === 'ONLINE' ? null : implode(' ', array_slice(explode(' ', $faker->address), 0, 2)),
                'tanggal_event' => now()->addDays(rand(2, 60))->format('Y-m-d'), // Masa Depan
                // 'tanggal_event' => now(), // Masa Kini
                'jam_mulai' => sprintf('%02d:00:00', $startHour),
                'jam_selesai' => sprintf('%02d:00:00', $endHour),
                'tipe_event' => $tipeEvent,
            ]);
        }

        // 3. BUAT 30 PAST EVENTS (MASA LALU)
        foreach (range(1, 30) as $index) {
            $tipeEvent = $faker->randomElement(['OFFLINE', 'ONLINE','HYBRID']);
            $startHour = rand(7, 14);
            $endHour = rand($startHour + 1, 17);
            Event::create([
                'nama_event' => $faker->company() . ' Event ' . $index,
                'lokasi' => $tipeEvent === 'ONLINE' ? null : implode(' ', array_slice(explode(' ', $faker->address), 0, 2)),
                'tanggal_event' => now()->subDays(rand(5, 120))->format('Y-m-d'), // Masa Lalu
                'jam_mulai' => sprintf('%02d:00:00', $startHour),
                'jam_selesai' => sprintf('%02d:00:00', $endHour),
                'tipe_event' => $tipeEvent,
            ]);
        }

        $allEvents = Event::all();
        foreach ($allEvents as $event) {
            $jumlahPeserta = rand(40, 100); 
            for ($i = 0; $i < $jumlahPeserta; $i++) {
                $nama = $faker->name();
                $email = $faker->unique()->safeEmail();

                // Logika metode kehadiran dinamis berdasarkan tipe event
                if ($event->tipe_event === 'HYBRID') {
                    $metode = $faker->randomElement(['OFFLINE', 'ONLINE']);
                } else {
                    $metode = $event->tipe_event; // OFFLINE atau ONLINE sesuai eventnya
                }

                $daftarProfesi = ['Mahasiswa', 'Dosen/Guru', 'Aparatur Sipil Negara (ASN)', 'Karyawan Swasta', 'Wirausaha', 'Pelajar', 'Umum'];
                $checkedInAt = null;
                $todayDate = now()->format('Y-m-d');
                if ($metode === 'OFFLINE') {
                    if ($event->tanggal_event < $todayDate) {
                        // Event masa lalu: 90% kemungkinan hadir
                        $checkedInAt = $faker->boolean(90) ? now()->subHours(rand(1, 8)) : null;
                    } elseif ($event->tanggal_event === $todayDate) {
                        // Event hari ini: 50% kemungkinan sudah hadir
                        $checkedInAt = $faker->boolean(50) ? now() : null;
                    }
                    // Jika event masa depan (> $todayDate), biarkan null
                }
                Participant::create([
                    'event_id' => $event->id,
                    'email_primary' => $email,
                    'nama_lengkap' => $nama,
                    'no_hp_normalized' => '628' . $faker->numerify('##########'),
                    'kategori_peserta' => $faker->randomElement($daftarProfesi),
                    'metode_kehadiran' => $metode,
                    'checked_in_at' => $checkedInAt,
                    'qr_token' => 'OFF-' . strtoupper(Str::random(12)),
                    'dedupe_key_hash' => hash('sha256', strtolower($nama) . '|' . $email . '|' . $metode . '|' . $event->id),
                ]);
            }
        }

        // --- BUAT 1 EVENT HYBRID KHUSUS UNTUK TESTING BULK EMAIL ---
        $specialEvent = Event::create([
            'nama_event' => 'Bulk Email Test Event (Hybrid)',
            'lokasi' => 'Ruang Testing Hybrid',
            'tanggal_event' => now()->addDays(2)->format('Y-m-d'), // Upcoming
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'tipe_event' => 'HYBRID',
        ]);

        $testEmails = [
            'dinnereatc@gmail.com',
            'syariffullah0911@gmail.com',
            'd1041231018@student.untan.ac.id',
            'dawamaf11ipa2@gmail.com',
            'd1041211005@student.untan.ac.id'
        ];

        $daftarProfesi = ['Mahasiswa', 'Dosen/Guru', 'Aparatur Sipil Negara (ASN)', 'Karyawan Swasta', 'Wirausaha', 'Pelajar', 'Umum'];

        foreach ($testEmails as $email) {
            $metode = $faker->randomElement(['OFFLINE', 'ONLINE']);
            $nama = $faker->name();
            
            Participant::create([
                'event_id' => $specialEvent->id,
                'email_primary' => $email,
                'nama_lengkap' => $nama,
                'no_hp_normalized' => '628' . $faker->numerify('##########'),
                'kategori_peserta' => $faker->randomElement($daftarProfesi),
                'metode_kehadiran' => $metode,
                'checked_in_at' => null,
                'dedupe_key_hash' => hash('sha256', strtolower($nama) . '|' . $email . '|' . $metode . '|' . $specialEvent->id),
            ]);
        }
    }
}
