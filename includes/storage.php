<?php

declare(strict_types=1);

function storage_file(string $collection): string
{
    return STORAGE_PATH . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '', $collection) . '.json';
}

function read_json(string $collection): array
{
    $file = storage_file($collection);
    if (!is_file($file)) {
        write_json($collection, []);
    }

    $json = file_get_contents($file);
    $data = json_decode($json ?: '[]', true);
    return is_array($data) ? $data : [];
}

function write_json(string $collection, array $data): void
{
    if (!is_dir(STORAGE_PATH)) {
        mkdir(STORAGE_PATH, 0775, true);
    }

    $file = storage_file($collection);
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        throw new RuntimeException('No se pudo abrir ' . $file);
    }

    try {
        flock($handle, LOCK_EX);
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode(array_values($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

function all_data(): array
{
    $collections = ['users', 'branches', 'plans', 'clients', 'trainers', 'employees', 'staffMetrics', 'evaluationSeasons', 'satisfactionSurveys', 'areas', 'machines', 'memberships', 'schedules', 'reservations', 'maintenance', 'payments', 'referrals', 'referralBenefits', 'purchaseOrders', 'products', 'partners', 'services', 'carts', 'dailyReports', 'audit'];
    $data = [];
    foreach ($collections as $collection) {
        $data[$collection] = read_json($collection);
    }
    return $data;
}

function find_by_id(string $collection, string $id): ?array
{
    foreach (read_json($collection) as $item) {
        if ((string) ($item['id'] ?? '') === $id) {
            return $item;
        }
    }
    return null;
}

function upsert_json(string $collection, array $record): array
{
    $items = read_json($collection);
    $record['id'] = $record['id'] ?? uid(substr($collection, 0, 3));
    $found = false;

    foreach ($items as $index => $item) {
        if (($item['id'] ?? null) === $record['id']) {
            $items[$index] = array_replace_recursive($item, $record);
            $found = true;
            break;
        }
    }

    if (!$found) {
        array_unshift($items, $record);
    }

    write_json($collection, $items);
    return $record;
}

function delete_json(string $collection, string $id): bool
{
    $items = read_json($collection);
    $next = array_values(array_filter($items, fn ($item) => (string) ($item['id'] ?? '') !== $id));
    write_json($collection, $next);
    return count($next) !== count($items);
}

function audit_log(string $module, string $action, string $detail): void
{
    $user = current_user();
    $items = read_json('audit');
    array_unshift($items, [
        'id' => uid('log'),
        'at' => now_stamp(),
        'user' => $user['name'] ?? 'Sistema',
        'module' => $module,
        'action' => $action,
        'detail' => $detail,
    ]);
    write_json('audit', $items);
}

