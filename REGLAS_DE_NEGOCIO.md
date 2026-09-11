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
10. Los equipos no tienen estados En uso ni Reservada.
11. La capacidad de equipos se usa solo para calcular capacidad operativa del area.
12. La ocupacion de personas se calcula por accesos/asistencias.
13. Estados de equipos: Operativo, En mantenimiento, Danado, Fuera de servicio, Retirado y Pendiente de documentacion.
14. Un equipo nuevo no puede quedar Operativo sin certificado aprobado.
15. Una orden de compra de equipo no puede recibirse conforme sin certificado aprobado.
16. Las ordenes registran cotizaciones, Top 3, garantia, entrega y certificado.
17. Coaches y recepcionistas tienen dos metricas configurables.
18. Sueldo base y bonos se guardan por separado.
19. Cada metrica calcula su propio bono: no se exige cumplir ambas para recibir todos los bonos.
20. Estados de bono: No alcanzado, Bono parcial, Bono completo y Pendiente de evaluacion.
21. El coach solo ve sus clases, participantes, sesiones, asistencia, metricas y bonos propios.
22. El coach no ve pagos generales, compras, proveedores, salarios ni reportes financieros.
23. Recepcion ve solo clientes, membresias, horarios, reservas, pagos, tienda y servicios.
24. Reportes administrativos completos son visibles para administrador.
25. Los pagos aprobados generan una factura electronica simulada.
26. Si la emision falla, el pago permanece y la factura queda pendiente de reintento.
27. Estados de factura: Pendiente de emision, Emitida, Enviada, Error de emision y Anulada.
28. La tienda permite cafeteria, bebidas, suplementos y combos.
29. El cliente solo ve productos activos con existencia disponible.
30. La compra de tienda simula carrito, descuento por membresia, pago y factura.
31. Nutricionista se registra como partner, no empleado interno.
32. La agenda de nutricionista queda como propuesta pendiente de validacion.
33. El reporte diario por sucursal se guarda aunque falle el envio por correo.

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
