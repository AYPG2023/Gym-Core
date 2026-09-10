window.GYM_SEED = {
  users: [
    { id: "u-admin", name: "Valeria Rivas", email: "admin@gym.test", role: "admin", status: "Activo" },
    { id: "u-recep", name: "Mario Escobar", email: "recepcion@gym.test", role: "reception", status: "Activo" },
    { id: "u-trainer", name: "Lucia Mendez", email: "trainer@gym.test", role: "trainer", trainerId: "t1", status: "Activo" },
    { id: "u-client", name: "Ana Lopez", email: "cliente@gym.test", role: "client", clientId: "c1", status: "Activo" }
  ],
  branches: [
    { id: "b1", code: "Z10", name: "Zona 10 Performance", address: "Avenida Reforma 10-45", phone: "2410-1000", email: "zona10@gym.test", manager: "Valeria Rivas", opens: "05:00", closes: "22:00", capacity: 62, status: "Activa" },
    { id: "b2", code: "MJD", name: "Majadas Athletic", address: "Calzada Roosevelt 26-70", phone: "2410-2000", email: "majadas@gym.test", manager: "Mario Escobar", opens: "06:00", closes: "21:00", capacity: 50, status: "Activa" }
  ],
  plans: [
    { id: "p1", name: "Basica", price: 180, durationDays: 30, areas: ["a1", "a2", "a7"], reservationLimit: 4, status: "Activa" },
    { id: "p2", name: "Premium Mensual", price: 320, durationDays: 30, areas: ["a1", "a2", "a3", "a4", "a5", "a6", "a7"], reservationLimit: 8, status: "Activa" },
    { id: "p3", name: "Trimestral Elite", price: 850, durationDays: 90, areas: ["a1", "a2", "a3", "a4", "a5", "a6", "a7"], reservationLimit: 14, status: "Activa" },
    { id: "p4", name: "Anual Corporate", price: 2600, durationDays: 365, areas: ["a1", "a2", "a3", "a4", "a5", "a6", "a7"], reservationLimit: 20, status: "Activa" }
  ],
  clients: [
    { id: "c1", name: "Ana Lopez", email: "ana@gym.test", phone: "5551-2001", status: "Activo", branchId: "b1", membershipId: "m1", currentAreaId: "a1" },
    { id: "c2", name: "Carlos Ruiz", email: "carlos@gym.test", phone: "5551-2002", status: "Activo", branchId: "b1", membershipId: "m2", currentAreaId: "a2" },
    { id: "c3", name: "Sofia Garcia", email: "sofia@gym.test", phone: "5551-2003", status: "Activo", branchId: "b2", membershipId: "m3", currentAreaId: "a3" },
    { id: "c4", name: "Jose Martinez", email: "jose@gym.test", phone: "5551-2004", status: "Suspendido", branchId: "b1", membershipId: "m4", currentAreaId: "" },
    { id: "c5", name: "Marta Perez", email: "marta@gym.test", phone: "5551-2005", status: "Activo", branchId: "b2", membershipId: "m5", currentAreaId: "a5" },
    { id: "c6", name: "Daniel Torres", email: "daniel@gym.test", phone: "5551-2006", status: "Inactivo", branchId: "b1", membershipId: "m6", currentAreaId: "" },
    { id: "c7", name: "Elena Castillo", email: "elena@gym.test", phone: "5551-2007", status: "Bloqueado", branchId: "b2", membershipId: "m7", currentAreaId: "" },
    { id: "c8", name: "Ricardo Flores", email: "ricardo@gym.test", phone: "5551-2008", status: "Activo", branchId: "b1", membershipId: "m8", currentAreaId: "a4" }
  ],
  trainers: [
    { id: "t1", name: "Lucia Mendez", specialty: "Funcional", status: "Activo", branchId: "b1" },
    { id: "t2", name: "Esteban Cano", specialty: "Pesas", status: "Activo", branchId: "b1" },
    { id: "t3", name: "Paola Herrera", specialty: "Spinning", status: "Activo", branchId: "b2" },
    { id: "t4", name: "Hugo Diaz", specialty: "CrossFit", status: "Activo", branchId: "b2" }
  ],
  areas: [
    { id: "a1", name: "Cardio", description: "Caminadoras, elipticas y bicicletas.", branchId: "b1", capacity: 20, schedule: "05:00-22:00", status: "Disponible" },
    { id: "a2", name: "Pesas", description: "Peso libre y maquinas de fuerza.", branchId: "b1", capacity: 18, schedule: "05:00-22:00", status: "Disponible" },
    { id: "a3", name: "Spinning", description: "Salon con bicicletas indoor.", branchId: "b2", capacity: 16, schedule: "06:00-21:00", status: "Capacidad limitada" },
    { id: "a4", name: "CrossFit", description: "Jaulas, barras y circuito funcional.", branchId: "b1", capacity: 14, schedule: "06:00-20:00", status: "Disponible" },
    { id: "a5", name: "Entrenamiento funcional", description: "TRX, bandas y estaciones.", branchId: "b2", capacity: 12, schedule: "06:00-21:00", status: "Disponible" },
    { id: "a6", name: "Salon de clases", description: "Yoga, movilidad y HIIT.", branchId: "b2", capacity: 22, schedule: "07:00-20:00", status: "Cerrada" },
    { id: "a7", name: "Vestidores", description: "Lockers y duchas.", branchId: "b1", capacity: 10, schedule: "05:00-22:00", status: "Disponible" }
  ],
  machines: [
    { id: "ma1", code: "CAR-001", name: "Caminadora Pro X", type: "Cardio", areaId: "a1", brand: "Nordic", model: "T9", simultaneousCapacity: 1, acquiredAt: "2024-02-10", lastMaintenance: "2026-08-10", nextMaintenance: "2026-10-10", notes: "Banda nueva", status: "Disponible" },
    { id: "ma2", code: "CAR-002", name: "Eliptica Air", type: "Cardio", areaId: "a1", brand: "Matrix", model: "E50", simultaneousCapacity: 1, acquiredAt: "2023-06-05", lastMaintenance: "2026-07-28", nextMaintenance: "2026-09-20", notes: "Sensor revisado", status: "Disponible" },
    { id: "ma3", code: "CAR-003", name: "Bicicleta vertical", type: "Cardio", areaId: "a1", brand: "LifeFit", model: "B2", simultaneousCapacity: 1, acquiredAt: "2022-11-12", lastMaintenance: "2026-08-01", nextMaintenance: "2026-09-25", notes: "", status: "En uso" },
    { id: "ma4", code: "PES-001", name: "Prensa 45", type: "Fuerza", areaId: "a2", brand: "Hammer", model: "L45", simultaneousCapacity: 2, acquiredAt: "2021-03-16", lastMaintenance: "2026-08-20", nextMaintenance: "2026-11-20", notes: "", status: "Disponible" },
    { id: "ma5", code: "PES-002", name: "Polea doble", type: "Fuerza", areaId: "a2", brand: "Rogue", model: "C2", simultaneousCapacity: 2, acquiredAt: "2020-10-18", lastMaintenance: "2026-06-12", nextMaintenance: "2026-09-14", notes: "Cable a observar", status: "En mantenimiento" },
    { id: "ma6", code: "PES-003", name: "Banco olimpico", type: "Fuerza", areaId: "a2", brand: "Impulse", model: "OB", simultaneousCapacity: 1, acquiredAt: "2023-01-11", lastMaintenance: "2026-08-12", nextMaintenance: "2026-10-12", notes: "", status: "Disponible" },
    { id: "ma7", code: "SPI-001", name: "Bike Sprint A", type: "Spinning", areaId: "a3", brand: "Keiser", model: "M3", simultaneousCapacity: 1, acquiredAt: "2024-04-22", lastMaintenance: "2026-07-30", nextMaintenance: "2026-09-30", notes: "", status: "Disponible" },
    { id: "ma8", code: "SPI-002", name: "Bike Sprint B", type: "Spinning", areaId: "a3", brand: "Keiser", model: "M3", simultaneousCapacity: 1, acquiredAt: "2024-04-22", lastMaintenance: "2026-07-30", nextMaintenance: "2026-09-30", notes: "", status: "Reservada" },
    { id: "ma9", code: "SPI-003", name: "Bike Sprint C", type: "Spinning", areaId: "a3", brand: "Keiser", model: "M3", simultaneousCapacity: 1, acquiredAt: "2024-04-22", lastMaintenance: "2026-07-30", nextMaintenance: "2026-09-30", notes: "", status: "Fuera de servicio" },
    { id: "ma10", code: "CRS-001", name: "Rack olimpico", type: "CrossFit", areaId: "a4", brand: "Rogue", model: "RML", simultaneousCapacity: 4, acquiredAt: "2022-02-10", lastMaintenance: "2026-08-15", nextMaintenance: "2026-10-15", notes: "", status: "Disponible" },
    { id: "ma11", code: "CRS-002", name: "Remo indoor", type: "CrossFit", areaId: "a4", brand: "Concept2", model: "D", simultaneousCapacity: 1, acquiredAt: "2022-05-25", lastMaintenance: "2026-08-16", nextMaintenance: "2026-10-16", notes: "", status: "Disponible" },
    { id: "ma12", code: "FUN-001", name: "TRX Station", type: "Funcional", areaId: "a5", brand: "TRX", model: "Studio", simultaneousCapacity: 6, acquiredAt: "2023-07-01", lastMaintenance: "2026-08-18", nextMaintenance: "2026-10-18", notes: "", status: "Disponible" },
    { id: "ma13", code: "FUN-002", name: "Kettlebell set", type: "Funcional", areaId: "a5", brand: "Eleiko", model: "KB", simultaneousCapacity: 5, acquiredAt: "2021-05-14", lastMaintenance: "2026-08-02", nextMaintenance: "2026-11-02", notes: "", status: "Disponible" },
    { id: "ma14", code: "CLS-001", name: "Audio salon", type: "Clase", areaId: "a6", brand: "Bose", model: "S1", simultaneousCapacity: 20, acquiredAt: "2025-01-12", lastMaintenance: "2026-05-20", nextMaintenance: "2026-09-15", notes: "Salon cerrado", status: "Fuera de servicio" },
    { id: "ma15", code: "VST-001", name: "Locker inteligente", type: "Servicio", areaId: "a7", brand: "SafeFit", model: "L10", simultaneousCapacity: 10, acquiredAt: "2023-09-08", lastMaintenance: "2026-08-05", nextMaintenance: "2026-10-05", notes: "", status: "Disponible" }
  ],
  memberships: [
    { id: "m1", clientId: "c1", planId: "p2", startDate: "2026-09-01", endDate: "2026-09-30", status: "Activa" },
    { id: "m2", clientId: "c2", planId: "p1", startDate: "2026-08-20", endDate: "2026-09-18", status: "Proxima a vencer" },
    { id: "m3", clientId: "c3", planId: "p3", startDate: "2026-08-01", endDate: "2026-10-30", status: "Activa" },
    { id: "m4", clientId: "c4", planId: "p2", startDate: "2026-08-01", endDate: "2026-08-31", status: "Suspendida" },
    { id: "m5", clientId: "c5", planId: "p4", startDate: "2026-01-02", endDate: "2027-01-01", status: "Activa" },
    { id: "m6", clientId: "c6", planId: "p1", startDate: "2026-07-01", endDate: "2026-07-31", status: "Vencida" },
    { id: "m7", clientId: "c7", planId: "p2", startDate: "2026-08-15", endDate: "2026-09-14", status: "Cancelada" },
    { id: "m8", clientId: "c8", planId: "p3", startDate: "2026-09-05", endDate: "2026-12-04", status: "Activa" }
  ],
  schedules: [
    { id: "s1", date: "2026-09-10", start: "06:00", end: "07:00", areaId: "a1", branchId: "b1", trainerId: "t1", capacity: 14, status: "Disponible" },
    { id: "s2", date: "2026-09-10", start: "07:00", end: "08:00", areaId: "a2", branchId: "b1", trainerId: "t2", capacity: 12, status: "Disponible" },
    { id: "s3", date: "2026-09-10", start: "18:00", end: "19:00", areaId: "a3", branchId: "b2", trainerId: "t3", capacity: 8, status: "Disponible" },
    { id: "s4", date: "2026-09-10", start: "19:00", end: "20:00", areaId: "a4", branchId: "b1", trainerId: "t4", capacity: 8, status: "Disponible" },
    { id: "s5", date: "2026-09-11", start: "06:00", end: "07:00", areaId: "a5", branchId: "b2", trainerId: "t1", capacity: 10, status: "Disponible" },
    { id: "s6", date: "2026-09-11", start: "07:00", end: "08:00", areaId: "a6", branchId: "b2", trainerId: "t3", capacity: 12, status: "Cerrado" },
    { id: "s7", date: "2026-09-11", start: "17:00", end: "18:00", areaId: "a1", branchId: "b1", trainerId: "t2", capacity: 14, status: "Disponible" },
    { id: "s8", date: "2026-09-11", start: "18:00", end: "19:00", areaId: "a2", branchId: "b1", trainerId: "t2", capacity: 12, status: "Disponible" }
  ],
  reservations: [
    { id: "r1", clientId: "c1", scheduleId: "s1", machineId: "ma1", status: "Confirmada", createdAt: "2026-09-09 08:00", history: [{ status: "Pendiente", at: "2026-09-09 08:00" }, { status: "Confirmada", at: "2026-09-09 08:03" }] },
    { id: "r2", clientId: "c2", scheduleId: "s2", machineId: "", status: "Pendiente", createdAt: "2026-09-09 09:10", history: [{ status: "Pendiente", at: "2026-09-09 09:10" }] },
    { id: "r3", clientId: "c3", scheduleId: "s3", machineId: "ma7", status: "Confirmada", createdAt: "2026-09-08 18:10", history: [{ status: "Pendiente", at: "2026-09-08 18:10" }, { status: "Confirmada", at: "2026-09-08 18:11" }] },
    { id: "r4", clientId: "c8", scheduleId: "s4", machineId: "ma10", status: "Completada", createdAt: "2026-09-06 07:20", history: [{ status: "Pendiente", at: "2026-09-06 07:20" }, { status: "Confirmada", at: "2026-09-06 07:25" }, { status: "Completada", at: "2026-09-10 20:00" }] },
    { id: "r5", clientId: "c5", scheduleId: "s5", machineId: "ma12", status: "Cancelada", createdAt: "2026-09-08 10:40", history: [{ status: "Pendiente", at: "2026-09-08 10:40" }, { status: "Cancelada", at: "2026-09-09 08:00" }] },
    { id: "r6", clientId: "c1", scheduleId: "s7", machineId: "ma2", status: "No asistio", createdAt: "2026-09-07 06:50", history: [{ status: "Pendiente", at: "2026-09-07 06:50" }, { status: "Confirmada", at: "2026-09-07 06:52" }, { status: "No asistio", at: "2026-09-11 18:00" }] }
  ],
  maintenance: [
    { id: "mt1", machineId: "ma5", type: "Preventivo", startDate: "2026-09-09", estimatedEnd: "2026-09-12", technician: "TecnoFit", cost: 450, description: "Cambio de cable y lubricacion.", result: "", status: "En proceso" },
    { id: "mt2", machineId: "ma14", type: "Correctivo", startDate: "2026-09-07", estimatedEnd: "2026-09-15", technician: "AudioPro", cost: 700, description: "Falla de amplificador.", result: "", status: "Programado" }
  ],
  payments: [
    { id: "pay1", clientId: "c1", branchId: "b1", planId: "p2", amount: 320, date: "2026-09-01", method: "Tarjeta", receipt: "FAC-1001", status: "Pagado" },
    { id: "pay2", clientId: "c2", branchId: "b1", planId: "p1", amount: 180, date: "2026-08-20", method: "Efectivo", receipt: "FAC-1002", status: "Pagado" },
    { id: "pay3", clientId: "c4", branchId: "b1", planId: "p2", amount: 320, date: "2026-08-01", method: "Transferencia", receipt: "FAC-1003", status: "Rechazado" },
    { id: "pay4", clientId: "c5", branchId: "b2", planId: "p4", amount: 2600, date: "2026-01-02", method: "Tarjeta", receipt: "FAC-1004", status: "Pagado" },
    { id: "pay5", clientId: "c3", branchId: "b2", planId: "p3", amount: 850, date: "2026-09-04", method: "Transferencia", receipt: "FAC-1005", status: "Pagado" },
    { id: "pay6", clientId: "c8", branchId: "b1", planId: "p3", amount: 850, date: "2026-09-05", method: "Tarjeta", receipt: "FAC-1006", status: "Pendiente" },
    { id: "pay7", clientId: "c6", branchId: "b1", planId: "p1", amount: 180, date: "2026-07-01", method: "Efectivo", receipt: "FAC-0980", status: "Anulado" }
  ],
  audit: [
    { id: "log1", at: "2026-09-09 08:03", user: "Sistema", module: "Reservas", action: "Confirmar reserva", detail: "Ana Lopez / Cardio" }
  ]
};
