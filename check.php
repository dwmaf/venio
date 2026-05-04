<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$participants = App\Models\Participant::where('event_id', 38)->get();
echo "Total in Event 38: " . $participants->count() . "\n";
foreach ($participants as $p) {
    echo "ID: {$p->id}, Name: {$p->nama_lengkap}, Email: {$p->email_primary}\n";
}
