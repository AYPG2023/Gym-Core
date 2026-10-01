<?php

declare(strict_types=1);

function start_app_session(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function roles(): array
{
    return [
        'admin' => ['label' => 'Administrador', 'permissions' => ['all']],
        'general_manager' => ['label' => 'Gerente general', 'permissions' => ['dashboard', 'branches', 'clients', 'employees', 'memberships', 'purchaseOrders', 'payments', 'reports', 'settings']],
        'supervisor' => ['label' => 'Supervisor', 'permissions' => ['dashboard', 'clients', 'employees', 'schedules', 'reservations', 'inventory', 'maintenance', 'reports']],
        'reception' => ['label' => 'Recepcionista', 'permissions' => ['dashboard', 'clients', 'memberships', 'schedules', 'reservations', 'payments', 'store', 'surveys']],
        'trainer' => ['label' => 'Coach', 'permissions' => ['dashboard', 'schedules', 'reservations', 'staffMetrics', 'surveys']],
        'client' => ['label' => 'Cliente', 'permissions' => ['dashboard', 'memberships', 'referrals', 'schedules', 'reservations', 'store', 'payments', 'surveys']],
        'purchases' => ['label' => 'Compras', 'permissions' => ['dashboard', 'purchaseOrders', 'inventory', 'maintenance', 'reports']],
        'inventory' => ['label' => 'Inventario', 'permissions' => ['dashboard', 'inventory', 'maintenance', 'purchaseOrders', 'reports']],
        'cafeteria' => ['label' => 'Cafeteria', 'permissions' => ['dashboard', 'store', 'payments', 'reports']],
        'partner' => ['label' => 'Partner', 'permissions' => ['dashboard', 'store', 'surveys']],
    ];
}

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function role_key(?array $user = null): string
{
    $user ??= current_user();
    return (string) ($user['role'] ?? 'client');
}

function role_config(?string $role = null): array
{
    $availableRoles = roles();
    $role ??= role_key();
    return $availableRoles[$role] ?? $availableRoles['client'];
}

function role_label(?string $role = null): string
{
    return (string) (role_config($role)['label'] ?? 'Cliente');
}

function require_login(): void
{
    if (!current_user()) {
        redirect('login.php');
    }
}

function has_permission(string $permission): bool
{
    $user = current_user();
    if (!$user) {
        return false;
    }

    $permissions = $user['permissions'] ?? role_config(role_key($user))['permissions'] ?? [];
    return in_array('all', $permissions, true) || in_array($permission, $permissions, true);
}

function require_permission(string $permission): void
{
    if (!has_permission($permission)) {
        http_response_code(403);
        require BASE_PATH . '/modules/403.php';
        exit;
    }
}

function csrf_token(): string
{
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function verify_csrf(): void
{
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
        flash('error', 'La sesion del formulario expiro. Intenta de nuevo.');
        redirect($_SERVER['HTTP_REFERER'] ?? 'index.php');
    }
}

function visible_modules(array $modules): array
{
    return array_filter($modules, fn ($module) => has_permission($module['permission']));
}
