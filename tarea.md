# Tarea: migrar GymCore a PHP puro sin base de datos

Revisar completamente el prototipo actual de Renovatio Gym y migrarlo para que utilice PHP puro.

## Objetivo

Conservar exactamente:

- diseño actual;
- colores;
- menú lateral;
- vistas;
- módulos;
- formularios;
- datos de demostración;
- roles;
- reglas de negocio;
- estados;
- navegación;
- diseño responsivo.

La diferencia es que ahora la navegación, sesiones, formularios, validaciones y persistencia deben utilizar PHP puro.

## Tecnologías

- PHP 8.1 o superior
- HTML5
- Tailwind CSS
- JavaScript puro
- Archivos JSON para almacenar información
- Sesiones de PHP para autenticación y mensajes
- Sin Laravel
- Sin Composer, salvo que ya sea estrictamente necesario
- Sin MySQL ni otra base de datos
- Sin React, Vue o Angular

JavaScript puede continuar utilizándose para modales, filtros visuales, confirmaciones y gráficas, pero PHP debe controlar los datos y las operaciones principales.

## 1. Revisar antes de modificar

Antes de comenzar:

1. Analizar todos los archivos actuales.
2. Identificar módulos, componentes y funciones JavaScript.
3. No eliminar módulos ya desarrollados.
4. No cambiar el diseño sin necesidad.
5. Reutilizar HTML, Tailwind y JavaScript existente.
6. Convertir las páginas necesarias de `.html` a `.php`.
7. Mantener todas las mejoras solicitadas anteriormente.

## 2. Estructura recomendada

Organizar el proyecto aproximadamente así:

