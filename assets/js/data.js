window.GYM_SEED = {
  users: [
    { id: "u-admin", name: "Valeria Rivas", email: "admin@gym.test", role: "admin", status: "Activo" },
    { id: "u-recep", name: "Mario Escobar", email: "recepcion@gym.test", role: "reception", employeeId: "e5", status: "Activo" },
    { id: "u-trainer", name: "Lucia Mendez", email: "trainer@gym.test", role: "trainer", trainerId: "t1", employeeId: "e1", status: "Activo" },
    { id: "u-client", name: "Ana Lopez", email: "cliente@gym.test", role: "client", clientId: "c1", status: "Activo" }
  ],
  branches: [
    { id: "b1", code: "PREM", name: "Sucursal Premium", address: "Avenida Reforma 10-45", phone: "2410-1000", email: "premium@gym.test", manager: "Valeria Rivas", opens: "04:00", closes: "22:00", weekdayHours: "Lunes-viernes 04:00-22:00", weekendHours: "Sabados y domingos 06:00-14:00", expectedAttendance: "75-100 personas", amenities: ["Piscina", "Boxeo", "Cardio", "Pesas", "Cafeteria"], hasPool: true, hasBoxingRing: true, capacity: 100, status: "Activa" },
    { id: "b2", code: "MJD", name: "Majadas Athletic", address: "Calzada Roosevelt 26-70", phone: "2410-2000", email: "majadas@gym.test", manager: "Mario Escobar", opens: "04:00", closes: "22:00", weekdayHours: "Lunes-viernes 04:00-22:00", weekendHours: "Sabados y domingos 06:00-14:00", expectedAttendance: "75-100 personas", amenities: ["Spinning", "Entrenamiento funcional", "Cafeteria"], hasPool: false, hasBoxingRing: false, capacity: 100, status: "Activa" }
  ],
  plans: [
    { id: "p-basica", name: "Basica", price: 250, durationDays: 30, status: "Activa", areas: ["a-cardio", "a-pesas", "a-piscina"], reservationLimit: 4, benefits: [{ name: "Acceso ilimitado al gimnasio", limit: "Ilimitado", period: "mes" }, { name: "Coaching incluido", limit: 1, period: "semana" }, { name: "Descuento en parqueo", limit: 10, unit: "%", period: "uso" }, { name: "Acceso a piscina", limit: "Incluido", period: "mes" }, { name: "Acceso a boxeo", limit: "No incluido", period: "mes" }], pendingBenefits: [] },
    { id: "p-haute", name: "Haute", price: 350, durationDays: 30, status: "Activa", areas: ["a-cardio", "a-pesas", "a-piscina", "a-boxeo", "a-spinning", "a-funcional"], reservationLimit: 8, benefits: [{ name: "Acceso ilimitado al gimnasio", limit: "Ilimitado", period: "mes" }, { name: "Coaching incluido", limit: 3, period: "mes" }, { name: "Descuento en parqueo", limit: 20, unit: "%", period: "uso" }, { name: "Acceso a piscina", limit: "Incluido", period: "mes" }, { name: "Boxeo segun disponibilidad", limit: "Configurable", period: "clase" }, { name: "Descuento en servicios", limit: 10, unit: "%", period: "compra" }], pendingBenefits: ["Masajes Haute", "Dias de prueba", "Referidos"] }
  ],
  clients: [
    { id: "c1", code: "CLI-001", name: "Ana Lopez", email: "ana@gym.test", phone: "5551-2001", joinedAt: "2026-01-12", status: "Activo", branchId: "b1", membershipId: "m1", currentAreaId: "a-cardio", observations: "Prefiere entrenar temprano." },
    { id: "c2", code: "CLI-002", name: "Carlos Ruiz", email: "carlos@gym.test", phone: "5551-2002", joinedAt: "2026-02-03", status: "Activo", branchId: "b1", membershipId: "m2", currentAreaId: "a-pesas", observations: "Renovacion pendiente esta semana." },
    { id: "c3", code: "CLI-003", name: "Sofia Garcia", email: "sofia@gym.test", phone: "5551-2003", joinedAt: "2026-03-18", status: "Activo", branchId: "b2", membershipId: "m3", currentAreaId: "a-spinning", observations: "Asiste a spinning." },
    { id: "c4", code: "CLI-004", name: "Jose Martinez", email: "jose@gym.test", phone: "5551-2004", joinedAt: "2026-04-02", status: "Suspendido", branchId: "b1", membershipId: "m4", currentAreaId: "", observations: "Suspension temporal solicitada." },
    { id: "c5", code: "CLI-005", name: "Marta Perez", email: "marta@gym.test", phone: "5551-2005", joinedAt: "2026-01-02", status: "Activo", branchId: "b2", membershipId: "m5", currentAreaId: "a-funcional", observations: "Cliente Haute." }
  ],
  trainers: [
    { id: "t1", name: "Lucia Mendez", specialty: "Coaching y funcional", status: "Activo", branchId: "b1" },
    { id: "t2", name: "Esteban Cano", specialty: "Pesas", status: "Activo", branchId: "b1" },
    { id: "t3", name: "Paola Herrera", specialty: "Spinning", status: "Activo", branchId: "b2" },
    { id: "t4", name: "Hugo Diaz", specialty: "Boxeo", status: "Activo", branchId: "b1" }
  ],
  employees: [
    { id: "e1", code: "EMP-001", name: "Lucia Mendez", position: "Coach", branchId: "b1", phone: "5601-1001", email: "lucia@gym.test", hiredAt: "2024-03-01", baseSalary: 4500, workSchedule: "Lun-Vie 06:00-14:00", status: "Activo", trainerId: "t1" },
    { id: "e2", code: "EMP-002", name: "Esteban Cano", position: "Coach", branchId: "b1", phone: "5601-1002", email: "esteban@gym.test", hiredAt: "2023-11-15", baseSalary: 4700, workSchedule: "Lun-Sab 14:00-21:00", status: "Activo", trainerId: "t2" },
    { id: "e3", code: "EMP-003", name: "Paola Herrera", position: "Coach", branchId: "b2", phone: "5601-1003", email: "paola@gym.test", hiredAt: "2025-01-10", baseSalary: 4300, workSchedule: "Lun-Vie 17:00-21:00", status: "Vacaciones", trainerId: "t3" },
    { id: "e4", code: "EMP-004", name: "Hugo Diaz", position: "Coach", branchId: "b1", phone: "5601-1004", email: "hugo@gym.test", hiredAt: "2022-08-20", baseSalary: 4800, workSchedule: "Lun-Sab 06:00-12:00", status: "Activo", trainerId: "t4" },
    { id: "e5", code: "EMP-005", name: "Mario Escobar", position: "Recepcionista", branchId: "b2", phone: "5601-2001", email: "mario@gym.test", hiredAt: "2024-06-12", baseSalary: 3800, workSchedule: "Lun-Vie 08:00-16:00", status: "Activo" },
    { id: "e6", code: "EMP-006", name: "Andrea Lima", position: "Recepcionista", branchId: "b1", phone: "5601-2002", email: "andrea@gym.test", hiredAt: "2025-02-03", baseSalary: 3600, workSchedule: "Lun-Sab 06:00-13:00", status: "Activo" },
    { id: "e8", code: "EMP-008", name: "Valeria Rivas", position: "Administrador", branchId: "b1", phone: "5601-3001", email: "valeria@gym.test", hiredAt: "2021-05-15", baseSalary: 7200, workSchedule: "Lun-Vie 09:00-18:00", status: "Activo" }
  ],
  staffMetrics: [
    { employeeId: "e1", period: "2026-09", metrics: [{ label: "Sesiones de coaching completadas", goal: 48, result: 52, unit: "sesiones", threshold: 85, bonusAmount: 700, status: "Bono completo" }, { label: "Satisfaccion de clientes", goal: 90, result: 94, unit: "%", threshold: 90, bonusAmount: 500, status: "Bono completo" }], assignedClasses: "Coaching, funcional", clientsServed: 86, absences: 1, rating: 4.8 },
    { employeeId: "e2", period: "2026-09", metrics: [{ label: "Sesiones de coaching completadas", goal: 54, result: 44, unit: "sesiones", threshold: 80, bonusAmount: 700, status: "Bono parcial" }, { label: "Satisfaccion de clientes", goal: 92, result: 87, unit: "%", threshold: 90, bonusAmount: 500, status: "No alcanzado" }], assignedClasses: "Pesas", clientsServed: 74, absences: 2, rating: 4.5 },
    { employeeId: "e5", period: "2026-09", metrics: [{ label: "Venta de membresias", goal: 40, result: 44, unit: "ventas", threshold: 85, bonusAmount: 700, status: "Bono completo" }, { label: "Atencion o satisfaccion del cliente", goal: 90, result: 82, unit: "%", threshold: 80, bonusAmount: 500, status: "Bono parcial" }], clientsServed: 132, absences: 0, rating: 4.7 },
    { employeeId: "e6", period: "2026-09", metrics: [{ label: "Venta de membresias", goal: 38, result: 30, unit: "ventas", threshold: 85, bonusAmount: 700, status: "No alcanzado" }, { label: "Atencion o satisfaccion del cliente", goal: 90, result: 0, unit: "%", threshold: 80, bonusAmount: 500, status: "Pendiente de evaluacion" }], clientsServed: 102, absences: 1, rating: 4.4 }
  ],
  evaluationSeasons: [
    {
      id: "season-active-2026",
      name: "Temporada alta 2026",
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      status: "Activa",
      branchId: "all",
      minSurveys: 1,
      metrics: [
        { key: "coach_sessions", role: "Coach", label: "Coaching impartido", goal: 1, unit: "sesiones", maxBonus: 700, tiers: [{ from: 0, bonusPercent: 0 }, { from: 80, bonusPercent: 90 }, { from: 95, bonusPercent: 100 }] },
        { key: "coach_satisfaction", role: "Coach", label: "Satisfaccion de clientes", goal: 100, unit: "%", maxBonus: 500, tiers: [{ from: 0, bonusPercent: 0 }, { from: 80, bonusPercent: 90 }, { from: 95, bonusPercent: 100 }] },
        { key: "reception_sales", role: "Recepcionista", label: "Venta de membresias", goal: 2, unit: "ventas", maxBonus: 700, tiers: [{ from: 0, bonusPercent: 0 }, { from: 80, bonusPercent: 90 }, { from: 95, bonusPercent: 100 }] },
        { key: "reception_satisfaction", role: "Recepcionista", label: "Satisfaccion en atencion", goal: 100, unit: "%", maxBonus: 500, tiers: [{ from: 0, bonusPercent: 0 }, { from: 80, bonusPercent: 90 }, { from: 95, bonusPercent: 100 }] }
      ],
      closedResults: null
    },
    {
      id: "season-closed-2026",
      name: "Temporada abril-junio 2026",
      startDate: "2026-04-01",
      endDate: "2026-06-30",
      status: "Cerrada",
      branchId: "all",
      minSurveys: 2,
      metrics: [
        { key: "coach_sessions", role: "Coach", label: "Coaching impartido", goal: 60, unit: "sesiones", maxBonus: 650, tiers: [{ from: 0, bonusPercent: 0 }, { from: 80, bonusPercent: 75 }, { from: 95, bonusPercent: 100 }] },
        { key: "coach_satisfaction", role: "Coach", label: "Satisfaccion de clientes", goal: 100, unit: "%", maxBonus: 450, tiers: [{ from: 0, bonusPercent: 0 }, { from: 80, bonusPercent: 80 }, { from: 95, bonusPercent: 100 }] }
      ],
      closedResults: [{ employeeId: "e1", totalBonus: 980 }, { employeeId: "e2", totalBonus: 520 }]
    }
  ],
  areas: [
    { id: "a-cardio", name: "Cardio", description: "Caminadoras, elipticas y bicicletas como acceso general.", branchId: "b1", capacity: 20, schedule: "05:00-22:00", status: "Disponible" },
    { id: "a-pesas", name: "Pesas", description: "Peso libre y maquinas de fuerza.", branchId: "b1", capacity: 18, schedule: "05:00-22:00", status: "Disponible" },
    { id: "a-piscina", name: "Natacion", description: "Piscina; referencia inicial de clase de una hora.", branchId: "b1", capacity: 10, schedule: "04:00-22:00", status: "Disponible" },
    { id: "a-boxeo", name: "Boxeo", type: "Area deportiva", resourceName: "Ring de boxeo", allowsClasses: true, allowsReservations: true, description: "Area deportiva con ring; solo sucursales con amenidad de boxeo pueden ofertarla.", branchId: "b1", capacity: 15, schedule: "06:00-19:00", status: "Disponible" },
    { id: "a-spinning", name: "Spinning", description: "Salon con bicicletas indoor.", branchId: "b2", capacity: 16, schedule: "06:00-21:00", status: "Capacidad limitada" },
    { id: "a-funcional", name: "Entrenamiento funcional", description: "TRX, bandas y estaciones.", branchId: "b2", capacity: 12, schedule: "06:00-21:00", status: "Disponible" }
  ],
  machines: [
    { id: "ma1", code: "CAR-001", name: "Caminadora Pro X", type: "Cardio", areaId: "a-cardio", brand: "Nordic", model: "T9", simultaneousCapacity: 1, acquiredAt: "2024-02-10", lastMaintenance: "2026-08-10", nextMaintenance: "2026-10-10", certificate: { status: "Aprobado", fileName: "cert-car-001.pdf", reviewedBy: "Valeria Rivas", reviewedAt: "2026-08-12", observations: "Certificado vigente." }, notes: "Banda nueva", status: "Operativo" },
    { id: "ma2", code: "PES-001", name: "Prensa 45", type: "Fuerza", areaId: "a-pesas", brand: "Hammer", model: "L45", simultaneousCapacity: 2, acquiredAt: "2021-03-16", lastMaintenance: "2026-08-20", nextMaintenance: "2026-11-20", certificate: { status: "Aprobado", fileName: "cert-pes-001.pdf", reviewedBy: "Valeria Rivas", reviewedAt: "2026-08-21", observations: "Conforme." }, notes: "", status: "Operativo" },
    { id: "ma3", code: "BOX-001", name: "Ring de boxeo", type: "Boxeo", areaId: "a-boxeo", brand: "CombatFit", model: "R15", simultaneousCapacity: 15, acquiredAt: "2025-05-10", lastMaintenance: "2026-08-01", nextMaintenance: "2026-10-01", certificate: { status: "Aprobado", fileName: "cert-ring-boxeo.pdf", reviewedBy: "Valeria Rivas", reviewedAt: "2026-08-01", observations: "Certificado de calidad vigente; apto para clases y reservas." }, notes: "Recurso principal del area de Boxeo.", status: "Operativo" },
    { id: "ma4", code: "SPI-001", name: "Bike Sprint A", type: "Spinning", areaId: "a-spinning", brand: "Keiser", model: "M3", simultaneousCapacity: 1, acquiredAt: "2024-04-22", lastMaintenance: "2026-07-30", nextMaintenance: "2026-09-30", certificate: { status: "Cargado", fileName: "cert-spi-001.pdf", reviewedBy: "Mario Escobar", reviewedAt: "2026-08-03", observations: "Pendiente de revision final." }, notes: "", status: "En mantenimiento" }
  ],
  memberships: [
    { id: "m1", clientId: "c1", planId: "p-haute", startDate: "2026-09-01", endDate: "2026-09-30", status: "Activa" },
    { id: "m2", clientId: "c2", planId: "p-basica", startDate: "2026-08-20", endDate: "2026-09-18", status: "Proxima a vencer" },
    { id: "m3", clientId: "c3", planId: "p-haute", startDate: "2026-08-01", endDate: "2026-10-30", status: "Activa" },
    { id: "m4", clientId: "c4", planId: "p-basica", startDate: "2026-08-01", endDate: "2026-08-31", status: "Suspendida" },
    { id: "m5", clientId: "c5", planId: "p-haute", startDate: "2026-09-01", endDate: "2026-09-30", status: "Activa" }
  ],
  schedules: [
    { id: "s1", type: "Coaching", date: "2026-09-10", start: "06:00", end: "07:00", areaId: "a-cardio", branchId: "b1", trainerId: "t1", capacity: 8, status: "Disponible" },
    { id: "s2", type: "Pesas", date: "2026-09-10", start: "07:00", end: "08:00", areaId: "a-pesas", branchId: "b1", trainerId: "t2", capacity: 12, status: "Disponible" },
    { id: "s3", type: "Natacion", date: "2026-09-10", start: "08:00", end: "09:00", areaId: "a-piscina", branchId: "b1", trainerId: "t1", capacity: 10, durationMinutes: 60, status: "Disponible" },
    { id: "s4", type: "Boxeo", date: "2026-09-10", start: "18:00", end: "19:00", areaId: "a-boxeo", branchId: "b1", trainerId: "t4", capacity: 15, durationMinutes: 60, status: "Disponible" },
    { id: "s8", type: "Boxeo", date: "2026-09-12", start: "07:00", end: "08:00", areaId: "a-boxeo", branchId: "b1", trainerId: "t4", capacity: 15, durationMinutes: 60, status: "Disponible" },
    { id: "s5", type: "Spinning", date: "2026-09-11", start: "18:00", end: "19:00", areaId: "a-spinning", branchId: "b2", trainerId: "t3", capacity: 12, status: "Disponible" },
    { id: "s6", type: "Entrenamiento funcional", date: "2026-09-11", start: "06:00", end: "07:00", areaId: "a-funcional", branchId: "b2", trainerId: "t1", capacity: 10, status: "Disponible" },
    { id: "s7", type: "Cardio", date: "2026-09-11", start: "17:00", end: "18:00", areaId: "a-cardio", branchId: "b1", trainerId: "t2", capacity: 14, status: "Disponible" }
  ],
  reservations: [
    { id: "r1", clientId: "c1", scheduleId: "s1", status: "Completada", attendance: "Presente", createdAt: "2026-09-09 08:00", history: [{ status: "Pendiente", at: "2026-09-09 08:00" }, { status: "Confirmada", at: "2026-09-09 08:03" }, { status: "Completada", at: "2026-09-10 07:00" }] },
    { id: "r2", clientId: "c2", scheduleId: "s2", status: "Pendiente", attendance: "Pendiente", createdAt: "2026-09-09 09:10", history: [{ status: "Pendiente", at: "2026-09-09 09:10" }] },
    { id: "r3", clientId: "c3", scheduleId: "s5", status: "Confirmada", attendance: "Pendiente", createdAt: "2026-09-08 18:10", history: [{ status: "Pendiente", at: "2026-09-08 18:10" }, { status: "Confirmada", at: "2026-09-08 18:11" }] },
    { id: "r4", clientId: "c1", scheduleId: "s4", status: "Completada", attendance: "Presente", createdAt: "2026-09-06 07:20", history: [{ status: "Pendiente", at: "2026-09-06 07:20" }, { status: "Confirmada", at: "2026-09-06 07:25" }, { status: "En curso", at: "2026-09-10 18:00" }, { status: "Completada", at: "2026-09-10 19:00" }] }
  ],
  satisfactionSurveys: [
    { id: "sv1", serviceId: "r1", serviceType: "Sesion de coaching", clientId: "c1", employeeId: "e1", branchId: "b1", date: "2026-09-10", rating: 4, quality: 4, kindness: 4, clarity: 4, satisfaction: 4, comment: "Buena sesion, seguimiento claro.", status: "Respondida" },
    { id: "sv2", serviceId: "r-coach-demo-2", serviceType: "Sesion de coaching", clientId: "c2", employeeId: "e1", branchId: "b1", date: "2026-09-12", rating: 4, quality: 4, kindness: 4, clarity: 4, satisfaction: 4, comment: "Atencion profesional.", status: "Respondida" },
    { id: "sv3", serviceId: "pay1", serviceType: "Pago atendido", clientId: "c1", employeeId: "e6", branchId: "b1", date: "2026-09-01", rating: 5, quality: 5, kindness: 5, clarity: 4, satisfaction: 5, comment: "Proceso rapido.", status: "Respondida" },
    { id: "sv4", serviceId: "pay2", serviceType: "Renovacion de membresia", clientId: "c2", employeeId: "e6", branchId: "b1", date: "2026-09-05", rating: 3, quality: 3, kindness: 4, clarity: 3, satisfaction: 3, comment: "", status: "Respondida" },
    { id: "sv-pending-1", serviceId: "r4", serviceType: "Clase completada", clientId: "c1", employeeId: "e4", branchId: "b1", date: "2026-09-10", status: "Pendiente" }
  ],
  maintenance: [
    { id: "mt1", machineId: "ma4", type: "Preventivo", startDate: "2026-09-09", estimatedEnd: "2026-09-12", technician: "TecnoFit", cost: 450, description: "Revision de bicicletas de spinning.", result: "", status: "En proceso" }
  ],
  payments: [
    { id: "pay1", clientId: "c1", branchId: "b1", itemType: "Membresia", planId: "p-haute", amount: 350, date: "2026-09-01", method: "Tarjeta", receipt: "FAC-1001", status: "Pagado", receptionistId: "e6", invoice: { number: "1001", series: "REN-A", date: "2026-09-01", status: "Enviada", email: "ana@gym.test", sent: true, attempts: 1 } },
    { id: "pay2", clientId: "c2", branchId: "b1", itemType: "Membresia", planId: "p-basica", amount: 250, date: "2026-09-05", method: "Efectivo", receipt: "FAC-1002", status: "Pagado", receptionistId: "e6", invoice: { number: "1002", series: "REN-A", date: "2026-09-05", status: "Emitida", email: "carlos@gym.test", sent: false, attempts: 0 } },
    { id: "pay3", clientId: "c3", branchId: "b2", itemType: "Producto", amount: 125, date: "2026-09-04", method: "Transferencia", receipt: "FAC-1003", status: "Pagado", invoice: { number: "1003", series: "REN-B", date: "2026-09-04", status: "Pendiente de emision", email: "sofia@gym.test", sent: false, attempts: 0 } }
  ],
  referralProgram: {
    id: "refprog-demo",
    name: "Referidos Basica demo",
    participatingPlanIds: ["p-basica"],
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    benefitType: "Saldo a favor",
    amount: 10,
    beneficiary: "Cliente que refiere",
    maxReferrals: 20,
    validityDays: 30,
    conditions: "El referido debe adquirir y pagar una membresia participante. Estado del requisito: pendiente de validacion con el cliente.",
    status: "Activa"
  },
  referrals: [
    { id: "ref1", referrerClientId: "c1", referralCode: "REF-CLI001", referredClientId: "c2", referredName: "Carlos Ruiz", referredPhone: "5551-2002", referredEmail: "carlos@gym.test", branchId: "b1", membershipId: "m2", paymentId: "pay2", benefitId: "rb1", date: "2026-09-05", status: "Beneficio aprobado" }
  ],
  referralBenefits: [
    { id: "rb1", referralId: "ref1", referrerClientId: "c1", referredClientId: "c2", paymentId: "pay2", type: "Saldo a favor", amount: 10, pendingAmount: 10, beneficiary: "Cliente que refiere", generatedAt: "2026-09-05", expiresAt: "2026-10-05", status: "Aprobado", appliedAt: "", appliedPaymentId: "" }
  ],
  purchaseOrders: [
    { id: "po1", number: "OC-2026-001", date: "2026-09-01", branchId: "b1", requesterId: "e8", supplier: "FitMachines GT", purchaseType: "Nueva maquina", items: [{ name: "Caminadora comercial", quantity: 2, unitPrice: 14500 }], quotes: [{ supplier: "FitMachines GT", price: 29000, quality: 94 }, { supplier: "ProGym", price: 30300, quality: 90 }, { supplier: "Equipos Maya", price: 28500, quality: 86 }], warranty: "24 meses", deliveryTime: "20 dias", certificate: { status: "Aprobado", fileName: "cert-caminadora.pdf", reviewedBy: "Valeria Rivas", reviewedAt: "2026-09-02", observations: "Certificado valido." }, taxRate: 0.12, reason: "Ampliacion de cardio Zona 10", expectedDelivery: "2026-09-20", observations: "Instalacion incluida.", status: "Ordenada", approvals: { branchAdmin: { by: "e8", at: "2026-09-01 09:00" }, generalManager: { by: "e8", at: "2026-09-01 10:00" } }, reception: null },
    { id: "po2", number: "OC-2026-002", date: "2026-09-02", branchId: "b2", requesterId: "e5", supplier: "Bike Studio", purchaseType: "Nueva maquina", items: [{ name: "Bicicleta indoor", quantity: 5, unitPrice: 6200 }], quotes: [{ supplier: "Bike Studio", price: 31000, quality: 91 }, { supplier: "Indoor Pro", price: 32500, quality: 93 }, { supplier: "SportLine", price: 30000, quality: 84 }], warranty: "18 meses", deliveryTime: "30 dias", certificate: { status: "Pendiente", fileName: "", reviewedBy: "", reviewedAt: "", observations: "No recibido aun." }, taxRate: 0.12, reason: "Reemplazo de bicicletas antiguas", expectedDelivery: "2026-10-01", observations: "Certificado pendiente.", status: "En revision", approvals: { branchAdmin: null, generalManager: null }, reception: null }
  ],
  products: [
    { id: "prod1", code: "CAF-001", name: "Bowl proteico", description: "Yogurt, fruta y granola.", category: "Cafeteria", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80", price: 45, stock: 18, branchId: "b1", partnerId: "", status: "Activo" },
    { id: "prod2", code: "BEB-001", name: "Smoothie verde", description: "Bebida post entrenamiento.", category: "Bebidas", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80", price: 32, stock: 25, branchId: "b1", partnerId: "", status: "Activo" },
    { id: "prod3", code: "SUP-001", name: "Proteina whey", description: "Suplemento de 2 lb.", category: "Suplementos", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=80", price: 280, stock: 9, branchId: "b2", partnerId: "par2", status: "Activo" },
    { id: "prod4", code: "COM-001", name: "Combo energia", description: "Smoothie mas barra proteica.", category: "Combos", image: "https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=900&q=80", price: 58, stock: 12, branchId: "b1", partnerId: "", status: "Activo" }
  ],
  partners: [
    { id: "par1", name: "NutriWell", type: "Nutricionista", contact: "nutriwell@gym.test", status: "Activo" },
    { id: "par2", name: "Suplementos GT", type: "Proveedor", contact: "ventas@suplementos.test", status: "Activo" },
    { id: "par3", name: "RelaxPro", type: "Masajes", contact: "agenda@relax.test", status: "Activo" }
  ],
  services: [
    { id: "srv1", name: "Consulta nutricional", partnerId: "par1", branchId: "b1", price: 220, schedule: "Lun y mie 09:00-13:00", availability: "6 espacios", status: "Propuesta pendiente de validacion" },
    { id: "srv2", name: "Masaje deportivo", partnerId: "par3", branchId: "b1", price: 180, schedule: "Vie 14:00-18:00", availability: "4 espacios", status: "Propuesta pendiente de validacion" },
    { id: "srv3", name: "Coaching adicional", partnerId: "", branchId: "b2", price: 120, schedule: "Segun coach", availability: "Configurable", status: "Activo" }
  ],
  carts: [],
  dailyReports: [
    { id: "dr1", date: "2026-09-10", branchId: "b1", attendedUsers: 38, averageMinutes: 82, peakHour: "18:00", membershipsSold: 3, productsSold: 8, partnerServiceSales: 2, swimmingAttendance: 9, boxingAttendance: 12, totalIncome: 1825, accessWarnings: 1, emailStatus: "Error de envio", savedAt: "2026-09-10 22:15" }
  ],
  audit: [
    { id: "log1", at: "2026-09-09 08:03", user: "Sistema", module: "Reservas", action: "Confirmar reserva", detail: "Ana Lopez / Cardio" }
  ]
};
