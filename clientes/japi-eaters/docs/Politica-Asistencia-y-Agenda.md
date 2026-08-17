# Política de asistencia y admisión — Entrevista ÉxiTO

> Objetivo: subir la **tasa de asistencia** a la entrevista de admisión y bajar
> cancelaciones/no-shows, posicionando el proceso como una **postulación
> universitaria** y no como una llamada de venta. Incluye el copy del formulario,
> el bloque HTML para la página de agenda, los mensajes de WhatsApp y cómo
> operar el bloqueo por un semestre.

## La regla (fuente de verdad)

| Situación | Consecuencia |
|---|---|
| **Reprograma una vez**, con más de 24 h de aviso | Sin penalización. Mueve su hora desde el link de confirmación. |
| **Cancela** su entrevista (en cualquier momento) | Postulación cerrada **6 meses** (un semestre). |
| **No se presenta** (no-show) | Postulación cerrada **6 meses** (un semestre). |
| No responde la confirmación por WhatsApp | Liberamos el cupo antes de la hora; **no** cuenta como no-show porque la baja la damos nosotros. |
| Segunda reprogramación | Se cierra el cupo y se invita a postular en la próxima convocatoria. |

**La distinción que sostiene todo:** *reprogramar* no es *cancelar*. Mover la
hora una vez, avisando antes, está permitido y no penaliza. Cancelar o no
aparecer, sí. Así la política es dura sin ser injusta: siempre hubo una salida
limpia y ella eligió no tomarla.

**Por qué funciona:** el costo de faltar deja de ser cero. La escasez es real
(la agenda de la entrevistadora se bloquea) y la consecuencia es concreta y
fechada, no una amenaza vaga.

**Criterio interno de excepción** (no se publica): emergencia médica o
fallecimiento familiar, avisado dentro de las 24 h posteriores. Lo autoriza solo
Rafa o Seba y se registra en el CRM. Todo lo demás se aplica sin excepción —
si la regla se dobla, deja de existir.

---

## 1. Pregunta de confirmación por WhatsApp (formulario de postulación)

Reemplaza el texto largo actual. La advertencia va en la descripción; la
pregunta queda de una sola línea y las opciones dan una salida digna.

**Descripción (arriba de la pregunta):**

> Te contactaremos por WhatsApp para confirmar tu entrevista. **Si no
> confirmas, el cupo se libera para otra terapeuta.** Y si **cancelas o no te
> presentas, tu postulación queda cerrada por un semestre completo.** Lo hacemos
> porque esto es una formación profesional y la agenda es limitada.

**Pregunta:**

> ¿Confirmas que responderás por WhatsApp y asistirás a tu entrevista? *

**Opciones:**

- ✅ Sí. Respondo el WhatsApp y me conecto puntual el día y la hora que elija.
- ❌ Prefiero no comprometerme ahora. Postularé en la próxima convocatoria.

> Si necesitas mover tu hora, puedes **reprogramar una sola vez** desde el correo
> de confirmación, avisando con más de 24 horas. Reprogramar a tiempo no
> penaliza tu postulación.

> Nota: quien marque la segunda opción **no debe** llegar al calendario. Envíala
> a una página de "próxima convocatoria" con captura de correo. Un no-show menos
> vale más que una agenda inflada.

### Micro-ajuste a la segunda pregunta (la de decisión)

Mantén "¿Quién debe estar contigo en la reunión para poder tomar la decisión?"
y agrega una línea de descripción:

> Si la decisión no es solo tuya, **agenda un horario en el que esa persona
> pueda acompañarte**. Es la única forma de que salgas de la entrevista con una
> respuesta y no con una conversación pendiente.

---

## 2. Bloque para la página de agenda (arriba del calendario)

Código listo en [`../assets/agenda-aviso.html`](../assets/agenda-aviso.html).
Es autocontenido (sin fuentes ni scripts externos) y usa la paleta de la landing:
púrpura `#26215C`/`#3C3489` con acento dorado `#C9A84C`. Va **al mismo ancho que
el widget del calendario** (1170 px, ajustable con la variable `--je-w`) y las
tres reglas van en 3 columnas en desktop para no empujar el calendario fuera de
la primera pantalla; en móvil se apilan.

**Instalación en Go High Level:**

1. Edita la página de agenda → añade un elemento **Custom HTML / Código
   personalizado** justo **arriba** del embed del calendario.
2. Pega el contenido completo del archivo (incluye su bloque `<style>`).
3. Guarda y revisa en móvil: el bloque no debe empujar el calendario fuera de la
   primera pantalla en desktop.

