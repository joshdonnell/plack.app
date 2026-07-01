<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Workspace;

it('can create a workspace', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user);

    $page = visit('/workspaces');

    $page->assertSee('No workspaces yet.')
        ->press('New workspace')
        ->fill('name', 'Acme')
        ->press('Create')
        ->assertSee('Acme');

    expect($user->workspaces()->where('name', 'Acme')->exists())->toBeTrue();
});

it('validates the workspace name when creating', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user);

    $page = visit('/workspaces');

    $page->press('New workspace')
        ->fill('name', 'ab')
        ->press('Create')
        ->assertSee('The name field must be at least 3 characters.');

    expect($user->workspaces()->count())->toBe(0);
});

it('can update a workspace', function (): void {
    $user = User::factory()->create();
    $workspace = Workspace::factory()->for($user, 'owner')->create(['name' => 'Acme']);

    $this->actingAs($user);

    $page = visit('/workspaces');

    $page->assertSee('Acme')
        ->click('[aria-label="Edit workspace"]')
        ->fill('name', 'Globex')
        ->press('Save')
        ->assertSee('Globex');

    expect($workspace->refresh()->name)->toBe('Globex');
});
