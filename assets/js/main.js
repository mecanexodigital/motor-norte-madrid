/**
 * Motor Norte Madrid — Interacciones de la web
 * Sin dependencias externas. Todo el código corre en el navegador.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initCitaForm();
  initHorario();
  document.getElementById('anio').textContent = new Date().getFullYear();
});

/* ---------- Menú móvil ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
  const getFocusable = () => Array.from(nav.querySelectorAll('a, button'));

  const openMenu = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    // Mueve el foco dentro del panel para que el siguiente Tab del usuario
    // continúe en el menú, no en el contenido oculto detrás.
    const focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
  };

  const closeMenu = (options = {}) => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (options.restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu();
    }
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeMenu({ restoreFocus: true });
      return;
    }

    // Atrapa el foco dentro del panel mientras está abierto en móvil, para
    // que Tab/Shift+Tab no se escapen al contenido de fondo cubierto por el menú.
    if (event.key === 'Tab' && isMobile()) {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

/* ---------- Acordeón de preguntas frecuentes ---------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      items.forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Formulario de cita / presupuesto ----------
 * En local (localhost o abriendo el archivo) envía los datos al webhook de n8n.
 * En la web publicada, el webhook de localhost no es accesible, así que solo
 * valida y muestra un aviso de demo en lugar de un error de envío.
 * Cuando n8n esté accesible desde internet, cambia N8N_WEBHOOK_URL y
 * elimina la comprobación de IS_LOCAL. Ver docs/automatizacion.md.
 */
function initCitaForm() {
  const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/formulario-taller';
  const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

  const form = document.getElementById('cita-form');
  if (!form) return;

  const feedback = document.getElementById('form-feedback');

  const validators = {
    nombre: (value) => value.trim().length >= 3,
    telefono: (value) => /^[+\d][\d\s]{7,}$/.test(value.trim()),
    email: (value) => value.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    vehiculo: (value) => value.trim().length >= 2,
    servicio: (value) => value.trim().length > 0,
    descripcion: (value) => value.trim().length >= 5,
  };

  const errorMessages = {
    nombre: 'Escribe tu nombre completo.',
    telefono: 'Introduce un teléfono válido.',
    email: 'Introduce un email válido.',
    vehiculo: 'Indica marca y modelo de tu vehículo.',
    servicio: 'Selecciona un servicio.',
    descripcion: 'Cuéntanos brevemente qué necesitas o qué problema has notado.',
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const field = form.elements[fieldName];
      const errorEl = document.getElementById(`error-${fieldName}`);
      const group = field.closest('.form-group');
      const valid = validators[fieldName](field.value);

      if (!valid) {
        isValid = false;
        group?.classList.add('has-error');
        if (errorEl) errorEl.textContent = errorMessages[fieldName];
      } else {
        group?.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';
      }
    });

    if (!isValid) {
      feedback.textContent = 'Revisa los campos marcados en rojo antes de continuar.';
      feedback.className = 'form-feedback error';
      return;
    }

    if (!IS_LOCAL) {
      feedback.textContent =
        'Datos correctos. Esta web es una demo y todavía no envía solicitudes: para pedir cita, llámanos al 910 000 000.';
      feedback.className = 'form-feedback success';
      form.reset();
      return;
    }

    const submitButton = form.querySelector('.form-submit');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.elements.nombre.value,
          telefono: form.elements.telefono.value,
          email: form.elements.email.value,
          vehiculo: form.elements.vehiculo.value,
          servicio: form.elements.servicio.value,
          descripcion: form.elements.descripcion.value,
          fecha: form.elements.fecha.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok === true) {
        feedback.textContent =
          '¡Gracias! Hemos recibido tu solicitud, te contactaremos lo antes posible.';
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        feedback.textContent =
          'No hemos podido enviar tu solicitud. Inténtalo de nuevo o llámanos directamente.';
        feedback.className = 'form-feedback error';
      }
    } catch (error) {
      feedback.textContent =
        'No hemos podido enviar tu solicitud. Inténtalo de nuevo o llámanos directamente.';
      feedback.className = 'form-feedback error';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

/* ---------- Horario: "abierto ahora" y día de hoy ----------
 * Usa la hora de Madrid, no la del dispositivo del visitante.
 */
function initHorario() {
  const estado = document.getElementById('horario-estado');
  if (!estado) return;

  // [apertura, cierre] en minutos desde medianoche; índice 0 = domingo.
  const horario = {
    0: null,
    1: [480, 1140], 2: [480, 1140], 3: [480, 1140], 4: [480, 1140], 5: [480, 1140],
    6: [540, 840],
  };
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const hora = (min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;

  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type) => partes.find((p) => p.type === type).value;
  const hoy = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const ahora = Number(get('hour')) * 60 + Number(get('minute'));

  document.querySelector(`.horario-table tr[data-days="${hoy}"]`)?.classList.add('is-today');

  const tramo = horario[hoy];
  if (tramo && ahora >= tramo[0] && ahora < tramo[1]) {
    estado.textContent = `Abierto ahora. Cerramos a las ${hora(tramo[1])}.`;
    estado.classList.add('is-open');
    return;
  }

  // Busca la próxima apertura (hoy más tarde o en los días siguientes).
  for (let i = 0; i < 7; i++) {
    const dia = (hoy + i) % 7;
    const t = horario[dia];
    if (!t || (i === 0 && ahora >= t[0])) continue;
    const cuando = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${dias[dia]}`;
    estado.textContent = `Cerrado ahora. Abrimos ${cuando} a las ${hora(t[0])}.`;
    return;
  }
}
