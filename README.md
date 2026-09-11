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
- Gestion administrativa de clientes, empleados, membresias, accesos, areas/equipos, horarios, reservas, cafeteria, suplementos, ventas, compras, mantenimiento, metricas, reportes y servicios.
- Modulo de sucursales con capacidad, contacto, encargado, estado e indicadores relacionados.
- Inventario con pestanas separadas para areas y equipos, sin ocupacion individual de maquinas.
- Mantenimiento separado del inventario con filtros, historial y acciones por estado.
- Dashboard filtrable por sucursal.
- Reportes por categorias con imprimir, CSV y descarga simulada.
- Clientes con busqueda, filtros por sucursal, membresia y estado, detalle de pagos, membresias, reservas, asistencias y observaciones.
- Empleados con busqueda, filtros por sucursal, puesto y estado, acciones de activacion/desactivacion y datos laborales.
- Metricas individuales para coaches y recepcionistas, con dos bonos configurables e independientes.
- Ordenes de compra de equipos, repuestos, accesorios, oficina e insumos, con certificacion obligatoria para equipos.
- Facturacion electronica simulada con estados, envio por correo, descarga y reintento.
- Cafeteria y suplementos con productos, bebidas, combos, partners, stock y ventas.
- Vista de cliente Menu / Tienda con carrito, descuentos por membresia y factura.
- Servicios tercerizados con nutricionista como partner y agenda marcada como propuesta pendiente de validacion.
- Panel del coach limitado a sus clases, participantes, asistencia, historial y metricas.
- Reportes financieros restringidos por rol y reporte diario por sucursal.
- Sucursales con amenidades administradas como areas operativas.
- Ordenes de compra con visto bueno del administrador de sucursal y gerente general antes de aprobar.
- Recepcion de equipo con cantidades recibidas, entrega completa/parcial e incorporacion opcional al inventario antes de registrar maquina.
- Reglas de negocio para reservas, cupos, equipos, areas, membresias, facturas, compras certificadas y roles.
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
