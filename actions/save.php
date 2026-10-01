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

if (!$module || empty($module['collection'])) {
    flash('error', 'Modulo invalido.');
    redirect('../index.php');
}

require_permission($module['permission']);

$collection = $module['collection'];
$fields = $module['fields'] ?? [];
$payload = sanitize_payload($fields, $_POST);
$payload['id'] = trim((string) ($_POST['id'] ?? '')) ?: uid(substr($collection, 0, 3));
$errors = validate_required($payload, array_slice($fields, 0, min(2, count($fields))));

if ($collection === 'machines') {
    $existing = find_by_id('machines', $payload['id']) ?? [];
    $certificate = $existing['certificate'] ?? ['history' => []];
    $certificate['number'] = trim((string) ($_POST['certificate_number'] ?? $certificate['number'] ?? ''));
    $certificate['issuer'] = trim((string) ($_POST['certificate_issuer'] ?? $certificate['issuer'] ?? ''));
    $certificate['expiresAt'] = trim((string) ($_POST['certificate_expiresAt'] ?? $certificate['expiresAt'] ?? ''));
    $certificate['status'] = trim((string) ($_POST['certificate_status'] ?? $certificate['status'] ?? 'Pendiente'));
    $certificate['reviewedAt'] = $certificate['status'] === 'Aprobado' ? date('Y-m-d') : ($certificate['reviewedAt'] ?? '');
    $certificate['reviewedBy'] = $certificate['status'] === 'Aprobado' ? (current_user()['name'] ?? '') : ($certificate['reviewedBy'] ?? '');

    if (!empty($_FILES['certificate_file']['name'])) {
        $file = $_FILES['certificate_file'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, ['pdf', 'jpg', 'jpeg', 'png'], true) || (int) $file['size'] > 4 * 1024 * 1024) {
            $errors[] = 'El certificado debe ser PDF, JPG o PNG y pesar maximo 4MB.';
        } elseif (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
            if (!is_dir(CERTIFICATE_UPLOAD_PATH)) {
                mkdir(CERTIFICATE_UPLOAD_PATH, 0775, true);
            }
            if (!empty($certificate['fileName'])) {
                $certificate['history'][] = ['fileName' => $certificate['fileName'], 'status' => $certificate['status'] ?? '', 'replacedAt' => now_stamp()];
            }
            $safeName = uid('cert') . '.' . $extension;
            move_uploaded_file($file['tmp_name'], CERTIFICATE_UPLOAD_PATH . '/' . $safeName);
            $certificate['fileName'] = $safeName;
            $certificate['fileType'] = strtoupper($extension);
        }
    }

    $payload['certificate'] = $certificate;
    if (($payload['status'] ?? '') === 'Operativo' && !certificate_is_approved($payload)) {
        $payload['status'] = 'Pendiente de documentacion';
        flash('error', 'El equipo no puede quedar Operativo sin certificado aprobado vigente.');
    }
}

if ($errors) {
    flash('error', implode(' ', $errors));
    redirect('../index.php?module=' . $moduleKey . ($payload['id'] ? '&edit=' . rawurlencode($payload['id']) : ''));
}

upsert_json($collection, $payload);
audit_log($module['label'], isset($_POST['id']) && $_POST['id'] !== '' ? 'Editar registro' : 'Crear registro', $payload['id']);
flash('success', 'Registro guardado correctamente.');
redirect('../index.php?module=' . $moduleKey);

