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

$modules = require BASE_PATH . '/config/modules.php';
$moduleKey = active_module();
$module = $modules[$moduleKey] ?? $modules['dashboard'];
require_permission($module['permission']);

require BASE_PATH . '/includes/header.php';
require BASE_PATH . '/includes/sidebar.php';

if ($moduleKey === 'dashboard') {
    require BASE_PATH . '/modules/dashboard.php';
} else {
    require BASE_PATH . '/modules/generic.php';
}

require BASE_PATH . '/includes/footer.php';

