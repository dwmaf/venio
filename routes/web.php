<?php

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CheckinController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantImportController;
use App\Http\Controllers\SendEmailController;
use App\Http\Controllers\PartnerController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Auth::check() ? redirect()->route('dashboard') : redirect()->route('login'));

Route::middleware('guest')->group(function () {
	Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
	Route::post('/login', [AuthController::class, 'login'])->name('login');
});

Route::middleware('auth')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
	Route::post('/account/password', [AuthController::class, 'updatePassword'])->name('account.password.update');

	Route::get('/all-events', [EventController::class, 'allEvents'])->name('all.events');
	Route::get('/events/{event}', [EventController::class, 'detailEvent'])->name('events.index');
	Route::get('/upcoming-events', [EventController::class, 'upcomingEvents'])->name('upcoming.events');
	Route::get('/ongoing-events', [EventController::class, 'ongoingEvents'])->name('ongoing.events');
	Route::get('/past-events', [EventController::class, 'pastEvents'])->name('past.events');
	Route::get('/create-events', [EventController::class, 'create'])->name('create.events');
	Route::get('/api/partners/search', [PartnerController::class, 'search'])->name('partners.search');
	Route::get('/edit-events', [EventController::class, 'edit'])->name('edit.events');
	Route::post('/events', [EventController::class, 'store'])->name('events.store');
	Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');

	Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

	Route::post('/peserta/import', [ParticipantImportController::class, 'store'])->name('peserta.import');
	Route::post('/peserta/import-sheet', [ParticipantImportController::class, 'storeFromSheet'])->name('peserta.import-sheet');
	Route::post('/peserta/send-qr-bulk', [SendEmailController::class, 'sendQrBulk'])->name('peserta.send-qr-bulk');
	Route::post('/peserta/{participant}/send-qr', [SendEmailController::class, 'sendQr'])->name('peserta.send-qr');

	Route::get('/datang/{event}', [CheckinController::class, 'index'])->name('datang.index');
	Route::post('/datang/{event}/scan', [CheckinController::class, 'scan'])->name('datang.scan');

	Route::get('/ekspor/wa', [ExportController::class, 'download'])->name('ekspor.wa');
	Route::get('/ekspor/recap', [ExportController::class, 'downloadRecap'])->name('ekspor.recap');
});
