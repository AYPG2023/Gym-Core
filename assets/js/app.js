(function () {
  "use strict";

  const PASSWORD = "Gym2026!";
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const today = "2026-09-10";

  const roles = {
    admin: { label: "Administrador", permissions: ["all"] },
    reception: { label: "Recepcionista", permissions: ["dashboard", "clients", "memberships", "schedules", "reservations", "payments", "reports"] },
    trainer: { label: "Entrenador", permissions: ["dashboard", "schedules", "reservations", "reports"] },
    client: { label: "Cliente", permissions: ["dashboard", "inventory", "schedules", "reservations", "memberships"] }
  };

  const nav = [
    ["dashboard", "layout-dashboard", "Dashboard", "dashboard"],
    ["branches", "building-2", "Sucursales", "branches"],
    ["clients", "users-round", "Clientes", "clients"],
    ["memberships", "badge-dollar-sign", "Membresias", "memberships"],
    ["inventory", "warehouse", "Areas y maquinas", "inventory"],
    ["schedules", "calendar-days", "Horarios", "schedules"],
    ["reservations", "clipboard-check", "Reservas", "reservations"],
    ["maintenance", "wrench", "Mantenimiento", "maintenance"],
    ["payments", "credit-card", "Pagos", "payments"],
    ["reports", "chart-no-axes-combined", "Reportes", "reports"]
  ];

  const app = { data: null, user: null, view: "dashboard", filters: { inventoryTab: "areas", reportTab: "Ingresos" }, charts: [] };

  function normalizeData(data) {
    data.branches.forEach((branch, index) => {
      branch.code ||= index === 0 ? "Z10" : `SUC-${index + 1}`;
      branch.phone ||= "2400-0000";
      branch.email ||= `${branch.code.toLowerCase()}@gym.test`;
      branch.manager ||= "Encargado pendiente";
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
    return `<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p class="eyebrow">GymCore / ${esc(roles[app.user.role].label)}</p><h1 class="page-title">${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div><div class="flex flex-wrap gap-2">${actions}</div></div>`;
  }

  function byId(collection, id) { return window.GymRules.byId(app.data, collection, id); }
  function clientName(id) { return byId("clients", id)?.name || "Sin cliente"; }
  function areaName(id) { return byId("areas", id)?.name || "Sin area"; }
  function branchName(id) { return byId("branches", id)?.name || "Sin sucursal"; }
  function trainerName(id) { return byId("trainers", id)?.name || "Sin entrenador"; }
  function machineName(id) { return id ? byId("machines", id)?.name || "Maquina" : "Area completa"; }
  function planName(id) { return byId("plans", id)?.name || "Plan"; }
  function branchOfMachine(machine) { return byId("areas", machine.areaId)?.branchId || ""; }
  function scheduleOf(reservation) { return byId("schedules", reservation.scheduleId); }

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
    const views = { dashboard, branches, clients, memberships, inventory, schedules, reservations, maintenance, payments, reports };
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

    return page("Dashboard", "Indicadores por sucursal, ingresos, ocupacion, reservas y mantenimiento.", button(`${icon("plus")} Nueva reserva`, "open-reservation", "primary")) +
      `<section class="panel mb-5 p-5"><label class="form-field mt-0 max-w-sm"><span>Sucursal global</span><select id="dashboardBranch" class="form-control"><option value="all">Todas las sucursales</option>${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), scope.branchId)}</select></label></section>
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        ${metric("Ingresos del dia", `Q${dayIncome}`, today, "wallet", "blue")}
        ${metric("Ingresos del mes", `Q${monthIncome}`, "septiembre 2026", "landmark", "blue")}
        ${metric("Clientes activos", activeClients, "filtrados por sucursal", "users-round", "green")}
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
    return `<article class="panel p-5 area-card"><div class="section-head"><div><h2>${esc(branch.code)} / ${esc(branch.name)}</h2><p>${esc(branch.address)}</p></div>${badge(branch.status)}</div><dl class="detail-grid mt-4"><div><dt>Encargado</dt><dd>${esc(branch.manager)}</dd></div><div><dt>Contacto</dt><dd>${esc(branch.phone)}</dd></div><div><dt>Horario</dt><dd>${branch.opens}-${branch.closes}</dd></div><div><dt>Capacidad</dt><dd>${branch.capacity}</dd></div><div><dt>Areas</dt><dd>${areas.length}</dd></div><div><dt>Maquinas</dt><dd>${machines.length}</dd></div><div><dt>Clientes</dt><dd>${clients.length}</dd></div><div><dt>Ingresos</dt><dd>Q${income}</dd></div></dl><div class="mt-4 flex flex-wrap gap-2">${button(icon("eye"), "branch-detail", "icon-only", `data-id="${branch.id}" title="Ver detalle"`)}${button(icon("pencil"), "open-branch", "icon-only", `data-id="${branch.id}" title="Editar"`)}${button(branch.status === "Activa" ? "Desactivar" : "Activar", "toggle-branch", branch.status === "Activa" ? "warning" : "success", `data-id="${branch.id}"`)}${button("Reservas", "branch-reservations", "secondary", `data-id="${branch.id}"`)}</div></article>`;
  }

  function clients() {
    const term = String(app.filters.client || "").toLowerCase();
    const list = app.data.clients.filter((client) => Object.values(client).join(" ").toLowerCase().includes(term));
    return page("Gestion de clientes", "Registro, filtros, estados, membresias, pagos y reservas por cliente.", button(`${icon("user-plus")} Registrar cliente`, "open-client", "primary")) +
      `<section class="panel p-5"><div class="grid gap-3 md:grid-cols-[1fr_220px]"><input id="clientFilter" class="form-control" placeholder="Buscar cliente, correo o estado..." value="${esc(app.filters.client || "")}"><select id="clientStatusFilter" class="form-control"><option value="">Todos los estados</option>${options(["Activo", "Inactivo", "Suspendido", "Bloqueado"], app.filters.clientStatus || "")}</select></div></section>
      <section class="panel mt-5 overflow-hidden">${clientTable(list)}</section>`;
  }

  function clientTable(list) {
    const rows = list.filter((client) => !app.filters.clientStatus || client.status === app.filters.clientStatus).map((client) => {
      const membership = window.GymRules.membershipFor(app.data, client.id);
      const payments = app.data.payments.filter((payment) => payment.clientId === client.id).length;
      const reservations = app.data.reservations.filter((reservation) => reservation.clientId === client.id).length;
      return `<tr><td><b>${esc(client.name)}</b><small>${esc(client.email)} / ${esc(client.phone)}</small></td><td>${branchName(client.branchId)}</td><td>${membership ? badge(membership.status) : badge("Sin membresia")}</td><td>${badge(client.status)}</td><td>${payments} pagos / ${reservations} reservas</td><td><div class="row-actions">${button(icon("eye"), "client-detail", "icon-only", `data-id="${client.id}" title="Detalle"`)}${button(icon("pencil"), "open-client", "icon-only", `data-id="${client.id}" title="Editar"`)}${button(client.status === "Activo" ? "Suspender" : "Activar", "toggle-client", "secondary", `data-id="${client.id}"`)}</div></td></tr>`;
    }).join("");
    return `<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Sucursal</th><th>Membresia</th><th>Estado</th><th>Historial</th><th>Acciones</th></tr></thead><tbody>${rows || `<tr><td colspan="6" class="empty">No hay clientes con estos filtros.</td></tr>`}</tbody></table></div>`;
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
    const tab = app.filters.reportTab || "Ingresos";
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
      `<section class="panel p-5"><div class="tabs">${["Ingresos", "Sucursales", "Clientes", "Membresias", "Reservas", "Ocupacion", "Maquinas", "Mantenimientos"].map((name) => `<button class="${tab === name ? "active" : ""}" data-action="report-tab" data-tab="${name}">${name}</button>`).join("")}</div><div class="mt-4 grid gap-3 lg:grid-cols-5"><input id="reportFrom" class="form-control" type="date" value="${esc(f.from || "2026-09-01")}"><input id="reportTo" class="form-control" type="date" value="${esc(f.to || "2026-09-30")}"><select id="reportBranch" class="form-control"><option value="">Todas las sucursales</option>${options(app.data.branches.map((b) => ({ value: b.id, label: b.name })), f.branch || "")}</select><select id="reportMethod" class="form-control"><option value="">Todos los metodos</option>${options(["Efectivo", "Tarjeta", "Transferencia"], f.method || "")}</select><select id="reportStatus" class="form-control"><option value="">Todos los estados</option>${options(["Pendiente", "Pagado", "Rechazado", "Anulado", "Confirmada", "Cancelada", "En mantenimiento"], f.status || "")}</select></div></section>
      ${reportBody(tab, filteredPayments, paid)}`;
  }

  function reportBody(tab, filteredPayments, paid) {
    if (tab === "Ingresos") {
      const total = paid.reduce((sum, payment) => sum + Number(payment.amount), 0);
      const previous = app.data.payments.filter((payment) => payment.status === "Pagado" && payment.date < "2026-09-01").reduce((sum, payment) => sum + Number(payment.amount), 0);
      const diff = previous ? Math.round(((total - previous) / previous) * 100) : 100;
      return `<section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${metric("Ingresos totales", `Q${total}`, `${diff}% vs periodo anterior`, "wallet", "blue")}${metric("Cantidad de pagos", filteredPayments.length, "segun filtros", "receipt", "green")}${metric("Pendientes", filteredPayments.filter((p) => p.status === "Pendiente").length, "pagos", "clock", "yellow")}${metric("Rechazados/anulados", filteredPayments.filter((p) => ["Rechazado", "Anulado"].includes(p.status)).length, "pagos", "circle-x", "red")}</section><section class="mt-5 grid gap-5 xl:grid-cols-2"><article class="panel p-5"><h2>Ingresos por sucursal</h2><div class="chart-box"><canvas id="reportBranchIncomeChart"></canvas></div></article><article class="panel p-5"><h2>Ingresos por metodo</h2><div class="chart-box"><canvas id="reportMethodChart"></canvas></div></article></section>${paymentReportTable(filteredPayments)}`;
    }
    const cards = {
      Sucursales: app.data.branches.length,
      Clientes: app.data.clients.length,
      Membresias: app.data.memberships.length,
      Reservas: app.data.reservations.length,
      Ocupacion: `${Math.round(app.data.schedules.reduce((sum, schedule) => sum + window.GymRules.availability(app.data, schedule.id).percent, 0) / app.data.schedules.length)}%`,
      Maquinas: app.data.machines.length,
      Mantenimientos: app.data.maintenance.length
    };
    return `<section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${metric(tab, cards[tab], "resumen actual", "chart-column", "blue")}${metric("Activos", activeCountFor(tab), "registros vigentes", "check-circle-2", "green")}${metric("Alertas", alertCountFor(tab), "requieren atencion", "triangle-alert", "yellow")}${metric("Relacionados", relatedCountFor(tab), "vinculos operativos", "git-branch", "orange")}</section><section class="mt-5 grid gap-5 xl:grid-cols-2"><article class="panel p-5"><h2>${esc(tab)} por estado</h2><div class="chart-box"><canvas id="genericStateChart"></canvas></div></article><article class="panel p-5"><h2>Distribucion por sucursal</h2><div class="chart-box"><canvas id="genericBranchChart"></canvas></div></article></section>`;
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
    $("#modalRoot").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" onclick="event.stopPropagation()"><div class="section-head"><h2>${esc(title)}</h2>${button(icon("x"), "close-modal", "icon-only", `title="Cerrar"`)}</div><div class="mt-5">${body}</div></section></div>`;
    window.lucide?.createIcons();
  }

  function reservationForm() {
    const clientOptions = app.user.role === "client" ? app.data.clients.filter((client) => client.id === app.user.clientId) : app.data.clients;
    showModal("Nueva reserva", `<form id="reservationForm" class="grid gap-4" novalidate><label class="form-field"><span>Cliente</span><select id="reservationClient" class="form-control">${options(clientOptions.map((client) => ({ value: client.id, label: client.name })))}</select></label><label class="form-field"><span>Horario</span><select id="reservationSchedule" class="form-control">${options(app.data.schedules.map((schedule) => ({ value: schedule.id, label: `${schedule.date} ${schedule.start}-${schedule.end} / ${areaName(schedule.areaId)} / ${branchName(schedule.branchId)}` })))}</select></label><label class="form-field"><span>Maquina opcional</span><select id="reservationMachine" class="form-control"><option value="">Reservar area completa</option>${app.data.machines.map((machine) => `<option value="${machine.id}">${esc(machine.code)} / ${esc(machine.name)} / ${esc(areaName(machine.areaId))}</option>`).join("")}</select></label><div id="reservationPreview" class="info-box"></div><button class="btn btn-primary" type="submit">Confirmar reserva ${icon("check")}</button></form>`);
    updateReservationPreview();
  }

  function branchForm(branch = {}) {
    showModal(branch.id ? "Editar sucursal" : "Nueva sucursal", `<form id="branchForm" data-id="${esc(branch.id || "")}" class="grid gap-4 md:grid-cols-2"><label class="form-field"><span>Codigo</span><input id="branchCode" class="form-control" value="${esc(branch.code || "")}" required></label><label class="form-field"><span>Nombre</span><input id="branchName" class="form-control" value="${esc(branch.name || "")}" required></label><label class="form-field md:col-span-2"><span>Direccion</span><input id="branchAddress" class="form-control" value="${esc(branch.address || "")}" required></label><label class="form-field"><span>Telefono</span><input id="branchPhone" class="form-control" value="${esc(branch.phone || "")}"></label><label class="form-field"><span>Correo</span><input id="branchEmail" class="form-control" type="email" value="${esc(branch.email || "")}"></label><label class="form-field"><span>Encargado</span><input id="branchManager" class="form-control" value="${esc(branch.manager || "")}"></label><label class="form-field"><span>Capacidad maxima</span><input id="branchCapacity" type="number" class="form-control" value="${esc(branch.capacity || 40)}"></label><label class="form-field"><span>Apertura</span><input id="branchOpens" type="time" class="form-control" value="${esc(branch.opens || "06:00")}"></label><label class="form-field"><span>Cierre</span><input id="branchCloses" type="time" class="form-control" value="${esc(branch.closes || "21:00")}"></label><label class="form-field md:col-span-2"><span>Estado</span><select id="branchStatus" class="form-control">${options(["Activa", "Inactiva", "En mantenimiento", "Cerrada temporalmente"], branch.status || "Activa")}</select></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar sucursal</button></form>`);
  }

  function clientForm(client = {}) {
    showModal(client.id ? "Editar cliente" : "Registrar cliente", `<form id="clientForm" data-id="${esc(client.id || "")}" class="grid gap-4 md:grid-cols-2" novalidate><label class="form-field"><span>Nombre</span><input id="clientName" class="form-control" value="${esc(client.name || "")}" required></label><label class="form-field"><span>Correo</span><input id="clientEmail" type="email" class="form-control" value="${esc(client.email || "")}" required></label><label class="form-field"><span>Telefono</span><input id="clientPhone" class="form-control" value="${esc(client.phone || "")}" required></label><label class="form-field"><span>Sucursal</span><select id="clientBranch" class="form-control">${options(app.data.branches.map((branch) => ({ value: branch.id, label: branch.name })), client.branchId || "b1")}</select></label><label class="form-field"><span>Estado</span><select id="clientStatus" class="form-control">${options(["Activo", "Inactivo", "Suspendido", "Bloqueado"], client.status || "Activo")}</select></label><label class="form-field"><span>Plan</span><select id="clientPlan" class="form-control">${options(app.data.plans.map((plan) => ({ value: plan.id, label: plan.name })))}</select></label><button class="btn btn-primary md:col-span-2" type="submit">Guardar cliente</button></form>`);
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
    const managed = ["reservationForm", "branchForm", "clientForm", "areaForm", "machineForm", "maintenanceForm", "finishMaintenanceForm", "paymentForm"];
    if (!managed.includes(form.id)) return;
    event.preventDefault();
    if (form.id === "reservationForm") return submitReservation();
    if (form.id === "branchForm") return submitBranch(form);
    if (form.id === "clientForm") return submitClient(form);
    if (form.id === "areaForm") return submitArea(form);
    if (form.id === "machineForm") return submitMachine(form);
    if (form.id === "maintenanceForm") return submitMaintenance(form);
    if (form.id === "finishMaintenanceForm") return submitFinishMaintenance(form);
    if (form.id === "paymentForm") return submitPayment();
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
    Object.assign(branch, { code, name: $("#branchName").value.trim(), address: $("#branchAddress").value.trim(), phone: $("#branchPhone").value.trim(), email: $("#branchEmail").value.trim(), manager: $("#branchManager").value.trim(), opens: $("#branchOpens").value, closes: $("#branchCloses").value, capacity: Number($("#branchCapacity").value), status: $("#branchStatus").value });
    if (!form.dataset.id) app.data.branches.unshift(branch);
    window.GymReservations.audit(app.data, app.user, "Sucursales", form.dataset.id ? "Editar sucursal" : "Crear sucursal", branch.name);
    save(); closeModal(); render(); toast("Sucursal guardada.");
  }

  function submitClient(form) {
    const id = form.dataset.id;
    const client = id ? byId("clients", id) : { id: uid("c"), membershipId: uid("m"), currentAreaId: "" };
    Object.assign(client, { name: $("#clientName").value.trim(), email: $("#clientEmail").value.trim(), phone: $("#clientPhone").value.trim(), branchId: $("#clientBranch").value, status: $("#clientStatus").value });
    if (!client.name || !client.email) return toast("Nombre y correo son obligatorios.", "error");
    if (!id) {
      app.data.clients.unshift(client);
      app.data.memberships.unshift({ id: client.membershipId, clientId: client.id, planId: $("#clientPlan").value, startDate: today, endDate: "2026-10-09", status: "Activa" });
    }
    window.GymReservations.audit(app.data, app.user, "Clientes", id ? "Editar cliente" : "Registrar cliente", client.name);
    save(); closeModal(); render(); toast("Cliente guardado.");
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

  function closeModal() {
    $("#modalRoot").classList.add("hidden");
    $("#modalRoot").innerHTML = "";
  }

  function handleAction(event) {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === "close-modal") return closeModal();
    if (action === "logout") return logout();
    if (action === "restore-demo") return restoreDemo();
    if (action === "open-reservation") return reservationForm();
    if (action === "open-branch") return branchForm(id ? byId("branches", id) : {});
    if (action === "open-client") return clientForm(id ? byId("clients", id) : {});
    if (action === "open-area") return areaForm(id ? byId("areas", id) : {});
    if (action === "open-machine") return machineForm(id ? byId("machines", id) : {});
    if (action === "open-maintenance") return maintenanceForm(id ? byId("maintenance", id) : {});
    if (action === "open-payment") return paymentForm();
    if (action === "inventory-tab") { app.filters.inventoryTab = el.dataset.tab; return render(); }
    if (action === "report-tab") { app.filters.reportTab = el.dataset.tab; return render(); }
    if (action === "branch-detail") return branchDetail(id);
    if (action === "branch-reservations") { app.view = "reservations"; app.filters.dashboardBranch = id; return render(); }
    if (action === "toggle-branch") return toggleBranch(id);
    if (action === "client-detail") return clientDetail(id);
    if (action === "toggle-client") return toggleClient(id);
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
    if (action === "print-report") return window.print();
    if (action === "export-report") return exportCsv(app.data.payments, "gymcore-reporte.csv");
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
    showModal("Detalle de sucursal", `<dl class="detail-grid"><div><dt>Codigo</dt><dd>${esc(branch.code)}</dd></div><div><dt>Estado</dt><dd>${badge(branch.status)}</dd></div><div><dt>Encargado</dt><dd>${esc(branch.manager)}</dd></div><div><dt>Ingresos</dt><dd>Q${income}</dd></div><div><dt>Areas</dt><dd>${areas.length}</dd></div><div><dt>Maquinas</dt><dd>${machines.length}</dd></div><div><dt>Clientes</dt><dd>${clients.length}</dd></div><div><dt>Reservas</dt><dd>${reservations.length}</dd></div></dl>`);
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
    showModal("Detalle de cliente", `<dl class="detail-grid"><div><dt>Correo</dt><dd>${esc(client.email)}</dd></div><div><dt>Estado</dt><dd>${badge(client.status)}</dd></div><div><dt>Membresia</dt><dd>${membership ? badge(membership.status) : "Sin membresia"}</dd></div><div><dt>Sucursal</dt><dd>${branchName(client.branchId)}</dd></div></dl><h3 class="mt-5 font-black">Reservas</h3>${reservationTable(app.data.reservations.filter((reservation) => reservation.clientId === id))}`);
  }

  function toggleClient(id) {
    const client = byId("clients", id);
    client.status = client.status === "Activo" ? "Suspendido" : "Activo";
    save(); render(); toast(`Cliente ${client.status.toLowerCase()}.`);
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
    const blob = new Blob([`GymCore reporte\nGenerado: ${new Date().toLocaleString()}\nRegistros de pago: ${app.data.payments.length}`], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gymcore-reporte.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    toast("Reporte descargado.");
  }

  function handleInput(event) {
    const id = event.target.id;
    const value = event.target.value;
    const simpleMap = {
      clientFilter: ["client", null], clientStatusFilter: ["clientStatus", null],
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
