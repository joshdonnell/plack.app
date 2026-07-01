<?php

declare(strict_types=1);

use App\Models\User;

it('validates the password confirmation', function (): void {
    $page = visit('/register');

    $page->fill('name', 'Test User')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->fill('password_confirmation', 'different-password')
        ->press('Create account')
        ->assertPathIs('/register')
        ->assertSee('The password field confirmation does not match.');

    expect(User::query()->count())->toBe(0);
});

it('validates a unique email', function (): void {
    User::factory()->create(['email' => 'test@example.com']);

    $page = visit('/register');

    $page->fill('name', 'Test User')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->fill('password_confirmation', 'password')
        ->press('Create account')
        ->assertPathIs('/register')
        ->assertSee('The email has already been taken.');

    expect(User::query()->count())->toBe(1);
});

it('registers a new account', function (): void {
    $page = visit('/register');

    $page->fill('name', 'Test User')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->fill('password_confirmation', 'password')
        ->press('Create account')
        ->assertPathIs('/verify-email');

    expect(User::query()->where('email', 'test@example.com')->exists())->toBeTrue();
});
