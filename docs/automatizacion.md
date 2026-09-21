# Propuesta de automatización — Atención al cliente y gestión de solicitudes

Este documento describe cómo llevar la web de demo a una versión con
formulario funcional y automatización real de la gestión de citas. **Nada de
esto está implementado en el código todavía** — es la hoja de ruta para
cuando el taller quiera activarlo.

## Por qué automatizar esto

En un taller mecánico, el cuello de botella habitual no es la web en sí,
sino todo lo que pasa *después* de que alguien pide una cita: alguien tiene
que leer el email/WhatsApp, apuntarlo en algún sitio, confirmar hueco y
responder al cliente. Automatizar ese flujo reduce tiempo de respuesta y
citas perdidas por no contestar a tiempo.

---

## Nivel 1 — Formulario funcional (mínimo viable)

**Objetivo:** que las solicitudes del formulario lleguen de verdad al taller,
sin necesidad de programar ni mantener un backend propio.

**Opciones recomendadas:**

- **[EmailJS](https://www.emailjs.com/):** envía el contenido del formulario
  directamente desde el navegador a una plantilla de email, sin servidor.
  Plan gratuito suficiente para el volumen de un taller pequeño/mediano.
- **[Formspree](https://formspree.io/):** alternativa muy similar, se define
  un `action` de formulario apuntando a su endpoint.

**Cómo se conectaría al formulario actual (`#cita-form` en `index.html`):**

1. Crear una cuenta en EmailJS o Formspree y una plantilla de email con los
   campos: `nombre`, `telefono`, `email`, `vehiculo`, `servicio`, `fecha`,
   `mensaje` (mismos `name` que ya usan los inputs del formulario).
2. En `assets/js/main.js`, sustituir el bloque de "Demo: no se envía ninguna
   petición real" por la llamada al SDK de EmailJS (o el `fetch` al endpoint
   de Formspree), manteniendo la validación que ya existe.
3. Mostrar el mismo mensaje de éxito/error actual, pero basado en la
   respuesta real del servicio.

**Complementario, ya funcional en la demo:** el botón de WhatsApp
(`wa.me/...`) no necesita ningún servicio adicional — solo actualizar el
número real del taller.

---

## Nivel 2 — Automatización de la gestión de solicitudes

**Objetivo:** que cada solicitud se organice y notifique sola, sin que
alguien tenga que estar revisando el email todo el día.

**Herramientas sin código recomendadas:** Zapier, Make.com o n8n (n8n es
autoalojable y gratuito si se quiere evitar cuotas mensuales).

**Flujo propuesto, disparado por cada envío del formulario (vía EmailJS/Formspree o un webhook):**

1. **Registro:** la solicitud se guarda como fila nueva en una hoja de
   **Google Sheets** (actúa como mini-CRM: nombre, teléfono, vehículo,
   servicio, fecha solicitada, estado).
2. **Calendario:** se crea un evento provisional en **Google Calendar** con
   la fecha/hora propuesta, para que quede bloqueada mientras se confirma.
3. **Confirmación al cliente:** email o WhatsApp automático confirmando que
   la solicitud se ha recibido y el siguiente paso (ej. "te llamamos para
   confirmar hora exacta").
4. **Aviso interno:** notificación al encargado del taller (email, Telegram
   o Slack) con el resumen de la solicitud, para que la confirme o reagende.

**Por qué este orden:** separar "solicitud registrada" de "cita confirmada"
evita que el calendario se llene de huecos fantasma si el cliente no
responde a la confirmación.

---

## Nivel 3 — Atención conversacional (opcional, a futuro)

Si el volumen de mensajes por WhatsApp crece, se puede añadir:

- Un **chatbot de WhatsApp Business API** (o un widget de chat en la propia
  web) que responda automáticamente preguntas frecuentes (horario, si hacen
  ITV, si necesitas cita previa) y derive a una persona cuando la consulta
  no encaja en las respuestas predefinidas.
- Reglas simples primero (palabras clave → respuesta), antes de plantear
  nada basado en IA generativa — para un taller, la mayoría de preguntas son
  muy repetitivas y no necesitan más que eso.

---

## Resumen: qué requiere cada nivel

| Nivel | Qué aporta | Servicios/cuentas necesarias | Coste aproximado |
|---|---|---|---|
| 1. Formulario funcional | Las solicitudes llegan por email de verdad | EmailJS o Formspree | Gratis en volumen bajo |
| 2. Gestión automática | Registro + calendario + notificaciones sin intervención manual | Google Sheets/Calendar + Zapier/Make/n8n | Gratis a bajo volumen; planes de pago si crece |
| 3. Atención conversacional | Respuestas automáticas por WhatsApp/chat | WhatsApp Business API o proveedor de chatbot | Variable según proveedor |

**Recomendación de orden de implementación:** Nivel 1 primero (imprescindible
para que el taller reciba solicitudes reales), Nivel 2 en cuanto el volumen
de citas justifique automatizar el registro, y Nivel 3 solo si el volumen de
mensajes repetitivos lo hace rentable.
