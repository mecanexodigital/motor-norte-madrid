/**
 * Motor Norte Madrid — Interacciones de la web
 * Sin dependencias externas. Todo el código corre en el navegador.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initCitaForm();
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
 * DEMO: solo valida los campos en el navegador.
 * No se envían datos a ningún servidor ni servicio externo.
 * Ver docs/automatizacion.md para cómo conectar esto a un
 * servicio real (EmailJS, Formspree, etc.) en el futuro.
 */
function initCitaForm() {
  const form = document.getElementById('cita-form');
  if (!form) return;

  const feedback = document.getElementById('form-feedback');

  const validators = {
    nombre: (value) => value.trim().length >= 3,
    telefono: (value) => /^[+\d][\d\s]{7,}$/.test(value.trim()),
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    vehiculo: (value) => value.trim().length >= 2,
    servicio: (value) => value.trim().length > 0,
  };

  const errorMessages = {
    nombre: 'Escribe tu nombre completo.',
    telefono: 'Introduce un teléfono válido.',
    email: 'Introduce un email válido.',
    vehiculo: 'Indica marca y modelo de tu vehículo.',
    servicio: 'Selecciona un servicio.',
  };

  form.addEventListener('submit', (event) => {
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

    // Demo: no se envía ninguna petición real. Solo confirmación visual.
    feedback.textContent =
      '¡Gracias! Esto es una demo, así que la solicitud no se ha enviado realmente. ' +
      'En la versión final te contactaríamos en menos de 24h.';
    feedback.className = 'form-feedback success';
    form.reset();
  });
}
