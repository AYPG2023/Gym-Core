<?php

declare(strict_types=1);

function require_post(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        exit('Metodo no permitido');
    }
}

function sanitize_payload(array $fields, array $source): array
{
    $payload = [];
    foreach ($fields as $field) {
        $value = trim((string) ($source[$field] ?? ''));
        $payload[$field] = $value;
    }
    return $payload;
}

function validate_required(array $payload, array $required): array
{
    $errors = [];
    foreach ($required as $field) {
        if (($payload[$field] ?? '') === '') {
            $errors[] = label_for($field) . ' es obligatorio.';
        }
    }
    return $errors;
}

function certificate_is_approved(array $machine): bool
{
    $certificate = $machine['certificate'] ?? [];
    if (($certificate['status'] ?? '') !== 'Aprobado') {
        return false;
    }

    $expires = $certificate['expiresAt'] ?? '';
    return $expires === '' || $expires >= date('Y-m-d');
}

