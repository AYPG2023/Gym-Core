<?php

declare(strict_types=1);

return [
    'dashboard' => ['label' => 'Dashboard', 'icon' => 'layout-dashboard', 'permission' => 'dashboard', 'collection' => null],
    'branches' => ['label' => 'Sucursales', 'icon' => 'building-2', 'permission' => 'branches', 'collection' => 'branches', 'fields' => ['code', 'name', 'address', 'phone', 'email', 'manager', 'status']],
    'clients' => ['label' => 'Clientes', 'icon' => 'users-round', 'permission' => 'clients', 'collection' => 'clients', 'fields' => ['code', 'name', 'email', 'phone', 'branchId', 'membershipId', 'status']],
    'employees' => ['label' => 'Empleados', 'icon' => 'id-card', 'permission' => 'employees', 'collection' => 'employees', 'fields' => ['code', 'name', 'position', 'branchId', 'phone', 'email', 'baseSalary', 'status']],
    'memberships' => ['label' => 'Membresias', 'icon' => 'badge-dollar-sign', 'permission' => 'memberships', 'collection' => 'plans', 'fields' => ['name', 'price', 'durationDays', 'reservationLimit', 'status']],
    'referrals' => ['label' => 'Referidos', 'icon' => 'share-2', 'permission' => 'referrals', 'collection' => 'referrals', 'fields' => ['referralCode', 'referredName', 'referredPhone', 'referredEmail', 'branchId', 'status']],
    'access' => ['label' => 'Accesos', 'icon' => 'scan-line', 'permission' => 'access', 'collection' => 'clients', 'fields' => ['code', 'name', 'currentAreaId', 'status']],
    'areas-equipment' => ['label' => 'Areas y equipos', 'icon' => 'warehouse', 'permission' => 'inventory', 'collection' => 'machines', 'fields' => ['code', 'name', 'type', 'areaId', 'brand', 'model', 'simultaneousCapacity', 'status']],
    'schedules' => ['label' => 'Horarios y clases', 'icon' => 'calendar-days', 'permission' => 'schedules', 'collection' => 'schedules', 'fields' => ['type', 'date', 'start', 'end', 'areaId', 'branchId', 'trainerId', 'capacity', 'status']],
    'reservations' => ['label' => 'Reservas', 'icon' => 'clipboard-check', 'permission' => 'reservations', 'collection' => 'reservations', 'fields' => ['clientId', 'scheduleId', 'status', 'attendance']],
    'cafeteria' => ['label' => 'Cafeteria y suplementos', 'icon' => 'coffee', 'permission' => 'store', 'collection' => 'products', 'fields' => ['code', 'name', 'category', 'price', 'stock', 'branchId', 'status']],
    'sales-payments' => ['label' => 'Ventas y pagos', 'icon' => 'credit-card', 'permission' => 'payments', 'collection' => 'payments', 'fields' => ['clientId', 'branchId', 'itemType', 'amount', 'date', 'method', 'receipt', 'status']],
    'purchases' => ['label' => 'Compras y proveedores', 'icon' => 'shopping-cart', 'permission' => 'purchaseOrders', 'collection' => 'purchaseOrders', 'fields' => ['number', 'date', 'branchId', 'supplier', 'purchaseType', 'status']],
    'inventory' => ['label' => 'Inventario', 'icon' => 'boxes', 'permission' => 'inventory', 'collection' => 'products', 'fields' => ['code', 'name', 'category', 'stock', 'branchId', 'status']],
    'maintenance' => ['label' => 'Mantenimiento', 'icon' => 'wrench', 'permission' => 'maintenance', 'collection' => 'maintenance', 'fields' => ['machineId', 'type', 'startDate', 'estimatedEnd', 'technician', 'cost', 'status']],
    'surveys' => ['label' => 'Encuestas', 'icon' => 'star', 'permission' => 'surveys', 'collection' => 'satisfactionSurveys', 'fields' => ['serviceType', 'clientId', 'employeeId', 'branchId', 'date', 'rating', 'status']],
    'metrics' => ['label' => 'Metricas y bonos', 'icon' => 'target', 'permission' => 'staffMetrics', 'collection' => 'staffMetrics', 'fields' => ['employeeId', 'period', 'clientsServed', 'absences', 'rating']],
    'reports' => ['label' => 'Reportes', 'icon' => 'chart-no-axes-combined', 'permission' => 'reports', 'collection' => 'dailyReports', 'fields' => ['date', 'branchId', 'attendedUsers', 'membershipsSold', 'productsSold', 'totalIncome', 'emailStatus']],
    'settings' => ['label' => 'Configuracion', 'icon' => 'settings', 'permission' => 'settings', 'collection' => 'users', 'fields' => ['name', 'email', 'role', 'status']],
];

