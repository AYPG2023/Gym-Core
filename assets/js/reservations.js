(function () {
  "use strict";

  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const stamp = () => new Date().toLocaleString("sv-SE").slice(0, 16);

  function audit(data, user, module, action, detail) {
    data.audit.unshift({ id: uid("log"), at: stamp(), user: user?.name || "Sistema", module, action, detail });
  }

  function create(data, payload, user) {
    const validation = window.GymRules.validateReservation(data, payload);
    if (!validation.ok) return validation;
    const item = {
      id: uid("r"),
      clientId: payload.clientId,
      scheduleId: payload.scheduleId,
      attendance: "Pendiente",
      status: payload.status || "Pendiente",
      createdAt: stamp(),
      history: [{ status: payload.status || "Pendiente", at: stamp() }]
    };
    data.reservations.unshift(item);
    audit(data, user, "Reservas", "Crear reserva", item.id);
    return { ok: true, item };
  }

  function changeStatus(data, reservationId, next, user) {
    const reservation = window.GymRules.byId(data, "reservations", reservationId);
    if (!reservation) return { ok: false, reason: "Reserva no encontrada" };
    const allowed = window.GymRules.reservationFlow[reservation.status] || [];
    if (!allowed.includes(next)) return { ok: false, reason: `Transicion invalida desde ${reservation.status} hacia ${next}` };
    const before = reservation.status;
    reservation.status = next;
    reservation.history.push({ status: next, at: stamp() });
    if (next === "Completada") reservation.attendance = "Presente";
    if (next === "No asistio") reservation.attendance = "Ausente";
    audit(data, user, "Reservas", `Estado ${before} -> ${next}`, reservation.id);
    return { ok: true, item: reservation };
  }

  function cancel(data, reservationId, user) {
    const check = window.GymRules.canCancel(data, reservationId);
    if (!check.ok) return check;
    return changeStatus(data, reservationId, "Cancelada", user);
  }

  window.GymReservations = { create, changeStatus, cancel, audit };
})();
