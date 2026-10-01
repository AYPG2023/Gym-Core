<?php

declare(strict_types=1);

$modules = require BASE_PATH . '/config/modules.php';
$current = active_module();
$user = current_user();
$userName = $user['name'] ?? 'Usuario';
$userRoleLabel = role_label(role_key($user));
?>
<header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur lg:hidden">
  <div class="flex items-center justify-between px-4 py-3">
    <button id="mobileMenuButton" class="icon-btn" type="button" aria-label="Abrir menu"><i data-lucide="menu" class="h-5 w-5"></i></button>
    <strong class="text-ink">Renovatio Gym</strong>
    <a class="icon-btn" href="logout.php" aria-label="Cerrar sesion"><i data-lucide="log-out" class="h-5 w-5"></i></a>
  </div>
  <nav id="mobileNav" class="hidden border-t border-line p-3">
    <?php foreach (visible_modules($modules) as $key => $module): ?>
      <a class="btn-sidebar <?= $current === $key ? 'active' : '' ?>" href="index.php?module=<?= e($key) ?>"><i data-lucide="<?= e($module['icon']) ?>" class="h-5 w-5"></i><span><?= e($module['label']) ?></span></a>
    <?php endforeach; ?>
  </nav>
</header>

<div class="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
  <aside class="hidden border-r border-white/10 bg-ink text-white lg:block">
    <div class="sticky top-0 flex h-screen flex-col p-4">
      <div class="mb-5 flex items-center gap-3 px-1">
        <div class="grid h-11 w-11 place-items-center rounded-lg bg-limefit text-ink"><i data-lucide="activity" class="h-6 w-6"></i></div>
        <div>
          <p class="font-black leading-tight">Renovatio Gym</p>
          <p class="text-xs text-white/65"><?= e($userName) ?> / <?= e($userRoleLabel) ?></p>
        </div>
      </div>
      <nav class="space-y-1 overflow-y-auto pr-1">
        <?php foreach (visible_modules($modules) as $key => $module): ?>
          <a class="btn-sidebar <?= $current === $key ? 'active' : '' ?>" href="index.php?module=<?= e($key) ?>"><i data-lucide="<?= e($module['icon']) ?>" class="h-5 w-5"></i><span><?= e($module['label']) ?></span></a>
        <?php endforeach; ?>
      </nav>
      <?php if (has_permission('settings')): ?>
        <form action="reset-demo.php" method="post" class="mt-auto" data-confirm="Restaurar datos demo originales?">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <button type="submit" class="btn-sidebar"><i data-lucide="refresh-cw" class="h-5 w-5"></i><span>Restaurar demo</span></button>
        </form>
      <?php endif; ?>
      <a class="btn-sidebar" href="logout.php"><i data-lucide="log-out" class="h-5 w-5"></i><span>Cerrar sesion</span></a>
    </div>
  </aside>
  <section class="min-w-0">
    <header class="hidden border-b border-line bg-white px-6 py-4 lg:block">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase text-aqua">PHP puro / JSON / Sesiones</p>
          <h2 class="text-lg font-black text-ink"><?= e($modules[$current]['label'] ?? 'Dashboard') ?></h2>
        </div>
        <div class="flex items-center gap-2 text-sm font-black text-slate-600">
          <i data-lucide="shield-check" class="h-5 w-5 text-aqua"></i><?= e($userRoleLabel) ?>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
