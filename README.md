# GymCore

Prototipo academico funcional para administracion de gimnasio. Usa HTML5, Tailwind por CDN, JavaScript puro, Lucide Icons, Chart.js y LocalStorage.

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
- Gestion de clientes, membresias, inventario, horarios, reservas, mantenimiento, pagos y reportes.
- Modulo de sucursales con capacidad, contacto, encargado, estado e indicadores relacionados.
- Inventario con pestanas separadas para areas y maquinas.
- Mantenimiento separado del inventario con filtros, historial y acciones por estado.
- Dashboard filtrable por sucursal.
- Reportes por categorias con imprimir, CSV y descarga simulada.
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
