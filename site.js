/* OurPins — shared site behavior. Lightweight, no dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Current year in footer ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Hero load sequence ---- */
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var heroItems = [].slice.call(hero.querySelectorAll('.hero-anim'));
    if (reduce) {
      heroItems.forEach(function (el) { el.classList.add('in'); });
    } else {
      hero.classList.add('hero-ready');
      heroItems.forEach(function (el, i) {
        var seq = parseInt(el.getAttribute('data-seq') || i, 10);
        setTimeout(function () { el.classList.add('in'); }, 120 + seq * 130);
      });
      /* Safety: commit hero to final state even where transitions are paused */
      setTimeout(function () { document.documentElement.classList.add('motion-settled'); }, 1600);
    }
  }

  /* ---- Scroll reveal with stagger (rect-based: works everywhere) ---- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  var pinEls = [].slice.call(document.querySelectorAll('[data-pindrop]'));
  function revealEverything() {
    revealEls.forEach(function (el) { el.classList.add('in', 'committed'); });
    /* leave [data-pindrop] at its default (visible) state — do NOT add
       .pin-drop here, since its drop animation starts from opacity:0 and
       would stay hidden in environments that pause animations. */
    revealEls = []; pinEls = [];
  }
  /* Detect environments where scrolling can't actually move (capture/preview
     harnesses): if so, just show everything so content is never stuck hidden.
     Real browsers pass this test and keep the scroll-triggered animations. */
  function scrollWorks() {
    var se = document.scrollingElement || document.documentElement;
    if (se.scrollHeight - se.clientHeight <= 8) return false; // nothing to scroll
    var before = se.scrollTop;
    se.scrollTop = before + 12;
    var moved = Math.abs(se.scrollTop - before) > 1;
    se.scrollTop = before;
    return moved;
  }
  if (reduce) {
    revealEverything();
  } else if (!scrollWorks()) {
    revealEverything();
  } else {
    var revealTick = false;
    var revealCheck = function () {
      revealTick = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = revealEls.length - 1; i >= 0; i--) {
        var el = revealEls[i];
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          var groupIndex = el.getAttribute('data-stagger');
          var d = groupIndex ? parseInt(groupIndex, 10) * 90 : parseFloat(el.getAttribute('data-delay') || '0');
          el.style.transitionDelay = d + 'ms';
          el.classList.add('in');
          (function (node) { setTimeout(function () { node.classList.add('committed'); }, 780 + d); })(el);
          revealEls.splice(i, 1);
        }
      }
      for (var j = pinEls.length - 1; j >= 0; j--) {
        var p = pinEls[j], pr = p.getBoundingClientRect();
        if (pr.top < vh * 0.85 && pr.bottom > 0) {
          p.classList.add('pin-drop');
          (function (node) { setTimeout(function () { node.classList.add('committed'); }, 760); })(p);
          pinEls.splice(j, 1);
        }
      }
    };
    var onReveal = function () { if (!revealTick) { revealTick = true; requestAnimationFrame(revealCheck); } };
    window.addEventListener('scroll', onReveal, { passive: true });
    window.addEventListener('resize', onReveal, { passive: true });
    window.addEventListener('load', revealCheck);
    revealCheck();
    /* re-check shortly after load in case layout/fonts shift positions */
    setTimeout(revealCheck, 300);
    setTimeout(revealCheck, 900);
    /* final safety net: if still hidden after a while, just show it */
    setTimeout(function () { if (revealEls.length) revealEverything(); }, 5000);
  }

  /* ---- Gentle parallax on tagged elements ---- */
  if (!reduce) {
    var px = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (px.length) {
      var ticking = false;
      var run = function () {
        var vh = window.innerHeight;
        px.forEach(function (el) {
          var r = el.getBoundingClientRect();
          var center = r.top + r.height / 2;
          var off = (center - vh / 2) / vh; // -0.5..0.5-ish
          var amt = parseFloat(el.getAttribute('data-parallax') || '14');
          el.style.transform = 'translate3d(0,' + (-off * amt).toFixed(1) + 'px,0)';
        });
        ticking = false;
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(run); }
      }, { passive: true });
      run();
    }
  }
})();
