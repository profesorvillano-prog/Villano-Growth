# Cardio Fight — app de reservas

App mínima para que el profe deje de gestionar las clases a mano por WhatsApp.

**Nadie necesita crearse una cuenta.** El profe comparte el enlace de la clase
en el grupo de WhatsApp, la gente toca, escribe su nombre y queda anotada.
La app cruza ese nombre con la lista de quién ha pagado y le avisa al profe
de quién no está al día.

- **El profe** es el único con cuenta: publica horarios, comparte clases,
  ve quién va a cada una y registra los pagos.
- **Todos los demás** solo tocan un enlace y escriben su nombre.

Todo cabe en un archivo: [`index.html`](index.html). Los datos viven en
Supabase (plan gratuito).

**Dónde vive:** proyecto Vercel `cardio-fight`, enlazado a este repositorio
con la carpeta raíz `clientes/cardio-fight`. Cada push despliega solo.

---

## Manual del profe

### Entrar

Abre la app y escribe **tu teléfono** y **tu PIN**. Nada de correos ni
contraseñas largas. Queda la sesión abierta: no tendrás que entrar cada día.

> **Lo primero que debes hacer:** ve a **Ajustes**, cambia el teléfono por el
> tuyo de verdad, y luego pulsa **Cambiar mi PIN**. El teléfono y el PIN que te
> entregamos al principio son provisionales.

**Truco:** en el móvil, abre la app en el navegador y usa
*«Añadir a pantalla de inicio»*. Te queda como una app normal.

### 1. Publicar tus horarios — pestaña **Agenda**

La agenda se ve **un día a la vez**. Arriba tienes la tira de días: deslízala
con el dedo o usa las flechas ‹ ›. El puntito rojo bajo un día significa que
ese día tiene clases. El botón **Hoy** te devuelve al día de hoy, y el
interruptor **Día / Semana** cambia entre ver solo ese día o la semana entera.

Para crear clases tienes dos formas:

- **📅 Horario semanal** — para tu horario fijo. Eliges los días (por ejemplo
  lunes, miércoles y viernes), la hora y los cupos, y te crea todas las clases
  de los **próximos 3 meses** de una vez. Repítelo para cada franja horaria.
  Hacerlo dos veces no duplica nada.
- **＋ Nueva clase** — para una clase suelta o un personalizado concreto. Se
  crea en el día que estés viendo.

**Personalizados 1 a 1:** al elegir el tipo *Personalizado*, aparece un
selector de **alumno**. Si lo eliges ahí, la clase queda creada **con esa
persona ya anotada**, sin pasos extra. Funciona igual en el horario semanal:
te deja montar «los martes a las 18:00 con Ana» en una sola pantalla.

Cada clase es de un tipo:

| Tipo | Quién puede reservarla |
|---|---|
| **Grupal** | Todos los alumnos |
| **Personalizado** | Solo los del plan *Personalizado full* |

En la agenda ves cada clase con **la lista de quién va**. Ya no hace falta
preguntar por WhatsApp. Desde ahí puedes escribirle a cualquiera (💬), sacarlo
de la clase (✕) o anotarlo tú a mano.

### 2. Mandar la clase al grupo de WhatsApp

En cualquier clase de la agenda, **📤 Compartir por WhatsApp**. Te prepara el
mensaje con el nombre de la clase, el día, la hora, los cupos que quedan y el
enlace:

> 🥊 **CARDIO FIGHT**
> **Kickboxing**
> Lunes 8 de septiembre
> ⏰ 19:00 a 20:00
> 👥 Quedan 8 de 12 cupos
>
> Anótate aquí 👇
> `https://cardio-fight.vercel.app/?c=...`

**Para que se te abra el grupo directamente**, guarda una vez el enlace de tu
grupo en **Ajustes → Enlace del grupo de WhatsApp** (en WhatsApp: abre el
grupo → toca su nombre → *Invitar por enlace* → *Copiar enlace*). A partir de
ahí el botón dice **📋 Copiar y abrir el grupo**: se copia el mensaje, se abre
tu grupo, y solo tienes que mantener pulsado y pegar.

> WhatsApp no permite a ninguna app abrir un grupo con el mensaje ya escrito
> —sus enlaces solo apuntan a números de teléfono, y su API oficial no publica
> en grupos—, así que este par de toques es lo más corto que se puede hacer
> sin arriesgar la cuenta con herramientas no oficiales.

Si no configuras el grupo, el botón abre WhatsApp y eliges tú el chat. También
puedes **copiar el mensaje** o **solo el enlace** para pegarlo donde quieras.

Quien abra el enlace ve la clase, quiénes van ya, y escribe **su nombre y
apellido** para anotarse. No pide contraseña ni descargar nada. Si se llena,
la app no deja anotar a nadie más. Si alguien no puede ir, con el mismo
enlace se da de baja y libera su cupo.

