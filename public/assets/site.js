// Shared behaviour: mobile menu, reveal and count-up, filters, the climbing rail, and the contact form.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ── Mobile menu ──
  var nav = document.getElementById('navbar');
  var toggle = document.getElementById('menuToggle');
  if (nav && toggle) {
    var setOpen = function (open) {
      nav.classList.toggle('menu-open', open);
      document.documentElement.classList.toggle('menu-lock', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('menu-open')); });
    $$('.nav-links a', nav).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
    });
  }

  // ── Count up a number when it comes into view. The animated figure is only painted (data-show via CSS
  // ::after), so the element's text stays the true value for crawlers and screen readers at every moment. ──
  function countUp(el) {
    var m = el.textContent.match(/^([^\d]*)(\d+)([^\d]*)$/);
    if (!m || reduced) return;
    var end = +m[2], start = performance.now();
    el.setAttribute('data-show', m[1] + '0' + m[3]);
    el.classList.add('counting');
    (function step(now) {
      var k = Math.min(1, (now - start) / 900);
      el.setAttribute('data-show', m[1] + Math.round(end * (1 - Math.pow(1 - k, 3))) + m[3]);
      if (k < 1) return requestAnimationFrame(step);
      el.classList.remove('counting');
      el.removeAttribute('data-show');
    })(start);
  }

  // ── Headings rise word by word. The words stay in the HTML; this only wraps them for animation. ──
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 1) { if (n.tagName !== 'BR') walk(n); return; }
        if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        n.nodeValue.split(/( +|\n+)/).forEach(function (part) {
          if (!part.trim()) { if (part) frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          var wi = document.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i++);
          wi.textContent = part; w.appendChild(wi); frag.appendChild(w);
        });
        node.replaceChild(frag, n);
      });
    })(el);
    el.classList.add('split');
  }
  if (!reduced && 'IntersectionObserver' in window) {
    $$('.hero0 h1, .page-title').forEach(function (el) {
      splitWords(el);
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('rise'); }); });
    });
    var titleObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('rise');
        titleObs.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    $$('.section-title, .h-lg, .talk-title, .h2s').forEach(function (el) { splitWords(el); titleObs.observe(el); });
  }

  // ── Reveal on scroll ──
  var counters = $$('[data-count]');
  if (reduced || !('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        revealObs.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    $$('[data-reveal]').forEach(function (el) { revealObs.observe(el); });
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countObs.unobserve(en.target);
        countUp(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObs.observe(el); });
  }

  // ── Service picker: hovering or focusing a service shows its detail ──
  $$('[data-svc]').forEach(function (root) {
    var items = $$('.svcx-item', root);
    var pick = function (item) { items.forEach(function (it) { it.classList.toggle('on', it === item); }); };
    items.forEach(function (item) {
      var name = item.querySelector('.svcx-name');
      name.addEventListener('mouseenter', function () { pick(item); });
      name.addEventListener('focus', function () { pick(item); });
    });
    if (items[0]) pick(items[0]);
  });

  // ── Filters: chips and selects show or hide server-rendered items, so all content stays in the HTML ──
  $$('[data-filters]').forEach(function (root) {
    var state = {};
    var items = $$('[data-item]', root);
    var countEl = root.querySelector('[data-filter-count]');
    var emptyEl = root.querySelector('[data-filter-empty]');
    function apply() {
      var shown = 0;
      items.forEach(function (it) {
        var ok = Object.keys(state).every(function (key) {
          var want = state[key];
          return !want || (it.getAttribute('data-' + key) || '').split(' ').indexOf(want) !== -1;
        });
        it.hidden = !ok;
        if (ok) { shown++; it.classList.add('in'); }
      });
      $$('[data-group]', root).forEach(function (g) { g.hidden = !g.querySelector('[data-item]:not([hidden])'); });
      if (countEl) countEl.textContent = shown + ' of ' + items.length + ' ' + (countEl.getAttribute('data-noun') || 'items');
      if (emptyEl) emptyEl.hidden = shown > 0;
    }
    $$('[data-key]', root).forEach(function (ctl) {
      var key = ctl.getAttribute('data-key');
      if (ctl.tagName === 'SELECT') {
        ctl.addEventListener('change', function () { state[key] = ctl.value; apply(); });
      } else {
        ctl.addEventListener('click', function () {
          state[key] = ctl.getAttribute('data-val');
          $$('[data-key="' + key + '"]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b === ctl)); });
          apply();
        });
      }
    });
    apply();
  });

  // ── Rail: the arrow is tied to the sections, so it sits on each stop as that section arrives and reaches
  // the top when the last one (contact) does. That is the summit: a short moment that points to the form,
  // which replays only after scrolling back up. Layout is measured on resize and content change, not per frame.
  var rail = document.querySelector('.rail');
  if (rail) {
    var track = rail.querySelector('.track'), climber = rail.querySelector('.climber'), fill = rail.querySelector('.fill');
    var pbar = document.querySelector('.pbar'), bar = pbar && pbar.querySelector('i');
    var fab = document.querySelector('.fab');
    var stops = $$('.stop', rail);
    var sections = stops.map(function (s) { return document.getElementById(s.getAttribute('data-id')); });
    var lastStop = stops[stops.length - 1], lastSection = sections[sections.length - 1];
    var lastLabel = lastStop.querySelector('span');
    var lastText = lastLabel.textContent, summitText = rail.getAttribute('data-summit');
    lastStop.classList.add('last');
    var th = 0, anchors = [0], summit = false, ticking = false;

    var measure = function () {
      th = track.clientHeight;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      anchors = sections.map(function (sec, i) {
        return i === 0 ? 0 : Math.min(max, Math.max(0, sec.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35));
      });
      for (var i = 1; i < anchors.length; i++) if (anchors[i] <= anchors[i - 1]) anchors[i] = anchors[i - 1] + 1;
    };
    var progress = function (y) {
      var n = anchors.length;
      if (y >= anchors[n - 1]) return 1;
      for (var k = n - 2; k >= 0; k--) {
        if (y >= anchors[k]) return (k + (y - anchors[k]) / (anchors[k + 1] - anchors[k])) / (n - 1);
      }
      return 0;
    };
    var setSummit = function (on) {
      if (on === summit) return;
      summit = on;
      rail.classList.toggle('summit', on);
      if (pbar) pbar.classList.toggle('done', on);
      if (lastSection) lastSection.classList.toggle('reached', on);
      lastLabel.textContent = on ? summitText + ' →' : lastText;
    };
    var scrollPos = 0;
    var draw = function () {
      ticking = false;
      var p = progress(scrollPos);
      climber.style.transform = 'translateY(' + ((1 - p) * th - 11) + 'px)';
      fill.style.transform = 'scaleY(' + p + ')';
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (fab) fab.classList.toggle('show', window.scrollY > 240 && p < 0.999);
      // The lit stop is the last one the arrow has reached.
      var reached = Math.floor(p * (stops.length - 1) + 0.001);
      stops.forEach(function (st, j) { st.classList.toggle('on', j === reached); });
      if (p >= 0.999) setSummit(true); else if (p < 0.9) setSummit(false);
    };
    var refresh = function () { measure(); scrollPos = window.scrollY; draw(); };
    window.addEventListener('scroll', function () {
      // Read here, before this frame's animation callbacks write styles.
      scrollPos = window.scrollY;
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    }, { passive: true });
    // Measure at the start of a frame, once per frame at most, so reading layout never forces a reflow.
    // ResizeObserver fires once on observe and after every layout change; height-only window resizes
    // don't change the body, hence the listener.
    var pending = false;
    var schedule = function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; refresh(); });
    };
    window.addEventListener('resize', schedule);
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
    else schedule();
  }

  // ── Contact form ──
  // Submissions go to Web3Forms, which emails them to the address the access key was issued for.
  // The key is public by design; get one at web3forms.com and paste it here.
  var WEB3FORMS_KEY = 'd27d0242-b616-4b13-aa21-70fca7079ef7';
  var WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  var CONTACT_FALLBACK = 'Please email us at <a href="mailto:info@riroteglobal.com">info@riroteglobal.com</a>.';
  var form = document.getElementById('contactForm');
  // In its own function so pages without the form still run everything after it.
  (function () {
  if (!form) return;

  // Pre-fill from links such as /contact?service=ERPTick%20(our%20product)&message=...
  var params = new URLSearchParams(window.location.search);
  var preService = params.get('service'), preMessage = params.get('message');
  if (preService) {
    var select = form.elements.service;
    if (Array.prototype.some.call(select.options, function (o) { return o.value === preService; })) select.value = preService;
  }
  if (preMessage && !form.elements.message.value) form.elements.message.value = preMessage;

  var sendBtn = form.querySelector('button[type="submit"]');
  var statusEl = document.getElementById('contactStatus');
  var sendLabel = sendBtn.textContent;
  var required = [
    ['name', 'Please enter your name.'],
    ['email', 'Please enter a valid email address.'],
    ['message', 'Please tell us a little about your project.'],
  ];
  var setStatus = function (html, kind) {
    statusEl.innerHTML = html;
    statusEl.className = 'contact-status' + (kind ? ' is-' + kind : '');
  };
  // Marks invalid fields, focuses the first one and returns its message (or '' when the form is valid).
  var validate = function () {
    var firstError = '';
    required.forEach(function (rule) {
      var field = form.elements[rule[0]];
      field.value = field.value.trim();
      var ok = field.checkValidity();
      field.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstError) { firstError = rule[1]; field.focus(); }
    });
    return firstError;
  };
  form.addEventListener('input', function (e) { e.target.removeAttribute('aria-invalid'); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sendBtn.disabled) return;
    var error = validate();
    if (error) return setStatus(error, 'error');
    if (!WEB3FORMS_KEY) return setStatus('The form is not connected yet. ' + CONTACT_FALLBACK, 'error');

    var data = Object.fromEntries(new FormData(form));
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    setStatus('', '');
    fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({}, data, {
        access_key: WEB3FORMS_KEY,
        subject: 'New enquiry from ' + data.name + ' · riroteglobal.com',
        from_name: 'Rirote Global website',
      })),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
        form.reset();
        setStatus('Thanks, your message has been sent. We will get back to you as soon as we can.', 'success');
      });
    }).catch(function () {
      // What the visitor typed stays in the form so they can retry.
      setStatus('Sorry, your message could not be sent. ' + CONTACT_FALLBACK, 'error');
    }).finally(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = sendLabel;
    });
  });
  })();

  // Product clips (video[data-inview]): muted loops that play only while on screen. They never preload,
  // so a page of clips costs nothing until it is scrolled. Under reduced motion they keep their controls
  // and stay on the still until the visitor presses play.
  var clips = document.querySelectorAll('video[data-inview]');
  if (clips.length && !reduced && 'IntersectionObserver' in window) {
    var clipObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          var p = v.play();
          if (p && p.catch) p.catch(function () { v.controls = true; }); // autoplay refused: let them press play
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '120px 0px', threshold: 0.35 });
    clips.forEach(function (v) { v.controls = false; clipObs.observe(v); });
  }

  // Tabs ([data-tabs]): WAI-ARIA tabs with manual activation. Without this script every panel shows,
  // stacked, and the tab row stays hidden, so nothing is lost when JavaScript fails.
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var list = box.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    if (!list || !tabs.length) return;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    list.hidden = false;
    box.classList.add('is-tabbed');
    select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0], false);
  });
})();
