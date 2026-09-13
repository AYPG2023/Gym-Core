# Reglas de negocio

Reglas implementadas en `assets/js/validations.js` y `assets/js/app.js`.

1. Las membresias iniciales confirmadas son solo Basica Q250 y Haute Q350.
2. Los planes pueden crearse, editarse, activarse y desactivarse.
3. Un plan sin clientes relacionados puede eliminarse; con relaciones solo se desactiva.
4. Los beneficios pendientes de Haute se muestran como pendientes de confirmacion.
5. Basica no tiene acceso a boxeo.
6. Haute puede acceder a boxeo si la sucursal tiene ring.
7. Natacion, boxeo, pesas, cardio, spinning, coaching y funcional son tipos de clase configurables.
8. Las clases pueden tener horarios distintos al horario general de la sucursal.
9. Administracion puede crear y editar clases/horarios con sucursal, area, coach, fecha, hora, cupo y estado.
10. Una clase debe usar un area perteneciente a la sucursal seleccionada.
11. Un coach no puede tener clases solapadas en la misma fecha y horario.
12. Al editar una clase con reservas activas, el cupo no puede quedar por debajo de las reservas vigentes.
13. La ocupacion individual de maquinas no se controla.
14. Los equipos no tienen estados de ocupacion individual.
15. La capacidad de equipos se usa solo para calcular capacidad operativa del area.
16. La ocupacion de personas se calcula por accesos/asistencias.
17. Estados de equipos: Operativo, En mantenimiento, Danado, Fuera de servicio, Retirado y Pendiente de documentacion.
18. El area Boxeo se configura como area deportiva de la Sucursal Premium, con recurso principal Ring de boxeo.
19. Boxeo solo puede crearse o activarse en sucursales con amenidad de boxeo habilitada.
20. El cupo inicial de Boxeo es 15 y el horario de referencia es 06:00-19:00, ambos configurables desde el formulario de area.
21. Si el ring no esta Operativo, las clases y reservas de Boxeo quedan bloqueadas por disponibilidad.
22. Un equipo nuevo no puede quedar Operativo sin certificado de calidad aprobado y vigente.
23. Si un equipo no tiene certificado aprobado, queda Pendiente de documentacion.
24. Un certificado rechazado o vencido bloquea la activacion del equipo.
25. El certificado de calidad se registra separado de las observaciones generales del equipo.
26. Estados de certificado: Pendiente, Cargado, En revision, Aprobado, Rechazado y Vencido.
27. El certificado guarda numero, entidad emisora, fecha de emision, vencimiento opcional, archivo, nombre de archivo, estado, observaciones y orden de compra relacionada.
28. Los archivos de certificado permitidos en el prototipo son PDF, JPG y PNG.
29. Al reemplazar un certificado, el registro anterior se conserva en un historial simulado del equipo.
30. Una orden de compra de equipo no puede recibirse conforme sin certificado aprobado.
31. Las ordenes registran cotizaciones, Top 3, garantia, entrega y certificado.
32. Las reglas de bonos se administran por temporada de evaluacion, no directamente por rol.
33. Estados de temporada: Borrador, Programada, Activa, Cerrada y Cancelada.
34. Solo puede existir una temporada activa solapada para el mismo periodo, salvo configuraciones separadas por sucursal.
35. Una temporada cerrada guarda resultados historicos y no recalcula bonos automaticamente.
36. Coaches y recepcionistas tienen dos metricas configurables e independientes.
37. Para coaches, Coaching impartido usa solo sesiones de coaching Completadas.
38. Para coaches, Satisfaccion de clientes usa el promedio porcentual de encuestas validas de la temporada.
39. Para recepcionistas, Venta de membresias usa solo pagos/ventas aprobadas, no anuladas ni reembolsadas.
40. Para recepcionistas, Satisfaccion en atencion usa encuestas posteriores a atencion, venta, renovacion o pago.
41. Sueldo base, bono por primera metrica, bono por segunda metrica y total estimado se muestran separados.
42. Cada metrica calcula su propio bono: un resultado bajo en una metrica no elimina el bono de la otra.
43. Los escalones pertenecen a cada metrica dentro de la temporada y no estan rigidos en el codigo.
44. Formula de bono: bono obtenido = bono maximo x porcentaje pagado por el escalon alcanzado.
45. Cumplimiento y porcentaje pagado del bono se muestran como valores distintos.
46. Estados de bono: No alcanzado, Bono parcial, Bono completo y Pendiente de evaluacion.
47. Las encuestas convierten estrellas y criterios a porcentaje: puntos obtenidos / puntos maximos x 100.
48. Solo se permite una encuesta por servicio completado y vinculada a cliente, empleado, sucursal y fecha.
49. No se permite evaluar servicios cancelados, pendientes o no realizados.
50. El empleado no puede modificar sus propias encuestas; solo ve resultados consolidados segun su rol.
51. Administracion puede auditar el detalle de encuestas y cerrar temporadas.
52. Si no se alcanza el minimo de encuestas de la temporada, la metrica queda Pendiente por cantidad insuficiente de encuestas.
53. El coach solo ve sus clases, participantes, sesiones, asistencia, metricas y bonos propios.
54. El coach no ve pagos generales, compras, proveedores, salarios ni reportes financieros.
55. Recepcion ve solo clientes, membresias, horarios, reservas, pagos, tienda, servicios y metricas propias.
56. Reportes administrativos completos son visibles para administrador.
57. Los pagos aprobados generan una factura electronica simulada.
58. Si la emision falla, el pago permanece y la factura queda pendiente de reintento.
59. Estados de factura: Pendiente de emision, Emitida, Enviada, Error de emision y Anulada.
60. La tienda permite cafeteria, bebidas, suplementos y combos.
61. El cliente solo ve productos activos con existencia disponible.
62. La compra de tienda simula carrito, descuento por membresia, pago y factura.
63. Nutricionista se registra como partner, no empleado interno.
64. La agenda de nutricionista queda como propuesta pendiente de validacion.
65. El reporte diario por sucursal se guarda aunque falle el envio por correo.
66. El reporte de Boxeo muestra participantes, asistencia, horarios solicitados, ocupacion y clases completadas/canceladas.
67. Cada cliente tiene un codigo unico de referido generado a partir de su codigo de cliente.
68. El programa demostrativo de referidos usa membresia Basica y Q10 como configuracion inicial, pendiente de validacion con el cliente.
69. Los Q10 no se presentan como regla final: son un valor configurable del prototipo.
70. Registrar un referido no genera beneficio por si solo.
71. El flujo requerido es: cliente comparte codigo, referido se registra con ese codigo, compra membresia participante, el pago queda aprobado y entonces se genera el beneficio.
72. Estados del referido: Invitado, Registrado, Membresia pendiente, Membresia adquirida, Beneficio aprobado, Beneficio aplicado, Vencido y Cancelado.
73. No se permite que una persona utilice su propio codigo de referido.
74. Un nuevo cliente solo puede quedar asociado a un referido.
75. No se duplican beneficios para la misma persona, referido o pago relacionado.
76. Pagos Pendiente, Rechazado, Anulado o Reembolsado no generan beneficios.
77. Si un pago aprobado se anula, rechaza o reembolsa, los beneficios pendientes vinculados a ese pago se cancelan.
78. Un beneficio ya aplicado conserva trazabilidad de referido, pago original, fecha, beneficiario y monto.
79. El beneficio aplicado no debe exceder el total de la proxima compra o pago pendiente.
80. El historial de referidos guarda quien refirio, quien fue referido, fecha, sucursal, membresia, pago relacionado y beneficio generado.
81. Administracion puede filtrar referidos por sucursal, membresia, fecha y estado.
82. La configuracion de referidos permite nombre de promocion, membresias participantes, fechas, tipo de beneficio, monto, beneficiario, maximo de referidos, vigencia, condiciones y estado.

## Formula de aforo

```text
capacidad_operativa = suma de capacidad de equipos Operativo del area
aforo_permitido = menor valor entre capacidad fisica del area, cupo de clase y capacidad_operativa
ocupacion = reservas activas + accesos/asistencias registradas
cupos_disponibles = aforo_permitido - ocupacion
```

## Flujo de facturacion

```text
Pago aprobado -> Venta registrada -> Solicitud de factura -> Emision simulada -> Envio o reintento
```

## Flujo de compra de equipo

```text
Solicitud -> Cotizaciones -> Comparacion -> Verificacion de certificado -> Orden -> Aprobacion -> Recepcion -> Activo
```

## Formula de bonos por temporada

```text
cumplimiento = resultado / meta * 100
bono_obtenido = bono_maximo * porcentaje_pagado_del_escalon
total_estimado = sueldo_base + bono_metrica_1 + bono_metrica_2
```
