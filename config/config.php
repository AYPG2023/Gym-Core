<?php

declare(strict_types=1);

const APP_NAME = 'Renovatio Gym';
const APP_PASSWORD = 'Gym2026!';
const BASE_PATH = __DIR__ . '/..';
const STORAGE_PATH = BASE_PATH . '/storage';
const DEMO_STORAGE_PATH = STORAGE_PATH . '/demo';
const UPLOAD_PATH = BASE_PATH . '/uploads';
const CERTIFICATE_UPLOAD_PATH = UPLOAD_PATH . '/certificates';

date_default_timezone_set('America/Guatemala');

if (!is_dir(STORAGE_PATH . '/sessions')) {
    mkdir(STORAGE_PATH . '/sessions', 0775, true);
}

ini_set('session.save_path', STORAGE_PATH . '/sessions');
