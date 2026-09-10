window.DIALI_SEED = {
  users: [
    { id: 1, name: "Valeria Rivas", email: "admin@diali.test", role: "admin", department: "Tecnologia", status: "Activo" },
    { id: 2, name: "Mario Escobar", email: "supervisor@diali.test", role: "supervisor", department: "Operaciones", status: "Activo" },
    { id: 3, name: "Andrea Lima", email: "analista@diali.test", role: "analyst", department: "Finanzas", status: "Activo" },
    { id: 4, name: "Diego Paredes", email: "soporte@diali.test", role: "support", department: "Soporte", status: "Activo" },
    { id: 5, name: "Carla Soto", email: "empleado@diali.test", role: "employee", department: "Comercial", status: "Activo" },
    { id: 6, name: "Hector Molina", email: "auditor@diali.test", role: "auditor", department: "Auditoria", status: "Activo" },
    { id: 7, name: "Cliente Norte SA", email: "cliente@diali.test", role: "client", department: "Externo", status: "Activo" }
  ],
  documents: [
    { id: 1, name: "Contrato marco Retail Norte.pdf", type: "Contrato", owner: "Andrea Lima", department: "Legal", date: "2026-08-18", status: "Aprobado", confidence: 93, confidentiality: "Interna", source: "Gestor documental", extracted: { cliente: "Retail Norte SA", monto: "$48,500", vencimiento: "2027-08-18" } },
    { id: 2, name: "Factura F-8831.pdf", type: "Factura", owner: "Andrea Lima", department: "Finanzas", date: "2026-08-21", status: "Requiere revision", confidence: 72, confidentiality: "Restringida", source: "Correo", extracted: { proveedor: "CloudOps", total: "$12,940", impuestos: "$1,553" } },
    { id: 3, name: "Reporte financiero Q3.xlsx", type: "Reporte financiero", owner: "Valeria Rivas", department: "Finanzas", date: "2026-08-29", status: "Procesado", confidence: 91, confidentiality: "Restringida", source: "ERP", extracted: { utilidad: "$183,000", variacion: "-4.2%", riesgo: "Medio" } },
    { id: 4, name: "Acta reunion expansion.mp3", type: "Audio de reunion", owner: "Carla Soto", department: "Comercial", date: "2026-08-30", status: "Procesando", confidence: 0, confidentiality: "Interna", source: "Audio", extracted: { duracion: "43 min", participantes: "6", idioma: "es" } },
    { id: 5, name: "Correo reclamo cliente.eml", type: "Correo electronico", owner: "Diego Paredes", department: "Soporte", date: "2026-08-31", status: "Integrado al ERP/CRM", confidence: 96, confidentiality: "Confidencial", source: "CRM", extracted: { cliente: "Banco Delta", sentimiento: "Negativo", urgencia: "Alta" } },
    { id: 6, name: "Orden escaneada 221.png", type: "Documento escaneado", owner: "Andrea Lima", department: "Operaciones", date: "2026-09-01", status: "Error", confidence: 39, confidentiality: "Interna", source: "Scanner", extracted: { motivo: "Imagen borrosa", paginas: "2", reintentos: "1" } },
    { id: 7, name: "Contrato renovacion Alpha.pdf", type: "Contrato", owner: "Mario Escobar", department: "Legal", date: "2026-09-02", status: "En cola", confidence: 0, confidentiality: "Interna", source: "Portal" },
    { id: 8, name: "Factura proveedor logistico.pdf", type: "Factura", owner: "Andrea Lima", department: "Finanzas", date: "2026-09-02", status: "Cargado", confidence: 0, confidentiality: "Restringida", source: "Correo" },
    { id: 9, name: "Minuta comite riesgo.docx", type: "Documento escaneado", owner: "Hector Molina", department: "Auditoria", date: "2026-09-03", status: "Archivado", confidence: 89, confidentiality: "Confidencial", source: "Gestor documental" },
    { id: 10, name: "Reporte cartera agosto.xlsx", type: "Reporte financiero", owner: "Valeria Rivas", department: "Finanzas", date: "2026-09-03", status: "Rechazado", confidence: 81, confidentiality: "Restringida", source: "ERP", rejectionReason: "Datos de periodo incompletos" },
    { id: 11, name: "Correo solicitud SLA.eml", type: "Correo electronico", owner: "Diego Paredes", department: "Soporte", date: "2026-09-04", status: "Procesado", confidence: 88, confidentiality: "Interna", source: "Correo" },
    { id: 12, name: "Contrato confidencial Beta.pdf", type: "Contrato", owner: "Valeria Rivas", department: "Legal", date: "2026-09-04", status: "Borrador", confidence: 0, confidentiality: "Confidencial", source: "Portal" },
    { id: 13, name: "Factura servicios IA.pdf", type: "Factura", owner: "Andrea Lima", department: "Finanzas", date: "2026-09-05", status: "Procesado", confidence: 95, confidentiality: "Restringida", source: "Correo" },
    { id: 14, name: "Audio reunion cobranza.wav", type: "Audio de reunion", owner: "Carla Soto", department: "Finanzas", date: "2026-09-05", status: "Requiere revision", confidence: 63, confidentiality: "Restringida", source: "Audio" },
    { id: 15, name: "Documento identidad proveedor.jpg", type: "Documento escaneado", owner: "Andrea Lima", department: "Compras", date: "2026-09-06", status: "Aprobado", confidence: 90, confidentiality: "Confidencial", source: "Portal" }
  ],
  tickets: [
    { id: 1, subject: "No puedo ver mi factura", requester: "Retail Norte SA", owner: "Diego Paredes", priority: "Alta", status: "En atencion", elapsed: "3h 20m", solution: "", comments: ["IA clasifico como facturacion"] },
    { id: 2, subject: "Error al subir contrato", requester: "Carla Soto", owner: "Andrea Lima", priority: "Media", status: "Asignado", elapsed: "1h 05m", solution: "" },
    { id: 3, subject: "Incidente critico API CRM", requester: "Banco Delta", owner: "Mario Escobar", priority: "Critica", status: "Escalado", elapsed: "45m", solution: "" },
    { id: 4, subject: "Consulta estado de solicitud", requester: "Cliente Norte SA", owner: "Diego Paredes", priority: "Baja", status: "Nuevo", elapsed: "12m", solution: "" },
    { id: 5, subject: "Reapertura por respuesta incompleta", requester: "Retail Norte SA", owner: "Diego Paredes", priority: "Alta", status: "Reabierto", elapsed: "7h 10m", solution: "Se envio primer diagnostico" },
    { id: 6, subject: "Solicitud de integracion webhook", requester: "Valeria Rivas", owner: "Valeria Rivas", priority: "Media", status: "Clasificado", elapsed: "2h 00m", solution: "" },
    { id: 7, subject: "Cliente solicita eliminar datos", requester: "Banco Delta", owner: "Hector Molina", priority: "Alta", status: "En espera del cliente", elapsed: "1d 3h", solution: "" },
    { id: 8, subject: "Cambio de responsable", requester: "Andrea Lima", owner: "Mario Escobar", priority: "Baja", status: "Resuelto", elapsed: "5h 44m", solution: "Caso reasignado y notificado" },
    { id: 9, subject: "Solicitud cerrada por conformidad", requester: "Cliente Norte SA", owner: "Diego Paredes", priority: "Media", status: "Cerrado", elapsed: "2d", solution: "Cliente confirmo recepcion" },
    { id: 10, subject: "Anomalia en reporte mensual", requester: "Finanzas", owner: "Andrea Lima", priority: "Critica", status: "Asignado", elapsed: "25m", solution: "" }
  ],
  automations: [
    { id: 1, name: "Factura aprobada a ERP", trigger: "Documento aprobado", conditions: "Tipo = Factura; confianza >= 85", actions: "Crear cuenta por pagar", target: "ERP", status: "Activa", success: 94, runs: 123 },
    { id: 2, name: "Ticket critico a supervisor", trigger: "Prioridad critica", conditions: "Cliente premium o SLA < 1h", actions: "Escalar y notificar", target: "CRM", status: "Activa", success: 88, runs: 56 },
    { id: 3, name: "Indexacion nocturna RAG", trigger: "Programado", conditions: "Fuentes activas", actions: "Reindexar fragmentos", target: "Servicio IA", status: "Pausada", success: 97, runs: 31 },
    { id: 4, name: "Contrato vencido", trigger: "Fecha de vencimiento", conditions: "Vence en 30 dias", actions: "Crear alerta comercial", target: "CRM", status: "Borrador", success: 0, runs: 0 },
    { id: 5, name: "Reporte financiero anomalo", trigger: "Alerta confirmada", conditions: "Riesgo alto", actions: "Notificar auditoria", target: "Webhook", status: "Fallida", success: 61, runs: 12 }
  ],
  alerts: [
    { id: 1, title: "Riesgo de fuga Banco Delta", type: "Fuga de clientes", department: "Comercial", risk: "Alto", status: "Accion recomendada", date: "2026-09-04", recommendation: "Contactar sponsor ejecutivo y ofrecer plan de estabilidad SLA." },
    { id: 2, title: "Anomalia margen Q3", type: "Anomalia financiera", department: "Finanzas", risk: "Alto", status: "En analisis", date: "2026-09-03", recommendation: "Validar asientos extraordinarios y contratos asociados." },
    { id: 3, title: "Incremento tickets facturacion", type: "Tendencia soporte", department: "Soporte", risk: "Medio", status: "Detectada", date: "2026-09-02", recommendation: "Publicar respuesta RAG y revisar plantilla de facturas." },
    { id: 4, title: "Automatizacion con caida de exito", type: "Rendimiento RPA", department: "Tecnologia", risk: "Medio", status: "Confirmada", date: "2026-09-01", recommendation: "Revisar API ERP y reintentos." },
    { id: 5, title: "Cliente Norte aumenta consultas", type: "Fuga de clientes", department: "Comercial", risk: "Bajo", status: "Descartada", date: "2026-08-30", recommendation: "Monitorear sin accion inmediata." },
    { id: 6, title: "Documento financiero con baja confianza", type: "Anomalia financiera", department: "Finanzas", risk: "Alto", status: "Accion ejecutada", date: "2026-08-29", recommendation: "Enviar a revision de supervisor." },
    { id: 7, title: "SLA soporte en riesgo", type: "Tendencia soporte", department: "Soporte", risk: "Alto", status: "Accion recomendada", date: "2026-08-28", recommendation: "Activar guardia y reasignar tickets criticos." },
    { id: 8, title: "Oportunidad de upsell Retail Norte", type: "Recomendacion comercial", department: "Comercial", risk: "Bajo", status: "Cerrada", date: "2026-08-25", recommendation: "Ofrecer modulo de analitica avanzada." }
  ],
  knowledge: [
    { id: 1, name: "Politicas corporativas", indexed: 183, updated: "2026-09-02", status: "Indexada", confidentiality: "Interna", permissions: "Todos los empleados" },
    { id: 2, name: "Contratos activos", indexed: 941, updated: "2026-09-01", status: "Indexada", confidentiality: "Confidencial", permissions: "Admin, Supervisor, Analista" },
    { id: 3, name: "Base soporte CRM", indexed: 420, updated: "2026-09-05", status: "Indexando", confidentiality: "Interna", permissions: "Soporte, Supervisor, Admin" },
    { id: 4, name: "Reportes financieros", indexed: 267, updated: "2026-08-31", status: "Indexada", confidentiality: "Restringida", permissions: "Admin, Supervisor, Analista, Auditor" },
    { id: 5, name: "FAQ clientes", indexed: 89, updated: "2026-09-04", status: "Indexada", confidentiality: "Publica", permissions: "Clientes y empleados" }
  ],
  integrations: [
    { id: 1, name: "ERP financiero", type: "ERP", status: "Conectada", lastSync: "2026-09-06 21:20", encrypted: true },
    { id: 2, name: "CRM corporativo", type: "CRM", status: "Conectada", lastSync: "2026-09-06 21:02", encrypted: true },
    { id: 3, name: "Correo Microsoft 365", type: "Correo electronico", status: "Error", lastSync: "2026-09-06 18:12", encrypted: true },
    { id: 4, name: "Repositorio documental", type: "Almacenamiento documental", status: "En mantenimiento", lastSync: "2026-09-05 23:00", encrypted: true },
    { id: 5, name: "Proveedor LLM", type: "Servicio de IA", status: "Conectada", lastSync: "2026-09-06 21:25", encrypted: true },
    { id: 6, name: "Webhook auditoria", type: "Webhooks", status: "Desconectada", lastSync: "2026-09-01 10:30", encrypted: false }
  ],
  conversations: [
    { id: 1, user: "Carla Soto", status: "Activa", source: "Politicas corporativas", confidence: 91, messages: 6 },
    { id: 2, user: "Cliente Norte SA", status: "Escalada a agente humano", source: "FAQ clientes", confidence: 54, messages: 4 },
    { id: 3, user: "Andrea Lima", status: "Resuelta", source: "Reportes financieros", confidence: 88, messages: 8 }
  ],
  audit: [
    { id: 1, user: "Valeria Rivas", action: "Aprobar documento", module: "Documentos", record: "Contrato marco Retail Norte.pdf", before: "Procesado", after: "Aprobado", date: "2026-09-06 09:15", ip: "10.20.4.11", result: "Exitoso" },
    { id: 2, user: "Mario Escobar", action: "Escalar ticket", module: "Tickets", record: "Incidente critico API CRM", before: "Asignado", after: "Escalado", date: "2026-09-06 10:01", ip: "10.20.4.44", result: "Exitoso" },
    { id: 3, user: "Andrea Lima", action: "Corregir extraccion", module: "Documentos", record: "Factura F-8831.pdf", before: "Total $12,490", after: "Total $12,940", date: "2026-09-06 11:28", ip: "10.20.4.33", result: "Exitoso" },
    { id: 4, user: "Sistema IA", action: "Clasificar ticket", module: "Tickets", record: "No puedo ver mi factura", before: "Nuevo", after: "Clasificado", date: "2026-09-06 12:02", ip: "127.0.0.1", result: "Simulado" }
  ]
};
