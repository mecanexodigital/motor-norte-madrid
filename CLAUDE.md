# Motor Norte Madrid — reglas del repositorio

## Qué es este proyecto
Landing de una sola página para un taller mecánico FICTICIO ("Motor Norte Madrid"), demo de mi negocio MecaNexo. HTML, CSS y JavaScript puros. Sin frameworks, sin Tailwind y sin dependencias externas.

## Estructura
index.html, css/styles.css, js/main.js, img/, docs/automatizacion.md, README.md, CLAUDE.md

## Reglas de contenido
- Son datos ficticios: nombre, dirección, teléfonos, horario, reseñas y razones de confianza. Nunca presentarlos como reales.
- Si en el futuro falta un dato real de un cliente, usar [PENDIENTE DE CONFIRMAR]. No inventarlo.
- No añadir promesas operativas ni comerciales: garantías, plazos, precios, certificaciones, reseñas, coche de sustitución.
- No prometer diagnóstico, presupuesto final, reparación ni cita inmediata antes de que el taller revise el coche.
- Mantener <meta name="robots" content="noindex, nofollow">. No añadir datos estructurados LocalBusiness con datos ficticios.

## Formulario
- Campos: nombre, teléfono, email (opcional), vehículo, servicio (desplegable), fecha preferida (opcional, debe ser posterior al día de envío) y descripción (obligatoria).
- Validación doble: HTML nativo (required, type, labels, límites) y JavaScript (mensajes claros, estado de carga, bloqueo de doble envío).
- Se envía como JSON con fetch() a la constante N8N_WEBHOOK_URL de js/main.js. No cambiar esa URL salvo que yo lo pida.

## Forma de trabajar
- Cambiar solo lo que se pide. No tocar código no relacionado.
- No añadir dependencias ni librerías sin explicar por qué hacen falta.
- Al terminar, decirme qué archivos y qué líneas se han modificado.
- Diseño mobile-first. Comprobar a 320, 375, 768 y 1024 px.

## Seguridad
- Nunca guardar contraseñas, claves API, tokens, archivos .env ni datos personales reales en el repositorio.

## Git
- No hacer commit ni push salvo que yo lo pida.
- Cuando te diga "sube esto", haz en un solo paso: git add, commit con mensaje descriptivo en español y push.
- Netlify despliega a producción con cada push, así que solo subo cambios que ya he probado en local.