```text
renovatio-gym/
├── index.php
├── login.php
├── logout.php
├── dashboard.php
├── config/
│   ├── config.php
│   └── modules.php
├── includes/
│   ├── auth.php
│   ├── functions.php
│   ├── storage.php
│   ├── validation.php
│   ├── header.php
│   ├── sidebar.php
│   ├── footer.php
│   └── flash.php
├── actions/
│   ├── clients/
│   ├── employees/
│   ├── memberships/
│   ├── branches/
│   ├── reservations/
│   ├── equipment/
│   ├── certificates/
│   ├── purchases/
│   ├── payments/
│   ├── products/
│   ├── surveys/
│   └── metrics/
├── modules/
│   ├── branches/
│   ├── clients/
│   ├── employees/
│   ├── memberships/
│   ├── access/
│   ├── areas-equipment/
│   ├── schedules/
│   ├── reservations/
│   ├── cafeteria/
│   ├── sales-payments/
│   ├── purchases/
│   ├── inventory/
│   ├── maintenance/
│   ├── referrals/
│   ├── surveys/
│   ├── metrics/
│   └── reports/
├── storage/
│   ├── users.json
│   ├── branches.json
│   ├── clients.json
│   ├── employees.json
│   ├── memberships.json
│   ├── areas.json
│   ├── equipment.json
│   ├── schedules.json
│   ├── reservations.json
│   ├── maintenance.json
│   ├── purchases.json
│   ├── payments.json
│   ├── products.json
│   ├── sales.json
│   ├── referrals.json
│   ├── surveys.json
│   ├── metrics.json
│   └── audit.json
├── uploads/
│   ├── certificates/
│   ├── invoices/
│   └── products/
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── README.md

Puede adaptar la estructura si el proyecto actual ya está organizado, pero debe mantener separación entre vistas, acciones, componentes y almacenamiento.

3. Persistencia mediante JSON

Reemplazar LocalStorage como almacenamiento principal por archivos JSON manejados desde PHP.

Crear funciones reutilizables para:

leer archivos JSON;
guardar información;
crear registros;
actualizar registros;
buscar por ID;
eliminar o desactivar;
generar identificadores únicos;
filtrar registros;
registrar auditoría.

Usar bloqueo de archivos con flock() al escribir para evitar corrupción si se realizan dos operaciones al mismo tiempo.

Si el archivo no existe, crearlo con un arreglo vacío o con datos de demostración.

No almacenar toda la información en un solo archivo JSON.

4. Sesiones y autenticación

Utilizar session_start() y crear un inicio de sesión simulado.

Conservar los perfiles:

Administrador
Gerente general
Supervisor
Recepcionista
Coach
Cliente
Compras
Inventario
Cafetería
Partner

Guardar en sesión:

ID del usuario;
nombre;
rol;
sucursal;
permisos.

Crear funciones como:

requireLogin()
currentUser()
hasRole()
hasPermission()
redirectByRole()

No permitir acceder a módulos restringidos escribiendo directamente la URL.

Si un usuario intenta ingresar sin permiso, mostrar una página 403.

5. Componentes reutilizables

Separar en archivos PHP reutilizables:

encabezado;
menú lateral;
barra superior;
pie de página;
modales;
alertas;
mensajes;
validación de sesión.

El menú debe cambiar de acuerdo con el rol autenticado.

No duplicar todo el HTML del menú en cada página.

6. Formularios funcionales

Los formularios deben enviarse mediante POST a acciones PHP.

Implementar operaciones funcionales para:

registrar;
editar;
consultar;
cambiar estado;
desactivar;
eliminar cuando sea permitido.

Después de cada operación:

Validar los datos.
Actualizar el JSON correspondiente.
Registrar la operación en auditoría.
Crear un mensaje flash.
Redirigir al módulo correspondiente.

Evitar reenviar el formulario al actualizar la página utilizando el patrón POST/Redirect/GET.

7. Seguridad básica

Implementar:

validación del método HTTP;
sanitización de salidas con htmlspecialchars();
validación de campos requeridos;
protección CSRF en formularios;
control de permisos;
validación de IDs;
validación de archivos;
restricción de extensiones y tamaños;
nombres seguros para archivos subidos.

No confiar únicamente en validaciones JavaScript.

8. Módulos que deben conservarse

Mantener funcionales:

Dashboard
Sucursales
Clientes
Empleados
Membresías
Accesos
Áreas y equipos
Horarios y clases
Reservas
Cafetería y suplementos
Ventas y pagos
Compras y proveedores
Inventario
Mantenimiento
Referidos
Encuestas
Métricas y bonos
Reportes
Configuración
9. Membresías

Conservar inicialmente:

Básica: Q250
Haute: Q350

Permitir:

crear nuevos planes;
editar;
desactivar;
eliminar únicamente si no tienen clientes relacionados;
configurar beneficios;
administrar referidos.

Todas estas operaciones deben guardarse en memberships.json.

10. Áreas y equipos

Mantener las áreas:

Cardio
Pesas
Spinning
Entrenamiento funcional
Piscina
Boxeo
Salón de clases
Vestidores

Registrar equipos con:

código;
nombre;
tipo;
sucursal;
área;
marca;
modelo;
capacidad;
estado;
mantenimiento;
certificado.

No controlar qué persona está utilizando una máquina específica.

La capacidad del equipo solamente se utiliza para calcular el aforo operativo del área.

11. Certificados

Mantener la gestión mejorada de certificados:

número;
entidad emisora;
emisión;
vencimiento;
archivo;
estado;
observaciones;
historial.

Permitir subir archivos a:

uploads/certificates/

El estado del certificado debe aparecer en la tabla de equipos.

No permitir que un equipo quede “Operativo” sin certificado aprobado.

12. Reservas y horarios

PHP debe validar:

membresía vigente;
beneficio permitido;
sucursal;
clase disponible;
cupos;
conflictos de horario;
coach asignado;
piscina o boxeo habilitado.

El cupo debe actualizarse al crear o cancelar una reserva.

La membresía Básica no tiene acceso a boxeo.

13. Ventas, pagos y facturas

Registrar ventas y pagos en JSON.

Mantener estados:

Pendiente
Aprobado
Rechazado
Cancelado
Reembolsado

Simular la integración externa de facturación.

Guardar:

número de factura;
serie;
correo del cliente;
fecha;
estado de emisión;
estado de envío.

No se necesita enviar correos reales, pero debe existir una acción PHP que simule el envío y actualice el estado.

14. Compras y proveedores

Mantener:

solicitudes;
proveedores;
cotizaciones;
comparación;
Top 3;
orden de compra;
aprobación;
certificado;
recepción;
incorporación al inventario.

Una máquina nueva no puede incorporarse como operativa sin certificado aprobado.

15. Cafetería y suplementos

Mantener:

productos;
bebidas;
suplementos;
combos;
inventario;
carrito;
ventas;
descuentos;
partners.

El cliente debe poder consultar el menú y simular una compra.

Las existencias deben actualizarse en el JSON después de una venta aprobada.

16. Métricas, bonos y encuestas

Mantener:

temporadas de evaluación;
dos métricas independientes para coaches;
dos métricas independientes para recepcionistas;
escalones de bonificación;
sueldo base;
bonos separados;
encuesta de satisfacción;
resultados individuales.

Los cálculos pueden realizarse mediante funciones PHP basadas en los datos JSON.

No mostrar los mismos resultados para todos los empleados.

17. Dashboard y reportes

Calcular la información leyendo los archivos JSON:

clientes activos;
ingresos;
reservas;
ocupación;
ventas;
equipos;
mantenimientos;
clases;
compras;
bonos;
encuestas.

Aplicar filtros por sucursal, fechas y estados.

Los reportes deben respetar los permisos del usuario.

18. JavaScript

Mantener JavaScript para:

abrir y cerrar modales;
confirmaciones;
filtros instantáneos;
pestañas;
menú móvil;
gráficas;
actualización visual;
vista previa de archivos.

No dejar en JavaScript las validaciones críticas ni la persistencia principal.

19. Datos de demostración

Conservar los datos actuales y migrarlos a JSON.

Agregar un script PHP:

reset-demo.php

Este archivo debe restaurar los datos iniciales únicamente cuando el usuario sea administrador y confirme la acción.

Guardar una copia de los datos originales en:

storage/demo/
20. Ejecución

El proyecto debe poder iniciarse con:

php -S localhost:8000

Y abrirse en:

http://localhost:8000

Crear instrucciones claras en README.md.

Criterios de aceptación
El diseño actual se conserva.
Las páginas principales utilizan PHP.
Los formularios funcionan mediante POST.
La información se almacena en archivos JSON.
No se utiliza base de datos.
No se utiliza Laravel ni otro framework PHP.
Existe autenticación mediante sesiones.
Los permisos funcionan también al escribir directamente una URL.
Las operaciones utilizan POST/Redirect/GET.
Existe protección CSRF.
Los certificados pueden simular carga de archivos.
Los datos se actualizan sin depender de LocalStorage.
El Dashboard utiliza los datos almacenados en JSON.
Todos los módulos anteriores continúan disponibles.
El proyecto funciona con php -S localhost:8000.
No existen errores PHP ni errores importantes en la consola.
Actualizar README y documentación técnica.

Primero realizar un inventario del proyecto actual. Después migrar de forma progresiva, reutilizando el diseño existente y verificando cada módulo antes de continuar.