# Renovatio Gym

Aplicacion academica migrada a PHP puro. Conserva el estilo visual del prototipo original, pero ahora la navegacion, autenticacion, permisos, formularios, validaciones principales y persistencia se ejecutan del lado servidor.

## Ejecucion

Requisitos:

- PHP 8.1 o superior
- Navegador moderno
- Sin Laravel, Composer ni base de datos

Iniciar servidor:

```bash
php -S localhost:8000
```

Abrir:

```text
http://localhost:8000
```

Clave demo para todas las cuentas:

```text
Gym2026!
```

## Cuentas demo

- Administrador: `admin@gym.test`
- Gerente general: `gerencia@gym.test`
- Supervisor: `supervisor@gym.test`
- Recepcionista: `recepcion@gym.test`
- Coach: `trainer@gym.test`
- Cliente: `cliente@gym.test`
- Compras: `compras@gym.test`
- Inventario: `inventario@gym.test`
- Cafeteria: `cafeteria@gym.test`
- Partner: `partner@gym.test`

## Arquitectura

- `index.php`: entrada autenticada y router por modulo.
- `login.php` / `logout.php`: sesiones PHP.
- `config/modules.php`: definicion central de modulos, permisos, colecciones y campos.
- `includes/auth.php`: usuario actual, roles, permisos y CSRF.
- `includes/storage.php`: lectura/escritura JSON con `flock()`.
- `includes/validation.php`: validaciones compartidas.
- `includes/header.php`, `sidebar.php`, `footer.php`, `flash.php`: componentes reutilizables.
- `modules/dashboard.php`: indicadores calculados desde JSON.
- `modules/generic.php`: tablas y formularios reutilizables para modulos.
- `actions/save.php`, `status.php`, `delete.php`: operaciones POST con Redirect/Get, auditoria y flash.
- `reset-demo.php`: restaura datos demo desde `storage/demo`, solo para usuarios con permiso de configuracion.
- `storage/*.json`: persistencia principal.
- `storage/demo/*.json`: copia original de datos demo.
- `uploads/certificates/`: archivos de certificados simulados.

## Funcionalidades migradas

- Login simulado con sesiones PHP.
- Menu lateral segun rol autenticado.
- Bloqueo 403 al escribir URLs sin permiso.
- Formularios con POST, CSRF y patron POST/Redirect/GET.
- Persistencia en archivos JSON separados por coleccion.
- Auditoria de operaciones.
- Dashboard con clientes, ingresos, reservas, equipos, clases, compras y encuestas.
- Modulos disponibles: dashboard, sucursales, clientes, empleados, membresias, accesos, areas y equipos, horarios, reservas, cafeteria, ventas y pagos, compras, inventario, mantenimiento, referidos, encuestas, metricas, reportes y configuracion.
- Certificados en equipos con carga PDF/JPG/PNG y bloqueo para impedir estado Operativo sin certificado aprobado.
- Eliminacion segura de planes: si tienen membresias relacionadas se desactivan.
- JavaScript reducido a interacciones visuales: menu movil, filtros instantaneos, confirmaciones, toasts y graficas.

## Datos demo

Los datos originales de `assets/js/data.js` fueron migrados a JSON. Para regenerarlos desde el seed:

```bash
node tools/migrate-seed.js
```

Desde la aplicacion, el boton **Restaurar demo** copia `storage/demo/*.json` sobre `storage/*.json`; requiere sesion con permiso de configuracion.

