# SOP — Evitar contactos y oportunidades duplicadas (Instagram → Formulario)

> Problema: la Setter abre la conversación en Instagram y se crea el contacto/tarjeta
> N°1 solo con el **nombre de usuario de IG**. Cuando esa misma persona rellena el
> formulario de postulación a ÉxiTO, GHL crea un contacto/oportunidad **N°2** con los
> datos formales. Quedan dos registros de la misma lead.

## 1. Por qué pasa (causa raíz)

GoHighLevel **no deduplica por nombre**. Su única llave de identidad es el
**email** y/o el **teléfono** (Settings → Business Profile → *Allow Duplicate
Contact*). Un contacto creado desde un DM de Instagram nace **sin email y sin
teléfono**: su única identidad es el `@usuario` de IG.

Por lo tanto, cuando llega el formulario con nombre + email + WhatsApp, GHL **no
tiene ningún campo con el que hacer match** → crea un contacto nuevo. Y el workflow
que corre al enviarse el formulario crea, sobre ese contacto nuevo, una **segunda
oportunidad**.

No es un bug ni un error de la Setter: es el comportamiento esperado del CRM
cuando el primer registro no tiene llave de identidad.

**Conclusión operativa:** el duplicado se evita **antes** de que la lead envíe el
formulario, no después. Hay que darle al contacto de IG una llave (email/teléfono)
o mandar el formulario "firmado" con el `contact_id`.

## 2. La solución, en 4 capas

Implementar de arriba hacia abajo. La capa 1 sola ya elimina la mayoría de los casos.

### Capa 1 — Regla de oro de la Setter: capturar la llave ANTES de enviar el link

La Setter **no envía el link del formulario** hasta haber pedido y cargado en la
ficha de GHL al menos **uno** de estos dos datos:

- **WhatsApp** (con código de país, formato `+56 9 ...`) — preferido.
- **Email**.

Guion sugerido en el DM (antes del link):

> "Perfecto 🙌 Te paso la postulación. ¿Me confirmas tu **WhatsApp con código de
> país** y tu **correo**? Es para reservarte el cupo y que no se pierda tu
> postulación si Instagram nos corta la conversación."

Luego la Setter pega esos datos en los campos **Phone** y **Email** del contacto de
IG (no en un campo personalizado: en los campos nativos) y **recién ahí** envía el
link.

Efecto: cuando llegue el formulario con ese mismo email/teléfono, GHL hace match y
**actualiza el contacto existente** en vez de crear uno nuevo.

**Requisito de configuración (hacer una vez):**
- Settings → Business Profile → **Allow Duplicate Contact = OFF**, con match por
  **Email o Teléfono**.
- Settings → Opportunities → **Allow Duplicate Opportunity = OFF**.

**Requisito de formato (hacer una vez):** el campo teléfono del formulario debe
guardar el número en **formato internacional E.164** (activar el selector de país
en el campo de teléfono del form). Si la Setter guarda `9 1234 5678` y el
formulario guarda `+56912345678`, GHL los ve como dos números distintos y el
duplicado vuelve. Estandarizar SIEMPRE con `+56`.

### Capa 2 — Link personalizado con `contact_id` (automatiza la capa 1)

Si la Setter responde los DMs **dentro de GHL** (Conversations), puede enviar el
formulario con el ID del contacto ya incrustado, usando un **Snippet / respuesta
guardada**:

```
https://TU-DOMINIO/postular?contact_id={{contact.id}}
```

Al abrirse con ese parámetro, el envío del formulario queda **atado al contacto
que ya existe** en lugar de crear uno nuevo, incluso sin email ni teléfono previos.
Se puede sumar prefill de otros campos:

```
...?contact_id={{contact.id}}&first_name={{contact.first_name}}
```

> ⚠️ **Validar antes de confiar:** hacer una prueba real (contacto de IG sin
> email/teléfono → abrir link con `contact_id` → enviar formulario) y confirmar en
> GHL que NO se creó un segundo contacto. Si el parámetro no se respeta en tu
> versión/plan, quedarse con la capa 1 + capa 4.

