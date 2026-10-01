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

if ($collection === 'plans') {
    $hasClients = array_filter(read_json('memberships'), fn ($item) => ($item['planId'] ?? '') === $id);
    if ($hasClients) {
        $plan = find_by_id('plans', $id) ?? [];
        $plan['status'] = 'Inactivo';
        upsert_json('plans', $plan);
        audit_log($module['label'], 'Desactivar plan relacionado', $id);
        flash('success', 'El plan tiene clientes relacionados; se desactivo en lugar de eliminarse.');
        redirect('../index.php?module=' . $moduleKey);
    }
}

delete_json($collection, $id);
audit_log($module['label'], 'Eliminar registro', $id);
flash('success', 'Registro eliminado.');
redirect('../index.php?module=' . $moduleKey);

