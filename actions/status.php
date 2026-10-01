<?php

declare(strict_types=1);

require __DIR__ . '/../config/config.php';
require BASE_PATH . '/includes/functions.php';
require BASE_PATH . '/includes/flash.php';
require BASE_PATH . '/includes/auth.php';
require BASE_PATH . '/includes/storage.php';
require BASE_PATH . '/includes/validation.php';

start_app_session();
require_login();
require_post();
verify_csrf();

$modules = require BASE_PATH . '/config/modules.php';
$moduleKey = preg_replace('/[^a-z0-9\-]/', '', $_POST['module'] ?? '');
$module = $modules[$moduleKey] ?? null;
$collection = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST['collection'] ?? '');
$id = (string) ($_POST['id'] ?? '');

if (!$module || $collection === '' || $id === '') {
    flash('error', 'Solicitud invalida.');
    redirect('../index.php');
}

require_permission($module['permission']);

$items = read_json($collection);
$flows = [
    'reservations' => ['Pendiente' => 'Confirmada', 'Confirmada' => 'En curso', 'En curso' => 'Completada', 'Completada' => 'Cancelada', 'Cancelada' => 'Pendiente'],
    'machines' => ['Operativo' => 'En mantenimiento', 'En mantenimiento' => 'Operativo', 'Pendiente de documentacion' => 'Operativo', 'Fuera de servicio' => 'En mantenimiento'],
    'memberships' => ['Activa' => 'Suspendida', 'Suspendida' => 'Activa', 'Proxima a vencer' => 'Vencida', 'Vencida' => 'Activa'],
    'plans' => ['Activa' => 'Inactivo', 'Inactivo' => 'Activa'],
    'payments' => ['Pendiente' => 'Aprobado', 'Aprobado' => 'Reembolsado', 'Pagado' => 'Reembolsado', 'Rechazado' => 'Pendiente'],
];

foreach ($items as &$item) {
    if ((string) ($item['id'] ?? '') !== $id) {
        continue;
    }

    $current = (string) ($item['status'] ?? 'Activo');
    $next = $flows[$collection][$current] ?? ($current === 'Activo' || $current === 'Activa' ? 'Inactivo' : 'Activo');
    $item['status'] = $next;

    if ($collection === 'machines' && $next === 'Operativo' && !certificate_is_approved($item)) {
        $item['status'] = 'Pendiente de documentacion';
        flash('error', 'No se activo el equipo porque el certificado no esta aprobado vigente.');
    } else {
        flash('success', 'Estado actualizado.');
    }

    audit_log($module['label'], 'Cambiar estado', $id . ': ' . $current . ' -> ' . $item['status']);
    break;
}
unset($item);

write_json($collection, $items);
redirect('../index.php?module=' . $moduleKey);

