<?php

declare(strict_types=1);

$data = all_data();
$activeClients = count(array_filter($data['clients'], fn ($item) => ($item['status'] ?? '') === 'Activo'));
$income = array_reduce(array_filter($data['payments'], fn ($item) => in_array($item['status'] ?? '', ['Pagado', 'Aprobado'], true)), fn ($sum, $item) => $sum + (float) ($item['amount'] ?? 0), 0);
$activeReservations = count(array_filter($data['reservations'], fn ($item) => in_array($item['status'] ?? '', ['Pendiente', 'Confirmada', 'En curso'], true)));
$operativeMachines = count(array_filter($data['machines'], fn ($item) => ($item['status'] ?? '') === 'Operativo'));
$maintenance = count(array_filter($data['maintenance'], fn ($item) => ($item['status'] ?? '') !== 'Finalizado'));
$classes = count($data['schedules']);
$surveys = array_filter($data['satisfactionSurveys'], fn ($item) => ($item['status'] ?? '') === 'Respondida');
$avgSurvey = $surveys ? round(array_sum(array_map(fn ($item) => (float) ($item['rating'] ?? 0), $surveys)) / count($surveys), 1) : 0;
$branches = $data['branches'];
?>
<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
  <div>
    <p class="eyebrow">Renovatio Gym / <?= e(roles()[current_user()['role']]['label'] ?? '') ?></p>
    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle">Indicadores calculados leyendo archivos JSON, sin base de datos ni LocalStorage.</p>
  </div>
  <form class="flex gap-2" method="get">
    <input type="hidden" name="module" value="dashboard">
    <select class="form-control w-56" name="branch">
      <option value="">Todas las sucursales</option>
      <?php foreach ($branches as $branch): ?>
        <option value="<?= e($branch['id']) ?>"><?= e($branch['name']) ?></option>
      <?php endforeach; ?>
    </select>
  </form>
</div>

<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <article class="panel metric"><div class="metric-icon green"><i data-lucide="users-round"></i></div><div><p>Clientes activos</p><strong><?= e($activeClients) ?></strong><small>Membresias vigentes y clientes habilitados</small></div></article>
  <article class="panel metric"><div class="metric-icon blue"><i data-lucide="banknote"></i></div><div><p>Ingresos</p><strong><?= e(money($income)) ?></strong><small>Pagos aprobados en JSON</small></div></article>
  <article class="panel metric"><div class="metric-icon yellow"><i data-lucide="calendar-check"></i></div><div><p>Reservas activas</p><strong><?= e($activeReservations) ?></strong><small>Pendientes, confirmadas o en curso</small></div></article>
  <article class="panel metric"><div class="metric-icon orange"><i data-lucide="dumbbell"></i></div><div><p>Equipos operativos</p><strong><?= e($operativeMachines) ?></strong><small><?= e($maintenance) ?> mantenimientos abiertos</small></div></article>
</section>

<section class="mt-6 grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
  <article class="panel p-5">
    <div class="section-head"><div><h2>Resumen operativo</h2><p>Clases, ventas y ocupacion por sucursal.</p></div></div>
    <div class="chart-box"><canvas id="dashboardChart" data-clients="<?= e($activeClients) ?>" data-reservations="<?= e($activeReservations) ?>" data-classes="<?= e($classes) ?>" data-machines="<?= e($operativeMachines) ?>"></canvas></div>
  </article>
  <article class="panel p-5">
    <div class="section-head"><div><h2>Calidad</h2><p>Encuestas respondidas por clientes.</p></div><?= badge($avgSurvey >= 4 ? 'Aprobado' : 'Pendiente') ?></div>
    <div class="mt-6 grid gap-3">
      <div class="info-box"><b>Promedio de satisfaccion</b><span class="text-3xl font-black"><?= e($avgSurvey) ?>/5</span></div>
      <div class="info-box"><b>Clases programadas</b><span><?= e($classes) ?> horarios disponibles</span></div>
      <div class="info-box"><b>Compras</b><span><?= e(count($data['purchaseOrders'])) ?> ordenes registradas</span></div>
    </div>
  </article>
</section>

<section class="panel mt-6 p-5">
  <div class="section-head"><div><h2>Auditoria reciente</h2><p>Ultimas operaciones persistidas por PHP.</p></div></div>
  <div class="table-wrap mt-4">
    <table>
      <thead><tr><th>Fecha</th><th>Usuario</th><th>Modulo</th><th>Accion</th><th>Detalle</th></tr></thead>
      <tbody>
        <?php foreach (array_slice($data['audit'], 0, 8) as $log): ?>
          <tr><td><?= e($log['at'] ?? '') ?></td><td><?= e($log['user'] ?? '') ?></td><td><?= e($log['module'] ?? '') ?></td><td><?= e($log['action'] ?? '') ?></td><td><?= e($log['detail'] ?? '') ?></td></tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</section>

