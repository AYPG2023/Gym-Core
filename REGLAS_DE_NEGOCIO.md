# Reglas de negocio

Las reglas estan implementadas en `assets/js/validations.js`.

1. Solo clientes activos con membresia activa pueden reservar.
2. La membresia debe estar vigente para la fecha del horario.
3. El plan debe permitir el area solicitada.
4. El horario debe estar dentro del horario de sucursal.
5. La disponibilidad respeta capacidad del area, horario y maquinas operativas.
6. Una maquina en mantenimiento o fuera de servicio no puede reservarse.
7. Un area cerrada o en mantenimiento no acepta reservas.
8. Un cliente no puede tener reservas traslapadas.
9. No se duplican reservas activas para el mismo cliente y horario.
10. El limite de reservas del plan se valida antes de crear.
11. La reserva completa bloquea nuevas asignaciones.
12. Al cancelar se libera cupo y maquina reservada.
13. La cancelacion solo procede dos horas antes.
14. Si una maquina entra en mantenimiento, sus reservas futuras se rechazan.
15. Los cambios de estado usan transiciones permitidas.
16. Toda operacion rechazada muestra la razon en un toast.
17. No se aceptan nuevas reservas si la sucursal esta inactiva, en mantenimiento o cerrada temporalmente.
18. Los pagos e ingresos se asocian a una sucursal.
19. No se permiten codigos duplicados de sucursal ni de maquina.
20. Una maquina solo pertenece a un area, y la sucursal se determina por esa area.
21. Una sucursal con areas, pagos u horarios relacionados no se elimina; solo se puede desactivar.
22. El mantenimiento se crea, inicia, finaliza o cancela solamente desde el modulo Mantenimiento.
23. Los clientes se administran con estados Activo, Inactivo, Suspendido y Bloqueado.
24. Los empleados se administran con estados Activo, Inactivo, Suspendido y Vacaciones.
25. Cada coach y recepcionista tiene dos metricas obligatorias e individuales por periodo.
26. La bonificacion se aprueba solo cuando el empleado cumple ambas metricas.
27. Si cumple una sola metrica, la bonificacion es Q0 aunque se muestre advertencia visual amarilla.
28. Si no cumple ninguna metrica, la bonificacion es Q0 y el estado visual es rojo.
29. Si cumple ambas metricas, el total estimado es sueldo base mas bonificacion.
30. Las ordenes de compra deben seguir transiciones permitidas.
31. Una orden recibida registra recepcion de articulos, cantidades, fecha, observaciones y entrega completa o parcial.
32. Una maquina nueva recibida puede precargar el formulario Registrar maquina, pero nunca se incorpora sin confirmacion administrativa.

## Formula de disponibilidad

```text
capacidad_operativa = suma de capacidad simultanea de maquinas disponibles
total = menor valor entre capacidad del area, capacidad del horario y capacidad_operativa
cupos_disponibles = total - reservas activas - personas actualmente en uso
```

## Estados administrativos

```text
Clientes: Activo, Inactivo, Suspendido, Bloqueado
Empleados: Activo, Inactivo, Suspendido, Vacaciones
Ordenes de compra: Borrador, Solicitada, En revision, Aprobada, Rechazada, Ordenada, Recibida, Cancelada
```

## Flujo de ordenes de compra

```text
Borrador -> Solicitada -> En revision -> Aprobada -> Ordenada -> Recibida
                         -> Rechazada
Borrador/Solicitada/En revision/Aprobada/Ordenada -> Cancelada
```

## Regla de bonificacion

```text
metricas_cumplidas = cantidad de metricas con resultado >= meta

0 metricas: rojo, bonificacion no alcanzada, total = sueldo base
1 metrica: amarillo, bonificacion no alcanzada, total = sueldo base
2 metricas: verde, bonificacion aprobada, total = sueldo base + bonificacion
```
