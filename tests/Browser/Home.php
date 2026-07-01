<?php

declare(strict_types=1);

it('has the landing page', function (): void {
    $page = visit('/');

    $page->assertSee('Laravel');
});

it('shows a login action on the landing page', function (): void {
    $page = visit('/');

    $page->click('Log in')
        ->assertSee('Log in to your account');
});

it('shows a register action on the landing page', function (): void {
    $page = visit('/');

    $page->click('Register')
        ->assertSee('Create an account');
});
