<?php

declare(strict_types=1);

function flash(string $type, string $message): void
{
    $_SESSION['flash'][] = ['type' => $type, 'message' => $message];
}

function render_flash(): void
{
    $messages = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);

    if (!$messages) {
        return;
    }

    echo '<div id="toastStack" class="fixed right-4 top-4 z-[90] grid gap-2">';
    foreach ($messages as $item) {
        $type = $item['type'] === 'error' ? 'error' : 'success';
        echo '<div class="toast ' . e($type) . '"><i data-lucide="' . ($type === 'error' ? 'circle-alert' : 'check-circle-2') . '" class="h-4 w-4"></i><span>' . e($item['message']) . '</span></div>';
    }
    echo '</div>';
}

