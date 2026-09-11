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
9. La ocupacion individual de maquinas no se controla.
10. Los equipos no tienen estados de ocupacion individual.
11. La capacidad de equipos se usa solo para calcular capacidad operativa del area.
12. La ocupacion de personas se calcula por accesos/asistencias.
13. Estados de equipos: Operativo, En mantenimiento, Danado, Fuera de servicio, Retirado y Pendiente de documentacion.
14. El area Boxeo se configura como area deportiva de la Sucursal Premium, con recurso principal Ring de boxeo.
15. Boxeo solo puede crearse o activarse en sucursales con amenidad de boxeo habilitada.
16. El cupo inicial de Boxeo es 15 y el horario de referencia es 06:00-19:00, ambos configurables desde el formulario de area.
17. Si el ring no esta Operativo, las clases y reservas de Boxeo quedan bloqueadas por disponibilidad.
18. Un equipo nuevo no puede quedar Operativo sin certificado aprobado.
19. Una orden de compra de equipo no puede recibirse conforme sin certificado aprobado.
20. Las ordenes registran cotizaciones, Top 3, garantia, entrega y certificado.
21. Las reglas de bonos se administran por temporada de evaluacion, no directamente por rol.
22. Estados de temporada: Borrador, Programada, Activa, Cerrada y Cancelada.
23. Solo puede existir una temporada activa solapada para el mismo periodo, salvo configuraciones separadas por sucursal.
24. Una temporada cerrada guarda resultados historicos y no recalcula bonos automaticamente.
25. Coaches y recepcionistas tienen dos metricas configurables e independientes.
26. Para coaches, Coaching impartido usa solo sesiones de coaching Completadas.
27. Para coaches, Satisfaccion de clientes usa el promedio porcentual de encuestas validas de la temporada.
28. Para recepcionistas, Venta de membresias usa solo pagos/ventas aprobadas, no anuladas ni reembolsadas.
29. Para recepcionistas, Satisfaccion en atencion usa encuestas posteriores a atencion, venta, renovacion o pago.
30. Sueldo base, bono por primera metrica, bono por segunda metrica y total estimado se muestran separados.
31. Cada metrica calcula su propio bono: un resultado bajo en una metrica no elimina el bono de la otra.
32. Los escalones pertenecen a cada metrica dentro de la temporada y no estan rigidos en el codigo.
33. Formula de bono: bono obtenido = bono maximo x porcentaje pagado por el escalon alcanzado.
34. Cumplimiento y porcentaje pagado del bono se muestran como valores distintos.
35. Estados de bono: No alcanzado, Bono parcial, Bono completo y Pendiente de evaluacion.
36. Las encuestas convierten estrellas y criterios a porcentaje: puntos obtenidos / puntos maximos x 100.
37. Solo se permite una encuesta por servicio completado y vinculada a cliente, empleado, sucursal y fecha.
38. No se permite evaluar servicios cancelados, pendientes o no realizados.
39. El empleado no puede modificar sus propias encuestas; solo ve resultados consolidados segun su rol.
40. Administracion puede auditar el detalle de encuestas y cerrar temporadas.
41. Si no se alcanza el minimo de encuestas de la temporada, la metrica queda Pendiente por cantidad insuficiente de encuestas.
42. El coach solo ve sus clases, participantes, sesiones, asistencia, metricas y bonos propios.
43. El coach no ve pagos generales, compras, proveedores, salarios ni reportes financieros.
44. Recepcion ve solo clientes, membresias, horarios, reservas, pagos, tienda, servicios y metricas propias.
45. Reportes administrativos completos son visibles para administrador.
46. Los pagos aprobados generan una factura electronica simulada.
47. Si la emision falla, el pago permanece y la factura queda pendiente de reintento.
48. Estados de factura: Pendiente de emision, Emitida, Enviada, Error de emision y Anulada.
49. La tienda permite cafeteria, bebidas, suplementos y combos.
50. El cliente solo ve productos activos con existencia disponible.
51. La compra de tienda simula carrito, descuento por membresia, pago y factura.
52. Nutricionista se registra como partner, no empleado interno.
53. La agenda de nutricionista queda como propuesta pendiente de validacion.
54. El reporte diario por sucursal se guarda aunque falle el envio por correo.
55. El reporte de Boxeo muestra participantes, asistencia, horarios solicitados, ocupacion y clases completadas/canceladas.

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
