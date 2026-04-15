<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator',
                'email' => 'admin@regist.local',
                'password' => Hash::make('admin12345'),
            ]
        );

        $event1 = \App\Models\Event::updateOrCreate(
            ['nama_event' => 'Kalbar Naker Fest'],
            [
                'tanggal_mulai' => '2026-05-01',
                'tanggal_selesai' => '2026-05-03',
                'status' => 'BERLANGSUNG',
            ]
        );

        $event2 = \App\Models\Event::updateOrCreate(
            ['nama_event' => 'Dies Natalis Untan'],
            [
                'tanggal_mulai' => '2026-04-10',
                'tanggal_selesai' => '2026-04-12',
                'status' => 'RIWAYAT',
            ]
        );

        $faker = \Faker\Factory::create('id_ID');
        $events = [$event1, $event2];

        foreach ($events as $index => $event) {
            // Kita buat 150 peserta untuk Kalbar Naker Fest, 50 untuk Dies Natalis
            $totalParticipants = $index === 0 ? 150 : 50; 

            for ($i = 0; $i < $totalParticipants; $i++) {
                $nama = $faker->name();
                $email = $faker->unique()->safeEmail();
                
                \App\Models\Participant::create([
                    'event_id' => $event->id,
                    'email_primary' => $email,
                    'nama_lengkap' => $nama,
                    'no_hp_normalized' => '628' . $faker->numerify('##########'),
                    'metode_kehadiran' => 'OFFLINE',
                    // 60% chance untuk sudah check-in dengan waktu random
                    'checked_in_at' => $faker->boolean(60) ? now()->subMinutes(rand(1, 1440)) : null,
                    'qr_token' => 'OFF-' . strtoupper(\Illuminate\Support\Str::random(12)),
                    'dedupe_key_hash' => hash('sha256', strtolower($nama) . '|' . $email . '|OFFLINE|' . $event->id),
                ]);
            }
        }
    }
}
