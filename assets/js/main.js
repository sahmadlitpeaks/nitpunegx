// NIPTunegx® — UI behaviors
(function () {
  'use strict';

  const mql = window.matchMedia('(max-width: 980px)');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  function closeMenu() {
    if (!links) return;
    links.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    // close all submenus too
    links.querySelectorAll('.has-menu.open').forEach(li => li.classList.remove('open'));
  }

  // Mobile nav toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      document.body.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) {
        links.querySelectorAll('.has-menu.open').forEach(li => li.classList.remove('open'));
      }
    });
  }

  // Submenu trigger: on mobile, the chevron link toggles the submenu
  // instead of navigating immediately. On desktop, hover/focus handles it.
  document.querySelectorAll('.nav-links .has-menu').forEach(li => {
    const trigger = li.querySelector(':scope > a');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      if (mql.matches) {
        e.preventDefault();
        const isOpen = li.classList.toggle('open');
        // close siblings
        if (isOpen) {
          li.parentElement.querySelectorAll(':scope > .has-menu.open').forEach(other => {
            if (other !== li) other.classList.remove('open');
          });
        }
      }
    });
  });

  // Close menu when a normal link is tapped on mobile
  if (links) {
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (!mql.matches) return;
        // ignore the parent submenu trigger (handled above)
        if (a.parentElement.classList.contains('has-menu') && a.parentElement.querySelector('.submenu')) return;
        closeMenu();
      });
    });
  }

  // Close on outside click (desktop submenus + mobile drawer)
  document.addEventListener('click', (e) => {
    if (!links) return;
    if (e.target.closest('.nav') || e.target.closest('.nav-links')) return;
    closeMenu();
  });

  // Escape closes everything
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Reset state when crossing the breakpoint
  mql.addEventListener('change', closeMenu);

  // Reveal-on-scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
