// NimNim protection diagram (components/ShieldStory.astro). Each [data-shield] box is one diagram in four states.
// Dots are requests: cyan customers, red attacks. Step 0 everything gets in (including the open database port),
// 1 Cloudflare in front and the direct route closed, 2 attacks stopped at Cloudflare except some sign-ups,
// 3 the sign-up check stops the rest. The teaser cycles on its own; the full version also has step buttons and
// stops cycling once someone picks a step. Animation runs only while the diagram is on screen, never under
// reduced motion (then each step shows a still).
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  Array.prototype.forEach.call(document.querySelectorAll('[data-shield]:not([data-ready])'), function (box) {
    box.setAttribute('data-ready', '');
    var svg = box.querySelector('svg'), layer = box.querySelector('.dots');
    var cf = box.querySelector('.cf'), gate = box.querySelector('.gate'), bx = box.querySelector('.bx'), byp = box.querySelector('.bypass');
    var cfSub = box.querySelector('.cfs'), cap = box.querySelector('.shield-cap');
    var doors = box.querySelectorAll('.door');
    var btns = Array.prototype.slice.call(box.querySelectorAll('[data-step]'));
    var says = Array.prototype.slice.call(box.querySelectorAll('[data-say]'));
    var captions = JSON.parse(box.querySelector('[data-steps]').textContent);
    var step = 0, auto = true, dots = [], running = false, raf = 0, timer = 0;
    var X = { web: 100, signup: 246, db: 323 };

    function set(i, byUser) {
      step = i;
      if (byUser) auto = false;
      btns.forEach(function (b, k) {
        b.setAttribute('aria-selected', String(k === i));
        b.tabIndex = k === i ? 0 : -1;
        b.classList.toggle('done', k < i);
      });
      says.forEach(function (s, k) { s.hidden = k !== i; });
      cap.textContent = captions[i];
      cf.classList.toggle('off', i < 1);
      bx.classList.toggle('off', i < 1);
      byp.style.opacity = i < 1 ? 1 : 0.15;
      gate.classList.toggle('off', i < 3);
      cfSub.textContent = i >= 2 ? 'Bot Fight Mode · custom rules · DDoS' : 'All traffic goes through here';
      if (reduced || !running) still();
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { set(i, true); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
        if (n >= 0 && n < btns.length) { e.preventDefault(); set(n, true); btns[n].focus(); }
      });
    });

    // Where a request stops in the current step (350 = it reached a door).
    function stopY(d) {
      if (d.t === 'db') return step >= 1 ? -1 : 350;
      if (d.k === 'b' && step >= 2 && (d.t === 'web' || !d.leak)) return 144;
      if (d.k === 'b' && d.t === 'signup' && step >= 3) return 268;
      return 350;
    }
    function spawn() {
      var k = Math.random() < 0.45 ? 'h' : 'b';
      var t = k === 'h' ? (Math.random() < 0.7 ? 'web' : 'signup') : (Math.random() < 0.35 ? 'web' : (Math.random() < 0.8 ? 'signup' : 'db'));
      if (t === 'db' && step >= 1) t = 'web';
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', 4.5);
      c.setAttribute('class', k === 'h' ? 'hu' : 'bo');
      layer.appendChild(c);
      dots.push({ el: c, k: k, t: t, x0: t === 'db' ? 330 : 30 + Math.random() * 270, y: 40, v: 1.3 + Math.random() * 0.6, dead: 0, leak: Math.random() < 0.4 });
    }
    function flash(t) {
      var el = doors[t === 'web' ? 0 : t === 'signup' ? 1 : 2];
      el.classList.add('hit');
      setTimeout(function () { el.classList.remove('hit'); }, 300);
    }
    function tick() {
      if (Math.random() < 0.09 && dots.length < 26) spawn();
      dots.forEach(function (d) {
        if (d.dead) { d.dead++; d.el.setAttribute('r', 4.5 + d.dead * 0.5); d.el.style.opacity = Math.max(0, 1 - d.dead / 14); return; }
        var end = stopY(d);
        d.y += d.v;
        var k = Math.min(1, Math.max(0, (d.y - 40) / 290));
        var x = d.t === 'db' ? 330 : d.x0 + (X[d.t] - d.x0) * k;
        d.el.setAttribute('cx', x.toFixed(1));
        d.el.setAttribute('cy', d.y.toFixed(1));
        if (end > 0 && d.y >= end) { d.dead = 1; if (end === 350 && d.k === 'b') flash(d.t); }
      });
      dots = dots.filter(function (d) { if (d.dead > 14) { d.el.remove(); return false; } return true; });
    }
    function still() {
      dots = [];
      layer.textContent = '';
      var pts = [[90, 120, 'hu'], [150, 250, 'hu'], [240, 100, 'bo'], [60, 240, 'bo']];
      if (step < 1) pts.push([330, 250, 'bo']);
      if (step >= 2) pts = pts.map(function (p) { return p[2] === 'bo' && p[0] < 300 ? [p[0], 144, 'bo'] : p; });
      pts.forEach(function (p) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 4.5); c.setAttribute('class', p[2]);
        layer.appendChild(c);
      });
    }
    function loop() { tick(); raf = requestAnimationFrame(loop); }

    set(0);
    if (reduced || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting;
      if (on && !running) {
        running = true;
        layer.textContent = '';
        loop();
        timer = setInterval(function () { if (auto) set((step + 1) % 4); }, 5200);
      } else if (!on && running) {
        running = false;
        cancelAnimationFrame(raf);
        clearInterval(timer);
      }
    }, { threshold: 0.35 }).observe(svg);
  });
})();
