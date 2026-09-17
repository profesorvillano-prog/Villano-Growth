# Agenda de closers en GHL — transición Rafa → Gabriela → Josefina

> Cómo dejar que el mismo calendario público reparta las llamadas de admisión
> entre tres closers, dando **prioridad horaria** (Gabriela de día, Josefina de
> tarde/noche) mientras se apaga gradualmente la agenda de Rafa.
> Subcuenta GHL: **Japi Eaters** (`kdmmFxEbJjSpgMtbaZ6F`).

## El mecanismo (respuesta corta)

En GHL **no existe** un campo "franja horaria por persona" dentro de un
calendario de equipo. La prioridad horaria se construye cruzando **dos**
palancas que sí existen:

1. **Disponibilidad por usuario** (horario propio de cada closer dentro del
   calendario) → define *quién puede* aparecer a esa hora.
2. **Prioridad del miembro del equipo** (Alta / Media / Baja) en un calendario
   **Round Robin – Optimizar por disponibilidad** → define *a quién se ofrece
   primero* cuando dos closers pueden a la misma hora.

Regla práctica:

- **Hora exclusiva** de alguien → que sea la única con disponibilidad en esa franja.
- **Hora compartida con dueño preferente** → ambas disponibles, la dueña con
  prioridad **Alta** y la otra con prioridad **Baja** (entra solo como desborde
  cuando la primera ya está ocupada).

Importante: el tipo de calendario debe seguir siendo
`Round Robin – Optimizar por disponibilidad`. Si se cambia a *Optimizar por
distribución equitativa*, GHL reparte parejo e **ignora** la prioridad.

## Estado actual (verificado en la API, 2026-09-17)

| Calendario | ID | Miembros | Tipo |
|---|---|---|---|
| `[A] Programa Éxito en Alimentación Infantil` | `NwjgigzvJK9qcrjizbFn` | solo Rafa (`oLXVLdDh5Vy9WEPligs2`), prioridad 1 | RoundRobin_OptimizeForAvailability |
| `[ORG] Programa Éxito en Alimentación Infantil` | `MiDJPvkZrUk3nhVrrYvw` | solo Rafa, prioridad 1 | RoundRobin_OptimizeForAvailability |
| `Curso Avanzado` | `f6zX7ITk863lH93BqBJ9` | solo Rafa, prioridad 0.5 | personal |

- Disponibilidad: un único horario **"Work Hours"** (`hUI7N5LEvxWVPAGlYmi0`) de
  Rafa, **aplicado a los tres calendarios**, en zona **America/Bogota**:
  L-V 08:00–21:00 y sábado 10:00–16:00.
- Llamada de 45 min, buffer 15 min, un inicio por hora, tope 10 citas/día,
  auto-confirmación, se puede agendar desde 6 h y hasta 6 días hacia adelante.
- `allowReschedule` y `allowCancellation` en **false**: la lead no puede mover ni
  cancelar sola; toda reasignación se hace desde dentro de GHL.
- `shouldAssignContactToTeamMember` en **false**: hoy el contacto **no** queda a
  nombre del closer (con un solo closer daba igual; con tres, no).

**Todo cambio hay que hacerlo en los dos calendarios del programa ([A] y [ORG]).**
Son embudos distintos (ads y orgánico) con la misma operación detrás.

## Estado objetivo (cuando Rafa ya salió)

Horarios expresados en **hora de Chile (America/Santiago)**.

| Closer | Ventana cargada | Prioridad | Último inicio ofrecido |
|---|---|---|---|
| **Gabriela** | L-V 09:00–19:00 | **Alta** | 18:00 (9 a 10 llamadas/día) |
| **Josefina** | L-J 18:00–22:00 · V 18:00–20:00 | **Baja** | 21:00 L-J · 19:00 V |

Cómo se comporta:

- **09:00 a 17:00** → solo Gabriela tiene disponibilidad. Todo cae en ella.
- **18:00** → ambas disponibles, pero Gabriela es Alta: el slot se le ofrece a
  ella; Josefina lo recibe **solo si Gabriela ya está tomada** a esa hora. Esta
  es la "hora de tarde que puede llegar a Gabriela" para no saturar a Josefina.
- **19:00 en adelante** → solo Josefina. Máximo **3 llamadas/noche** por diseño
  de la ventana (45 min + 15 de buffer, un inicio por hora).

**La ventana de Gabriela tiene que cerrar a las 19:00, no a las 18:00.** Si
cierra a las 18:00, su último inicio es a las 17:00 y la hora de las 18:00 no se
la ofrece a nadie: queda una hora muerta entre las dos agendas. Lo mismo del otro
lado: si Josefina parte a las 19:00 en vez de las 18:00, no hay solapamiento y la
prioridad nunca llega a usarse (cada hora tiene una sola persona posible). Eso
funciona igual, pero se pierde el respaldo de esa hora.

Si Josefina igual queda muy cargada, el ajuste es mover la frontera: estirar a
Gabriela hasta las 19:30 o recortar la ventana de Josefina. No se toca la prioridad.

Si se quiere el tope duro, además de la ventana: en el usuario de Josefina,
*Maximum appointments per day*. El `appointmentPerDay: 10` del calendario es del
calendario completo, no por persona.

