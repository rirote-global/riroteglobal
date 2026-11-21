// Homepage behaviour (src/pages/index.astro): the 3D hero stack, the reel caption, the "What we build" tabs and
// the work gallery. Everything degrades: without JS the stack is still, every showcase panel shows and the
// gallery is a plain horizontal scroller. Under reduced motion nothing moves on its own.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var motion = !reduced && 'IntersectionObserver' in window;
  if (motion) document.documentElement.classList.add('motion');
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ── Hero stack: assembles once, flattens as the page scrolls, follows the pointer on desktop ──
  var stack = document.getElementById('hx-stack'), stage = document.getElementById('hx-stage');
  if (stack && motion) {
    stack.classList.add('pre');
    setTimeout(function () {
      stack.classList.add('assemble');
      stack.classList.remove('pre');
      setTimeout(function () { stack.classList.remove('assemble'); }, 1500);
    }, 350);
    var flatTick = false;
    var flat = function () {
      flatTick = false;
      var r = stage.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / (window.innerHeight * 0.9)));
      stack.style.setProperty('--t', (1 - p).toFixed(3));
      stack.style.setProperty('--s', (1 - p * 0.8).toFixed(3));
    };
    window.addEventListener('scroll', function () { if (!flatTick) { flatTick = true; requestAnimationFrame(flat); } }, { passive: true });
    flat();
    if (fine) {
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        stack.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(2));
        stack.style.setProperty('--py', ((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2));
      });
      stage.addEventListener('pointerleave', function () { stack.style.setProperty('--px', 0); stack.style.setProperty('--py', 0); });
    }
  }

  // ── Reel: caption follows its four 3.2 s cuts; under reduced motion it waits for a tap ──
  var reel = document.getElementById('hx-reel'), reelCap = document.getElementById('hx-reel-cap');
  if (reel) {
    var cuts = ['ERPTick · service tickets', 'RIROTE VISION · make a video', 'RIROTE VISION · the timeline', 'ERPTick · quotations'];
    reel.addEventListener('timeupdate', function () { reelCap.textContent = cuts[Math.min(3, Math.floor(reel.currentTime / 3.2))]; });
    if (reduced) { reel.removeAttribute('autoplay'); reel.pause(); reel.controls = true; reel.removeAttribute('aria-hidden'); }
  }

  // ── What we build: tabs with arrow keys and a swipe on the panel; the panel slides in from the side moved to ──
  $$('[data-hx-tabs]').forEach(function (box) {
    var list = box.querySelector('[role="tablist"]');
    var tabs = $$('[role="tab"]', box), cur = 0;
    var panelOf = function (t) { return document.getElementById(t.getAttribute('aria-controls')); };
    function pick(i, focus) {
      if (i < 0 || i >= tabs.length || i === cur) return;
      var dir = i > cur ? 'fromR' : 'fromL';
      tabs.forEach(function (t, k) {
        var on = k === i, panel = panelOf(t), v = panel.querySelector('video');
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panel.hidden = !on;
        panel.classList.remove('fromR', 'fromL');
        if (v) {
          if (on && !reduced) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; }); }
          else { v.pause(); if (on) v.controls = true; }
        }
        if (on) { void panel.offsetWidth; panel.classList.add(dir); }
      });
      cur = i;
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      panelOf(t).hidden = i !== 0;
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); pick(Math.min(tabs.length - 1, cur + 1), true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); pick(Math.max(0, cur - 1), true); }
      });
    });
    list.hidden = false;
    box.classList.add('is-tabbed');
    var panels = box.querySelector('.hx-panels'), x0 = null, y0 = 0;
    panels.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    panels.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) pick(cur + (dx < 0 ? 1 : -1));
    });
  });

  // ── Work gallery: position counter and dots follow the swipe; the card in focus is full size ──
  var g = document.getElementById('hx-gallery');
  if (g) {
    var items = $$('article', g), dots = document.getElementById('hx-dots'), pos = document.getElementById('hx-pos');
    var padL = function () { return parseFloat(getComputedStyle(g).paddingLeft); };
    items.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Item ' + (i + 1) + ' of ' + items.length);
      d.addEventListener('click', function () { g.scrollTo({ left: items[i].offsetLeft - g.offsetLeft - padL(), behavior: reduced ? 'auto' : 'smooth' }); });
      dots.appendChild(d);
    });
    var galTick = false;
    var draw = function () {
      galTick = false;
      var start = g.getBoundingClientRect().left + padL(), best = 0, bd = Infinity;
      items.forEach(function (it, i) {
        var r = it.getBoundingClientRect(), dist = Math.abs(r.left - start);
        if (dist < bd) { bd = dist; best = i; }
        if (motion) it.style.setProperty('--k', Math.min(1, dist / r.width).toFixed(3));
      });
      pos.textContent = (best + 1) + ' of ' + items.length;
      $$('button', dots).forEach(function (d, i) { d.setAttribute('aria-current', String(i === best)); });
    };
    g.addEventListener('scroll', function () { if (!galTick) { galTick = true; requestAnimationFrame(draw); } }, { passive: true });
    window.addEventListener('resize', draw);
    g.addEventListener('keydown', function (e) {
      var i = +pos.textContent.split(' ')[0] - 1;
      if (e.key === 'ArrowRight' && i < items.length - 1) dots.children[i + 1].click();
      if (e.key === 'ArrowLeft' && i > 0) dots.children[i - 1].click();
    });
    draw();
  }
})();
