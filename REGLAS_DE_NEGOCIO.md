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

## Formula de disponibilidad

```text
capacidad_operativa = suma de capacidad simultanea de maquinas disponibles
total = menor valor entre capacidad del area, capacidad del horario y capacidad_operativa
cupos_disponibles = total - reservas activas - personas actualmente en uso
```
