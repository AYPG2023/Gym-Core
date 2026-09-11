(function () {
  "use strict";

  const activeReservationStates = ["Pendiente", "Confirmada", "En curso"];
  const unavailableMachineStates = ["En mantenimiento", "Danado", "Fuera de servicio", "Retirado", "Pendiente de documentacion"];
  const unavailableAreaStates = ["Cerrada", "En mantenimiento"];
  const inactiveBranchStates = ["Inactiva", "En mantenimiento", "Cerrada temporalmente"];
  const reservationFlow = {
    "Pendiente": ["Confirmada", "Cancelada", "Rechazada"],
    "Confirmada": ["En curso", "Cancelada", "No asistio"],
    "En curso": ["Completada"],
    "Completada": [],
    "Cancelada": [],
    "No asistio": [],
    "Rechazada": []
  };
  const machineFlow = {
    "Operativo": ["En mantenimiento", "Danado", "Fuera de servicio", "Retirado"],
    "En mantenimiento": ["Operativo", "Fuera de servicio"],
    "Danado": ["En mantenimiento", "Fuera de servicio"],
    "Fuera de servicio": ["En mantenimiento", "Retirado"],
    "Pendiente de documentacion": ["Operativo", "Fuera de servicio"],
    "Retirado": []
  };
  const membershipFlow = {
    "Pendiente": ["Activa", "Cancelada"],
    "Activa": ["Proxima a vencer", "Suspendida", "Cancelada", "Vencida"],
    "Proxima a vencer": ["Vencida", "Suspendida", "Cancelada"],
    "Vencida": [],
    "Suspendida": ["Activa", "Cancelada"],
    "Cancelada": []
  };
  const purchaseOrderFlow = {
    "Borrador": ["Solicitada", "Cancelada"],
    "Solicitada": ["En revision", "Cancelada"],
    "En revision": ["Rechazada", "Cancelada"],
    "Aprobada": ["Ordenada", "Cancelada"],
    "Ordenada": ["Recibida", "Cancelada"],
    "Rechazada": [],
    "Recibida": [],
    "Cancelada": []
  };

  function toMinutes(time) {
    const [h, m] = String(time).split(":").map(Number);
    return h * 60 + m;
  }

  function overlaps(aStart, aEnd, bStart, bEnd) {
    return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
  }

  function byId(data, collection, id) {
    return data[collection].find((item) => String(item.id) === String(id));
  }

  function membershipFor(data, clientId) {
    const client = byId(data, "clients", clientId);
    if (!client) return null;
    return byId(data, "memberships", client.membershipId);
  }

  function planFor(data, membership) {
    return membership ? byId(data, "plans", membership.planId) : null;
  }

  function machineOperationalCapacity(data, areaId) {
    const machines = data.machines.filter((machine) => machine.areaId === areaId && machine.status === "Operativo");
    return machines.reduce((sum, machine) => sum + Number(machine.simultaneousCapacity || 0), 0);
  }

  function currentPeople(data, areaId) {
    return data.clients.filter((client) => client.currentAreaId === areaId && client.status === "Activo").length;
  }

  function confirmedReservations(data, scheduleId) {
    return data.reservations.filter((reservation) => {
      if (reservation.scheduleId !== scheduleId || !activeReservationStates.includes(reservation.status)) return false;
      return true;
    }).length;
  }

  function availability(data, scheduleId) {
    const schedule = byId(data, "schedules", scheduleId);
    if (!schedule) return { total: 0, reserved: 0, inUse: 0, available: 0, percent: 100, state: "Cerrado", reason: "Horario no encontrado" };
    const area = byId(data, "areas", schedule.areaId);
    const branch = byId(data, "branches", schedule.branchId);

    if (!area || !branch) return { total: 0, reserved: 0, inUse: 0, available: 0, percent: 100, state: "Cerrado", reason: "Area o sucursal invalida" };
    if (inactiveBranchStates.includes(branch.status)) return { total: 0, reserved: 0, inUse: 0, available: 0, percent: 100, state: "Cerrado", reason: "Sucursal no activa" };
    if (schedule.status === "Cerrado" || unavailableAreaStates.includes(area.status)) return { total: 0, reserved: 0, inUse: 0, available: 0, percent: 100, state: "Cerrado", reason: "Area cerrada o en mantenimiento" };
    const areaMachines = data.machines.filter((item) => item.areaId === area.id);
    const operational = machineOperationalCapacity(data, area.id);
    if (area.name === "Boxeo" && !branch.hasBoxingRing) return { total: 0, reserved: 0, inUse: 0, available: 0, percent: 100, state: "Cerrado", reason: "La sucursal no tiene ring de boxeo" };
    if (area.name === "Boxeo" && operational <= 0) return { total: 0, reserved: 0, inUse: 0, available: 0, percent: 100, state: "Cerrado", reason: "El ring de boxeo no esta operativo" };

    const total = Math.min(Number(area.capacity), Number(schedule.capacity), areaMachines.length ? operational : Number(area.capacity));
    const reserved = confirmedReservations(data, scheduleId);
    const inUse = currentPeople(data, area.id);
    const available = Math.max(0, total - reserved - inUse);
    const percent = total ? Math.round(((reserved + inUse) / total) * 100) : 100;
    const state = available <= 0 ? "Completa" : percent >= 75 ? "Pocos cupos" : "Disponible";
    return { total, reserved, inUse, available, percent, state, reason: available <= 0 ? "Capacidad completa" : "" };
  }

  function validateReservation(data, payload, currentDateTime = new Date()) {
    const client = byId(data, "clients", payload.clientId);
    const schedule = byId(data, "schedules", payload.scheduleId);
    if (!client || !schedule) return { ok: false, reason: "Cliente u horario no encontrado" };
    const area = byId(data, "areas", schedule.areaId);
    const branch = byId(data, "branches", schedule.branchId);
    const membership = membershipFor(data, client.id);
    const plan = planFor(data, membership);

    if (client.status !== "Activo") return { ok: false, reason: "El cliente no esta activo" };
    if (!membership || membership.status !== "Activa") return { ok: false, reason: "Solo clientes con membresia activa pueden reservar" };
    if (schedule.date < membership.startDate || schedule.date > membership.endDate) return { ok: false, reason: "La membresia no esta vigente para la fecha seleccionada" };
    if (!plan.areas.includes(schedule.areaId)) return { ok: false, reason: "La membresia no permite reservar esta area" };
    if (inactiveBranchStates.includes(branch?.status)) return { ok: false, reason: "La sucursal no acepta nuevas reservas" };
    if (!area || unavailableAreaStates.includes(area.status) || schedule.status === "Cerrado") return { ok: false, reason: "El area esta cerrada o en mantenimiento" };
    if (area.name === "Boxeo" && !branch.hasBoxingRing) return { ok: false, reason: "Boxeo solo se ofrece en sucursales con ring" };
    if (area.name === "Boxeo" && plan.id === "p-basica") return { ok: false, reason: "La membresia Basica no incluye boxeo" };
    if (area.name === "Boxeo" && machineOperationalCapacity(data, area.id) <= 0) return { ok: false, reason: "El ring de boxeo esta fuera de servicio" };

    const sameSlot = data.reservations.some((reservation) => reservation.clientId === client.id && reservation.scheduleId === schedule.id && activeReservationStates.includes(reservation.status));
    if (sameSlot) return { ok: false, reason: "Ya existe una reserva para ese cliente, fecha y horario" };

    const conflict = data.reservations.some((reservation) => {
      if (reservation.clientId !== client.id || !activeReservationStates.includes(reservation.status)) return false;
      const other = byId(data, "schedules", reservation.scheduleId);
      return other && other.date === schedule.date && overlaps(schedule.start, schedule.end, other.start, other.end);
    });
    if (conflict) return { ok: false, reason: "El cliente ya tiene una reserva traslapada" };

    const trainerConflict = data.schedules.some((other) => other.id !== schedule.id && other.trainerId === schedule.trainerId && other.date === schedule.date && overlaps(schedule.start, schedule.end, other.start, other.end));
    if (trainerConflict) return { ok: false, reason: "El entrenador tiene otra actividad en el mismo horario" };

    const activeCount = data.reservations.filter((reservation) => reservation.clientId === client.id && activeReservationStates.includes(reservation.status)).length;
    if (activeCount >= Number(plan.reservationLimit)) return { ok: false, reason: "El cliente supero el limite de reservas de su plan" };

    const spaces = availability(data, schedule.id);
    if (spaces.available <= 0) return { ok: false, reason: spaces.reason || "No hay cupos disponibles" };

    const selectedTime = new Date(`${schedule.date}T${schedule.start}:00`);
    if (selectedTime.getTime() < currentDateTime.getTime()) return { ok: false, reason: "No se puede reservar un horario pasado" };
    return { ok: true, reason: "Reserva valida" };
  }

  function canCancel(data, reservationId, now = new Date()) {
    const reservation = byId(data, "reservations", reservationId);
    if (!reservation || !["Pendiente", "Confirmada"].includes(reservation.status)) return { ok: false, reason: "La reserva ya no admite cancelacion" };
    const schedule = byId(data, "schedules", reservation.scheduleId);
    const startsAt = new Date(`${schedule.date}T${schedule.start}:00`);
    const diffHours = (startsAt.getTime() - now.getTime()) / 36e5;
    if (diffHours < 2) return { ok: false, reason: "Solo se permite cancelar al menos dos horas antes" };
    return { ok: true, reason: "Cancelacion permitida" };
  }

  window.GymRules = {
    reservationFlow,
    machineFlow,
    membershipFlow,
    purchaseOrderFlow,
    activeReservationStates,
    unavailableMachineStates,
    unavailableAreaStates,
    inactiveBranchStates,
    toMinutes,
    overlaps,
    byId,
    membershipFor,
    planFor,
    availability,
    validateReservation,
    canCancel
  };
})();
