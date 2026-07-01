<?php

declare(strict_types=1);

use App\Models\User;

it('fails with invalid credentials', function (): void {
    User::factory()->withoutTwoFactor()->create([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $page = visit('/login');

    $page->fill('email', 'test@example.com')
        ->fill('password', 'wrong-password')
        ->press('Log in')
        ->assertPathIs('/login')
        ->assertSee('These credentials do not match our records.');

    expect(auth()->check())->toBeFalse();
});

it('logs in with valid credentials', function (): void {
    User::factory()->withoutTwoFactor()->create([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $page = visit('/login');

    $page->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->press('Log in')
        ->assertPathIs('/workspaces')
        ->assertSee('Workspaces');
});
