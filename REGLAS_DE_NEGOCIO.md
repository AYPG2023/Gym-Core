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
21. Coaches y recepcionistas tienen dos metricas configurables.
22. Sueldo base y bonos se guardan por separado.
23. Cada metrica calcula su propio bono: no se exige cumplir ambas para recibir todos los bonos.
24. Estados de bono: No alcanzado, Bono parcial, Bono completo y Pendiente de evaluacion.
25. El coach solo ve sus clases, participantes, sesiones, asistencia, metricas y bonos propios.
26. El coach no ve pagos generales, compras, proveedores, salarios ni reportes financieros.
27. Recepcion ve solo clientes, membresias, horarios, reservas, pagos, tienda y servicios.
28. Reportes administrativos completos son visibles para administrador.
29. Los pagos aprobados generan una factura electronica simulada.
30. Si la emision falla, el pago permanece y la factura queda pendiente de reintento.
31. Estados de factura: Pendiente de emision, Emitida, Enviada, Error de emision y Anulada.
32. La tienda permite cafeteria, bebidas, suplementos y combos.
33. El cliente solo ve productos activos con existencia disponible.
34. La compra de tienda simula carrito, descuento por membresia, pago y factura.
35. Nutricionista se registra como partner, no empleado interno.
36. La agenda de nutricionista queda como propuesta pendiente de validacion.
37. El reporte diario por sucursal se guarda aunque falle el envio por correo.
38. El reporte de Boxeo muestra participantes, asistencia, horarios solicitados, ocupacion y clases completadas/canceladas.

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