**Qué dice (versión mínima, 2 reglas):** entrevista de admisión a una formación
profesional con certificación internacional → reservas 45 minutos de agenda a tu
nombre → (1) confirmamos por WhatsApp, si no respondes liberamos el cupo →
(2) cancelar o no presentarte cierra la postulación por un semestre.

El bloque es deliberadamente breve: arriba del calendario nadie lee párrafos.
La opción de **reprogramar** no se menciona aquí a propósito — en el momento de
agendar solo debe pesar el compromiso. La salida por reprogramación se comunica
donde corresponde: en la descripción del calendario (sección 3), en el
formulario (sección 1) y en el recordatorio de WhatsApp de T-24 h, que es el
momento real en que alguien necesita mover su hora.

### Variante opcional: calendario bloqueado hasta aceptar

Si quieres subir aún más el compromiso, agrega esto **al final** del bloque HTML.
Oculta el calendario hasta que marque la casilla (cambia `#calendario` por el ID
o clase real del contenedor del embed en tu página).

```html
<label class="je-adm-ok" style="display:flex;gap:10px;align-items:flex-start;
  max-width:1170px;margin:0 auto 18px;padding:14px 16px;border-radius:12px;
  background:#F2F0F9;border:1px solid rgba(83,74,183,.18);cursor:pointer;
  font:500 15px/1.5 'DM Sans',system-ui,sans-serif;color:#26215C;">
  <input type="checkbox" id="jeAdmOk" style="margin-top:3px;width:18px;height:18px;">
  <span>Leí y acepto las condiciones: si cancelo o no me presento, no podré
  postular durante un semestre completo.</span>
</label>
<script>
(function(){
  var box = document.getElementById('jeAdmOk');
  var cal = document.querySelector('#calendario'); /* ← ajusta este selector */
  if(!box || !cal) return;
  cal.style.transition = 'opacity .25s ease';
  var lock = function(){
    cal.style.opacity = box.checked ? '1' : '.35';
    cal.style.pointerEvents = box.checked ? 'auto' : 'none';
  };
  lock();
  box.addEventListener('change', lock);
})();
</script>
```

---

## 3. Descripción del calendario (panel izquierdo del widget)

Ese panel es angosto y **hace scroll**: solo se leen las primeras 4-5 líneas sin
que nadie desplace. Por eso la advertencia va arriba, no al final.

**Nombre del evento** (hoy dice "[A] Programa Éxito en Alimentación Infantil"):

> Entrevista de admisión · Programa ÉxiTO en Alimentación Infantil

> Dos correcciones: el prefijo interno **"[A]"** no debería verlo la postulante
> (déjalo solo en el nombre interno del calendario) y la marca se escribe
> **ÉxiTO**, no "Éxito".

**Descripción:**

> **Entrevista de admisión** al Programa **ÉxiTO en Alimentación Infantil** —
> videollamada de **45 minutos** con una terapeuta del equipo de Josefina Pizarro.
>
> **Cupos limitados por convocatoria.** Al agendar bloqueas 45 minutos de agenda a
> tu nombre: si cancelas o no te presentas, tu postulación queda cerrada por un
> semestre completo. Si te surge un imprevisto puedes reprogramar una sola vez,
> avisando con más de 24 horas.
>
> **Qué haremos:** revisamos tu perfil profesional y tu realidad clínica actual, te
> presentamos el programa completo con precios, métodos y opciones de pago, y
> resolvemos todas tus dudas. Al terminar sabrás con claridad si ÉxiTO es la
> formación correcta para ti.
>
> **Cómo prepararte:**
> • Conéctate desde un computador, con audio y buena conexión.
> • Reserva los 45 minutos completos, en un lugar tranquilo y sin interrupciones.
> • Si la decisión no es solo tuya, elige un horario en que esa persona pueda
> acompañarte.
>
> **Condiciones de tu postulación:**
> • Confirmamos por WhatsApp. Si no respondes, liberamos el cupo.
> • Puedes reprogramar **una sola vez**, avisando con más de 24 horas.
> • Cancelar o no presentarte cierra tu postulación por **6 meses**.
>
> Al agendar, aceptas estas condiciones.

**Versión corta** (si el campo se ve muy apretado en móvil):

