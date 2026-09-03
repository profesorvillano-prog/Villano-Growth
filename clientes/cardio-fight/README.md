# Cardio Fight — app de reservas

App mínima para que el profe deje de gestionar las clases por WhatsApp.

- **El profe** publica horarios, ve quién va a cada clase, registra pagos y
  activa o elimina alumnos.
- **Los alumnos** entran, ven los horarios y reservan su cupo. Nada más.

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

Tienes dos formas:

- **📅 Horario semanal** — para tu horario fijo. Eliges los días (por ejemplo
  lunes, miércoles y viernes), la hora, los cupos y cuántas semanas. Te crea
  todas las clases de una vez. Repítelo para cada franja horaria que tengas.
- **＋ Nueva clase** — para una clase suelta o un personalizado concreto.

Cada clase es de un tipo:

| Tipo | Quién puede reservarla |
|---|---|
| **Grupal** | Todos los alumnos |
| **Personalizado** | Solo los del plan *Personalizado full* |

En la agenda ves cada clase con **la lista de quién va**. Ya no hace falta
preguntar por WhatsApp. Desde ahí puedes escribirle a cualquiera (💬), sacarlo
de la clase (✕) o anotarlo tú a mano.

### 2. Dar de alta un alumno — pestaña **Alumnos**

Pulsa **＋ Nuevo alumno**, pon nombre, teléfono y su plan:

| Plan | Qué incluye |
|---|---|
| **Grupal** | Solo las clases grupales |
| **Personalizado full** | Los 1 a 1 **y** las clases grupales |

La app le genera un **PIN de 4 dígitos** y te da un botón para
**mandárselo por WhatsApp** con el enlace a la app. Un toque y listo.

> Guarda el teléfono **con el código del país** (ej. `56912345678`). Así
> funciona el botón de WhatsApp.

### 3. Registrar un pago — pestaña **Pagos** o botón 💵 del alumno

Pon el monto, cómo te pagó y **hasta qué fecha le cubre el plan**. Con eso la
app sabe quién está al día y te avisa de quién debe. Registrar un pago
**reactiva automáticamente** a un alumno que estaba pausado.

### 4. Cuando alguien no paga

Tienes dos botones en su ficha:

- **Pausar** — no puede entrar a la app y se sueltan sus reservas futuras,
  pero **no pierdes su historial**. Cuando pague, le das a *Reactivar* (o
  simplemente le registras el pago) y vuelve a entrar con el mismo PIN.
  **Es lo que deberías usar casi siempre.**
- **Eliminar** — lo borra a él y a sus reservas. No se puede deshacer. El
  historial de pagos sí se conserva, para que tus cuentas cuadren.

---

## Reglas que la app aplica sola

- Un alumno **no puede reservar dos clases a la misma hora**.
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
