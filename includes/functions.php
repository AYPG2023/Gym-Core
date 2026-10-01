<?php

declare(strict_types=1);

function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): never
{
    header('Location: ' . $path);
    exit;
}

function money(mixed $value): string
{
    return 'Q' . number_format((float) $value, 2);
}

function now_stamp(): string
{
    return date('Y-m-d H:i');
}

function uid(string $prefix): string
{
    return $prefix . '-' . bin2hex(random_bytes(5));
}

function active_module(): string
{
    return preg_replace('/[^a-z0-9\-]/', '', $_GET['module'] ?? 'dashboard') ?: 'dashboard';
}

function badge(string $value): string
{
    $key = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT', $value) ?: $value);
    $key = preg_replace('/[^a-z0-9]+/', '', $key);
    return '<span class="badge badge-' . e($key) . '">' . e($value) . '</span>';
}

function label_for(string $field): string
{
    $labels = [
        'branchId' => 'Sucursal',
        'membershipId' => 'Membresia',
        'areaId' => 'Area',
        'trainerId' => 'Coach',
        'clientId' => 'Cliente',
        'employeeId' => 'Empleado',
        'machineId' => 'Equipo',
        'startDate' => 'Inicio',
        'estimatedEnd' => 'Fin estimado',
        'durationDays' => 'Duracion dias',
        'reservationLimit' => 'Limite reservas',
        'baseSalary' => 'Sueldo base',
        'simultaneousCapacity' => 'Capacidad',
        'itemType' => 'Tipo',
    ];

    return $labels[$field] ?? ucfirst(trim(preg_replace('/(?<!^)[A-Z]/', ' $0', $field)));
}

