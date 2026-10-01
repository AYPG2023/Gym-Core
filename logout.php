<?php

declare(strict_types=1);

require __DIR__ . '/config/config.php';
require BASE_PATH . '/includes/functions.php';
require BASE_PATH . '/includes/auth.php';

start_app_session();
$_SESSION = [];
session_destroy();
redirect('login.php');

