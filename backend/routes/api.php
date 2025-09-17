<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController; // <-- import here

// --------------- Register and Login ----------------//
Route::post('register', [AuthenticationController::class, 'register'])->name('register');
Route::post('login', [AuthenticationController::class, 'login'])->name('login');




// ------------------ Get Data ----------------------//
Route::middleware('auth:sanctum')->group(function () {
    Route::get('get-user', [AuthenticationController::class, 'userInfo'])->name('get-user');
    Route::post('logout', [AuthenticationController::class, 'logOut'])->name('logout');
    Route::get('profile', [AuthenticationController::class, 'profile'])->name('profile');
    Route::post('change-password', [AuthenticationController::class, 'changePassword'])->name('changePassword');
    Route::post('update', [AuthenticationController::class, 'update'])->name('update');
    Route::post('update-profile', [AuthenticationController::class, 'updateProfile'])->name('update-profile');
    Route::post('delete', [AuthenticationController::class, 'destroy'])->name('destroy');
});
