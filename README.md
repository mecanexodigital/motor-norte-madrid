# Motor Norte Madrid — Web del taller (demo)

Web profesional de demo para un taller mecánico de automoción, pensada para
transmitir confianza y captar solicitudes de cita/presupuesto.

> **Estado del proyecto:** demo funcional en HTML, CSS y JavaScript plano
> (sin frameworks ni dependencias externas). Todos los datos (teléfono,
> dirección, testimonios, etc.) son **ficticios**.

## Estructura del proyecto

```
motor-norte-madrid/
├── index.html                  # Página única con navegación por anclas
├── assets/
│   ├── css/styles.css          # Estilos (mobile-first, concepto "hoja de presupuesto")
│   ├── js/main.js              # Menú móvil, FAQ, formulario, horario "abierto ahora"
│   └── icons/favicon.svg       # Favicon
├── docs/
│   └── automatizacion.md       # Propuesta de automatización de atención al cliente
└── README.md
```

## Cómo verla en local

No hace falta instalar nada. Basta con abrir `index.html` en el navegador:

- **Opción rápida:** doble clic sobre `index.html`.
- **Opción recomendada (evita problemas de rutas):** servir la carpeta con un
  servidor local, por ejemplo:

  ```bash
  # Con Python (si lo tienes instalado)
  python -m http.server 5500

  # O con la extensión "Live Server" de VS Code
  ```

  Y abrir `http://localhost:5500` en el navegador.

## Estado del formulario de cita/presupuesto

El formulario de la sección **"Pedir cita"** realiza **validación en el
navegador únicamente**. Al enviarlo:

- Comprueba que los campos obligatorios sean válidos.
- Muestra un mensaje de confirmación visual.
- **No envía los datos a ningún servidor, email ni servicio externo.**

Esto es intencionado en esta v1. La propuesta para conectarlo a un envío real
(EmailJS, Formspree, etc.) y para automatizar la gestión de las solicitudes
está documentada en [`docs/automatizacion.md`](docs/automatizacion.md).

## Publicación (cuando se quiera desplegar)

Al ser un sitio 100% estático, se puede publicar gratis en:

- **GitHub Pages**: subir el repositorio a GitHub y activar Pages sobre la
  rama principal (carpeta raíz).
- **Netlify**: arrastrar la carpeta del proyecto en el panel de Netlify, o
  conectar el repositorio para despliegue automático.

Ninguna de las dos opciones requiere backend ni configuración adicional para
esta versión de la web.

## Próximos pasos posibles

1. Sustituir los datos de contacto y contenidos ficticios por los reales del
   taller.
2. Añadir fotografías reales del taller y del equipo.
3. Conectar el formulario a un servicio real de envío (ver `docs/automatizacion.md`).
4. Implementar la automatización de gestión de solicitudes (nivel básico o avanzado).
5. Registrar dominio propio y publicar en GitHub Pages/Netlify.
