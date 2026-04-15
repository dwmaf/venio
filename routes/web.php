<?php

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Inertia\LoginController;
use App\Http\Controllers\Inertia\DasborController;
use App\Http\Controllers\Inertia\DatangController;
use App\Http\Controllers\Inertia\EksporController;
use App\Http\Controllers\Inertia\EventController;
use App\Http\Controllers\Inertia\ImporPesertaController;
use App\Http\Controllers\Inertia\KirimkePesertaController;
use App\Http\Controllers\CheckinController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ParticipantCommunicationController;
use App\Http\Controllers\ParticipantImportController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Auth::check() ? redirect()->route('inertia.dasbor') : redirect()->route('login'));

Route::middleware('guest')->group(function () {
	Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
	Route::post('/login', [LoginController::class, 'login'])->name('login');
});

Route::middleware('auth')->group(function () {
	Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

	Route::post('/participants/import', [ParticipantImportController::class, 'store'])->name('participants.import');
	Route::post('/participants/import-sheet', [ParticipantImportController::class, 'storeFromSheet'])->name('participants.import-sheet');
	Route::post('/participants/send-qr-bulk', [ParticipantCommunicationController::class, 'sendQrBulk'])->name('participants.send-qr-bulk');
	Route::post('/participants/send-zoom-bulk', [ParticipantCommunicationController::class, 'sendZoomBulk'])->name('participants.send-zoom-bulk');
	Route::post('/participants/{participant}/send-qr', [ParticipantCommunicationController::class, 'sendQr'])->name('participants.send-qr');
	Route::post('/participants/{participant}/send-zoom', [ParticipantCommunicationController::class, 'sendZoom'])->name('participants.send-zoom');

	Route::get('/checkin', [CheckinController::class, 'index'])->name('checkin.index');
	Route::post('/checkin/scan', [CheckinController::class, 'scan'])->name('checkin.scan');

	Route::get('/export/wa', [ExportController::class, 'download'])->name('export.wa');
	Route::get('/export/recap', [ExportController::class, 'downloadRecap'])->name('export.recap');
});

Route::prefix('inertia')->name('inertia.')->middleware('auth')->group(function () {
	Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
	Route::post('/account/password', [LoginController::class, 'updatePassword'])->name('account.password.update');

	Route::get('/events/{event}', [EventController::class, 'show'])->name('events.index');
	Route::post('/events', [EventController::class, 'store'])->name('events.store');
	Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');

	Route::get('/dasbor', [DasborController::class, 'index'])->name('dasbor');

	Route::post('/peserta/import', [ImporPesertaController::class, 'store'])->name('peserta.import');
	Route::post('/peserta/import-sheet', [ImporPesertaController::class, 'storeFromSheet'])->name('peserta.import-sheet');
	Route::post('/peserta/send-qr-bulk', [KirimkePesertaController::class, 'sendQrBulk'])->name('peserta.send-qr-bulk');
	Route::post('/peserta/send-zoom-bulk', [KirimkePesertaController::class, 'sendZoomBulk'])->name('peserta.send-zoom-bulk');
	Route::post('/peserta/{participant}/send-qr', [KirimkePesertaController::class, 'sendQr'])->name('peserta.send-qr');
	Route::post('/peserta/{participant}/send-zoom', [KirimkePesertaController::class, 'sendZoom'])->name('peserta.send-zoom');

	Route::get('/datang', [DatangController::class, 'index'])->name('datang.index');
	Route::post('/datang/scan', [DatangController::class, 'scan'])->name('datang.scan');

	Route::get('/ekspor/wa', [EksporController::class, 'download'])->name('ekspor.wa');
	Route::get('/ekspor/recap', [EksporController::class, 'downloadRecap'])->name('ekspor.recap');
});
