# Cardio Fight — nota técnica

## Piezas

| Pieza | Qué es |
|---|---|
| `index.html` | Toda la app: un archivo, sin build, sin dependencias, sin CDN. |
| Supabase | Postgres + PostgREST. Proyecto `Cardio Fight` (`boxbmbhuarhasgblozvk`, región `sa-east-1`). |
| Vercel | Sirve el HTML como sitio estático. |

## Modelo de seguridad

No se usa Supabase Auth. El profesor necesitaba dar de alta alumnos sin
correos ni confirmaciones, así que la identidad es **teléfono + PIN**.

Como consecuencia no hay `auth.uid()` sobre el que montar políticas RLS, y el
diseño es el opuesto al habitual:

1. **Las seis tablas están cerradas.** RLS activado, **cero políticas**, y
   `REVOKE ALL ... FROM anon, authenticated`. El navegador no puede leer ni
   escribir ni una fila por REST.
2. **Todo pasa por funciones RPC `SECURITY DEFINER`** que reciben un token de
   sesión como primer argumento y comprueban por sí mismas quién llama y qué
   puede hacer. Son la única superficie expuesta a `anon` (22 funciones).
3. Los helpers internos (`cf_actor`, `cf_is_profe`, `cf_now`, `cf_norm_phone`)
   tienen el `EXECUTE` revocado: no se pueden llamar desde fuera.

Por eso la clave `anon` puede ir en claro dentro del HTML: por sí sola no
abre nada.

Otras defensas:

- PIN guardado con `bcrypt` (`extensions.crypt` / `gen_salt('bf', 10)`).
- **Bloqueo tras 5 intentos fallidos**, 15 minutos, por alumno y para el profe.
- Error de login **genérico** (`Teléfono o PIN incorrecto`) para no revelar qué
  teléfonos existen.
- Token de sesión de 24 bytes aleatorios, 30 días de vida, y se borra:
  al pausar o eliminar al alumno, y al cambiar su PIN.
- Las sesiones caducadas se limpian en cada login.

> Los avisos del linter de Supabase sobre `rls_enabled_no_policy` y
> `anon_security_definer_function_executable` son **esperados**: describen
> exactamente este diseño. Antes de dar por bueno un aviso nuevo, comprueba
> con la consulta de más abajo que la superficie expuesta no ha crecido.

```sql
-- Qué puede llamar realmente el navegador
select p.proname, pg_get_function_arguments(p.oid)
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'EXECUTE')
 order by 1;
```

## Inscripción por enlace (sin cuentas)

El modelo real del gimnasio es: el profe manda la clase al grupo de WhatsApp
y la gente dice «voy». Pedirle cuenta a cada persona (hay niños) era fricción
sin retorno, así que el flujo principal no tiene login:

- `cf_classes.share_token` — 9 bytes aleatorios en hex, creados la primera vez
  que se comparte la clase. El enlace es `?c=<token>`.
- `cf_bookings` acepta ahora inscripciones sin alumno: `student_id` es
  nullable y aparece `guest_name`, con un `check` que exige uno de los dos.
  `source` distingue `app` / `profe` / `enlace`.
- Índice único sobre `(class_id, cf_norm_name(guest_name))`: el mismo nombre no
  entra dos veces. `cf_norm_name` quita tildes y espacios de más y se declara
  IMMUTABLE (usando la forma de dos argumentos de `unaccent`) para poder
  indexarla.
- `cf_match_student` cruza el nombre escrito con la lista de alumnos usando
  `pg_trgm`: igualdad exacta sobre el nombre normalizado → `exacto`;
  `similarity >= 0.55` → `parecido` (el profe confirma con un toque);
  si no → `desconocido`. El resultado se guarda en `cf_bookings.match`.
- `cf_pay_status(student_id, hoy)` devuelve el estado de pago, y
  `no_registrado` cuando no hay alumno enlazado.

Las tres funciones públicas (`cf_link_class`, `cf_link_signup`,
`cf_link_cancel`) no reciben token de sesión: el `share_token` **es** la
credencial. Quien tenga el enlace puede anotarse, ver la lista y borrarse a sí
mismo; no puede leer nada de otras clases, ni alumnos, ni pagos.

El login por PIN sigue existiendo y escribe en la misma tabla de reservas,
pero ya no es el camino principal.

**Compromiso asumido a propósito:** cualquiera con el enlace puede anotarse
con el nombre que quiera y ocupar un cupo. Para un grupo de WhatsApp cerrado
de un gimnasio pequeño es proporcionado; el profe ve y borra cualquier
inscripción, y el aviso de «no registrado» hace visible al colado. Si algún
día molesta, el siguiente paso natural es pedir los 4 últimos dígitos del
teléfono además del nombre.

## Por qué no se publica solo en el grupo de WhatsApp

Se evaluó y se descartó:

- Los enlaces `wa.me` y `whatsapp://send` solo aceptan un **número de
  teléfono**. No existe un esquema público que apunte a un grupo.
