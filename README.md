# Renovatio Gym

Prototipo academico funcional para administracion de Renovatio Gym. Usa HTML5, Tailwind por CDN, JavaScript puro, Lucide Icons, Chart.js y LocalStorage.

## Ejecucion

Abre `index.html` directamente o usa Live Server.

Clave demo: `Gym2026!`

Cuentas:

- Administrador: `admin@gym.test`
- Recepcionista: `recepcion@gym.test`
- Entrenador: `trainer@gym.test`
- Cliente: `cliente@gym.test`

## Funcionalidades

- Login simulado por rol.
- Dashboard con indicadores y graficas.
- Gestion administrativa de clientes, empleados, membresias, inventario, horarios, reservas, mantenimiento, ordenes de compra, pagos, metricas del personal y reportes.
- Modulo de sucursales con capacidad, contacto, encargado, estado e indicadores relacionados.
- Inventario con pestanas separadas para areas y maquinas.
- Mantenimiento separado del inventario con filtros, historial y acciones por estado.
- Dashboard filtrable por sucursal.
- Reportes por categorias con imprimir, CSV y descarga simulada.
- Clientes con busqueda, filtros por sucursal, membresia y estado, detalle de pagos, membresias, reservas, asistencias y observaciones.
- Empleados con busqueda, filtros por sucursal, puesto y estado, acciones de activacion/desactivacion y datos laborales.
- Metricas individuales para coaches y recepcionistas, con dos metas obligatorias, progreso y calculo de bonificacion.
- Ordenes de compra de maquinas, repuestos, accesorios, oficina e insumos, con flujo de aprobacion y recepcion.
- Sucursales con amenidades administradas como areas operativas.
- Ordenes de compra con visto bueno del administrador de sucursal y gerente general antes de aprobar.
- Recepcion de equipo con cantidades recibidas, entrega completa/parcial e incorporacion opcional al inventario antes de registrar maquina.
- Reglas de negocio para reservas, cupos, maquinas, areas, membresias, traslapes y cancelaciones.
- Datos persistentes en LocalStorage.
- Boton para restaurar datos demo.
- Modales, toasts, filtros, badges de estados y tablas responsivas.

## Estructura

- `index.html`: shell de login y aplicacion.
- `assets/css/styles.css`: estilos del sistema visual.
- `assets/js/data.js`: datos semilla.
- `assets/js/storage.js`: LocalStorage.
- `assets/js/validations.js`: reglas de negocio y calculos.
- `assets/js/reservations.js`: operaciones de reservas y auditoria.
- `assets/js/app.js`: renderizado, navegacion y eventos.
