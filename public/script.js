/* ================================================================
   CONECTARURAL — script.js
   Navegación, animaciones de scroll y accesibilidad
   ================================================================ */

(function () {
  'use strict';

  // ── Referencias DOM ──────────────────────────────────────────────
  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  // ── Scroll: clase "scrolled" en la nav ──────────────────────────
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  // ── Menú móvil: abrir / cerrar ──────────────────────────────────
  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';

    // Foco al primer enlace cuando se abre
    const firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    if (navMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar al pulsar cualquier enlace
  navMenu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // Cerrar al clicar fuera (overlay)
  document.addEventListener('click', function (e) {
    if (
      navMenu.classList.contains('is-open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // ── Scroll suave para anclas internas ───────────────────────────
  // (polyfill ligero para Chrome/Android más antiguo)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Enlace activo en la nav según sección visible ───────────────
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var activeId = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          var matches = link.getAttribute('href') === '#' + activeId;
          link.classList.toggle('nav__link--active', matches);
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ── Animaciones de entrada (reveal) ─────────────────────────────
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Sin animaciones: mostrar todo de golpe
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ── Año en el footer (si se añade un <span id="year">) ──────────
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ── Aviso botones placeholder ────────────────────────────────────
  // Si las URLs no se han cambiado, los botones no redirigen sino que
  // muestran un aviso en consola para el desarrollador.
  document.querySelectorAll('a[href="URL_DEL_APK_AQUÍ"], a[href="URL_DEL_PANEL_AQUÍ"]')
    .forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        console.warn(
          '[ConectaRural] Enlace pendiente de configurar: ' + this.href +
          '\n→ Busca "URL_DEL_APK_AQUÍ" o "URL_DEL_PANEL_AQUÍ" en index.html y sustitúyelas.'
        );
        // En producción, eliminar este bloque y dejar los href reales.
      });
    });

})();
