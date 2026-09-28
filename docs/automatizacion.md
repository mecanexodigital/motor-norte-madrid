# Automatización de leads — n8n

## 1. Resumen general
La automatización consiste en que un cliente rellena el formulario para pedir cita o presupuesto con sus datos (Nombre, correo, telefono, marca del vehículo, fallo del coche, fecha preferida, descripción breve) esos datos se almacenan en una hoja google sheets, se envía un correo al taller y si ha incluido el email se le escribe que su solicitud ha sido recibida. Cada seis horas se revisa si el estado de la solicitud está en 'Nuevo' y si es así y han pasado más de 24 horas se notifica al taller.

Hay dos flujos, uno de los datos y el otro de recordatorios de leads.

## 2. Requisitos previos para un cliente nuevo
VPS instalado y corriendo.
Una cuenta de Google del cliente (o gestionada por ti en su nombre) con Sheets y Gmail habilitados.
Un proyecto de Google Cloud con las APIs de Sheets y Gmail activadas, y la pantalla de consentimiento configurada con esa cuenta como usuario de prueba (o publicada, si decides dar ese paso más adelante).

## 3. Qué cambiar para cada cliente nuevo

Nombre de la hoja de Google Sheets (Leads [Nombre Taller]).
Email de destino en el nodo Gmail (aviso al taller) — de tu email de pruebas al email real del taller.
Texto del email de confirmación al cliente — el nombre del taller mencionado en el cuerpo del mensaje.
La Production URL del webhook, que hay que pegar en el main.js de la web de ese cliente.
Las credenciales OAuth de Google — si gestionas la cuenta del cliente, hay que crear una nueva conexión OAuth para su cuenta específica, no reutilizar la tuya.

## 4. Problemas ya resueltos (para no repetirlos)
Esto es quizá lo más valioso del documento, porque son cosas que te han costado tiempo real resolver:
Que row_number no viaja entre nodos si pasa por Gmail en medio — hay que referenciarlo con $('nombre del nodo').item.json.row_number.
Que hay que guardar la fecha en dos formatos: uno legible (fecha_recepcion) y uno ISO (fecha_recepcion_iso) para que el cálculo de horas del recordatorio no dependa de cómo Google Sheets reformatee el texto.
Que "Get row(s) in sheet" necesita "Return All" activado, o solo trae una fila.
Que las pruebas con PowerShell necesitan Invoke-RestMethod, no curl (que en PowerShell es un alias distinto al curl real).
Que el botón para activar el flujo en esta versión de n8n se llama "Publish", no "Active".

## 5. Checklist de prueba tras clonar el flujo
Enviar una solicitud de prueba con datos ficticios, confirmar que aparece en Sheets, que llega el email de aviso, que llega la confirmación si hay email, y ejecutar el flujo de recordatorios manualmente con una fila de prueba de fecha antigua.