Si los DMs se responden desde ManyChat, el equivalente es que ManyChat pase el
`contact_id` (o el email/teléfono capturado) a GHL antes de entregar el link.

### Capa 3 — Que el formulario NO cree una segunda oportunidad

Aunque el contacto sea el mismo, un workflow mal configurado igual abre tarjeta N°2.
Revisar el workflow que dispara "Form Submitted":

1. Acción **Create/Update Opportunity** (no "Create Opportunity" a secas).
2. Marcar **Allow duplicate opportunity = No** dentro de la acción.
3. Configurarla para **actualizar la oportunidad existente**:
   - Pipeline **① Instagram · Setter [Valen]** → mover la tarjeta a la etapa
     **Formulario Completado**.
   - Luego crear/mover a **② Agenda · WhatsApp [Anaís]** → etapa
     **Calificada (Formulario)**.
4. Agregar un **If/Else** al inicio: si el contacto ya tiene oportunidad abierta en
   ①, actualizar; si no la tiene (lead que llegó directo por ads/bio), crear.

Así la tarjeta de Instagram **avanza** en lugar de duplicarse, y no se pierde la
trazabilidad del trabajo de la Setter.

### Capa 4 — Red de seguridad: campo `@usuario_instagram` obligatorio

En el formulario de postulación agregar (obligatorio) la pregunta:

> **¿Cuál es tu usuario de Instagram?** (ej: @jose.pizarro)

Mapeado al campo que ya existe: `contact.usuario_instagram`.

Esto da una **segunda llave de identidad** y habilita dos cosas:

1. **Detección automática de duplicados** con un escenario de Make:
   `GHL Form Submitted` → buscar contactos cuyo `usuario_instagram` coincida →
   si hay más de uno, notificar en Slack/WhatsApp con ambos links y/o copiar los
   datos formales al contacto de IG y etiquetar el otro como `duplicado-revisar`.
2. **Fusión manual rápida**: Contacts → seleccionar los dos registros →
   **Merge Contacts**. Conserva conversaciones de ambos (el hilo de IG + el email)
   y combina los campos. Definir como **primario el contacto de Instagram**
   (es el que tiene la conversación y el historial de la Setter).

También conviene setear `contact.origen = org-setter` en los contactos que abre la
Setter, para poder medir cuántos duplicados vienen de ese canal.

## 3. Checklist de implementación

- [ ] Settings → Business Profile → *Allow Duplicate Contact* **OFF** (match Email o Teléfono)
- [ ] Settings → Opportunities → *Allow Duplicate Opportunity* **OFF**
- [ ] Campo teléfono del formulario en formato internacional (+56) obligatorio
- [ ] Campo "@usuario de Instagram" obligatorio en el formulario → `contact.usuario_instagram`
- [ ] Workflow de "Form Submitted" usando **Create/Update Opportunity** con If/Else
- [ ] Snippet en Conversations con el link + `contact_id={{contact.id}}` (probado)
- [ ] Guion de la Setter actualizado: pedir WhatsApp + email ANTES del link
- [ ] Escenario de Make de detección de duplicados por `usuario_instagram`
- [ ] Limpieza inicial: fusionar los duplicados históricos ya existentes

## 4. Qué hacer con los duplicados que ya existen

1. Contacts → filtrar por contactos **sin email y sin teléfono** creados en los
   últimos meses (esos son los "solo nombre de IG").
2. Buscar la contraparte formal por nombre real.
3. Seleccionar ambos → **Merge**, dejando como primario el contacto de Instagram.
4. En Opportunities, borrar la tarjeta huérfana y dejar una sola en el pipeline
   que corresponda a su etapa real.

Hacerlo en bloque una vez, y después el sistema de las 4 capas evita que se
vuelva a acumular.
