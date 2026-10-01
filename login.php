<?php

declare(strict_types=1);

require __DIR__ . '/config/config.php';
require BASE_PATH . '/includes/functions.php';
require BASE_PATH . '/includes/flash.php';
require BASE_PATH . '/includes/auth.php';
require BASE_PATH . '/includes/storage.php';

start_app_session();

if (current_user()) {
    redirect('index.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
        flash('error', 'Formulario invalido.');
        redirect('login.php');
    }

    $userId = (string) ($_POST['user_id'] ?? '');
    $password = (string) ($_POST['password'] ?? '');
    $user = find_by_id('users', $userId);

    if (!$user || $password !== APP_PASSWORD || ($user['status'] ?? '') !== 'Activo') {
        flash('error', 'Credenciales invalidas.');
        redirect('login.php');
    }

    $role = $user['role'] ?? 'client';
    $_SESSION['user'] = [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'] ?? '',
        'role' => $role,
        'branchId' => $user['branchId'] ?? '',
        'permissions' => roles()[$role]['permissions'] ?? ['dashboard'],
        'employeeId' => $user['employeeId'] ?? '',
        'clientId' => $user['clientId'] ?? '',
    ];

    audit_log('Auth', 'Inicio de sesion', $user['email'] ?? $user['id']);
    flash('success', 'Sesion iniciada como ' . (roles()[$role]['label'] ?? $role) . '.');
    redirect('index.php');
}

$users = read_json('users');
require BASE_PATH . '/includes/header.php';
?>
<main class="min-h-screen">
  <section class="grid min-h-screen lg:grid-cols-[1fr_500px]">
    <div class="hero-login relative flex min-h-[44vh] items-end overflow-hidden bg-ink p-6 text-white sm:p-10 lg:min-h-screen">
      <img src="assets/login.jpg" alt="Gimnasio moderno" class="absolute inset-0 h-full w-full object-cover opacity-35">
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/84 to-ink/30"></div>
      <div class="relative max-w-3xl pb-5">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-bold backdrop-blur">
          <i data-lucide="dumbbell" class="h-4 w-4"></i>Administracion academica funcional
        </span>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Renovatio Gym</h1>
        <p class="mt-4 max-w-2xl text-lg leading-8 text-white/82">Gestion PHP pura con sesiones, permisos, JSON, auditoria, reservas, membresias, ventas y reportes.</p>
        <div class="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          <div class="glass-tile"><b>PHP 8.1+</b><small>Operaciones principales del lado servidor.</small></div>
          <div class="glass-tile"><b>JSON seguro</b><small>Persistencia separada por modulo con bloqueo.</small></div>
          <div class="glass-tile"><b>Roles</b><small>Menu y URLs protegidas por permisos.</small></div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center p-5">
      <form method="post" class="panel w-full max-w-md p-6 sm:p-8" novalidate>
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <p class="eyebrow">Acceso simulado</p>
        <h2 class="mt-2 text-2xl font-black text-ink">Iniciar sesion</h2>
        <p class="mt-2 text-sm text-slate-600">Selecciona una cuenta de demostracion.</p>
        <label class="form-field mt-5">
          <span>Usuario</span>
          <select name="user_id" class="form-control" required>
            <?php foreach ($users as $user): ?>
              <option value="<?= e($user['id']) ?>"><?= e($user['name']) ?> / <?= e(roles()[$user['role']]['label'] ?? $user['role']) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <label class="form-field mt-4">
          <span>Contrasena</span>
          <input name="password" class="form-control" type="password" value="<?= e(APP_PASSWORD) ?>" required>
        </label>
        <button class="btn btn-primary mt-5 w-full" type="submit"><i data-lucide="log-in" class="h-5 w-5"></i>Entrar al sistema</button>
      </form>
    </div>
  </section>
</main>
<script src="https://unpkg.com/lucide@latest"></script><script>lucide.createIcons();</script>
</body></html>