> Cada clase tiene su propio enlace, imposible de adivinar. Si prefieres que
> no se vea la lista de quién va, cámbialo en **Ajustes → Lista de inscritos**.

### 3. La lista de quién ha pagado — pestaña **Alumnos**

Esta pestaña es **tu lista de quién paga**, no una lista de usuarios. Pulsa
**＋ Nuevo alumno**, pon nombre, teléfono y su plan:

| Plan | Qué incluye |
|---|---|
| **Grupal** | Solo las clases grupales |
| **Personalizado full** | Los 1 a 1 **y** las clases grupales |

**El PIN es opcional y casi nunca hace falta**: la gente se anota por el
enlace de cada clase. Solo dáselo si quieres que alguien (por ejemplo un
adulto de personalizado) pueda entrar a la app y ver sus clases. Si lo
generas, la app te da un botón para mandárselo por WhatsApp.

> Guarda el teléfono **con el código del país** (ej. `56912345678`). Así
> funciona el botón de WhatsApp.

### 4. Cobrar — pestaña **Pagos**

Nada más entrar ves lo importante:

- **Ganado en el mes** y cuántos pagos llevas registrados.
- **Al día** y **Pendientes**: cuántos alumnos hay en cada situación.
- **Por cobrar**: la lista de quién debe, con si se le venció el plan o si
  nunca ha pagado, y un botón **💬 Cobrar** que le abre WhatsApp con el
  mensaje ya escrito.
- Abajo, el historial de **últimos pagos**.

Para registrar uno, pon el monto, cómo te pagó y **hasta qué fecha le cubre el
plan**. De ahí sale todo lo anterior. Registrar un pago **reactiva
automáticamente** a un alumno que estaba pausado.

### 4b. Encontrar a alguien — pestaña **Alumnos**

Además del buscador tienes dos filas de filtros: por **plan**
(Personalizado / Grupal) y por **pago** (Al día / Sin pago / Deudores). Se
combinan: por ejemplo «Personalizado + Deudores» te da justo a quién llamar.

### 5. Cuando alguien no paga

Tienes dos botones en su ficha:

- **Pausar** — no puede entrar a la app y se sueltan sus reservas futuras,
  pero **no pierdes su historial**. Cuando pague, le das a *Reactivar* (o
  simplemente le registras el pago) y vuelve a entrar con el mismo PIN.
  **Es lo que deberías usar casi siempre.**
- **Eliminar** — lo borra a él y a sus reservas. No se puede deshacer. El
  historial de pagos sí se conserva, para que tus cuentas cuadren.

---

## Cómo sabe la app si quien se anota ha pagado

Al escribir su nombre, la app lo compara con tu lista de alumnos:

| Lo que ve el profe | Qué significa |
|---|---|
| **Al día** / **Vence pronto** | Encontrado en tu lista y con el pago en regla |
| **Vencido** / **Sin pago** | Está en tu lista, pero debe |
| **No registrado** | Ese nombre no está en tu lista. Puedes **asignarlo a un alumno** si es alguien que ya tienes con el nombre escrito de otra forma, o darlo de alta |
| «Se anotó como *X*. ¿Es *Y*?» | El nombre se parece pero no es idéntico (una tilde, un apodo). Confirmas con un toque |

Cada clase muestra un aviso **⚠️ N por revisar** con la cuenta de personas
que no están al día o que no reconoce. Así ves de un vistazo si hay que
cobrarle a alguien antes de que entre a entrenar.

## Reglas que la app aplica sola

- **El mismo nombre no se puede anotar dos veces** en la misma clase.
- Hay que escribir **nombre y apellido**: con solo el nombre no deja.
- Una clase **no admite más gente que los cupos** que pusiste, ni aunque dos
  alumnos pulsen «Reservar» en el mismo segundo.
- Un alumno de plan grupal **no ve ni puede reservar** los personalizados.
- **No se puede reservar una clase que ya pasó.**
- Cancelar tiene un **aviso mínimo** (lo eliges en Ajustes, por defecto 3 h).
  Pasado ese punto el alumno ya no puede soltar el cupo solo: tiene que
  hablar contigo.
- Un alumno pausado **no entra**, aunque tuviera la sesión abierta.

---

## Preguntas típicas

**Un alumno perdió su PIN.**
Entra en su ficha → *Editar* → escribe un PIN nuevo → *Guardar*. La app te
vuelve a dar el botón de WhatsApp para enviárselo.

**Quiero cambiar los cupos de una clase.**
*Editar* en esa clase. No te deja dejar menos cupos de los que ya están
anotados: primero saca a alguien.

**Me equivoqué al crear el horario semanal.**
Borra las clases sobrantes una a una desde la agenda, y crea el horario bien.
Crear el mismo horario dos veces **no duplica** clases.

**¿Los alumnos ven los pagos o los datos de los demás?**
No. Un alumno solo ve los horarios, sus reservas y su nombre.

---

## Para quien mantenga el código

Ver [`docs/TECNICO.md`](docs/TECNICO.md).
