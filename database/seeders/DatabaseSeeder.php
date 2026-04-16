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

        // $ongoingNames = ['Workshop React Hari Ini', 'Seminar AI Live', 'Workshop Vue Live'];
        $ongoingNames = ['Workshop React Hari Ini'];
        foreach ($ongoingNames as $name) {
            Event::create([
                'nama_event' => $name,
                'lokasi' => 'Konferensi Untan',
                'tanggal_event' => now()->format('Y-m-d'), // Hari Ini
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '17:00:00',
                'tipe_event' => 'HYBRID',
                'status' => 'BELUM_SELESAI', // Karena masih jalan
            ]);
        }

        // 2. BUAT 4 UPCOMING EVENTS (MENDATANG)
        $upcomingNames = ['Kalbar Naker Fest 2026', 'Inertia Masterclass', 'Cyber Security Summit', 'Digital Marketing Expo'];
        foreach ($upcomingNames as $name) {
            Event::create([
                'nama_event' => $name,
                'lokasi' => implode(' ', array_slice(explode(' ', $faker->address), 0, 2)),
                // 'tanggal_event' => now()->addDays(rand(2, 60))->format('Y-m-d'), // Masa Depan
                'tanggal_event' => now(), // Masa Depan
                'jam_mulai' => '09:00:00',
                'jam_selesai' => '15:00:00',
                'tipe_event' => $faker->randomElement(['OFFLINE', 'ONLINE']),
                'status' => 'BELUM_SELESAI',
            ]);
        }

        // 3. BUAT 5 PAST EVENTS (MASA LALU)
        $pastNames = ['Grebek Pasar Pontianak', 'Tech Talk Vol 1', 'Pelatihan UMKM', 'Webinar Flutter', 'Bootcamp PHP'];
        foreach ($pastNames as $name) {
            Event::create([
                'nama_event' => $name,
                'lokasi' => implode(' ', array_slice(explode(' ', $faker->address), 0, 2)),
                'tanggal_event' => now()->subDays(rand(5, 120))->format('Y-m-d'), // Masa Lalu
                'jam_mulai' => '10:00:00',
                'jam_selesai' => '16:00:00',
                'tipe_event' => $faker->randomElement(['OFFLINE', 'ONLINE']),
                'status' => 'SELESAI', // Sudah beres
            ]);
        }

        $allEvents = Event::all();
        foreach ($allEvents as $event) {
            for ($i = 0; $i < 20; $i++) {
                $nama = $faker->name();
                $email = $faker->unique()->safeEmail();
                $metode = $faker->randomElement(['OFFLINE', 'ONLINE', 'HYBRID']);
                Participant::create([
                    'event_id' => $event->id,
                    'email_primary' => $email,
                    'nama_lengkap' => $nama,
                    'no_hp_normalized' => '628' . $faker->numerify('##########'),
                    'metode_kehadiran' => $metode,
                    'checked_in_at' => ($event->status === 'SELESAI')
                        ? ($faker->boolean(90) ? now()->subHours(rand(1, 8)) : null)
                        : ($event->tanggal_event === now()->format('Y-m-d') && $faker->boolean(50) ? now() : null),
                    'qr_token' => 'OFF-' . strtoupper(Str::random(12)),
                    'dedupe_key_hash' => hash('sha256', strtolower($nama) . '|' . $email . '|OFFLINE|' . $event->id),
                ]);
            }
        }
    }
}
