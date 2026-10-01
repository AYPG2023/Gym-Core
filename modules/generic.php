<?php

declare(strict_types=1);

$collection = $module['collection'];
$fields = $module['fields'] ?? [];
$items = $collection ? read_json($collection) : [];
$editing = null;
if (isset($_GET['edit']) && $collection) {
    $editing = find_by_id($collection, (string) $_GET['edit']);
}

function display_value(string $field, mixed $value): string
{
    $lookups = [
        'branchId' => 'branches',
        'membershipId' => 'memberships',
        'areaId' => 'areas',
        'trainerId' => 'trainers',
        'clientId' => 'clients',
        'employeeId' => 'employees',
        'machineId' => 'machines',
    ];

    if (isset($lookups[$field]) && $value !== '') {
        $item = find_by_id($lookups[$field], (string) $value);
        return $item['name'] ?? $item['code'] ?? (string) $value;
    }

    if (is_array($value)) {
        return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    return (string) $value;
}

function field_input(string $field, ?array $editing = null): string
{
    $value = $editing[$field] ?? '';
    $selects = [
        'branchId' => ['branches', 'name'],
        'membershipId' => ['memberships', 'id'],
        'areaId' => ['areas', 'name'],
        'trainerId' => ['trainers', 'name'],
        'clientId' => ['clients', 'name'],
        'employeeId' => ['employees', 'name'],
        'machineId' => ['machines', 'name'],
    ];
    $statusOptions = ['Activo', 'Activa', 'Disponible', 'Pendiente', 'Confirmada', 'Completada', 'Cancelada', 'Operativo', 'Pendiente de documentacion', 'En mantenimiento', 'Pagado', 'Aprobado', 'Rechazado', 'En revision'];

    ob_start();
    echo '<label class="form-field"><span>' . e(label_for($field)) . '</span>';
    if (isset($selects[$field])) {
        [$collection, $labelField] = $selects[$field];
        echo '<select class="form-control" name="' . e($field) . '"><option value="">Seleccionar</option>';
        foreach (read_json($collection) as $item) {
            $label = $item[$labelField] ?? $item['name'] ?? $item['code'] ?? $item['id'];
            echo '<option value="' . e($item['id']) . '" ' . ((string) $value === (string) $item['id'] ? 'selected' : '') . '>' . e($label) . '</option>';
        }
        echo '</select>';
    } elseif ($field === 'status') {
        echo '<select class="form-control" name="status">';
        foreach ($statusOptions as $status) {
            echo '<option value="' . e($status) . '" ' . ((string) $value === $status ? 'selected' : '') . '>' . e($status) . '</option>';
        }
        echo '</select>';
    } elseif (str_contains(strtolower($field), 'date') || $field === 'date') {
        echo '<input class="form-control" type="date" name="' . e($field) . '" value="' . e($value) . '">';
    } elseif (in_array($field, ['price', 'amount', 'stock', 'capacity', 'baseSalary', 'cost', 'rating', 'durationDays', 'reservationLimit', 'simultaneousCapacity', 'clientsServed', 'absences', 'attendedUsers', 'membershipsSold', 'productsSold', 'totalIncome'], true)) {
        echo '<input class="form-control" type="number" step="0.01" name="' . e($field) . '" value="' . e($value) . '">';
    } elseif (in_array($field, ['start', 'end'], true)) {
        echo '<input class="form-control" type="time" name="' . e($field) . '" value="' . e($value) . '">';
    } else {
        echo '<input class="form-control" name="' . e($field) . '" value="' . e($value) . '">';
    }
    echo '</label>';
    return ob_get_clean();
}
?>
<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
  <div>
    <p class="eyebrow">Renovatio Gym / <?= e(roles()[current_user()['role']]['label'] ?? '') ?></p>
    <h1 class="page-title"><?= e($module['label']) ?></h1>
    <p class="page-subtitle">Modulo protegido por permisos, persistido en <code><?= e($collection) ?>.json</code> y operado con POST/Redirect/GET.</p>
  </div>
  <button class="btn btn-primary" type="button" data-open-form><i data-lucide="plus" class="h-5 w-5"></i>Nuevo registro</button>
</div>

<section class="panel mb-6 p-5 <?= $editing ? '' : 'hidden' ?>" id="recordForm">
  <div class="section-head mb-4">
    <div><h2><?= $editing ? 'Editar registro' : 'Nuevo registro' ?></h2><p>Los campos criticos se validan nuevamente en PHP.</p></div>
  </div>
  <form action="actions/save.php" method="post" enctype="multipart/form-data" class="grid gap-4 md:grid-cols-2">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <input type="hidden" name="module" value="<?= e($moduleKey) ?>">
    <input type="hidden" name="collection" value="<?= e($collection) ?>">
    <?php if ($editing): ?><input type="hidden" name="id" value="<?= e($editing['id']) ?>"><?php endif; ?>
    <?php foreach ($fields as $field): ?>
      <?= field_input($field, $editing) ?>
    <?php endforeach; ?>
    <?php if ($moduleKey === 'areas-equipment'): ?>
      <fieldset class="form-section md:col-span-2">
        <legend>Certificado</legend>
        <div class="grid gap-4 md:grid-cols-3">
          <label class="form-field"><span>Numero</span><input class="form-control" name="certificate_number" value="<?= e($editing['certificate']['number'] ?? '') ?>"></label>
          <label class="form-field"><span>Entidad emisora</span><input class="form-control" name="certificate_issuer" value="<?= e($editing['certificate']['issuer'] ?? '') ?>"></label>
          <label class="form-field"><span>Vencimiento</span><input class="form-control" type="date" name="certificate_expiresAt" value="<?= e($editing['certificate']['expiresAt'] ?? '') ?>"></label>
          <label class="form-field"><span>Estado</span><select class="form-control" name="certificate_status"><option>Pendiente</option><option>Cargado</option><option>En revision</option><option>Aprobado</option><option>Rechazado</option><option>Vencido</option></select></label>
          <label class="form-field md:col-span-2"><span>Archivo PDF/JPG/PNG</span><input class="form-control" type="file" name="certificate_file" accept=".pdf,.jpg,.jpeg,.png"></label>
        </div>
      </fieldset>
    <?php endif; ?>
    <div class="md:col-span-2 flex flex-wrap gap-2">
      <button class="btn btn-primary" type="submit"><i data-lucide="save" class="h-5 w-5"></i>Guardar</button>
      <a class="btn btn-ghost" href="index.php?module=<?= e($moduleKey) ?>">Cancelar</a>
    </div>
  </form>
</section>

<section class="panel p-5">
  <div class="section-head">
    <div><h2>Registros</h2><p><?= e(count($items)) ?> elementos almacenados.</p></div>
    <input class="form-control max-w-xs" data-table-filter placeholder="Filtrar al instante">
  </div>
  <div class="table-wrap mt-4">
    <table>
      <thead>
        <tr>
          <?php foreach ($fields as $field): ?><th><?= e(label_for($field)) ?></th><?php endforeach; ?>
          <?php if ($moduleKey === 'areas-equipment'): ?><th>Certificado</th><?php endif; ?>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $item): ?>
          <tr>
            <?php foreach ($fields as $field): ?>
              <td><?= $field === 'status' ? badge((string) ($item[$field] ?? '')) : e(display_value($field, $item[$field] ?? '')) ?></td>
            <?php endforeach; ?>
            <?php if ($moduleKey === 'areas-equipment'): ?>
              <td class="doc-cell"><?= badge($item['certificate']['status'] ?? 'Pendiente') ?><small><?= e($item['certificate']['fileName'] ?? 'Sin archivo') ?></small></td>
            <?php endif; ?>
            <td>
              <div class="row-actions">
                <a class="btn btn-ghost btn-icon-only" title="Editar" href="index.php?module=<?= e($moduleKey) ?>&edit=<?= e($item['id'] ?? '') ?>"><i data-lucide="pencil" class="h-4 w-4"></i></a>
                <form action="actions/status.php" method="post">
                  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
                  <input type="hidden" name="module" value="<?= e($moduleKey) ?>">
                  <input type="hidden" name="collection" value="<?= e($collection) ?>">
                  <input type="hidden" name="id" value="<?= e($item['id'] ?? '') ?>">
                  <button class="btn btn-warning btn-icon-only" title="Cambiar estado" type="submit"><i data-lucide="refresh-cw" class="h-4 w-4"></i></button>
                </form>
                <form action="actions/delete.php" method="post" data-confirm="Eliminar este registro?">
                  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
                  <input type="hidden" name="module" value="<?= e($moduleKey) ?>">
                  <input type="hidden" name="collection" value="<?= e($collection) ?>">
                  <input type="hidden" name="id" value="<?= e($item['id'] ?? '') ?>">
                  <button class="btn btn-danger btn-icon-only" title="Eliminar" type="submit"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$items): ?><tr><td class="empty" colspan="<?= e(count($fields) + 2) ?>">Sin registros.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</section>