- La **API oficial de WhatsApp Business (Cloud API)** no puede enviar mensajes
  a grupos, solo a usuarios individuales.
- Las librerías no oficiales (whatsapp-web.js, Baileys) sí publican en grupos,
  pero exigen mantener una sesión del WhatsApp personal del profe en un
  servidor, incumplen los términos de uso y arriesgan el cierre de su cuenta.
  Desproporcionado para un gimnasio pequeño.

Lo implementado es lo más corto posible sin nada de eso: `cf_settings.wa_group_url`
guarda el enlace de invitación del grupo (validado contra
`^https://chat\.whatsapp\.com/[A-Za-z0-9_-]{6,64}$`). El botón copia el mensaje
al portapapeles **dentro del gesto del usuario** —requisito de Safari e iOS—
y deja que el `<a href>` navegue al grupo. Dos toques: tocar y pegar.

## Fechas y horas

Las clases se guardan como `date` + `time` **locales del gimnasio**, no como
`timestamptz`. Un gimnasio pequeño está en un solo sitio y a nadie le importa
la hora UTC; así se evita toda la aritmética de zonas horarias y sus errores.

La zona horaria (`cf_settings.tz`, editable en Ajustes) se usa solo para saber
qué es «ahora»: `cf_now()` devuelve `now() at time zone tz`. De ahí salen
«qué clase ya pasó» y el margen de cancelación.

## Reglas de negocio (todas en la base, no en el navegador)

- `cf_book` bloquea la fila de la clase (`select ... for update`) antes de
  contar los cupos, así dos alumnos simultáneos no se llevan el mismo último
  sitio.
- Un alumno no puede tener dos reservas que **se solapen en el tiempo**
  (mismo día, rangos de hora cruzados).
- `unique (class_id, student_id)` impide reservar dos veces la misma clase.
- Plan `grupal` → solo clases `grupal`; plan `full` → todas.
- Al pausar a un alumno se borran sus sesiones **y** sus reservas futuras.
- Al borrar un alumno, `cf_payments.student_id` queda a `null` pero
  `student_name` conserva el nombre: el historial de ingresos sobrevive.
- Índice único `(class_date, start_time, kind, title)`: generar dos veces el
  mismo horario semanal no duplica clases (`on conflict do nothing`).

## Dos fallos que solo aparecen ejecutando

Ambos eran errores de SQL **dentro** de funciones plpgsql, que Postgres no
valida hasta que la función se ejecuta. Compilaban, se desplegaban y fallaban
en producción:

1. `cf_admin_payments` ordenaba por `p.created_at`, columna que su propia
   subconsulta no seleccionaba. La pantalla de Pagos se quedaba girando.
2. `cf_cancel_booking` declaraba la variable `c` y además usaba `c` como alias
   de `cf_classes`: `column reference "c.id" is ambiguous`. Cancelar una
   reserva fallaba **siempre**.

Ninguno lo veía un test de interfaz contra un simulador, ni un recorrido SQL
que no llegara a llamar a esas dos funciones.

**Regla para este proyecto: cualquier cambio en el esquema tiene que ir
seguido de la ejecución de las 28 funciones RPC contra la base real.** El
bloque de humo vive en el historial de la sesión y se puede rehacer: crea
alumnos con teléfonos `9900000xx` y clases con título `ZZTEST%`, ejercita
todas las funciones y borra por esos marcadores al terminar. Es no
destructivo, así que puede correrse con datos reales dentro.

## Pruebas

- **Base de datos:** bloque `DO` con el recorrido completo (login, alta, plan,
  cupos, solapes, pago, pausa) ejecutado contra el Postgres real.
- **Interfaz:** `scratchpad/e2e.mjs` con Playwright, 62 comprobaciones sobre
  las tres vistas (profe, alumno y enlace público), contra un simulador de la API (`mock.mjs`) que replica las
  respuestas reales. Se simula porque la política de red del entorno de
  desarrollo bloquea `*.supabase.co` desde el navegador local.

## Si hay que cambiar de proyecto Supabase

Solo dos constantes, al principio del `<script>` de `index.html`:

```js
const SB_URL = "https://<ref>.supabase.co";
const SB_KEY = "sb_publishable_...";
```

## Esquema de la base

El esquema vive como **migraciones en el propio proyecto Supabase** (7
migraciones, prefijo `cardio_fight_`). Para sacarlas a disco:

```bash
supabase link --project-ref boxbmbhuarhasgblozvk
supabase db pull          # deja los .sql en supabase/migrations/
```

O directamente por SQL, sin CLI:

```sql
select version, name, array_to_string(statements, E';\n\n')
  from supabase_migrations.schema_migrations
 where name like 'cardio_fight%'
 order by version;
```

Cualquier cambio de esquema debe hacerse como **migración nueva**, nunca
editando tablas a mano desde el panel: así el historial sigue siendo el
origen de verdad.
