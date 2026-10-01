<?php

declare(strict_types=1);

require __DIR__ . '/config/config.php';
require BASE_PATH . '/includes/functions.php';
require BASE_PATH . '/includes/flash.php';
require BASE_PATH . '/includes/auth.php';
require BASE_PATH . '/includes/storage.php';
require BASE_PATH . '/includes/validation.php';

start_app_session();
require_login();
require_permission('settings');
require_post();
verify_csrf();

foreach (glob(DEMO_STORAGE_PATH . '/*.json') ?: [] as $demoFile) {
    copy($demoFile, STORAGE_PATH . '/' . basename($demoFile));
}

audit_log('Sistema', 'Restaurar demo', 'Datos restaurados desde storage/demo');
flash('success', 'Datos demo restaurados.');
redirect('index.php');

