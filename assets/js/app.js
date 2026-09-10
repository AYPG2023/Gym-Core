(function () {
  "use strict";

  const PASSWORD = "Gym2026!";
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const today = "2026-09-10";

  const roles = {
    admin: { label: "Administrador", permissions: ["all"] },
    reception: { label: "Recepcionista", permissions: ["dashboard", "clients", "memberships", "schedules", "reservations", "payments", "staffMetrics", "reports"] },
    trainer: { label: "Entrenador", permissions: ["dashboard", "schedules", "reservations", "staffMetrics", "reports"] },
    client: { label: "Cliente", permissions: ["dashboard", "inventory", "schedules", "reservations", "memberships"] }
  };

  const nav = [
    ["dashboard", "layout-dashboard", "Dashboard", "dashboard"],
    ["branches", "building-2", "Sucursales", "branches"],
    ["clients", "users-round", "Clientes", "clients"],
    ["employees", "id-card", "Empleados", "employees"],
    ["memberships", "badge-dollar-sign", "Membresias", "memberships"],
    ["inventory", "warehouse", "Areas y maquinas", "inventory"],
    ["schedules", "calendar-days", "Horarios", "schedules"],
    ["reservations", "clipboard-check", "Reservas", "reservations"],
    ["maintenance", "wrench", "Mantenimiento", "maintenance"],
    ["purchaseOrders", "shopping-cart", "Ordenes de compra", "purchaseOrders"],
    ["payments", "credit-card", "Pagos", "payments"],
    ["staffMetrics", "target", "Metricas del personal", "staffMetrics"],
    ["reports", "chart-no-axes-combined", "Reportes", "reports"]
  ];

  const app = { data: null, user: null, view: "dashboard", filters: { inventoryTab: "areas", reportTab: "Clientes" }, charts: [] };

  function normalizeData(data) {
    const seed = window.GYM_SEED || {};
    ["employees", "staffMetrics", "purchaseOrders"].forEach((key) => {
      if (!Array.isArray(data[key])) data[key] = window.GymStorage?.clone ? window.GymStorage.clone(seed[key] || []) : JSON.parse(JSON.stringify(seed[key] || []));
    });
    data.clients.forEach((client, index) => {
      client.code ||= `CLI-${String(index + 1).padStart(3, "0")}`;
      client.joinedAt ||= "2026-09-01";
      client.observations ||= "Sin observaciones registradas.";
    });
    data.purchaseOrders.forEach((order) => {
      order.taxRate ??= 0.12;
      order.items ||= [];
      order.status = order.status === "En revisión" ? "En revision" : order.status;
    });
    data.branches.forEach((branch, index) => {
      branch.code ||= index === 0 ? "Z10" : `SUC-${index + 1}`;
      branch.phone ||= "2400-0000";
      branch.email ||= `${branch.code.toLowerCase()}@gym.test`;
      branch.manager ||= "Encargado pendiente";
      branch.weekdayHours ||= "Lunes-viernes 04:00-22:00";
      branch.weekendHours ||= "Sabados y domingos 06:00-14:00";
      branch.expectedAttendance ||= "75-100 personas, con expectativa de crecimiento";
      branch.capacity ||= data.areas.filter((area) => area.branchId === branch.id).reduce((sum, area) => sum + Number(area.capacity || 0), 0);
      if (branch.status === "Disponible") branch.status = "Activa";
    });
    data.payments.forEach((payment) => {
      payment.branchId ||= window.GymRules.byId(data, "clients", payment.clientId)?.branchId || data.branches[0]?.id;
    });
    return data;
  }

  function can(permission) {
    const list = roles[app.user?.role]?.permissions || [];
    return list.includes("all") || list.includes(permission);
  }

  function icon(name, cls = "h-4 w-4") {
    return `<i data-lucide="${name}" class="${cls}"></i>`;
  }

  function toast(message, type = "success") {
    const node = document.createElement("div");
    node.className = `toast ${type}`;
    node.innerHTML = `${icon(type === "error" ? "circle-alert" : "check-circle-2")}<span>${esc(message)}</span>`;
    $("#toastStack").append(node);
    window.lucide?.createIcons();
    setTimeout(() => node.remove(), 3300);
  }

  function save() {
    window.GymStorage.save(app.data);
  }

  function badge(value) {
    const key = String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
    return `<span class="badge badge-${key}">${esc(value)}</span>`;
  }

  function button(label, action, variant = "secondary", extra = "") {
    return `<button type="button" class="btn btn-${variant}" data-action="${action}" ${extra}>${label}</button>`;
  }

  function options(items, selected = "") {
    return items.map((item) => {
      const value = typeof item === "string" ? item : item.value;
      const label = typeof item === "string" ? item : item.label;
      return `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(label)}</option>`;
    }).join("");
  }

  function page(title, subtitle, actions = "") {
    $("#topTitle").textContent = title;
    return `<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p class="eyebrow">Renovatio Gym / ${esc(roles[app.user.role].label)}</p><h1 class="page-title">${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div><div class="flex flex-wrap gap-2">${actions}</div></div>`;
  }

  function byId(collection, id) { return window.GymRules.byId(app.data, collection, id); }
  function clientName(id) { return byId("clients", id)?.name || "Sin cliente"; }
  function areaName(id) { return byId("areas", id)?.name || "Sin area"; }
  function branchName(id) { return byId("branches", id)?.name || "Sin sucursal"; }
  function employeeName(id) { return byId("employees", id)?.name || "Sin empleado"; }
  function trainerName(id) { return byId("trainers", id)?.name || "Sin entrenador"; }
  function machineName(id) { return id ? byId("machines", id)?.name || "Maquina" : "Area completa"; }
  function planName(id) { return byId("plans", id)?.name || "Plan"; }
  function branchOfMachine(machine) { return byId("areas", machine.areaId)?.branchId || ""; }
  function scheduleOf(reservation) { return byId("schedules", reservation.scheduleId); }
  function money(value) { return `Q${Number(value || 0).toLocaleString("es-GT")}`; }
  function orderSubtotal(order) { return (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0); }
  function orderTax(order) { return Math.round(orderSubtotal(order) * Number(order.taxRate ?? 0.12)); }
  function orderTotal(order) { return orderSubtotal(order) + orderTax(order); }
  function metricRecord(employeeId) { return app.data.staffMetrics.find((item) => item.employeeId === employeeId); }
  function metricPercent(item) { return item.goal ? Math.round((Number(item.result || 0) / Number(item.goal)) * 100) : 0; }
  function metricMet(item) { return Number(item.result || 0) >= Number(item.goal || 0); }
  function bonusState(employee) {
    const record = metricRecord(employee.id);
    const metCount = record ? record.metrics.filter(metricMet).length : 0;
    const approved = metCount === 2;
    return { record, metCount, approved, tone: approved ? "green" : metCount === 1 ? "yellow" : "red", bonus: approved ? Number(employee.bonus || 0) : 0, total: Number(employee.baseSalary || 0) + (approved ? Number(employee.bonus || 0) : 0) };
  }

  function branchFilter(id) {
    return !id || id === "all" ? app.data.branches : app.data.branches.filter((branch) => branch.id === id);
  }

  function branchScoped(collection, branchId) {
    if (!branchId || branchId === "all") return collection;
    return collection.filter((item) => item.branchId === branchId);
  }

  function renderNav() {
    const items = nav.filter(([, , , permission]) => can(permission));
    const html = items.map(([id, ico, label]) => `<button class="btn-sidebar ${app.view === id ? "active" : ""}" data-section="${id}">${icon(ico)}<span>${label}</span></button>`).join("");
    $("#desktopNav").innerHTML = html;
    $("#mobileNav").innerHTML = html;
    $("#activeUserLabel").textContent = `${app.user.name} / ${roles[app.user.role].label}`;
    $("#roleSwitcher").value = app.user.role;
  }

  function render() {
    if (!can(nav.find((item) => item[0] === app.view)?.[3] || "dashboard")) app.view = "dashboard";
    renderNav();
    const views = { dashboard, branches, clients, employees, memberships, inventory, schedules, reservations, maintenance, purchaseOrders, payments, staffMetrics, reports };
    $("#content").innerHTML = (views[app.view] || dashboard)();
    window.lucide?.createIcons();
    setTimeout(renderCharts, 0);
  }

  function metric(label, value, detail, ico, tone = "green") {
    return `<article class="panel metric"><div class="metric-icon ${tone}">${icon(ico)}</div><div><p>${esc(label)}</p><strong>${esc(value)}</strong><small>${esc(detail)}</small></div></article>`;
  }

  function dashboardScope() {
    const branchId = app.filters.dashboardBranch || "all";
    const schedules = branchScoped(app.data.schedules, branchId);
    const scheduleIds = schedules.map((schedule) => schedule.id);
    const clients = branchScoped(app.data.clients, branchId);
    const payments = app.data.payments.filter((payment) => branchId === "all" || payment.branchId === branchId);
    const machines = app.data.machines.filter((machine) => branchId === "all" || branchOfMachine(machine) === branchId);
    const reservations = app.data.reservations.filter((reservation) => scheduleIds.includes(reservation.scheduleId));
    return { branchId, schedules, clients, payments, machines, reservations };
  }

  function dashboard() {
    const scope = dashboardScope();
    const paid = scope.payments.filter((payment) => payment.status === "Pagado");
    const dayIncome = paid.filter((payment) => payment.date === today).reduce((sum, payment) => sum + Number(payment.amount), 0);
    const monthIncome = paid.filter((payment) => payment.date.startsWith("2026-09")).reduce((sum, payment) => sum + Number(payment.amount), 0);
    const activeClients = scope.clients.filter((client) => client.status === "Activo").length;
    const todayReservations = scope.reservations.filter((reservation) => scheduleOf(reservation)?.date === today && window.GymRules.activeReservationStates.includes(reservation.status)).length;
    const occupation = scope.schedules.length ? Math.round(scope.schedules.reduce((sum, schedule) => sum + window.GymRules.availability(app.data, schedule.id).percent, 0) / scope.schedules.length) : 0;
    const activeMemberships = app.data.memberships.filter((membership) => membership.status === "Activa" && scope.clients.some((client) => client.id === membership.clientId)).length;
    const expiring = app.data.memberships.filter((membership) => membership.status === "Proxima a vencer" && scope.clients.some((client) => client.id === membership.clientId)).length;
    const employees = branchScoped(app.data.employees, scope.branchId);
    const bonusEmployees = employees.filter((employee) => ["Coach", "Recepcionista"].includes(employee.position) && bonusState(employee).approved);
    const bonusAmount = bonusEmployees.reduce((sum, employee) => sum + Number(employee.bonus || 0), 0);
    const orders = app.data.purchaseOrders.filter((order) => scope.branchId === "all" || order.branchId === scope.branchId);
    const pendingOrders = orders.filter((order) => ["Borrador", "Solicitada", "En revision"].includes(order.status)).length;
    const approvedOrders = orders.filter((order) => ["Aprobada", "Ordenada"].includes(order.status)).length;
    const receivedOrders = orders.filter((order) => order.status === "Recibida").length;
    const equipmentSpend = orders.filter((order) => ["Aprobada", "Ordenada", "Recibida"].includes(order.status)).reduce((sum, order) => sum + orderTotal(order), 0);

    return page("Dashboard", "Indicadores administrativos de clientes, empleados, compras, ingresos y mantenimiento.") +
      `<section class="panel mb-5 p-5"><label class="form-field mt-0 max-w-sm"><span>Sucursal global</span><select id="dashboardBranch" class="form-control"><option value="all">Todas las sucursales</option>${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), scope.branchId)}</select></label></section>
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        ${metric("Total de clientes", scope.clients.length, `${activeClients} activos`, "users-round", "green")}
        ${metric("Total de empleados", employees.length, "distribuidos por sucursal", "id-card", "blue")}
        ${metric("Coaches activos", employees.filter((e) => e.position === "Coach" && e.status === "Activo").length, "entrenadores operativos", "dumbbell", "green")}
        ${metric("Recepcionistas activos", employees.filter((e) => e.position === "Recepcionista" && e.status === "Activo").length, "atencion al cliente", "headphones", "green")}
        ${metric("Bonificaciones alcanzadas", bonusEmployees.length, `${money(bonusAmount)} estimado`, "award", "yellow")}
        ${metric("Ordenes pendientes", pendingOrders, "borrador, solicitadas o revision", "clock", "yellow")}
        ${metric("Ordenes aprobadas", approvedOrders, "aprobadas u ordenadas", "check-circle-2", "green")}
        ${metric("Compras recibidas", receivedOrders, "con recepcion registrada", "package-check", "green")}
        ${metric("Gastos en equipo", money(equipmentSpend), "compras aprobadas/recibidas", "shopping-cart", "red")}
        ${metric("Ingresos del dia", money(dayIncome), today, "wallet", "blue")}
        ${metric("Ingresos del mes", money(monthIncome), "septiembre 2026", "landmark", "blue")}
        ${metric("Reservas del dia", todayReservations, "activas o pendientes", "calendar-check", "orange")}
        ${metric("Ocupacion actual", `${occupation}%`, "promedio operativo", "activity", "orange")}
        ${metric("Maquinas disponibles", scope.machines.filter((m) => m.status === "Disponible").length, "inventario operativo", "dumbbell", "green")}
        ${metric("En mantenimiento", scope.machines.filter((m) => m.status === "En mantenimiento").length, "requieren seguimiento", "wrench", "red")}
        ${metric("Membresias activas", `${activeMemberships}`, `${expiring} por vencer`, "badge-check", "yellow")}
      </section>
      <section class="mt-5 grid gap-5 xl:grid-cols-2">
        <article class="panel p-5"><h2>Ingresos por mes</h2><div class="chart-box"><canvas id="incomeMonthChart"></canvas></div></article>
        <article class="panel p-5"><h2>Ingresos por sucursal</h2><div class="chart-box"><canvas id="branchIncomeChart"></canvas></div></article>
        <article class="panel p-5"><h2>Ocupacion por horario</h2><div class="chart-box"><canvas id="occupancyChart"></canvas></div></article>
        <article class="panel p-5"><h2>Reservas por estado</h2><div class="chart-box"><canvas id="reservationStateChart"></canvas></div></article>
        <article class="panel p-5"><h2>Areas mas utilizadas</h2><div class="chart-box"><canvas id="areaChart"></canvas></div></article>
        <article class="panel p-5"><h2>Metodos de pago</h2><div class="chart-box"><canvas id="paymentMethodChart"></canvas></div></article>
      </section>
      <section class="panel mt-5 p-5"><div class="section-head"><div><h2>Alertas de mantenimiento proximo</h2><p>Maquinas con mantenimiento programado cerca.</p></div></div><div class="mt-4 grid gap-3 md:grid-cols-3">${upcomingMaintenance(scope.machines).map((machine) => `<div class="info-box"><b>${esc(machine.code)} / ${esc(machine.name)}</b><span>${areaName(machine.areaId)} / proximo ${machine.nextMaintenance}</span></div>`).join("") || `<p class="empty">Sin alertas para esta sucursal.</p>`}</div></section>`;
  }

  function upcomingMaintenance(machines) {
    return machines.filter((machine) => machine.nextMaintenance <= "2026-10-01").slice(0, 6);
  }

  function branches() {
    const term = String(app.filters.branchSearch || "").toLowerCase();
    const list = app.data.branches.filter((branch) => Object.values(branch).join(" ").toLowerCase().includes(term));
    return page("Sucursales", "Administracion de sedes, capacidad, relaciones e ingresos.", button(`${icon("plus")} Nueva sucursal`, "open-branch", "primary")) +
      `<section class="panel p-5"><div class="grid gap-3 md:grid-cols-[1fr_220px]"><input id="branchSearch" class="form-control" placeholder="Buscar codigo, nombre, encargado..." value="${esc(app.filters.branchSearch || "")}"><select id="branchStatusFilter" class="form-control"><option value="">Todos los estados</option>${options(["Activa", "Inactiva", "En mantenimiento", "Cerrada temporalmente"], app.filters.branchStatus || "")}</select></div></section>
      <section class="mt-5 grid gap-4 xl:grid-cols-2">${list.filter((branch) => !app.filters.branchStatus || branch.status === app.filters.branchStatus).map(branchCard).join("") || `<article class="panel empty">No hay sucursales con estos filtros.</article>`}</section>`;
  }

  function branchCard(branch) {
    const areas = app.data.areas.filter((area) => area.branchId === branch.id);
    const machines = app.data.machines.filter((machine) => areas.some((area) => area.id === machine.areaId));
    const clients = app.data.clients.filter((client) => client.branchId === branch.id);
    const scheduleIds = app.data.schedules.filter((schedule) => schedule.branchId === branch.id).map((schedule) => schedule.id);
    const reservations = app.data.reservations.filter((reservation) => scheduleIds.includes(reservation.scheduleId));
    const income = app.data.payments.filter((payment) => payment.branchId === branch.id && payment.status === "Pagado").reduce((sum, payment) => sum + Number(payment.amount), 0);
    return `<article class="panel p-5 area-card"><div class="section-head"><div><h2>${esc(branch.code)} / ${esc(branch.name)}</h2><p>${esc(branch.address)}</p></div>${badge(branch.status)}</div><dl class="detail-grid mt-4"><div><dt>Encargado</dt><dd>${esc(branch.manager)}</dd></div><div><dt>Contacto</dt><dd>${esc(branch.phone)}</dd></div><div><dt>Horario</dt><dd>${esc(branch.weekdayHours)}<small>${esc(branch.weekendHours)}</small></dd></div><div><dt>Aforo esperado</dt><dd>${esc(branch.expectedAttendance)}</dd></div><div><dt>Capacidad</dt><dd>${branch.capacity}</dd></div><div><dt>Areas</dt><dd>${areas.length}</dd></div><div><dt>Maquinas</dt><dd>${machines.length}</dd></div><div><dt>Clientes</dt><dd>${clients.length}</dd></div><div><dt>Ingresos</dt><dd>Q${income}</dd></div></dl><div class="mt-4 flex flex-wrap gap-2">${button(icon("eye"), "branch-detail", "icon-only", `data-id="${branch.id}" title="Ver detalle"`)}${button(icon("pencil"), "open-branch", "icon-only", `data-id="${branch.id}" title="Editar"`)}${button(branch.status === "Activa" ? "Desactivar" : "Activar", "toggle-branch", branch.status === "Activa" ? "warning" : "success", `data-id="${branch.id}"`)}${button("Reservas", "branch-reservations", "secondary", `data-id="${branch.id}"`)}</div></article>`;
  }

  function clients() {
    const term = String(app.filters.client || "").toLowerCase();
    const list = app.data.clients.filter((client) => {
      const membership = window.GymRules.membershipFor(app.data, client.id);
      const plan = window.GymRules.planFor(app.data, membership);
      if (app.filters.clientBranch && client.branchId !== app.filters.clientBranch) return false;
      if (app.filters.clientMembership && plan?.id !== app.filters.clientMembership) return false;
      if (app.filters.clientStatus && client.status !== app.filters.clientStatus) return false;
      return !term || `${client.code} ${client.name} ${client.email} ${client.phone} ${branchName(client.branchId)} ${plan?.name || ""} ${client.status}`.toLowerCase().includes(term);
    });
    return page("Clientes", "Administracion completa de registros, membresias, pagos, reservas y estados.", button(`${icon("user-plus")} Nuevo cliente`, "open-client", "primary")) +
      `<section class="panel p-5"><div class="grid gap-3 lg:grid-cols-[1fr_210px_210px_190px]"><input id="clientFilter" class="form-control" placeholder="Buscar codigo, cliente, telefono o correo..." value="${esc(app.filters.client || "")}"><select id="clientBranchFilter" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), app.filters.clientBranch || "")}</select><select id="clientMembershipFilter" class="form-control"><option value="">Todas las membresias</option>${options(app.data.plans.map((p) => ({ value: p.id, label: p.name })), app.filters.clientMembership || "")}</select><select id="clientStatusFilter" class="form-control"><option value="">Todos los estados</option>${options(["Activo", "Inactivo", "Suspendido", "Bloqueado"], app.filters.clientStatus || "")}</select></div></section>
      <section class="panel mt-5 overflow-hidden">${clientTable(list)}</section>`;
  }

  function clientTable(list) {
    const rows = list.map((client) => {
      const membership = window.GymRules.membershipFor(app.data, client.id);
      const plan = window.GymRules.planFor(app.data, membership);
      const payments = app.data.payments.filter((payment) => payment.clientId === client.id);
      const reservations = app.data.reservations.filter((reservation) => reservation.clientId === client.id).length;
      const lastPayment = payments.sort((a, b) => b.date.localeCompare(a.date))[0];
      return `<tr><td><b>${esc(client.code)}</b><small>${esc(client.name)}</small></td><td>${esc(client.phone)}<small>${esc(client.email)}</small></td><td>${branchName(client.branchId)}</td><td>${esc(plan?.name || "Sin plan")}<small>${membership?.endDate || "Sin vencimiento"}</small></td><td>${client.joinedAt}<small>Vence ${membership?.endDate || "-"}</small></td><td>${badge(client.status)}</td><td>${reservations}</td><td>${lastPayment ? `${lastPayment.date}<small>${money(lastPayment.amount)} / ${esc(lastPayment.status)}</small>` : "Sin pagos"}</td><td><div class="row-actions">${button(icon("eye"), "client-detail", "icon-only", `data-id="${client.id}" title="Ver"`)}${button(icon("pencil"), "open-client", "icon-only", `data-id="${client.id}" title="Editar"`)}${client.status !== "Activo" ? button("Activar", "client-status", "success", `data-id="${client.id}" data-next="Activo"`) : ""}${client.status !== "Suspendido" ? button("Suspender", "client-status", "warning", `data-id="${client.id}" data-next="Suspendido"`) : ""}${client.status !== "Bloqueado" ? button("Bloquear", "client-status", "danger", `data-id="${client.id}" data-next="Bloqueado"`) : ""}</div></td></tr>`;
    }).join("");
    return `<div class="table-wrap"><table><thead><tr><th>Codigo / Nombre</th><th>Contacto</th><th>Sucursal</th><th>Membresia</th><th>Inscripcion / Vencimiento</th><th>Estado</th><th>Reservas</th><th>Ultimo pago</th><th>Acciones</th></tr></thead><tbody>${rows || `<tr><td colspan="9" class="empty">No hay clientes con estos filtros.</td></tr>`}</tbody></table></div>`;
  }

  function employees() {
    const term = String(app.filters.employeeSearch || "").toLowerCase();
    const list = app.data.employees.filter((employee) => {
      if (app.filters.employeeBranch && employee.branchId !== app.filters.employeeBranch) return false;
      if (app.filters.employeePosition && employee.position !== app.filters.employeePosition) return false;
      if (app.filters.employeeStatus && employee.status !== app.filters.employeeStatus) return false;
      return !term || `${employee.code} ${employee.name} ${employee.position} ${employee.email} ${employee.phone} ${branchName(employee.branchId)} ${employee.status}`.toLowerCase().includes(term);
    });
    return page("Empleados", "Administracion de recepcionistas, coaches, administradores y mantenimiento.", button(`${icon("user-plus")} Nuevo empleado`, "open-employee", "primary")) +
      `<section class="panel p-5"><div class="grid gap-3 lg:grid-cols-[1fr_210px_210px_190px]"><input id="employeeSearch" class="form-control" placeholder="Buscar codigo, empleado, telefono o correo..." value="${esc(app.filters.employeeSearch || "")}"><select id="employeeBranchFilter" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), app.filters.employeeBranch || "")}</select><select id="employeePositionFilter" class="form-control"><option value="">Todos los puestos</option>${options(["Recepcionista", "Coach", "Administrador", "Mantenimiento"], app.filters.employeePosition || "")}</select><select id="employeeStatusFilter" class="form-control"><option value="">Todos los estados</option>${options(["Activo", "Inactivo", "Suspendido", "Vacaciones"], app.filters.employeeStatus || "")}</select></div></section>
      <section class="panel mt-5 overflow-hidden"><div class="table-wrap"><table><thead><tr><th>Codigo / Nombre</th><th>Puesto</th><th>Sucursal</th><th>Contacto</th><th>Contratacion</th><th>Salario</th><th>Horario</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${list.map(employeeRow).join("") || `<tr><td colspan="9" class="empty">No hay empleados con estos filtros.</td></tr>`}</tbody></table></div></section>`;
  }

  function employeeRow(employee) {
    return `<tr><td><b>${esc(employee.code)}</b><small>${esc(employee.name)}</small></td><td>${esc(employee.position)}</td><td>${branchName(employee.branchId)}</td><td>${esc(employee.phone)}<small>${esc(employee.email)}</small></td><td>${employee.hiredAt}</td><td>${money(employee.baseSalary)}</td><td>${esc(employee.workSchedule)}</td><td>${badge(employee.status)}</td><td><div class="row-actions">${button(icon("eye"), "employee-detail", "icon-only", `data-id="${employee.id}" title="Ver"`)}${button(icon("pencil"), "open-employee", "icon-only", `data-id="${employee.id}" title="Editar"`)}${employee.status !== "Activo" ? button("Activar", "employee-status", "success", `data-id="${employee.id}" data-next="Activo"`) : button("Desactivar", "employee-status", "warning", `data-id="${employee.id}" data-next="Inactivo"`)}</div></td></tr>`;
  }

  function staffMetrics() {
    const candidates = app.data.employees.filter((employee) => ["Coach", "Recepcionista"].includes(employee.position));
    let selectedId = app.filters.staffEmployee || app.user.employeeId || candidates[0]?.id;
    if (app.user.role === "trainer" && app.user.employeeId) selectedId = app.user.employeeId;
    if (app.user.role === "reception" && app.user.employeeId) selectedId = app.user.employeeId;
    const employee = byId("employees", selectedId) || candidates[0];
    app.filters.staffEmployee = employee?.id;
    const state = employee ? bonusState(employee) : {};
    return page("Metricas del personal", "Resultados individuales y regla visual de bonificacion por empleado.", "") +
      `<section class="panel p-5"><label class="form-field mt-0 max-w-md"><span>Empleado</span><select id="staffEmployeeSelect" class="form-control" ${app.user.role === "admin" ? "" : "disabled"}>${options(candidates.map((item) => ({ value: item.id, label: `${item.name} / ${item.position} / ${branchName(item.branchId)}` })), employee?.id)}</select></label></section>
      ${employee ? staffMetricDetail(employee, state) : `<section class="panel mt-5 empty">No hay metricas registradas.</section>`}`;
  }

  function staffMetricDetail(employee, state) {
    const metrics = state.record?.metrics || [];
    return `<section class="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><article class="grid gap-4 md:grid-cols-2">${metrics.map(metricCard).join("")}</article><article class="panel bonus-card ${state.tone} p-5"><div class="section-head"><div><h2>Resumen de bonificacion</h2><p>${esc(employee.name)} / ${esc(employee.position)}</p></div>${badge(state.approved ? "Bonificacion aprobada" : "Bonificacion no alcanzada")}</div><dl class="detail-grid mt-4"><div><dt>Sueldo base</dt><dd>${money(employee.baseSalary)}</dd></div><div><dt>Bonificacion</dt><dd>${money(state.bonus)}</dd></div><div><dt>Total estimado</dt><dd>${money(state.total)}</dd></div><div><dt>Resultado</dt><dd>${state.approved ? "Bonificacion aprobada" : "Bonificacion no alcanzada"}</dd></div></dl><p class="mt-4 text-sm font-bold text-slate-700">La bonificacion solo se aprueba cuando cumple las dos metricas obligatorias.</p></article></section>
    <section class="panel mt-5 p-5"><div class="section-head"><div><h2>Detalle operativo</h2><p>Datos individuales del periodo ${esc(state.record?.period || "2026-09")}.</p></div></div><dl class="detail-grid mt-4"><div><dt>Sucursal</dt><dd>${branchName(employee.branchId)}</dd></div><div><dt>Clases asignadas</dt><dd>${esc(state.record?.assignedClasses || "No aplica")}</dd></div><div><dt>Clientes atendidos</dt><dd>${state.record?.clientsServed ?? 0}</dd></div><div><dt>Ausencias</dt><dd>${state.record?.absences ?? 0}</dd></div><div><dt>Calificacion promedio</dt><dd>${state.record?.rating ?? "-"}</dd></div><div><dt>Horario</dt><dd>${esc(employee.workSchedule)}</dd></div><div><dt>Sueldo base</dt><dd>${money(employee.baseSalary)}</dd></div><div><dt>Bonificacion posible</dt><dd>${money(employee.bonus)}</dd></div></dl></section>`;
  }

  function metricCard(item) {
    const percent = metricPercent(item);
    const met = metricMet(item);
    return `<article class="panel p-5"><div class="section-head"><div><h2>${esc(item.label)}</h2><p>${esc(item.unit)}</p></div>${badge(met ? "Cumplida" : "No cumplida")}</div><dl class="detail-grid mt-4"><div><dt>Meta establecida</dt><dd>${item.goal}</dd></div><div><dt>Resultado alcanzado</dt><dd>${item.result}</dd></div><div><dt>Cumplimiento</dt><dd>${percent}%</dd></div><div><dt>Estado</dt><dd>${met ? "Cumplida" : "No cumplida"}</dd></div></dl><div class="mt-4 h-3 rounded-full bg-slate-200"><span class="block h-3 rounded-full ${met ? "bg-emerald-500" : "bg-amber-500"}" style="width:${Math.min(percent, 130)}%"></span></div></article>`;
  }

  function purchaseOrders() {
    const f = app.filters.purchaseOrders || {};
    const term = String(f.search || "").toLowerCase();
    const list = app.data.purchaseOrders.filter((order) => {
      if (f.branch && order.branchId !== f.branch) return false;
      if (f.supplier && order.supplier !== f.supplier) return false;
      if (f.date && order.date !== f.date) return false;
      if (f.status && order.status !== f.status) return false;
      return !term || `${order.number} ${order.supplier} ${order.purchaseType} ${order.reason} ${order.status} ${branchName(order.branchId)} ${employeeName(order.requesterId)}`.toLowerCase().includes(term);
    });
    const suppliers = [...new Set(app.data.purchaseOrders.map((order) => order.supplier))];
    return page("Ordenes de compra", "Gestion de maquinas, repuestos, accesorios, equipos e insumos.", button(`${icon("plus")} Nueva orden de compra`, "open-purchase-order", "primary")) +
      `<section class="panel p-5"><div class="grid gap-3 lg:grid-cols-[1fr_190px_190px_170px_190px]"><input id="poSearch" class="form-control" placeholder="Buscar orden, proveedor, motivo o solicitante..." value="${esc(f.search || "")}"><select id="poBranch" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), f.branch || "")}</select><select id="poSupplier" class="form-control"><option value="">Todos los proveedores</option>${options(suppliers, f.supplier || "")}</select><input id="poDate" type="date" class="form-control" value="${esc(f.date || "")}"><select id="poStatus" class="form-control"><option value="">Todos los estados</option>${options(["Borrador", "Solicitada", "En revision", "Aprobada", "Rechazada", "Ordenada", "Recibida", "Cancelada"], f.status || "")}</select></div></section>
      <section class="panel mt-5 overflow-hidden"><div class="table-wrap"><table><thead><tr><th>Orden</th><th>Fecha</th><th>Sucursal / Solicitante</th><th>Proveedor</th><th>Tipo</th><th>Articulos</th><th>Total</th><th>Entrega</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${list.map(orderRow).join("") || `<tr><td colspan="10" class="empty">No hay ordenes con estos filtros.</td></tr>`}</tbody></table></div></section>`;
  }

  function orderRow(order) {
    const items = (order.items || []).map((item) => `${item.quantity} x ${item.name}`).join(", ");
    return `<tr><td><b>${esc(order.number)}</b></td><td>${order.date}</td><td>${branchName(order.branchId)}<small>${employeeName(order.requesterId)}</small></td><td>${esc(order.supplier)}</td><td>${esc(order.purchaseType)}</td><td>${esc(items)}</td><td>${money(orderTotal(order))}<small>Subtotal ${money(orderSubtotal(order))}</small></td><td>${order.expectedDelivery}</td><td>${badge(order.status)}</td><td><div class="row-actions">${button(icon("eye"), "purchase-order-detail", "icon-only", `data-id="${order.id}" title="Ver"`)}${!["Recibida", "Cancelada", "Rechazada"].includes(order.status) ? button(icon("pencil"), "open-purchase-order", "icon-only", `data-id="${order.id}" title="Editar"`) : ""}${purchaseOrderActions(order)}</div></td></tr>`;
  }

  function purchaseOrderActions(order) {
    const labels = { "Solicitada": "Solicitar", "En revision": "Revisar", "Aprobada": "Aprobar", "Ordenada": "Ordenar", "Recibida": "Marcar recibida", "Rechazada": "Rechazar", "Cancelada": "Cancelar" };
    return (window.GymRules.purchaseOrderFlow[order.status] || []).map((next) => {
      const action = next === "Recibida" ? "receive-purchase-order" : "purchase-order-status";
      const variant = next === "Cancelada" || next === "Rechazada" ? "danger" : next === "Aprobada" || next === "Ordenada" ? "success" : "secondary";
      return button(labels[next] || next, action, variant, `data-id="${order.id}" data-next="${next}"`);
    }).join("");
  }

  function memberships() {
    return page("Membresias y planes", "Planes, vigencias, permisos de areas y estados de membresia.", button(`${icon("plus")} Registrar pago`, "open-payment", "primary")) +
      `<section class="grid gap-5 xl:grid-cols-[.9fr_1.4fr]">
        <article class="panel p-5"><div class="section-head"><div><h2>Planes disponibles</h2><p>Areas y limites por plan.</p></div></div><div class="mt-4 space-y-3">${app.data.plans.map((plan) => `<div class="plan-card"><div><b>${esc(plan.name)}</b><small>Q${plan.price} / ${plan.durationDays} dias / ${plan.reservationLimit} reservas</small></div>${badge(plan.status)}<p>${plan.areas.map(areaName).join(", ")}</p></div>`).join("")}</div></article>
        <article class="panel overflow-hidden"><div class="section-head p-5"><div><h2>Membresias asignadas</h2><p>Estados y fechas de vencimiento.</p></div></div><div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Plan</th><th>Vigencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${app.data.memberships.map((membership) => `<tr><td>${clientName(membership.clientId)}</td><td>${planName(membership.planId)}</td><td>${membership.startDate} al ${membership.endDate}</td><td>${badge(membership.status)}</td><td><div class="row-actions">${["Pendiente", "Suspendida"].includes(membership.status) ? button("Activar", "membership-status", "success", `data-id="${membership.id}" data-next="Activa"`) : ""}${["Activa", "Proxima a vencer"].includes(membership.status) ? button("Suspender", "membership-status", "warning", `data-id="${membership.id}" data-next="Suspendida"`) : ""}${!["Cancelada", "Vencida"].includes(membership.status) ? button("Cancelar", "membership-status", "danger", `data-id="${membership.id}" data-next="Cancelada"`) : ""}</div></td></tr>`).join("")}</tbody></table></div></article>
      </section>`;
  }

  function inventory() {
    const tab = app.filters.inventoryTab || "areas";
    const branch = app.filters.inventoryBranch || "";
    const term = String(app.filters.inventorySearch || "").toLowerCase();
    const state = app.filters.inventoryState || "";
    const type = app.filters.inventoryType || "all";
    const areas = filterAreas(branch, term, state);
    const machines = filterMachines(branch, term, state);
    return page("Areas y maquinas", "Inventario separado de mantenimiento, con filtros y formularios propios.", `${button(`${icon("plus")} Nueva area`, "open-area", "primary")}${button(`${icon("plus")} Nueva maquina`, "open-machine", "secondary")}`) +
      `<section class="panel p-5"><div class="grid gap-3 lg:grid-cols-[220px_1fr_180px_220px]"><select id="inventoryBranch" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), branch)}</select><input id="inventorySearch" class="form-control" placeholder="Buscar area, maquina, codigo, marca..." value="${esc(app.filters.inventorySearch || "")}"><select id="inventoryType" class="form-control">${options([{ value: "all", label: "Todas" }, { value: "areas", label: "Areas" }, { value: "machines", label: "Maquinas" }], type)}</select><select id="inventoryState" class="form-control"><option value="">Todos los estados</option>${options(["Disponible", "Capacidad limitada", "Completa", "Cerrada", "En mantenimiento", "Reservada", "En uso", "Fuera de servicio"], state)}</select></div><div class="tabs mt-4"><button class="${tab === "areas" ? "active" : ""}" data-action="inventory-tab" data-tab="areas">Areas</button><button class="${tab === "machines" ? "active" : ""}" data-action="inventory-tab" data-tab="machines">Maquinas</button></div></section>
      ${type !== "machines" && tab === "areas" ? areaInventory(areas) : ""}
      ${type !== "areas" && tab === "machines" ? machineInventory(machines) : ""}`;
  }

  function filterAreas(branch, term, state) {
    return app.data.areas.filter((area) => {
      if (branch && area.branchId !== branch) return false;
      if (state && area.status !== state) return false;
      if (term && !`${area.name} ${area.description} ${branchName(area.branchId)} ${area.status}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }

  function filterMachines(branch, term, state) {
    return app.data.machines.filter((machine) => {
      const machineBranch = branchOfMachine(machine);
      if (branch && machineBranch !== branch) return false;
      if (state && machine.status !== state) return false;
      if (term && !`${machine.code} ${machine.name} ${machine.type} ${machine.brand} ${machine.model} ${areaName(machine.areaId)} ${branchName(machineBranch)} ${machine.status}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }

  function areaInventory(areas) {
    return `<section class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">${areas.map((area) => {
      const schedule = app.data.schedules.find((item) => item.areaId === area.id);
      const availability = schedule ? window.GymRules.availability(app.data, schedule.id) : { available: area.capacity, total: area.capacity, percent: 0 };
      return `<article class="panel p-5 area-card"><div class="section-head"><div><h2>${esc(area.name)}</h2><p>${branchName(area.branchId)}</p></div>${badge(area.status)}</div><p class="mt-3 text-sm text-slate-600">${esc(area.description)}</p><dl class="detail-grid mt-4"><div><dt>Capacidad</dt><dd>${area.capacity}</dd></div><div><dt>Horario</dt><dd>${esc(area.schedule)}</dd></div><div><dt>Maquinas</dt><dd>${app.data.machines.filter((machine) => machine.areaId === area.id).length}</dd></div><div><dt>Cupos</dt><dd>${availability.available}/${availability.total}</dd></div></dl><div class="mt-4 row-actions">${button(icon("eye"), "area-detail", "icon-only", `data-id="${area.id}" title="Ver"`)}${button(icon("pencil"), "open-area", "icon-only", `data-id="${area.id}" title="Editar"`)}${button("Cambiar estado", "cycle-area-status", "secondary", `data-id="${area.id}"`)}</div></article>`;
    }).join("") || `<article class="panel empty">No hay areas con estos filtros.</article>`}</section>`;
  }

  function machineInventory(machines) {
    return `<section class="panel mt-5 overflow-hidden"><div class="table-wrap"><table><thead><tr><th>Codigo</th><th>Maquina</th><th>Tipo</th><th>Sucursal</th><th>Area</th><th>Marca / Modelo</th><th>Capacidad</th><th>Mantenimiento</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${machines.map((machine) => `<tr><td><b>${esc(machine.code)}</b></td><td>${esc(machine.name)}</td><td>${esc(machine.type)}</td><td>${branchName(branchOfMachine(machine))}</td><td>${areaName(machine.areaId)}</td><td>${esc(machine.brand)}<small>${esc(machine.model)}</small></td><td>${machine.simultaneousCapacity}</td><td>${machine.lastMaintenance}<small>Proximo ${machine.nextMaintenance}</small></td><td>${badge(machine.status)}</td><td><div class="row-actions">${button(icon("eye"), "machine-detail", "icon-only", `data-id="${machine.id}" title="Ver"`)}${button(icon("pencil"), "open-machine", "icon-only", `data-id="${machine.id}" title="Editar"`)}${machineActions(machine)}${button("Ver mantenimientos", "machine-maintenance", "secondary", `data-id="${machine.id}"`)}</div></td></tr>`).join("") || `<tr><td colspan="10" class="empty">No hay maquinas con estos filtros.</td></tr>`}</tbody></table></div></section>`;
  }

  function machineActions(machine) {
    const allowed = window.GymRules.machineFlow[machine.status] || [];
    return allowed.slice(0, 2).map((next) => button(next, "machine-status", next === "En mantenimiento" ? "warning" : "secondary", `data-id="${machine.id}" data-next="${next}"`)).join("");
  }

  function schedules() {
    return page("Horarios y disponibilidad", "Calendario de bloques con cupos, ocupacion y colores por estado.", can("reservations") ? button(`${icon("plus")} Reservar`, "open-reservation", "primary") : "") +
      `<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">${app.data.schedules.map(scheduleCard).join("")}</section>`;
  }

  function scheduleCard(schedule) {
    const spaces = window.GymRules.availability(app.data, schedule.id);
    const color = spaces.state === "Disponible" ? "green" : spaces.state === "Pocos cupos" ? "yellow" : "red";
    return `<article class="panel schedule-card ${color} p-5"><div class="section-head"><div><h2>${areaName(schedule.areaId)}</h2><p>${branchName(schedule.branchId)}</p></div>${badge(spaces.state)}</div><div class="mt-4 flex items-center gap-3 text-ink"><span class="time-chip">${schedule.start}</span><span>al</span><span class="time-chip">${schedule.end}</span></div><dl class="detail-grid mt-4"><div><dt>Fecha</dt><dd>${schedule.date}</dd></div><div><dt>Entrenador</dt><dd>${trainerName(schedule.trainerId)}</dd></div><div><dt>Reservados</dt><dd>${spaces.reserved}</dd></div><div><dt>Disponibles</dt><dd>${spaces.available}/${spaces.total}</dd></div></dl><div class="mt-4 h-2 rounded-full bg-slate-200"><span class="block h-2 rounded-full" style="width:${spaces.percent}%; background: var(--schedule-color)"></span></div></article>`;
  }

  function reservations() {
    let list = app.data.reservations;
    if (app.user.role === "client") list = list.filter((reservation) => reservation.clientId === app.user.clientId);
    if (app.user.role === "trainer") list = list.filter((reservation) => scheduleOf(reservation)?.trainerId === app.user.trainerId);
    return page("Reservas", "Crear, confirmar, cancelar y consultar historial de estados.", button(`${icon("plus")} Nueva reserva`, "open-reservation", "primary")) +
      `<section class="panel overflow-hidden">${reservationTable(list)}</section>`;
  }

  function reservationTable(list) {
    return `<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Horario</th><th>Sucursal</th><th>Area / Maquina</th><th>Estado</th><th>Historial</th><th>Acciones</th></tr></thead><tbody>${list.map((reservation) => {
      const schedule = scheduleOf(reservation);
      return `<tr><td>${clientName(reservation.clientId)}</td><td><b>${schedule?.date || ""}</b><small>${schedule?.start || ""} - ${schedule?.end || ""}</small></td><td>${branchName(schedule?.branchId)}</td><td>${areaName(schedule?.areaId)}<small>${machineName(reservation.machineId)}</small></td><td>${badge(reservation.status)}</td><td><div class="timeline">${reservation.history.map((item) => `<span>${esc(item.status)}</span>`).join("")}</div></td><td><div class="row-actions">${reservationActions(reservation)}</div></td></tr>`;
    }).join("") || `<tr><td colspan="7" class="empty">No hay reservas registradas.</td></tr>`}</tbody></table></div>`;
  }

  function reservationActions(reservation) {
    const allowed = window.GymRules.reservationFlow[reservation.status] || [];
    return allowed.map((next) => {
      const variant = next === "Cancelada" || next === "Rechazada" ? "danger" : next === "Confirmada" || next === "Completada" ? "success" : "secondary";
      return button(next, next === "Cancelada" ? "cancel-reservation" : "reservation-status", variant, `data-id="${reservation.id}" data-next="${next}"`);
    }).join("");
  }

  function maintenance() {
    const filters = app.filters.maintenance || {};
    const list = app.data.maintenance.filter((item) => {
      const machine = byId("machines", item.machineId);
      const branchId = machine ? branchOfMachine(machine) : "";
      const areaId = machine?.areaId || "";
      const term = String(filters.search || "").toLowerCase();
      if (filters.branch && branchId !== filters.branch) return false;
      if (filters.area && areaId !== filters.area) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (term && !`${machine?.code} ${machine?.name} ${item.type} ${item.technician} ${item.status}`.toLowerCase().includes(term)) return false;
      return true;
    });
    return page("Mantenimiento", "Registro centralizado de mantenimientos e historial por maquina.", button(`${icon("plus")} Registrar mantenimiento`, "open-maintenance", "primary")) +
      `<section class="panel p-5"><div class="grid gap-3 lg:grid-cols-[1fr_200px_200px_180px_180px]"><input id="maintenanceSearch" class="form-control" placeholder="Buscar maquina, codigo o tecnico..." value="${esc(filters.search || "")}"><select id="maintenanceBranch" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), filters.branch || "")}</select><select id="maintenanceArea" class="form-control"><option value="">Todas las areas</option>${options(app.data.areas.map((a) => ({ value: a.id, label: a.name })), filters.area || "")}</select><select id="maintenanceTypeFilter" class="form-control"><option value="">Todos los tipos</option>${options(["Preventivo", "Correctivo", "Calibracion"], filters.type || "")}</select><select id="maintenanceStatusFilter" class="form-control"><option value="">Todos los estados</option>${options(["Programado", "En proceso", "Finalizado", "Cancelado"], filters.status || "")}</select></div></section>
      <section class="panel mt-5 overflow-hidden"><div class="table-wrap"><table><thead><tr><th>Maquina</th><th>Sucursal / Area</th><th>Tipo</th><th>Fechas</th><th>Tecnico</th><th>Costo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${list.map((item) => maintenanceRow(item)).join("") || `<tr><td colspan="8" class="empty">No hay mantenimientos con estos filtros.</td></tr>`}</tbody></table></div></section>`;
  }

  function maintenanceRow(item) {
    const machine = byId("machines", item.machineId);
    return `<tr><td><b>${esc(machine?.code || "")}</b><small>${machineName(item.machineId)}</small></td><td>${branchName(machine ? branchOfMachine(machine) : "")}<small>${areaName(machine?.areaId)}</small></td><td>${esc(item.type)}</td><td>${item.startDate} a ${item.estimatedEnd}<small>${item.finishedAt ? `Finalizado ${item.finishedAt}` : ""}</small></td><td>${esc(item.technician)}</td><td>Q${item.finalCost || item.cost}</td><td>${badge(item.status)}</td><td><div class="row-actions">${button(icon("eye"), "maintenance-detail", "icon-only", `data-id="${item.id}" title="Ver"`)}${item.status === "Programado" ? button("Iniciar", "start-maintenance", "warning", `data-id="${item.id}"`) : ""}${["Programado", "En proceso"].includes(item.status) ? button(icon("pencil"), "open-maintenance", "icon-only", `data-id="${item.id}" title="Editar"`) : ""}${item.status === "En proceso" ? button("Finalizar", "finish-maintenance", "success", `data-id="${item.id}"`) : ""}${["Programado", "En proceso"].includes(item.status) ? button("Cancelar", "cancel-maintenance", "danger", `data-id="${item.id}"`) : ""}</div></td></tr>`;
  }

  function payments() {
    return page("Pagos", "Registro de pagos de membresia con comprobante, sucursal y estado.", button(`${icon("plus")} Registrar pago`, "open-payment", "primary")) +
      `<section class="panel overflow-hidden"><div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Sucursal</th><th>Plan</th><th>Monto</th><th>Fecha</th><th>Metodo</th><th>Comprobante</th><th>Estado</th></tr></thead><tbody>${app.data.payments.map((payment) => `<tr><td>${clientName(payment.clientId)}</td><td>${branchName(payment.branchId)}</td><td>${planName(payment.planId)}</td><td>Q${payment.amount}</td><td>${payment.date}</td><td>${esc(payment.method)}</td><td>${esc(payment.receipt)}</td><td>${badge(payment.status)}</td></tr>`).join("")}</tbody></table></div></section>`;
  }

  function reports() {
    const tab = app.filters.reportTab || "Clientes";
    const f = app.filters.report || {};
    const filteredPayments = app.data.payments.filter((payment) => {
      if (f.from && payment.date < f.from) return false;
      if (f.to && payment.date > f.to) return false;
      if (f.branch && payment.branchId !== f.branch) return false;
      if (f.method && payment.method !== f.method) return false;
      if (f.status && payment.status !== f.status) return false;
      return true;
    });
    const paid = filteredPayments.filter((payment) => payment.status === "Pagado");
    return page("Reportes", "Categorias administrativas con filtros, graficas, tablas y exportaciones.", `${button(`${icon("printer")} Imprimir`, "print-report", "ghost")}${button(`${icon("download")} Exportar CSV`, "export-report", "secondary")}${button(`${icon("file-down")} Descargar reporte`, "download-report", "primary")}`) +
      `<section class="panel p-5"><div class="tabs">${["Clientes", "Empleados", "Compras", "Financiero"].map((name) => `<button class="${tab === name ? "active" : ""}" data-action="report-tab" data-tab="${name}">${name}</button>`).join("")}</div><div class="mt-4 grid gap-3 lg:grid-cols-5"><input id="reportFrom" class="form-control" type="date" value="${esc(f.from || "2026-09-01")}"><input id="reportTo" class="form-control" type="date" value="${esc(f.to || "2026-09-30")}"><select id="reportBranch" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), f.branch || "")}</select><select id="reportMethod" class="form-control"><option value="">Todos los metodos</option>${options(["Efectivo", "Tarjeta", "Transferencia"], f.method || "")}</select><select id="reportStatus" class="form-control"><option value="">Todos los estados</option>${options(["Pendiente", "Pagado", "Rechazado", "Anulado", "Confirmada", "Cancelada", "En mantenimiento", "Aprobada", "Recibida", "En revision"], f.status || "")}</select></div></section>
      ${reportBody(tab, filteredPayments, paid)}`;
  }

  function reportBody(tab, filteredPayments, paid) {
    if (tab === "Clientes") return clientReport();
    if (tab === "Empleados") return employeeReport();
    if (tab === "Compras") return purchaseReport();
    return financialReport(filteredPayments, paid);
  }

  function countBy(items, keyFn) {
    return items.reduce((acc, item) => {
      const key = keyFn(item) || "Sin dato";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function summaryTable(title, rows) {
    return `<article class="panel overflow-hidden"><div class="section-head p-5"><div><h2>${esc(title)}</h2><p>${rows.length} grupos.</p></div></div>${simpleTable(["Categoria", "Cantidad"], rows)}</article>`;
  }

  function clientReport() {
    const active = app.data.clients.filter((client) => client.status === "Activo").length;
    const renewals = app.data.memberships.filter((membership) => membership.startDate >= "2026-09-01").length;
    return `<section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${metric("Clientes totales", app.data.clients.length, "base actual", "users-round", "blue")}${metric("Activos e inactivos", `${active}/${app.data.clients.length - active}`, "activo / otros estados", "user-check", "green")}${metric("Nuevas inscripciones", app.data.clients.filter((c) => c.joinedAt >= "2026-09-01").length, "periodo seleccionado", "user-plus", "yellow")}${metric("Renovaciones", renewals, "membresias iniciadas", "refresh-cw", "orange")}</section><section class="mt-5 grid gap-5 xl:grid-cols-2">${summaryTable("Clientes por sucursal", Object.entries(countBy(app.data.clients, (c) => branchName(c.branchId))).map(([k, v]) => [k, v]))}${summaryTable("Clientes por membresia", Object.entries(countBy(app.data.clients, (c) => planName(window.GymRules.membershipFor(app.data, c.id)?.planId))).map(([k, v]) => [k, v]))}</section>`;
  }

  function employeeReport() {
    const bonusApproved = app.data.employees.filter((employee) => ["Coach", "Recepcionista"].includes(employee.position) && bonusState(employee).approved).length;
    return `<section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${metric("Empleados", app.data.employees.length, "nomina demo", "id-card", "blue")}${metric("Cumplen ambas metas", bonusApproved, "bonificacion aprobada", "award", "green")}${metric("No alcanzadas", app.data.staffMetrics.length - bonusApproved, "una o ninguna meta", "triangle-alert", "yellow")}${metric("Monto aprobado", money(app.data.employees.filter((e) => bonusState(e).approved).reduce((s, e) => s + Number(e.bonus || 0), 0)), "bonificaciones", "wallet", "orange")}</section><section class="mt-5 grid gap-5 xl:grid-cols-2">${summaryTable("Empleados por sucursal", Object.entries(countBy(app.data.employees, (e) => branchName(e.branchId))).map(([k, v]) => [k, v]))}${summaryTable("Empleados por puesto", Object.entries(countBy(app.data.employees, (e) => e.position)).map(([k, v]) => [k, v]))}</section><section class="panel mt-5 overflow-hidden"><div class="section-head p-5"><div><h2>Metricas por empleado</h2><p>Cumplimiento de metas y bonificaciones.</p></div></div><div class="table-wrap"><table><thead><tr><th>Empleado</th><th>Puesto</th><th>Meta 1</th><th>Meta 2</th><th>Resultado</th></tr></thead><tbody>${app.data.employees.filter((e) => metricRecord(e.id)).map((employee) => { const state = bonusState(employee); return `<tr><td>${esc(employee.name)}</td><td>${esc(employee.position)}</td><td>${badge(metricMet(state.record.metrics[0]) ? "Cumplida" : "No cumplida")}</td><td>${badge(metricMet(state.record.metrics[1]) ? "Cumplida" : "No cumplida")}</td><td>${state.approved ? "Bonificacion aprobada" : "Bonificacion no alcanzada"}</td></tr>`; }).join("")}</tbody></table></div></section>`;
  }

  function purchaseReport() {
    const pending = app.data.purchaseOrders.filter((order) => ["Borrador", "Solicitada", "En revision"].includes(order.status)).length;
    const received = app.data.purchaseOrders.filter((order) => order.status === "Recibida").length;
    return `<section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${metric("Ordenes", app.data.purchaseOrders.length, "compras registradas", "shopping-cart", "blue")}${metric("Pendientes", pending, "por aprobar o revisar", "clock", "yellow")}${metric("Equipos recibidos", received, "recepciones cerradas", "package-check", "green")}${metric("Gastos por equipo", money(app.data.purchaseOrders.reduce((s, o) => s + orderTotal(o), 0)), "total solicitado", "wallet", "red")}</section><section class="mt-5 grid gap-5 xl:grid-cols-2">${summaryTable("Ordenes por estado", Object.entries(countBy(app.data.purchaseOrders, (o) => o.status)).map(([k, v]) => [k, v]))}${summaryTable("Compras por sucursal", Object.entries(countBy(app.data.purchaseOrders, (o) => branchName(o.branchId))).map(([k, v]) => [k, v]))}${summaryTable("Compras por proveedor", Object.entries(countBy(app.data.purchaseOrders, (o) => o.supplier)).map(([k, v]) => [k, v]))}${summaryTable("Gastos por tipo de equipo", Object.entries(app.data.purchaseOrders.reduce((acc, order) => { acc[order.purchaseType] = (acc[order.purchaseType] || 0) + orderTotal(order); return acc; }, {})).map(([k, v]) => [k, money(v)]))}</section>`;
  }

  function financialReport(filteredPayments, paid) {
    const income = paid.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const purchases = app.data.purchaseOrders.filter((order) => ["Aprobada", "Ordenada", "Recibida"].includes(order.status)).reduce((sum, order) => sum + orderTotal(order), 0);
    const maintenanceCost = app.data.maintenance.reduce((sum, item) => sum + Number(item.finalCost || item.cost || 0), 0);
    return `<section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${metric("Ingresos por pagos", money(income), "membresias pagadas", "wallet", "blue")}${metric("Gastos por compras", money(purchases), "ordenes aprobadas", "shopping-cart", "red")}${metric("Costos mantenimiento", money(maintenanceCost), "programados/finalizados", "wrench", "yellow")}${metric("Resultado estimado", money(income - purchases - maintenanceCost), "global", "landmark", income - purchases - maintenanceCost >= 0 ? "green" : "red")}</section><section class="mt-5 grid gap-5 xl:grid-cols-2"><article class="panel p-5"><h2>Ingresos por sucursal</h2><div class="chart-box"><canvas id="reportBranchIncomeChart"></canvas></div></article><article class="panel p-5"><h2>Ingresos por metodo</h2><div class="chart-box"><canvas id="reportMethodChart"></canvas></div></article></section>${paymentReportTable(filteredPayments)}<section class="panel mt-5 overflow-hidden"><div class="section-head p-5"><div><h2>Resultado estimado por sucursal</h2><p>Ingresos menos compras y mantenimiento asignado.</p></div></div>${simpleTable(["Sucursal", "Ingresos", "Gastos compras", "Resultado"], app.data.branches.map((branch) => { const branchIncome = app.data.payments.filter((p) => p.branchId === branch.id && p.status === "Pagado").reduce((s, p) => s + p.amount, 0); const branchPurchases = app.data.purchaseOrders.filter((o) => o.branchId === branch.id).reduce((s, o) => s + orderTotal(o), 0); return [branch.name, money(branchIncome), money(branchPurchases), money(branchIncome - branchPurchases)]; }))}</section>`;
  }

  function activeCountFor(tab) {
    if (tab === "Clientes") return app.data.clients.filter((x) => x.status === "Activo").length;
    if (tab === "Membresias") return app.data.memberships.filter((x) => x.status === "Activa").length;
    if (tab === "Maquinas") return app.data.machines.filter((x) => x.status === "Disponible").length;
    if (tab === "Mantenimientos") return app.data.maintenance.filter((x) => x.status === "En proceso").length;
    return app.data.branches.filter((x) => x.status === "Activa").length;
  }

  function alertCountFor(tab) {
    if (tab === "Maquinas") return upcomingMaintenance(app.data.machines).length;
    if (tab === "Reservas") return app.data.reservations.filter((x) => ["Cancelada", "No asistio", "Rechazada"].includes(x.status)).length;
    return app.data.maintenance.filter((x) => ["Programado", "En proceso"].includes(x.status)).length;
  }

  function relatedCountFor(tab) {
    if (tab === "Sucursales") return app.data.areas.length + app.data.machines.length;
    if (tab === "Clientes") return app.data.reservations.length + app.data.payments.length;
    return app.data.schedules.length;
  }

  function paymentReportTable(payments) {
    return `<section class="panel mt-5 overflow-hidden"><div class="section-head p-5"><div><h2>Detalle de pagos</h2><p>${payments.length} registros filtrados.</p></div></div><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Sucursal</th><th>Cliente</th><th>Plan</th><th>Metodo</th><th>Monto</th><th>Estado</th></tr></thead><tbody>${payments.map((payment) => `<tr><td>${payment.date}</td><td>${branchName(payment.branchId)}</td><td>${clientName(payment.clientId)}</td><td>${planName(payment.planId)}</td><td>${esc(payment.method)}</td><td>Q${payment.amount}</td><td>${badge(payment.status)}</td></tr>`).join("") || `<tr><td colspan="7" class="empty">Sin pagos para los filtros seleccionados.</td></tr>`}</tbody></table></div></section>`;
  }

  function showModal(title, body) {
    $("#modalRoot").classList.remove("hidden");
    $("#modalRoot").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true"><div class="section-head"><h2>${esc(title)}</h2>${button(icon("x"), "close-modal", "icon-only", `title="Cerrar"`)}</div><div class="mt-5">${body}</div></section></div>`;
    window.lucide?.createIcons();
  }

  function reservationForm() {
    const clientOptions = app.user.role === "client" ? app.data.clients.filter((client) => client.id === app.user.clientId) : app.data.clients;
    showModal("Nueva reserva", `<form id="reservationForm" class="grid gap-4" novalidate><label class="form-field"><span>Cliente</span><select id="reservationClient" class="form-control">${options(clientOptions.map((client) => ({ value: client.id, label: client.name })))}</select></label><label class="form-field"><span>Horario</span><select id="reservationSchedule" class="form-control">${options(app.data.schedules.map((schedule) => ({ value: schedule.id, label: `${schedule.date} ${schedule.start}-${schedule.end} / ${areaName(schedule.areaId)} / ${branchName(schedule.branchId)}` })))}</select></label><label class="form-field"><span>Maquina opcional</span><select id="reservationMachine" class="form-control"><option value="">Reservar area completa</option>${app.data.machines.map((machine) => `<option value="${machine.id}">${esc(machine.code)} / ${esc(machine.name)} / ${esc(areaName(machine.areaId))}</option>`).join("")}</select></label><div id="reservationPreview" class="info-box"></div><button class="btn btn-primary" type="submit">Confirmar reserva ${icon("check")}</button></form>`);
    updateReservationPreview();
  }

  function branchForm(branch = {}) {
    const employees = app.data.employees || [];
    const selectedManager = employees.some((employee) => employee.name === branch.manager) ? branch.manager : employees[0]?.name || branch.manager || "";
    const managerOptions = employees.map((employee) => ({ value: employee.name, label: `${employee.name} / ${employee.position}` }));
    if (branch.manager && !employees.some((employee) => employee.name === branch.manager)) managerOptions.unshift({ value: branch.manager, label: `${branch.manager} / encargado actual` });
    showModal(branch.id ? "Editar sucursal" : "Nueva sucursal", `<form id="branchForm" data-id="${esc(branch.id || "")}" class="grid gap-4 md:grid-cols-2"><label class="form-field"><span>Codigo</span><input id="branchCode" class="form-control" value="${esc(branch.code || "")}" required></label><label class="form-field"><span>Nombre</span><input id="branchName" class="form-control" value="${esc(branch.name || "")}" required></label><label class="form-field md:col-span-2"><span>Direccion</span><input id="branchAddress" class="form-control" value="${esc(branch.address || "")}" required></label><label class="form-field"><span>Telefono</span><input id="branchPhone" class="form-control" value="${esc(branch.phone || "")}"></label><label class="form-field"><span>Correo</span><input id="branchEmail" class="form-control" type="email" value="${esc(branch.email || "")}"></label><label class="form-field"><span>Encargado</span><select id="branchManager" class="form-control">${options(managerOptions, selectedManager)}</select></label><label class="form-field"><span>Capacidad maxima</span><input id="branchCapacity" type="number" class="form-control" value="${esc(branch.capacity || 100)}"></label><label class="form-field"><span>Horario lunes-viernes</span><input id="branchWeekdayHours" class="form-control" value="${esc(branch.weekdayHours || "Lunes-viernes 04:00-22:00")}"></label><label class="form-field"><span>Horario sabado-domingo</span><input id="branchWeekendHours" class="form-control" value="${esc(branch.weekendHours || "Sabados y domingos 06:00-14:00")}"></label><label class="form-field"><span>Aforo esperado</span><input id="branchExpectedAttendance" class="form-control" value="${esc(branch.expectedAttendance || "75-100 personas, con expectativa de crecimiento")}"></label><label class="form-field md:col-span-2"><span>Estado</span><select id="branchStatus" class="form-control">${options(["Activa", "Inactiva", "En mantenimiento", "Cerrada temporalmente"], branch.status || "Activa")}</select></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar sucursal</button></form>`);
  }

  function clientForm(client = {}) {
    showModal(client.id ? "Editar cliente" : "Registrar cliente", `<form id="clientForm" data-id="${esc(client.id || "")}" class="grid gap-4 md:grid-cols-2" novalidate><label class="form-field"><span>Nombre</span><input id="clientName" class="form-control" value="${esc(client.name || "")}" required></label><label class="form-field"><span>Correo</span><input id="clientEmail" type="email" class="form-control" value="${esc(client.email || "")}" required></label><label class="form-field"><span>Telefono</span><input id="clientPhone" class="form-control" value="${esc(client.phone || "")}" required></label><label class="form-field"><span>Sucursal</span><select id="clientBranch" class="form-control">${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), client.branchId || "b1")}</select></label><label class="form-field"><span>Estado</span><select id="clientStatus" class="form-control">${options(["Activo", "Inactivo", "Suspendido", "Bloqueado"], client.status || "Activo")}</select></label><label class="form-field"><span>Plan</span><select id="clientPlan" class="form-control">${options(app.data.plans.map((plan) => ({ value: plan.id, label: plan.name })))}</select></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar cliente</button></form>`);
  }

  function employeeForm(employee = {}) {
    showModal(employee.id ? "Editar empleado" : "Nuevo empleado", `<form id="employeeForm" data-id="${esc(employee.id || "")}" class="grid gap-4 md:grid-cols-2" novalidate><label class="form-field"><span>Codigo</span><input id="employeeCode" class="form-control" value="${esc(employee.code || `EMP-${String(app.data.employees.length + 1).padStart(3, "0")}`)}" required></label><label class="form-field"><span>Nombre completo</span><input id="employeeName" class="form-control" value="${esc(employee.name || "")}" required></label><label class="form-field"><span>Puesto</span><select id="employeePosition" class="form-control">${options(["Recepcionista", "Coach", "Administrador", "Mantenimiento"], employee.position || "Recepcionista")}</select></label><label class="form-field"><span>Sucursal</span><select id="employeeBranch" class="form-control">${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), employee.branchId || "b1")}</select></label><label class="form-field"><span>Telefono</span><input id="employeePhone" class="form-control" value="${esc(employee.phone || "")}"></label><label class="form-field"><span>Correo</span><input id="employeeEmail" type="email" class="form-control" value="${esc(employee.email || "")}"></label><label class="form-field"><span>Fecha de contratacion</span><input id="employeeHired" type="date" class="form-control" value="${esc(employee.hiredAt || today)}"></label><label class="form-field"><span>Salario base</span><input id="employeeSalary" type="number" class="form-control" value="${esc(employee.baseSalary || 3600)}"></label><label class="form-field"><span>Bonificacion posible</span><input id="employeeBonus" type="number" class="form-control" value="${esc(employee.bonus || 500)}"></label><label class="form-field"><span>Estado</span><select id="employeeStatus" class="form-control">${options(["Activo", "Inactivo", "Suspendido", "Vacaciones"], employee.status || "Activo")}</select></label><label class="form-field md:col-span-2"><span>Horario laboral</span><input id="employeeSchedule" class="form-control" value="${esc(employee.workSchedule || "Lun-Vie 08:00-16:00")}"></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar empleado</button></form>`);
  }

  function purchaseOrderForm(order = {}) {
    const first = order.items?.[0] || {};
    showModal(order.id ? "Editar orden de compra" : "Nueva orden de compra", `<form id="purchaseOrderForm" data-id="${esc(order.id || "")}" class="grid gap-4 md:grid-cols-2" novalidate><label class="form-field"><span>Numero de orden</span><input id="poNumberInput" class="form-control" value="${esc(order.number || `OC-2026-${String(app.data.purchaseOrders.length + 1).padStart(3, "0")}`)}" required></label><label class="form-field"><span>Fecha</span><input id="poDateInput" type="date" class="form-control" value="${esc(order.date || today)}"></label><label class="form-field"><span>Sucursal solicitante</span><select id="poBranchInput" class="form-control">${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), order.branchId || "b1")}</select></label><label class="form-field"><span>Empleado solicitante</span><select id="poRequesterInput" class="form-control">${options(app.data.employees.map((employee) => ({ value: employee.id, label: `${employee.name} / ${employee.position}` })), order.requesterId || app.data.employees[0]?.id)}</select></label><label class="form-field"><span>Proveedor</span><input id="poSupplierInput" class="form-control" value="${esc(order.supplier || "Proveedor demo")}"></label><label class="form-field"><span>Tipo de compra</span><select id="poTypeInput" class="form-control">${options(["Nueva maquina", "Repuesto", "Accesorio", "Equipo de oficina", "Insumo", "Otro"], order.purchaseType || "Nueva maquina")}</select></label><label class="form-field"><span>Articulo principal</span><input id="poItemName" class="form-control" value="${esc(first.name || "")}" required></label><label class="form-field"><span>Cantidad</span><input id="poItemQty" type="number" class="form-control" value="${esc(first.quantity || 1)}"></label><label class="form-field"><span>Precio unitario</span><input id="poItemPrice" type="number" class="form-control" value="${esc(first.unitPrice || 1000)}"></label><label class="form-field"><span>Impuesto</span><input id="poTaxRate" type="number" step="0.01" class="form-control" value="${esc(order.taxRate ?? 0.12)}"></label><label class="form-field"><span>Entrega esperada</span><input id="poExpectedInput" type="date" class="form-control" value="${esc(order.expectedDelivery || "2026-09-30")}"></label><label class="form-field"><span>Estado</span><select id="poStatusInput" class="form-control">${options(["Borrador", "Solicitada", "En revision", "Aprobada", "Rechazada", "Ordenada", "Recibida", "Cancelada"], order.status || "Borrador")}</select></label><label class="form-field md:col-span-2"><span>Motivo de compra</span><textarea id="poReasonInput" class="form-control" rows="2">${esc(order.reason || "")}</textarea></label><label class="form-field md:col-span-2"><span>Observaciones</span><textarea id="poObsInput" class="form-control" rows="2">${esc(order.observations || "")}</textarea></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar orden de compra</button></form>`);
  }

  function receivePurchaseOrderForm(order) {
    showModal("Recepcion de equipo", `<form id="receivePurchaseOrderForm" data-id="${esc(order.id)}" class="grid gap-4 md:grid-cols-2"><div class="info-box md:col-span-2"><b>${esc(order.number)} / ${esc(order.purchaseType)}</b><span>${esc(order.items.map((item) => `${item.quantity} x ${item.name}`).join(", "))}</span></div>${order.items.map((item, index) => `<label class="form-field"><span>${esc(item.name)} solicitado</span><input class="form-control" value="${item.quantity}" disabled></label><label class="form-field"><span>Cantidad recibida</span><input id="receiveQty${index}" type="number" class="form-control" value="${item.quantity}"></label>`).join("")}<label class="form-field"><span>Fecha de recepcion</span><input id="receiveDate" type="date" class="form-control" value="${today}"></label><label class="form-field"><span>Entrega</span><select id="receiveComplete" class="form-control">${options(["Completa", "Parcial"], "Completa")}</select></label><label class="form-field md:col-span-2"><span>Incorporar equipos al inventario</span><select id="receiveInventory" class="form-control">${options([{ value: "si", label: "Si, despues de confirmar" }, { value: "no", label: "No" }], "si")}</select></label><label class="form-field md:col-span-2"><span>Observaciones</span><textarea id="receiveObs" class="form-control" rows="3">Entrega revisada por administracion.</textarea></label><button class="btn btn-primary md:col-span-2" type="submit">Confirmar recepcion</button></form>`);
  }

  function areaForm(area = {}) {
    const [opens = "06:00", closes = "21:00"] = String(area.schedule || "06:00-21:00").split("-");
    showModal(area.id ? "Editar area" : "Nueva area", `<form id="areaForm" data-id="${esc(area.id || "")}" class="grid gap-4 md:grid-cols-2"><label class="form-field"><span>Nombre</span><input id="areaName" class="form-control" value="${esc(area.name || "")}" required></label><label class="form-field"><span>Sucursal</span><select id="areaBranch" class="form-control">${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), area.branchId || "b1")}</select></label><label class="form-field md:col-span-2"><span>Descripcion</span><textarea id="areaDescription" class="form-control" rows="3">${esc(area.description || "")}</textarea></label><label class="form-field"><span>Capacidad maxima</span><input id="areaCapacity" type="number" class="form-control" value="${esc(area.capacity || 10)}"></label><label class="form-field"><span>Estado</span><select id="areaStatus" class="form-control">${options(["Disponible", "Capacidad limitada", "Completa", "Cerrada", "En mantenimiento"], area.status || "Disponible")}</select></label><label class="form-field"><span>Apertura</span><input id="areaOpens" type="time" class="form-control" value="${esc(opens)}"></label><label class="form-field"><span>Cierre</span><input id="areaCloses" type="time" class="form-control" value="${esc(closes)}"></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar area</button></form>`);
  }

  function machineForm(machine = {}) {
    showModal(machine.id ? "Editar maquina" : "Nueva maquina", `<form id="machineForm" data-id="${esc(machine.id || "")}" class="grid gap-4 md:grid-cols-2"><label class="form-field"><span>Codigo</span><input id="machineCode" class="form-control" value="${esc(machine.code || "")}" required></label><label class="form-field"><span>Nombre</span><input id="machineName" class="form-control" value="${esc(machine.name || "")}" required></label><label class="form-field"><span>Tipo</span><input id="machineType" class="form-control" value="${esc(machine.type || "")}" required></label><label class="form-field"><span>Area</span><select id="machineArea" class="form-control">${options(app.data.areas.map((area) => ({ value: area.id, label: `${area.name} / ${branchName(area.branchId)}` })), machine.areaId || "a1")}</select></label><label class="form-field"><span>Marca</span><input id="machineBrand" class="form-control" value="${esc(machine.brand || "")}"></label><label class="form-field"><span>Modelo</span><input id="machineModel" class="form-control" value="${esc(machine.model || "")}"></label><label class="form-field"><span>Capacidad simultanea</span><input id="machineCapacity" type="number" class="form-control" value="${esc(machine.simultaneousCapacity || 1)}"></label><label class="form-field"><span>Estado</span><select id="machineStatus" class="form-control">${options(["Disponible", "Reservada", "En uso", "En mantenimiento", "Fuera de servicio"], machine.status || "Disponible")}</select></label><label class="form-field"><span>Ultimo mantenimiento</span><input id="machineLast" type="date" class="form-control" value="${esc(machine.lastMaintenance || "2026-09-01")}"></label><label class="form-field"><span>Proximo mantenimiento</span><input id="machineNext" type="date" class="form-control" value="${esc(machine.nextMaintenance || "2026-10-01")}"></label><label class="form-field md:col-span-2"><span>Observaciones</span><textarea id="machineNotes" class="form-control" rows="2">${esc(machine.notes || "")}</textarea></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar maquina</button></form>`);
  }

  function maintenanceForm(item = {}) {
    showModal(item.id ? "Editar mantenimiento" : "Registrar mantenimiento", `<form id="maintenanceForm" data-id="${esc(item.id || "")}" class="grid gap-4 md:grid-cols-2"><label class="form-field"><span>Maquina</span><select id="maintenanceMachine" class="form-control">${options(app.data.machines.map((machine) => ({ value: machine.id, label: `${machine.code} / ${machine.name}` })), item.machineId || "")}</select></label><label class="form-field"><span>Tipo</span><select id="maintenanceType" class="form-control">${options(["Preventivo", "Correctivo", "Calibracion"], item.type || "Preventivo")}</select></label><label class="form-field"><span>Inicio</span><input id="maintenanceStart" type="date" class="form-control" value="${esc(item.startDate || today)}"></label><label class="form-field"><span>Fin estimado</span><input id="maintenanceEnd" type="date" class="form-control" value="${esc(item.estimatedEnd || "2026-09-12")}"></label><label class="form-field"><span>Tecnico</span><input id="maintenanceTech" class="form-control" value="${esc(item.technician || "TecnoFit")}"></label><label class="form-field"><span>Costo</span><input id="maintenanceCost" type="number" class="form-control" value="${esc(item.cost || 350)}"></label><label class="form-field md:col-span-2"><span>Descripcion</span><textarea id="maintenanceDesc" class="form-control" rows="3">${esc(item.description || "Revision general y lubricacion.")}</textarea></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar mantenimiento</button></form>`);
  }

  function finishMaintenanceForm(item) {
    showModal("Finalizar mantenimiento", `<form id="finishMaintenanceForm" data-id="${esc(item.id)}" class="grid gap-4"><label class="form-field"><span>Fecha de finalizacion</span><input id="finishDate" type="date" class="form-control" value="${today}"></label><label class="form-field"><span>Costo final</span><input id="finishCost" type="number" class="form-control" value="${esc(item.cost)}"></label><label class="form-field"><span>Resultado</span><textarea id="finishResult" class="form-control" rows="3" required>Equipo probado y operativo.</textarea></label><button class="btn btn-primary" type="submit">Finalizar y liberar maquina</button></form>`);
  }

  function paymentForm() {
    showModal("Registrar pago", `<form id="paymentForm" class="grid gap-4 md:grid-cols-2"><label class="form-field"><span>Cliente</span><select id="paymentClient" class="form-control">${options(app.data.clients.map((client) => ({ value: client.id, label: client.name })))}</select></label><label class="form-field"><span>Sucursal</span><select id="paymentBranch" class="form-control">${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })))}</select></label><label class="form-field"><span>Plan</span><select id="paymentPlan" class="form-control">${options(app.data.plans.map((plan) => ({ value: plan.id, label: `${plan.name} / Q${plan.price}` })))}</select></label><label class="form-field"><span>Monto</span><input id="paymentAmount" type="number" class="form-control" value="320"></label><label class="form-field"><span>Fecha</span><input id="paymentDate" type="date" class="form-control" value="${today}"></label><label class="form-field"><span>Metodo</span><select id="paymentMethod" class="form-control">${options(["Efectivo", "Tarjeta", "Transferencia"])}</select></label><label class="form-field"><span>Comprobante</span><input id="paymentReceipt" class="form-control" value="FAC-${Math.floor(Math.random() * 9000) + 1000}"></label><label class="form-field"><span>Estado</span><select id="paymentStatus" class="form-control">${options(["Pendiente", "Pagado", "Rechazado", "Anulado"], "Pagado")}</select></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar pago</button></form>`);
  }

  function updateReservationPreview() {
    const scheduleId = $("#reservationSchedule")?.value;
    if (!scheduleId) return;
    const schedule = byId("schedules", scheduleId);
    const machineId = $("#reservationMachine")?.value || "";
    const spaces = window.GymRules.availability(app.data, scheduleId, machineId);
    const validation = window.GymRules.validateReservation(app.data, { clientId: $("#reservationClient")?.value, scheduleId, machineId });
    $("#reservationPreview").innerHTML = `<b>${areaName(schedule.areaId)} / ${branchName(schedule.branchId)} / ${schedule.date} ${schedule.start}-${schedule.end}</b><span>${spaces.available} cupos disponibles de ${spaces.total}. Ocupacion ${spaces.percent}%.</span><small class="${validation.ok ? "text-emerald-700" : "text-red-700"}">${esc(validation.reason)}</small>`;
  }

  function handleSubmit(event) {
    const form = event.target;
    const managed = ["reservationForm", "branchForm", "clientForm", "employeeForm", "areaForm", "machineForm", "maintenanceForm", "finishMaintenanceForm", "paymentForm", "purchaseOrderForm", "receivePurchaseOrderForm"];
    if (!managed.includes(form.id)) return;
    event.preventDefault();
    if (form.id === "reservationForm") return submitReservation();
    if (form.id === "branchForm") return submitBranch(form);
    if (form.id === "clientForm") return submitClient(form);
    if (form.id === "employeeForm") return submitEmployee(form);
    if (form.id === "areaForm") return submitArea(form);
    if (form.id === "machineForm") return submitMachine(form);
    if (form.id === "maintenanceForm") return submitMaintenance(form);
    if (form.id === "finishMaintenanceForm") return submitFinishMaintenance(form);
    if (form.id === "paymentForm") return submitPayment();
    if (form.id === "purchaseOrderForm") return submitPurchaseOrder(form);
    if (form.id === "receivePurchaseOrderForm") return submitReceivePurchaseOrder(form);
  }

  function submitReservation() {
    const result = window.GymReservations.create(app.data, { clientId: $("#reservationClient").value, scheduleId: $("#reservationSchedule").value, machineId: $("#reservationMachine").value, status: "Confirmada" }, app.user);
    if (!result.ok) return toast(result.reason, "error");
    save(); closeModal(); render(); toast("Reserva creada y cupos actualizados.");
  }

  function submitBranch(form) {
    const code = $("#branchCode").value.trim();
    if (!code || !$("#branchName").value.trim()) return toast("Codigo y nombre son obligatorios.", "error");
    if (app.data.branches.some((branch) => branch.code.toLowerCase() === code.toLowerCase() && branch.id !== form.dataset.id)) return toast("El codigo de sucursal ya existe.", "error");
    const branch = form.dataset.id ? byId("branches", form.dataset.id) : { id: uid("b") };
    Object.assign(branch, { code, name: $("#branchName").value.trim(), address: $("#branchAddress").value.trim(), phone: $("#branchPhone").value.trim(), email: $("#branchEmail").value.trim(), manager: $("#branchManager").value, opens: "04:00", closes: "22:00", weekdayHours: $("#branchWeekdayHours").value.trim(), weekendHours: $("#branchWeekendHours").value.trim(), expectedAttendance: $("#branchExpectedAttendance").value.trim(), capacity: Number($("#branchCapacity").value), status: $("#branchStatus").value });
    if (!form.dataset.id) app.data.branches.unshift(branch);
    window.GymReservations.audit(app.data, app.user, "Sucursales", form.dataset.id ? "Editar sucursal" : "Crear sucursal", branch.name);
    save(); closeModal(); render(); toast("Sucursal guardada.");
  }

  function submitClient(form) {
    const id = form.dataset.id;
    const client = id ? byId("clients", id) : { id: uid("c"), membershipId: uid("m"), currentAreaId: "" };
    Object.assign(client, { code: client.code || `CLI-${String(app.data.clients.length + 1).padStart(3, "0")}`, joinedAt: client.joinedAt || today, name: $("#clientName").value.trim(), email: $("#clientEmail").value.trim(), phone: $("#clientPhone").value.trim(), branchId: $("#clientBranch").value, status: $("#clientStatus").value, observations: client.observations || "Sin observaciones registradas." });
    if (!client.name || !client.email) return toast("Nombre y correo son obligatorios.", "error");
    if (!id) {
      app.data.clients.unshift(client);
      app.data.memberships.unshift({ id: client.membershipId, clientId: client.id, planId: $("#clientPlan").value, startDate: today, endDate: "2026-10-09", status: "Activa" });
    }
    window.GymReservations.audit(app.data, app.user, "Clientes", id ? "Editar cliente" : "Registrar cliente", client.name);
    save(); closeModal(); render(); toast("Cliente guardado.");
  }

  function submitEmployee(form) {
    const id = form.dataset.id;
    const code = $("#employeeCode").value.trim();
    if (!code || !$("#employeeName").value.trim()) return toast("Codigo y nombre son obligatorios.", "error");
    if (app.data.employees.some((employee) => employee.code.toLowerCase() === code.toLowerCase() && employee.id !== id)) return toast("El codigo de empleado ya existe.", "error");
    const employee = id ? byId("employees", id) : { id: uid("e") };
    Object.assign(employee, { code, name: $("#employeeName").value.trim(), position: $("#employeePosition").value, branchId: $("#employeeBranch").value, phone: $("#employeePhone").value.trim(), email: $("#employeeEmail").value.trim(), hiredAt: $("#employeeHired").value, baseSalary: Number($("#employeeSalary").value), bonus: Number($("#employeeBonus").value), workSchedule: $("#employeeSchedule").value.trim(), status: $("#employeeStatus").value });
    if (!id) app.data.employees.unshift(employee);
    if (["Coach", "Recepcionista"].includes(employee.position) && !metricRecord(employee.id)) {
      app.data.staffMetrics.unshift({ employeeId: employee.id, period: "2026-09", metrics: employee.position === "Coach" ? [{ label: "Sesiones impartidas", goal: 45, result: 0, unit: "sesiones" }, { label: "Asistencia o satisfaccion", goal: 90, result: 0, unit: "%" }] : [{ label: "Membresias o renovaciones gestionadas", goal: 35, result: 0, unit: "gestiones" }, { label: "Pagos o clientes atendidos", goal: 100, result: 0, unit: "atenciones" }], assignedClasses: employee.position === "Coach" ? "Por asignar" : "No aplica", clientsServed: 0, absences: 0, rating: 0 });
    }
    window.GymReservations.audit(app.data, app.user, "Empleados", id ? "Editar empleado" : "Crear empleado", employee.name);
    save(); closeModal(); render(); toast("Empleado guardado.");
  }

  function submitArea(form) {
    const area = form.dataset.id ? byId("areas", form.dataset.id) : { id: uid("a") };
    Object.assign(area, { name: $("#areaName").value.trim(), branchId: $("#areaBranch").value, description: $("#areaDescription").value.trim(), capacity: Number($("#areaCapacity").value), schedule: `${$("#areaOpens").value}-${$("#areaCloses").value}`, status: $("#areaStatus").value });
    if (!area.name) return toast("El nombre del area es obligatorio.", "error");
    if (!form.dataset.id) app.data.areas.unshift(area);
    window.GymReservations.audit(app.data, app.user, "Areas", form.dataset.id ? "Editar area" : "Crear area", area.name);
    save(); closeModal(); render(); toast("Area guardada.");
  }

  function submitMachine(form) {
    const code = $("#machineCode").value.trim();
    if (app.data.machines.some((machine) => machine.code.toLowerCase() === code.toLowerCase() && machine.id !== form.dataset.id)) return toast("El codigo de maquina ya existe.", "error");
    const machine = form.dataset.id ? byId("machines", form.dataset.id) : { id: uid("ma"), acquiredAt: today };
    Object.assign(machine, { code, name: $("#machineName").value.trim(), type: $("#machineType").value.trim(), areaId: $("#machineArea").value, brand: $("#machineBrand").value.trim(), model: $("#machineModel").value.trim(), simultaneousCapacity: Number($("#machineCapacity").value), lastMaintenance: $("#machineLast").value, nextMaintenance: $("#machineNext").value, notes: $("#machineNotes").value.trim(), status: $("#machineStatus").value });
    if (!machine.code || !machine.name) return toast("Codigo y nombre son obligatorios.", "error");
    if (!form.dataset.id) app.data.machines.unshift(machine);
    window.GymReservations.audit(app.data, app.user, "Maquinas", form.dataset.id ? "Editar maquina" : "Crear maquina", machine.code);
    save(); closeModal(); render(); toast("Maquina guardada.");
  }

  function submitMaintenance(form) {
    const item = form.dataset.id ? byId("maintenance", form.dataset.id) : { id: uid("mt"), status: "Programado", result: "" };
    Object.assign(item, { machineId: $("#maintenanceMachine").value, type: $("#maintenanceType").value, startDate: $("#maintenanceStart").value, estimatedEnd: $("#maintenanceEnd").value, technician: $("#maintenanceTech").value, cost: Number($("#maintenanceCost").value), description: $("#maintenanceDesc").value });
    if (!form.dataset.id) app.data.maintenance.unshift(item);
    window.GymReservations.audit(app.data, app.user, "Mantenimiento", form.dataset.id ? "Editar mantenimiento" : "Registrar mantenimiento", machineName(item.machineId));
    save(); closeModal(); render(); toast("Mantenimiento guardado.");
  }

  function submitFinishMaintenance(form) {
    const item = byId("maintenance", form.dataset.id);
    if (!item || ["Finalizado", "Cancelado"].includes(item.status)) return toast("Este mantenimiento no se puede finalizar.", "error");
    const machine = byId("machines", item.machineId);
    item.status = "Finalizado";
    item.finishedAt = $("#finishDate").value;
    item.finalCost = Number($("#finishCost").value);
    item.result = $("#finishResult").value.trim();
    machine.status = "Disponible";
    machine.lastMaintenance = item.finishedAt;
    save(); closeModal(); render(); toast("Mantenimiento finalizado y maquina disponible.");
  }

  function submitPayment() {
    app.data.payments.unshift({ id: uid("pay"), clientId: $("#paymentClient").value, branchId: $("#paymentBranch").value, planId: $("#paymentPlan").value, amount: Number($("#paymentAmount").value), date: $("#paymentDate").value, method: $("#paymentMethod").value, receipt: $("#paymentReceipt").value, status: $("#paymentStatus").value });
    window.GymReservations.audit(app.data, app.user, "Pagos", "Registrar pago", $("#paymentReceipt").value);
    save(); closeModal(); render(); toast("Pago registrado.");
  }

  function submitPurchaseOrder(form) {
    const id = form.dataset.id;
    const number = $("#poNumberInput").value.trim();
    if (!number || !$("#poItemName").value.trim()) return toast("Numero de orden y articulo son obligatorios.", "error");
    if (app.data.purchaseOrders.some((order) => order.number.toLowerCase() === number.toLowerCase() && order.id !== id)) return toast("El numero de orden ya existe.", "error");
    const order = id ? byId("purchaseOrders", id) : { id: uid("po"), reception: null };
    Object.assign(order, { number, date: $("#poDateInput").value, branchId: $("#poBranchInput").value, requesterId: $("#poRequesterInput").value, supplier: $("#poSupplierInput").value.trim(), purchaseType: $("#poTypeInput").value, items: [{ name: $("#poItemName").value.trim(), quantity: Number($("#poItemQty").value), unitPrice: Number($("#poItemPrice").value) }], taxRate: Number($("#poTaxRate").value), reason: $("#poReasonInput").value.trim(), expectedDelivery: $("#poExpectedInput").value, observations: $("#poObsInput").value.trim(), status: $("#poStatusInput").value });
    if (!id) app.data.purchaseOrders.unshift(order);
    window.GymReservations.audit(app.data, app.user, "Ordenes de compra", id ? "Editar orden" : "Crear orden", order.number);
    save(); closeModal(); render(); toast("Orden de compra guardada.");
  }

  function submitReceivePurchaseOrder(form) {
    const order = byId("purchaseOrders", form.dataset.id);
    const receivedItems = order.items.map((item, index) => ({ name: item.name, ordered: item.quantity, received: Number($(`#receiveQty${index}`).value) }));
    order.status = "Recibida";
    order.reception = { receivedAt: $("#receiveDate").value, complete: $("#receiveComplete").value, inventory: $("#receiveInventory").value === "si", observations: $("#receiveObs").value.trim(), items: receivedItems };
    window.GymReservations.audit(app.data, app.user, "Ordenes de compra", "Marcar como recibida", order.number);
    save(); closeModal(); render(); toast("Recepcion registrada.");
    if (order.purchaseType === "Nueva maquina" && order.reception.inventory && confirm("Continuar al formulario Registrar maquina con datos de la orden?")) {
      const area = app.data.areas.find((item) => item.branchId === order.branchId) || app.data.areas[0];
      const first = order.items[0] || {};
      machineForm({ code: `MA-${Date.now().toString().slice(-4)}`, name: first.name || "Nueva maquina", type: "Equipo", areaId: area?.id, brand: order.supplier, model: order.number, simultaneousCapacity: 1, acquiredAt: order.reception.receivedAt, lastMaintenance: order.reception.receivedAt, nextMaintenance: "2026-12-10", notes: `Origen ${order.number}. ${order.observations || ""}`, status: "Disponible" });
    }
  }

  function closeModal() {
    $("#modalRoot").classList.add("hidden");
    $("#modalRoot").innerHTML = "";
  }

  function handleAction(event) {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === "close-modal") {
      if (el.classList.contains("modal-backdrop") && event.target !== el) return;
      return closeModal();
    }
    if (action === "logout") return logout();
    if (action === "restore-demo") return restoreDemo();
    if (action === "open-reservation") return reservationForm();
    if (action === "open-branch") return branchForm(id ? byId("branches", id) : {});
    if (action === "open-client") return clientForm(id ? byId("clients", id) : {});
    if (action === "open-employee") return employeeForm(id ? byId("employees", id) : {});
    if (action === "open-area") return areaForm(id ? byId("areas", id) : {});
    if (action === "open-machine") return machineForm(id ? byId("machines", id) : {});
    if (action === "open-maintenance") return maintenanceForm(id ? byId("maintenance", id) : {});
    if (action === "open-payment") return paymentForm();
    if (action === "open-purchase-order") return purchaseOrderForm(id ? byId("purchaseOrders", id) : {});
    if (action === "go-staff-metrics") { app.view = "staffMetrics"; return render(); }
    if (action === "inventory-tab") { app.filters.inventoryTab = el.dataset.tab; return render(); }
    if (action === "report-tab") { app.filters.reportTab = el.dataset.tab; return render(); }
    if (action === "branch-detail") return branchDetail(id);
    if (action === "branch-reservations") { app.view = "reservations"; app.filters.dashboardBranch = id; return render(); }
    if (action === "toggle-branch") return toggleBranch(id);
    if (action === "client-detail") return clientDetail(id);
    if (action === "toggle-client") return toggleClient(id);
    if (action === "client-status") return setClientStatus(id, el.dataset.next);
    if (action === "employee-detail") return employeeDetail(id);
    if (action === "employee-status") return setEmployeeStatus(id, el.dataset.next);
    if (action === "area-detail") return areaDetail(id);
    if (action === "cycle-area-status") return cycleAreaStatus(id);
    if (action === "machine-detail") return machineDetail(id);
    if (action === "machine-maintenance") { app.view = "maintenance"; app.filters.maintenance = { search: byId("machines", id).code }; return render(); }
    if (action === "machine-status") return changeMachineStatus(id, el.dataset.next);
    if (action === "reservation-status" || action === "cancel-reservation") return updateReservationStatus(action, id, el.dataset.next);
    if (action === "membership-status") return updateMembershipStatus(id, el.dataset.next);
    if (action === "maintenance-detail") return maintenanceDetail(id);
    if (action === "start-maintenance") return startMaintenance(id);
    if (action === "finish-maintenance") return finishMaintenanceForm(byId("maintenance", id));
    if (action === "cancel-maintenance") return cancelMaintenance(id);
    if (action === "purchase-order-detail") return purchaseOrderDetail(id);
    if (action === "purchase-order-status") return changePurchaseOrderStatus(id, el.dataset.next);
    if (action === "receive-purchase-order") return receivePurchaseOrderForm(byId("purchaseOrders", id));
    if (action === "print-report") return window.print();
    if (action === "export-report") return exportCsv(app.data.payments, "renovatio-gym-reporte.csv");
    if (action === "download-report") return downloadReport();
  }

  function logout() {
    app.user = null;
    $("#appView").classList.add("hidden");
    $("#loginView").classList.remove("hidden");
    toast("Sesion cerrada.");
  }

  function restoreDemo() {
    if (!confirm("Restaurar los datos de demostracion? Se perderan los cambios locales.")) return;
    app.data = normalizeData(window.GymStorage.reset());
    hydrateLogin();
    if (app.user) app.user = app.data.users.find((user) => user.role === app.user.role) || app.data.users[0];
    render();
    toast("Datos demo restaurados.");
  }

  function branchDetail(id) {
    const branch = byId("branches", id);
    const areas = app.data.areas.filter((area) => area.branchId === id);
    const machines = app.data.machines.filter((machine) => areas.some((area) => area.id === machine.areaId));
    const clients = app.data.clients.filter((client) => client.branchId === id);
    const scheduleIds = app.data.schedules.filter((schedule) => schedule.branchId === id).map((schedule) => schedule.id);
    const reservations = app.data.reservations.filter((reservation) => scheduleIds.includes(reservation.scheduleId));
    const income = app.data.payments.filter((payment) => payment.branchId === id && payment.status === "Pagado").reduce((sum, payment) => sum + Number(payment.amount), 0);
    showModal("Detalle de sucursal", `<dl class="detail-grid"><div><dt>Codigo</dt><dd>${esc(branch.code)}</dd></div><div><dt>Estado</dt><dd>${badge(branch.status)}</dd></div><div><dt>Encargado</dt><dd>${esc(branch.manager)}</dd></div><div><dt>Ingresos</dt><dd>Q${income}</dd></div><div><dt>Horario lunes-viernes</dt><dd>${esc(branch.weekdayHours)}</dd></div><div><dt>Horario sabado-domingo</dt><dd>${esc(branch.weekendHours)}</dd></div><div><dt>Aforo esperado</dt><dd>${esc(branch.expectedAttendance)}</dd></div><div><dt>Capacidad</dt><dd>${branch.capacity}</dd></div><div><dt>Areas</dt><dd>${areas.length}</dd></div><div><dt>Maquinas</dt><dd>${machines.length}</dd></div><div><dt>Clientes</dt><dd>${clients.length}</dd></div><div><dt>Reservas</dt><dd>${reservations.length}</dd></div></dl>`);
  }

  function toggleBranch(id) {
    const branch = byId("branches", id);
    const related = app.data.areas.some((a) => a.branchId === id) || app.data.payments.some((p) => p.branchId === id) || app.data.schedules.some((s) => s.branchId === id);
    if (branch.status === "Activa" && related && !confirm("La sucursal tiene relaciones. No se eliminara; solo se desactivara. Continuar?")) return;
    branch.status = branch.status === "Activa" ? "Inactiva" : "Activa";
    save(); render(); toast(`Sucursal ${branch.status.toLowerCase()}.`);
  }

  function clientDetail(id) {
    const client = byId("clients", id);
    const membership = window.GymRules.membershipFor(app.data, id);
    const memberships = app.data.memberships.filter((item) => item.clientId === id || item.id === client.membershipId);
    const payments = app.data.payments.filter((payment) => payment.clientId === id);
    const reservations = app.data.reservations.filter((reservation) => reservation.clientId === id);
    const attendance = reservations.filter((reservation) => ["Completada", "No asistio"].includes(reservation.status));
    showModal("Detalle de cliente", `<dl class="detail-grid"><div><dt>Codigo</dt><dd>${esc(client.code)}</dd></div><div><dt>Nombre</dt><dd>${esc(client.name)}</dd></div><div><dt>Telefono</dt><dd>${esc(client.phone)}</dd></div><div><dt>Correo</dt><dd>${esc(client.email)}</dd></div><div><dt>Sucursal</dt><dd>${branchName(client.branchId)}</dd></div><div><dt>Inscripcion</dt><dd>${client.joinedAt}</dd></div><div><dt>Estado</dt><dd>${badge(client.status)}</dd></div><div><dt>Membresia actual</dt><dd>${membership ? `${planName(membership.planId)} / ${membership.endDate}` : "Sin membresia"}</dd></div></dl><h3 class="mt-5 font-black">Historial de membresias</h3>${simpleTable(["Plan", "Vigencia", "Estado"], memberships.map((item) => [planName(item.planId), `${item.startDate} al ${item.endDate}`, item.status]))}<h3 class="mt-5 font-black">Historial de pagos</h3>${simpleTable(["Fecha", "Comprobante", "Monto", "Estado"], payments.map((item) => [item.date, item.receipt, money(item.amount), item.status]))}<h3 class="mt-5 font-black">Reservas</h3>${reservationTable(reservations)}<h3 class="mt-5 font-black">Asistencias</h3>${simpleTable(["Horario", "Resultado"], attendance.map((item) => [`${scheduleOf(item)?.date || ""} ${scheduleOf(item)?.start || ""}`, item.status]))}<h3 class="mt-5 font-black">Observaciones</h3><p class="mt-2 text-sm text-slate-600">${esc(client.observations)}</p>`);
  }

  function toggleClient(id) {
    const client = byId("clients", id);
    client.status = client.status === "Activo" ? "Suspendido" : "Activo";
    save(); render(); toast(`Cliente ${client.status.toLowerCase()}.`);
  }

  function simpleTable(headers, rows) {
    return `<div class="table-wrap mt-3"><table><thead><tr>${headers.map((head) => `<th>${esc(head)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${headers.length}" class="empty">Sin registros.</td></tr>`}</tbody></table></div>`;
  }

  function setClientStatus(id, next) {
    const client = byId("clients", id);
    client.status = next;
    save(); render(); toast(`Cliente ${next.toLowerCase()}.`);
  }

  function employeeDetail(id) {
    const employee = byId("employees", id);
    const state = bonusState(employee);
    showModal("Detalle de empleado", `<dl class="detail-grid"><div><dt>Codigo</dt><dd>${esc(employee.code)}</dd></div><div><dt>Nombre</dt><dd>${esc(employee.name)}</dd></div><div><dt>Puesto</dt><dd>${esc(employee.position)}</dd></div><div><dt>Sucursal</dt><dd>${branchName(employee.branchId)}</dd></div><div><dt>Telefono</dt><dd>${esc(employee.phone)}</dd></div><div><dt>Correo</dt><dd>${esc(employee.email)}</dd></div><div><dt>Contratacion</dt><dd>${employee.hiredAt}</dd></div><div><dt>Estado</dt><dd>${badge(employee.status)}</dd></div><div><dt>Salario base</dt><dd>${money(employee.baseSalary)}</dd></div><div><dt>Horario</dt><dd>${esc(employee.workSchedule)}</dd></div></dl>${["Coach", "Recepcionista"].includes(employee.position) ? staffMetricDetail(employee, state) : ""}`);
  }

  function setEmployeeStatus(id, next) {
    const employee = byId("employees", id);
    employee.status = next;
    save(); render(); toast(`Empleado ${next.toLowerCase()}.`);
  }

  function purchaseOrderDetail(id) {
    const order = byId("purchaseOrders", id);
    const rows = (order.items || []).map((item) => [item.name, item.quantity, money(item.unitPrice), money(item.quantity * item.unitPrice)]);
    showModal("Detalle de orden de compra", `<dl class="detail-grid"><div><dt>Numero</dt><dd>${esc(order.number)}</dd></div><div><dt>Fecha</dt><dd>${order.date}</dd></div><div><dt>Sucursal</dt><dd>${branchName(order.branchId)}</dd></div><div><dt>Solicitante</dt><dd>${employeeName(order.requesterId)}</dd></div><div><dt>Proveedor</dt><dd>${esc(order.supplier)}</dd></div><div><dt>Tipo</dt><dd>${esc(order.purchaseType)}</dd></div><div><dt>Entrega esperada</dt><dd>${order.expectedDelivery}</dd></div><div><dt>Estado</dt><dd>${badge(order.status)}</dd></div><div><dt>Subtotal</dt><dd>${money(orderSubtotal(order))}</dd></div><div><dt>Impuestos</dt><dd>${money(orderTax(order))}</dd></div><div><dt>Total</dt><dd>${money(orderTotal(order))}</dd></div><div><dt>Motivo</dt><dd>${esc(order.reason)}</dd></div></dl><h3 class="mt-5 font-black">Articulos</h3>${simpleTable(["Articulo", "Cantidad", "Precio unitario", "Subtotal"], rows)}<h3 class="mt-5 font-black">Observaciones</h3><p class="mt-2 text-sm text-slate-600">${esc(order.observations || "Sin observaciones.")}</p>${order.reception ? `<h3 class="mt-5 font-black">Recepcion</h3><dl class="detail-grid mt-3"><div><dt>Fecha</dt><dd>${order.reception.receivedAt}</dd></div><div><dt>Entrega</dt><dd>${order.reception.complete}</dd></div><div><dt>Inventario</dt><dd>${order.reception.inventory ? "Si" : "No"}</dd></div><div><dt>Observaciones</dt><dd>${esc(order.reception.observations)}</dd></div></dl>` : ""}`);
  }

  function changePurchaseOrderStatus(id, next) {
    const order = byId("purchaseOrders", id);
    const allowed = window.GymRules.purchaseOrderFlow[order.status] || [];
    if (!allowed.includes(next)) return toast("Transicion de orden no permitida.", "error");
    order.status = next;
    window.GymReservations.audit(app.data, app.user, "Ordenes de compra", `Estado -> ${next}`, order.number);
    save(); render(); toast("Estado de orden actualizado.");
  }

  function areaDetail(id) {
    const area = byId("areas", id);
    showModal("Detalle de area", `<dl class="detail-grid"><div><dt>Nombre</dt><dd>${esc(area.name)}</dd></div><div><dt>Sucursal</dt><dd>${branchName(area.branchId)}</dd></div><div><dt>Capacidad</dt><dd>${area.capacity}</dd></div><div><dt>Horario</dt><dd>${esc(area.schedule)}</dd></div><div><dt>Estado</dt><dd>${badge(area.status)}</dd></div><div><dt>Maquinas</dt><dd>${app.data.machines.filter((machine) => machine.areaId === id).length}</dd></div></dl><p class="mt-4 text-sm text-slate-600">${esc(area.description)}</p>`);
  }

  function cycleAreaStatus(id) {
    const area = byId("areas", id);
    const states = ["Disponible", "Capacidad limitada", "Completa", "Cerrada", "En mantenimiento"];
    area.status = states[(states.indexOf(area.status) + 1) % states.length];
    save(); render(); toast("Estado del area actualizado.");
  }

  function machineDetail(id) {
    const machine = byId("machines", id);
    showModal("Detalle de maquina", `<dl class="detail-grid"><div><dt>Codigo</dt><dd>${esc(machine.code)}</dd></div><div><dt>Nombre</dt><dd>${esc(machine.name)}</dd></div><div><dt>Sucursal</dt><dd>${branchName(branchOfMachine(machine))}</dd></div><div><dt>Area</dt><dd>${areaName(machine.areaId)}</dd></div><div><dt>Marca</dt><dd>${esc(machine.brand)}</dd></div><div><dt>Modelo</dt><dd>${esc(machine.model)}</dd></div><div><dt>Capacidad</dt><dd>${machine.simultaneousCapacity}</dd></div><div><dt>Estado</dt><dd>${badge(machine.status)}</dd></div></dl>`);
  }

  function changeMachineStatus(id, next) {
    const machine = byId("machines", id);
    const allowed = window.GymRules.machineFlow[machine.status] || [];
    if (!allowed.includes(next)) return toast("Transicion de maquina no permitida.", "error");
    machine.status = next;
    if (next === "En mantenimiento") rejectFutureMachineReservations(machine.id);
    save(); render(); toast("Estado de maquina actualizado.");
  }

  function rejectFutureMachineReservations(machineId) {
    app.data.reservations.forEach((reservation) => {
      if (reservation.machineId === machineId && ["Pendiente", "Confirmada"].includes(reservation.status)) {
        reservation.status = "Rechazada";
        reservation.history.push({ status: "Rechazada", at: new Date().toLocaleString("sv-SE").slice(0, 16) });
      }
    });
  }

  function updateReservationStatus(action, id, next) {
    const result = action === "cancel-reservation" ? window.GymReservations.cancel(app.data, id, app.user) : window.GymReservations.changeStatus(app.data, id, next, app.user);
    if (!result.ok) return toast(result.reason, "error");
    save(); render(); toast("Reserva actualizada.");
  }

  function updateMembershipStatus(id, next) {
    const membership = byId("memberships", id);
    const allowed = window.GymRules.membershipFlow[membership.status] || [];
    if (!allowed.includes(next)) return toast(`Transicion invalida desde ${membership.status}.`, "error");
    membership.status = next;
    save(); render(); toast("Membresia actualizada.");
  }

  function maintenanceDetail(id) {
    const item = byId("maintenance", id);
    showModal("Detalle de mantenimiento", `<dl class="detail-grid"><div><dt>Maquina</dt><dd>${machineName(item.machineId)}</dd></div><div><dt>Tipo</dt><dd>${esc(item.type)}</dd></div><div><dt>Estado</dt><dd>${badge(item.status)}</dd></div><div><dt>Tecnico</dt><dd>${esc(item.technician)}</dd></div><div><dt>Costo</dt><dd>Q${item.finalCost || item.cost}</dd></div><div><dt>Resultado</dt><dd>${esc(item.result || "Pendiente")}</dd></div></dl><p class="mt-4 text-sm text-slate-600">${esc(item.description)}</p>`);
  }

  function startMaintenance(id) {
    const item = byId("maintenance", id);
    if (item.status !== "Programado") return toast("Solo se pueden iniciar mantenimientos programados.", "error");
    item.status = "En proceso";
    const machine = byId("machines", item.machineId);
    machine.status = "En mantenimiento";
    rejectFutureMachineReservations(machine.id);
    save(); render(); toast("Mantenimiento iniciado. Maquina bloqueada.");
  }

  function cancelMaintenance(id) {
    const item = byId("maintenance", id);
    if (!["Programado", "En proceso"].includes(item.status)) return toast("No se puede cancelar este mantenimiento.", "error");
    item.status = "Cancelado";
    save(); render(); toast("Mantenimiento cancelado.");
  }

  function exportCsv(items, filename) {
    const rows = items.map((item) => Object.values(item).map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[Object.keys(items[0] || {}).join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    toast("CSV generado.");
  }

  function downloadReport() {
    const blob = new Blob([`Renovatio Gym reporte\nGenerado: ${new Date().toLocaleString()}\nRegistros de pago: ${app.data.payments.length}`], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "renovatio-gym-reporte.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    toast("Reporte descargado.");
  }

  function handleInput(event) {
    const id = event.target.id;
    const value = event.target.value;
    const simpleMap = {
      clientFilter: ["client", null], clientStatusFilter: ["clientStatus", null],
      clientBranchFilter: ["clientBranch", null], clientMembershipFilter: ["clientMembership", null],
      employeeSearch: ["employeeSearch", null], employeeBranchFilter: ["employeeBranch", null], employeePositionFilter: ["employeePosition", null], employeeStatusFilter: ["employeeStatus", null],
      staffEmployeeSelect: ["staffEmployee", null],
      branchSearch: ["branchSearch", null], branchStatusFilter: ["branchStatus", null],
      inventoryBranch: ["inventoryBranch", null], inventorySearch: ["inventorySearch", null], inventoryType: ["inventoryType", null], inventoryState: ["inventoryState", null],
      dashboardBranch: ["dashboardBranch", null]
    };
    if (simpleMap[id]) {
      app.filters[simpleMap[id][0]] = value;
      return render();
    }
    if (["reservationClient", "reservationSchedule", "reservationMachine"].includes(id)) return updateReservationPreview();
    const maintenanceMap = { maintenanceSearch: "search", maintenanceBranch: "branch", maintenanceArea: "area", maintenanceTypeFilter: "type", maintenanceStatusFilter: "status" };
    if (maintenanceMap[id]) {
      app.filters.maintenance = app.filters.maintenance || {};
      app.filters.maintenance[maintenanceMap[id]] = value;
      return render();
    }
    const reportMap = { reportFrom: "from", reportTo: "to", reportBranch: "branch", reportMethod: "method", reportStatus: "status" };
    if (reportMap[id]) {
      app.filters.report = app.filters.report || {};
      app.filters.report[reportMap[id]] = value;
      return render();
    }
    const poMap = { poSearch: "search", poBranch: "branch", poSupplier: "supplier", poDate: "date", poStatus: "status" };
    if (poMap[id]) {
      app.filters.purchaseOrders = app.filters.purchaseOrders || {};
      app.filters.purchaseOrders[poMap[id]] = value;
      return render();
    }
  }

  function chartValuesBy(items, labels, keyFn, valueFn = () => 1) {
    return labels.map((label) => items.filter((item) => keyFn(item) === label).reduce((sum, item) => sum + valueFn(item), 0));
  }

  function renderCharts() {
    app.charts.forEach((chart) => chart.destroy());
    app.charts = [];
    if (!window.Chart) return;
    const common = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, grid: { color: "#e2e8f0" } }, x: { grid: { display: false } } } };
    const scope = dashboardScope();
    if ($("#incomeMonthChart")) app.charts.push(new Chart($("#incomeMonthChart"), { type: "line", data: { labels: ["Ene", "Jul", "Ago", "Sep"], datasets: [{ label: "Ingresos", data: [2600, 180, 500, scope.payments.filter((p) => p.status === "Pagado" && p.date.startsWith("2026-09")).reduce((s, p) => s + p.amount, 0)], borderColor: "#111827", backgroundColor: "rgba(163,230,53,.28)", fill: true, tension: .35 }] }, options: common }));
    if ($("#branchIncomeChart")) app.charts.push(new Chart($("#branchIncomeChart"), { type: "bar", data: { labels: app.data.branches.map((b) => b.name), datasets: [{ label: "Ingresos", data: app.data.branches.map((b) => app.data.payments.filter((p) => p.branchId === b.id && p.status === "Pagado").reduce((s, p) => s + p.amount, 0)), backgroundColor: "#14b8a6", borderRadius: 6 }] }, options: common }));
    if ($("#occupancyChart")) app.charts.push(new Chart($("#occupancyChart"), { type: "bar", data: { labels: scope.schedules.map((s) => `${s.start} ${areaName(s.areaId)}`), datasets: [{ label: "Ocupacion %", data: scope.schedules.map((s) => window.GymRules.availability(app.data, s.id).percent), backgroundColor: "#f97316", borderRadius: 6 }] }, options: common }));
    if ($("#reservationStateChart")) {
      const states = ["Pendiente", "Confirmada", "Completada", "Cancelada", "No asistio", "Rechazada"];
      app.charts.push(new Chart($("#reservationStateChart"), { type: "doughnut", data: { labels: states, datasets: [{ data: chartValuesBy(scope.reservations, states, (r) => r.status), backgroundColor: ["#f59e0b", "#22c55e", "#14b8a6", "#ef4444", "#64748b", "#991b1b"] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } } }));
    }
    if ($("#areaChart")) app.charts.push(new Chart($("#areaChart"), { type: "bar", data: { labels: app.data.areas.map((a) => a.name), datasets: [{ label: "Reservas", data: app.data.areas.map((area) => app.data.reservations.filter((r) => scheduleOf(r)?.areaId === area.id).length), backgroundColor: "#a3e635", borderRadius: 6 }] }, options: common }));
    if ($("#paymentMethodChart") || $("#reportMethodChart")) {
      const canvas = $("#paymentMethodChart") || $("#reportMethodChart");
      const methods = ["Efectivo", "Tarjeta", "Transferencia"];
      app.charts.push(new Chart(canvas, { type: "doughnut", data: { labels: methods, datasets: [{ data: methods.map((m) => app.data.payments.filter((p) => p.method === m && p.status === "Pagado").reduce((s, p) => s + p.amount, 0)), backgroundColor: ["#22c55e", "#38bdf8", "#f97316"] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } } }));
    }
    if ($("#reportBranchIncomeChart")) app.charts.push(new Chart($("#reportBranchIncomeChart"), { type: "bar", data: { labels: app.data.branches.map((b) => b.name), datasets: [{ label: "Q", data: app.data.branches.map((b) => app.data.payments.filter((p) => p.branchId === b.id && p.status === "Pagado").reduce((s, p) => s + p.amount, 0)), backgroundColor: "#111827", borderRadius: 6 }] }, options: common }));
    if ($("#genericStateChart")) {
      const labels = ["Activo", "Activa", "Disponible", "En proceso", "Cancelada", "Vencida"];
      app.charts.push(new Chart($("#genericStateChart"), { type: "bar", data: { labels, datasets: [{ label: "Registros", data: labels.map((label) => JSON.stringify(app.data).split(label).length - 1), backgroundColor: "#14b8a6", borderRadius: 6 }] }, options: common }));
    }
    if ($("#genericBranchChart")) app.charts.push(new Chart($("#genericBranchChart"), { type: "bar", data: { labels: app.data.branches.map((b) => b.name), datasets: [{ label: "Clientes", data: app.data.branches.map((b) => app.data.clients.filter((c) => c.branchId === b.id).length), backgroundColor: "#f97316", borderRadius: 6 }] }, options: common }));
  }

  function hydrateLogin() {
    $("#loginUser").innerHTML = app.data.users.map((user) => `<option value="${user.id}">${esc(user.name)} / ${esc(roles[user.role].label)}</option>`).join("");
    $("#roleSwitcher").innerHTML = Object.entries(roles).map(([key, role]) => `<option value="${key}">${esc(role.label)}</option>`).join("");
  }

  function login(event) {
    event.preventDefault();
    const user = byId("users", $("#loginUser").value);
    if (!user || $("#loginPassword").value !== PASSWORD) return toast("Credenciales invalidas.", "error");
    app.user = user;
    app.view = "dashboard";
    $("#loginView").classList.add("hidden");
    $("#appView").classList.remove("hidden");
    render();
    toast(`Sesion iniciada como ${roles[user.role].label}.`);
  }

  document.addEventListener("DOMContentLoaded", () => {
    app.data = normalizeData(window.GymStorage.load());
    save();
    hydrateLogin();
    $("#loginForm").addEventListener("submit", login);
    $("#mobileMenuButton").addEventListener("click", () => $("#mobileNav").classList.toggle("hidden"));
    $("#roleSwitcher").addEventListener("change", (event) => {
      app.user = app.data.users.find((user) => user.role === event.target.value) || app.user;
      render();
      toast(`Rol cambiado a ${roles[app.user.role].label}.`);
    });
    document.addEventListener("click", (event) => {
      const section = event.target.closest("[data-section]");
      if (section) {
        app.view = section.dataset.section;
        $("#mobileNav").classList.add("hidden");
        render();
        return;
      }
      handleAction(event);
    });
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleInput);
    window.lucide?.createIcons();
  });
})();