**Sábado (decisión pendiente):** hoy Rafa cubre sábado 10:00–16:00. Hay que
definir si Gabriela lo hereda, si se reparte, o si el sábado se cierra.

### Los Schedules hay que aplicarlos a los calendarios

En GHL un *Schedule* se crea aparte y luego se **aplica** a uno o más
calendarios (campo **Active on**). Un schedule en "Active on: 0 calendars" no
hace nada, aunque tenga los horarios bien cargados. Cada horario (el de Gabriela
y el de Josefina) tiene que quedar aplicado a **los dos** calendarios del
programa, `[A]` y `[ORG]`.

Verificar además la **zona horaria de cada schedule** por separado: Gabriela y
Josefina en `America/Santiago`; el horario viejo de Rafa está en
`America/Bogota`, que hoy va dos horas atrás de Chile (sus 08:00 son las 10:00
en Chile).

## Plan de transición (4 semanas)

La idea es que la ventana de Rafa se encoja y su prioridad baje, sin que ninguna
lead vea un calendario vacío en el intertanto. Rafa nunca pasa a Alta otra vez.

| Semana | Gabriela | Josefina | Rafa |
|---|---|---|---|
| **1 — sombra** | 09:00–13:00, prioridad **Alta** | — | 09:00–21:00, prioridad **Media** |
| **2 — traspaso de día** | 09:00–18:00, **Alta** | — | 13:00–21:00, **Media** |
| **3 — entra Josefina** | 09:00–19:00, **Alta** | 18:00–21:00, **Baja** | 19:00–21:00, **Media** (solo respaldo) |
| **4 — salida** | 09:00–19:00, **Alta** | 18:00–21:00, **Baja** | fuera del calendario |

- En semana 1 Gabriela toma ~4 llamadas/día con Rafa todavía disponible detrás:
  si ella se llena, la lead igual encuentra hora.
- Rafa en **Media** durante toda la transición significa que solo recibe lo que
  Gabriela no puede tomar. Nunca compite con ella por el mismo slot.
- En semana 4 se **quita a Rafa del calendario** (no se elimina el usuario hasta
  cerrar sus citas y ventas pendientes: si se borra el usuario, sus citas y su
  historial de asignación se rompen).

### Las citas que Rafa ya tiene agendadas

No se reasignan solas. El día que se confirme su fecha de salida:

1. Listar sus citas futuras (Calendarios → vista de Rafa, o la API de eventos).
2. Las anteriores a su último día las atiende él.
3. Las posteriores se reasignan a mano (abrir la cita → cambiar el usuario
   asignado) y se avisa por WhatsApp a la lead con el nombre de quien la atenderá.
4. A partir de su último día, `allowBookingFor` (6 días) garantiza que en menos
   de una semana ya no queda nada agendado a su nombre.

## Cómo se configura, paso a paso

Para **cada uno** de los dos calendarios del programa ([A] y [ORG]):

1. **Calendarios → editar calendario → Team members**
   - Agregar a Gabriela y a Josefina como miembros.
   - Confirmar que el tipo sigue siendo *Round Robin → Optimizar por disponibilidad*.
   - Asignar prioridad a cada una según la tabla (Alta / Baja / Media).
2. **Pestaña de disponibilidad → horario por usuario** (*custom availability per
   user*), no un horario único de calendario. Cargar la ventana de cada closer.
   - El horario actual "Work Hours" es de Rafa y está compartido con los tres
     calendarios: **no editarlo** para meter las horas de Gabriela. Crear un
     horario propio por persona.
3. **Zona horaria.** Las ventanas de Gabriela y Josefina se cargan en
   `America/Santiago`; la de Rafa está en `America/Bogota` (Chile va una o dos
   horas adelante según el horario de verano). Cargar la ventana de cada una en
   su propia zona y verificar el resultado en el widget público, no en la
   configuración.
4. **Activar "Assign contact to team member"** y también *skip assigning for
   existing contacts*, para que cada lead quede a nombre de la closer que la
   atiende sin robarle contactos ya asignados a otra persona.
5. **Google Meet.** Cada closer necesita su propia cuenta de Google conectada en
   su usuario de GHL. Hoy el link se genera desde la conexión de Rafa
   (`google_conference`); si Gabriela entra sin conectar su Google, se agenda
   pero el link de la videollamada queda roto.
6. **Workflows y mensajes.** Los avisos a Slack y los recordatorios de 24 h / 8 h
   deben usar `{{appointment.user.name}}` (o equivalente) en vez de asumir que el
   closer es Rafa. Revisar que ningún mensaje automático vaya firmado por él.

### QA antes de dar por cerrado

Agendar tres pruebas reales en el widget público y confirmar quién queda asignado:

- 10:00 → Gabriela.
- 18:00 con Gabriela libre → Gabriela. Con Gabriela ya tomada a esa hora → Josefina.
- 20:00 → Josefina.
- Repetir en el otro calendario ([ORG] además de [A]).

## Plan B si la prioridad no se comporta

Si al probar resulta que el round robin reparte sin respetar la prioridad,
la alternativa es **calendarios separados** (uno de Gabriela 09:00–19:00, otro
de Josefina 18:00–21:00) y un workflow que decida a cuál link enviar según la
hora o según la carga. Es más frágil (dos links, dos QA, más puntos de falla),
así que solo si el primer camino falla en las pruebas.