> **Entrevista de admisión** al Programa **ÉxiTO en Alimentación Infantil** —
> videollamada de 45 min con una terapeuta del equipo. Revisamos tu perfil, te
> mostramos el programa completo con precios y opciones de pago, y resolvemos tus
> dudas.
>
> **Cupos limitados.** Confirmamos por WhatsApp; puedes reprogramar una vez con
> 24 h de aviso. Si cancelas o no te presentas, tu postulación queda cerrada por
> un semestre completo. Conéctate desde un computador, con audio y 45 minutos
> libres.

---

## 4. Secuencia de WhatsApp (la que sostiene la asistencia)

Tres toques. Cortos, con tono de institución, siempre pidiendo una respuesta
explícita (responder = compromiso).

**T+0 · inmediato al agendar**

> Hola [Nombre] 👋 Soy [Setter] del equipo de Josefina Pizarro.
> Tu entrevista de admisión a ÉxiTO quedó reservada para el **[día] a las [hora]
> ([zona])**. El cupo está a tu nombre y la agenda de esa hora ya está bloqueada.
> Para dejarla confirmada, respóndeme con un **"CONFIRMO"**.
> Si no recibo tu respuesta, libero el cupo para la siguiente postulante.

**T-24 h**

> [Nombre], mañana **[día] a las [hora]** es tu entrevista de admisión.
> Recordatorio de las condiciones que aceptaste al postular: si necesitas mover
> la hora, este es el momento (se puede una sola vez, y este es el link:
> [link reprogramar]). Cancelar o no presentarte cierra tu postulación por un
> semestre completo.
> ¿Sigue en pie? Respóndeme **SÍ** 🥕

**T-1 h**

> [Nombre], en 1 hora nos vemos. Este es el link: [link]
> Conéctate desde un lugar tranquilo, con audio y 45 minutos libres —
> revisamos tu caso y te muestro el programa completo con precios y opciones de
> pago. Te espero puntual.

**Post no-show (mismo día)**

> [Nombre], te esperamos a las [hora] y no pudimos conectar contigo.
> Según las condiciones que aceptaste al postular, tu postulación a ÉxiTO queda
> **cerrada hasta el [fecha + 6 meses]**. Cuando se abra la próxima convocatoria
> te avisaremos por este medio.
> Gracias por tu interés y te deseo lo mejor en tu camino profesional 💜

> El mensaje de no-show **se envía siempre**. Es lo que convierte la política en
> algo real, y además es el mensaje que más "recuperaciones" genera: quien de
> verdad quería entrar, responde pidiendo una excepción. Ahí decides tú.

---

## 5. Cómo operar el bloqueo (CRM / Go High Level)

1. **Etiquetas de contacto:** `admision-confirmada`, `admision-reprogramada`,
   `no-show`, `cancelacion-tardia`, `bloqueado-hasta-AAAA-MM` (una sola vigente).
2. **Campo personalizado:** `Fecha de rehabilitación` = fecha del no-show + 6 meses.
   Es el dato que consulta el setter antes de agendar a alguien que ya postuló.
3. **Automatización:** al marcar `no-show` o `cancelacion-tardia` → aplicar
   etiqueta de bloqueo, calcular la fecha, sacar el contacto de las campañas de
   agenda y moverlo a la lista "Próxima convocatoria".
4. **Antes de agendar:** el setter revisa etiquetas. Si hay bloqueo vigente, no
   se agenda — se responde con el mensaje de próxima convocatoria.
5. **Al cumplirse el plazo:** automatización que quita el bloqueo y envía un
   "se abrió tu postulación de nuevo". Ese contacto vuelve caliente y ya sabe
   que la agenda se respeta.

---

## 6. Qué medir (semanal)

| Métrica | Cómo se calcula | Meta inicial |
|---|---|---|
| Tasa de confirmación | confirmaron por WhatsApp ÷ agendados | ≥ 80 % |
| **Tasa de asistencia (show rate)** | asistieron ÷ agendados | 45-55 % → **70 %+** |
| Cancelación tardía | canceladas <24 h ÷ agendados | < 10 % |
| No-show puro | no-shows ÷ agendados | < 15 % |
| Agendados por semana | volumen absoluto | Bajará; es esperado |
| **Entrevistas efectivas** | asistidas por semana | Debe **subir** o mantenerse |

**Lectura correcta:** filtrar reduce el número de agendados. Eso no es un
problema mientras las *entrevistas efectivas* no bajen — Rafa deja de perder
horas frente a una sala vacía y habla con postulantes que llegaron habiendo
aceptado condiciones. Si a las 3 semanas caen tanto agendados como entrevistas
efectivas, suaviza primero la variante con checkbox, nunca la política.
