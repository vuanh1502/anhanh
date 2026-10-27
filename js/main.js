(function () {
  'use strict';

  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var home = document.getElementById('home');

  /* ---------- storage helpers (may be unavailable in private mode) ---------- */
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function sessionFlag(key, set) {
    try {
      if (set) sessionStorage.setItem(key, '1');
      return sessionStorage.getItem(key) === '1';
    } catch (e) { return false; }
  }

  /* ---------- intro mascot ---------- */
  var mascot = document.getElementById('mascot');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pixels = mascot.querySelector('.mascot__pixels');
  var head2 = mascot.querySelector('.mascot__head--2');
  var rippleMap = document.getElementById('ripple-map');
  var rippleNoise = document.getElementById('ripple-noise');
  var bootTimers = [];
  var rippleFrame = 0;

  // Grid cells over the heads, plus a loose halo around them. The pixel layer
  // is larger than the mascot, so the squares spread out past the heads.
  // Reading the images' alpha only works over http(s); if it fails, the
  // heads' rough oval is used instead.
  function headCells(cols, rows) {
    var box = pixels.getBoundingClientRect();
    var w = box.width, h = box.height;
    var alpha = null;
    try {
      var c = document.createElement('canvas');
      c.width = cols; c.height = rows;
      var ctx = c.getContext('2d');
      mascot.querySelectorAll('.mascot__head').forEach(function (im) {
        var r = im.getBoundingClientRect();
        ctx.drawImage(im, (r.left - box.left) / w * cols, (r.top - box.top) / h * rows, r.width / w * cols, r.height / h * rows);
      });
      alpha = ctx.getImageData(0, 0, cols, rows).data;
    } catch (e) { alpha = null; }
    var m = mascot.getBoundingClientRect();
    var cx = (m.left + m.width / 2 - box.left) / w, cy = (m.top + m.height / 2 - box.top) / h;
    var rx = m.width / w / 2, ry = m.height / h / 2;
    var on = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        on.push(alpha
          ? alpha[(y * cols + x) * 4 + 3] > 20
          : Math.pow(((x + .5) / cols - cx) / rx, 2) + Math.pow(((y + .5) / rows - cy) / ry, 2) < .8);
      }
    }
    var cells = [];
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        if (on[y * cols + x]) { cells.push([x, y]); continue; }
        var near = false;                                     // always cover the cells touching the head, so no edge peeks through
        for (var ny = y - 1; ny <= y + 1 && !near; ny++) {
          for (var nx = x - 1; nx <= x + 1; nx++) {
            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && on[ny * cols + nx]) { near = true; break; }
          }
        }
        if (near) { cells.push([x, y]); continue; }
        var d = 9;                                            // distance to the nearest head cell
        for (var yy = Math.max(0, y - 3); yy <= Math.min(rows - 1, y + 3); yy++) {
          for (var xx = Math.max(0, x - 3); xx <= Math.min(cols - 1, x + 3); xx++) {
            if (on[yy * cols + xx]) d = Math.min(d, Math.max(Math.abs(xx - x), Math.abs(yy - y)));
          }
        }
        var chance = d === 2 ? .32 : d === 3 ? .14 : .05;
        if (Math.random() < chance) cells.push([x, y]);
      }
    }
    return cells;
  }

  var PIXEL_COLORS = ['#686bff', '#686bff', '#8f91ff', '#c7c8ff', '#ffffff', '#f4f4f4', '#e7e7e7', '#ffffff'];
  // Going back to head 1 swaps the violet squares for green ones
  var PIXEL_GREENS = ['#5af064', '#5af064', '#8ff596', '#c8fbcb', '#ffffff', '#f4f4f4', '#e7e7e7', '#ffffff'];

  function ripple(duration, el) {
    var start = performance.now();
    el.style.filter = 'url(#ripple)';
    cancelAnimationFrame(rippleFrame);
    (function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var ease = 1 - Math.pow(1 - t, 3);
      rippleMap.setAttribute('scale', (18 * (1 - ease)).toFixed(2));
      rippleNoise.setAttribute('baseFrequency', (0.012 + 0.006 * t).toFixed(4) + ' ' + (0.04 - 0.015 * t).toFixed(4));
      if (t < 1) rippleFrame = requestAnimationFrame(tick);
      else el.style.filter = '';
    })(start);
  }

  var head1 = mascot.querySelector('.mascot__head--1');
  var lensImg = mascot.querySelector('.mascot__zoom img');
  var flipped = false;            // true while head 1 is the resting head
  var morphing = false;

  // The lens always shows the head that is not resting
  function syncLens() {
    lensImg.src = flipped ? head2.getAttribute('src') : head1.getAttribute('src');
    lensImg.classList.toggle('is-h2', flipped);
  }

  // Squares climb up to cover the "from" head, then the "to" head appears
  // underneath with a light water ripple. Used on load (head 1 to head 2)
  // and on every click (resting head to the other one).
  function morph(from, to, done) {
    bootTimers.forEach(clearTimeout);
    bootTimers = [];
    cancelAnimationFrame(rippleFrame);
    head1.style.filter = head2.style.filter = '';
    pixels.replaceChildren();
    [head1, head2].forEach(function (h) { h.classList.remove('is-from', 'is-to'); });
    mascot.classList.remove('is-booting', 'is-swapped', 'is-peeking');
    if (reduceMotion) { done(); return; }
    from.classList.add('is-from');
    to.classList.add('is-to');
    mascot.classList.add('is-booting');
    morphing = true;

    var palette = to === head1 ? PIXEL_GREENS : PIXEL_COLORS;
    var cols = 15, rows = 13;
    var cw = 100 / cols, ch = 100 / rows;
    var COVER = 700, SWAP = 1650, CLEAR = 1750;

    function build() {
      headCells(cols, rows).forEach(function (cell) {
        var sq = document.createElement('i');
        var big = Math.random() < .12 ? 2 : 1;               // a few double squares
        sq.style.left = (cell[0] * cw) + '%';
        sq.style.top = (cell[1] * ch) + '%';
        sq.style.width = (cw * big) + '%';
        sq.style.height = (ch * big) + '%';
        sq.style.background = palette[Math.floor(Math.random() * palette.length)];
        pixels.appendChild(sq);
        var rise = (rows - 1 - cell[1]) / rows;               // 0 at the bottom row: bottom rows go first
        var delayIn = COVER + rise * 750 + Math.random() * 180;
        var delayOut = CLEAR + rise * 650 + Math.random() * 220;
        sq.animate(
          [{ opacity: 0, transform: 'translateY(30%) scale(.4)' }, { opacity: 1, transform: 'none' }],
          { duration: 180, delay: delayIn, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
        sq.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-40%) scale(.6)' }],
          { duration: 220, delay: delayOut, fill: 'forwards', easing: 'ease-in' }
        );
      });
    }
    if (from.complete) build();
    else from.addEventListener('load', build, { once: true });

    bootTimers.push(setTimeout(function () {
      mascot.classList.add('is-swapped');
      ripple(1400, to);
    }, SWAP));
    bootTimers.push(setTimeout(function () {
      mascot.classList.remove('is-booting', 'is-swapped');
      from.classList.remove('is-from');
      to.classList.remove('is-to');
      pixels.replaceChildren();
      morphing = false;
      done();
    }, 3300));
  }

  function setFlipped(value) {
    flipped = value;
    mascot.classList.toggle('is-flipped', flipped);
    syncLens();
  }

  // Head 1 shows first, then turns into head 2
  function bootMascot() {
    setFlipped(false);
    morph(head1, head2, function () { setFlipped(false); });
  }

  function switchHead() {
    if (morphing) return;
    var next = !flipped;
    mascot.classList.remove('is-flipped');
    morph(flipped ? head1 : head2, flipped ? head2 : head1, function () { setFlipped(next); });
  }
  // A finger that drags the lens around should not also switch the head on release
  var dragStart = null, dragged = false;
  mascot.addEventListener('pointerdown', function (e) {
    dragStart = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY } : null;
    dragged = false;
  });
  mascot.addEventListener('click', function () {
    if (dragged) { dragged = false; return; }
    switchHead();
  });
  mascot.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchHead(); }
  });

  // Hover lens: a small circle that follows the pointer and shows head 1.
  function moveLens(e) {
    var box = mascot.getBoundingClientRect();
    mascot.style.setProperty('--mx', (e.clientX - box.left) + 'px');
    mascot.style.setProperty('--my', (e.clientY - box.top) + 'px');
  }
  mascot.addEventListener('pointerenter', function (e) {
    if (mascot.classList.contains('is-booting')) return;
    moveLens(e);
    mascot.classList.add('is-peeking');
  });
  mascot.addEventListener('pointermove', function (e) {
    if (dragStart && Math.abs(e.clientX - dragStart.x) + Math.abs(e.clientY - dragStart.y) > 10) dragged = true;
    if (mascot.classList.contains('is-booting')) return;
    moveLens(e);
    mascot.classList.add('is-peeking');
  });
  mascot.addEventListener('pointerleave', function () { mascot.classList.remove('is-peeking'); });
  mascot.addEventListener('pointercancel', function () { mascot.classList.remove('is-peeking'); });

  /* ---------- intro date ---------- */
  var now = new Date();
  var dayEl = document.getElementById('intro-day');
  dayEl.textContent = String(now.getDate()).padStart(2, '0');
  dayEl.dateTime = now.toISOString().slice(0, 10);
  document.getElementById('intro-month').textContent =
    now.toLocaleString('en-US', { month: 'long' }) + ' ' + now.getFullYear();

  /* ---------- intro → home ---------- */
  function showHome(animate) {
    intro.hidden = true;
    home.hidden = false;
    if (animate) {
      home.classList.add('is-entering');
      home.addEventListener('animationend', function () { home.classList.remove('is-entering'); }, { once: true });
    }
    sessionFlag('introSeen', true);
  }

  function showIntro() {
    home.hidden = true;
    intro.hidden = false;
    intro.classList.remove('is-leaving');
    window.scrollTo(0, 0);
    startIntro();
  }

  document.getElementById('intro-next').addEventListener('click', function () {
    intro.classList.add('is-leaving');
    setTimeout(function () { showHome(true); }, 450);
  });

  document.getElementById('logo-link').addEventListener('click', function (e) {
    e.preventDefault();
    showIntro();
  });

  document.getElementById('intro-brand').addEventListener('click', function () {
    document.getElementById('intro-next').click();
  });

  /* ---------- crafting ideas: a big head fills the screen for ~1.5s ---------- */
  var craft = document.getElementById('craft');
  var craftHead = document.getElementById('craft-head');
  var craftWide = craft.querySelector('.craft__art--wide');
  var craftStd = craft.querySelector('.craft__art--std');
  var craftTimer = 0;
  var craftBtn = document.getElementById('intro-craft');
  function setCraftArt() {
    var who = flipped ? 'angel' : 'robot';                     // the resting head
    craftWide.src = 'assets/intro/craft-1920-' + who + '.jpg';
    craftStd.src = 'assets/intro/craft-1440-' + who + '.jpg';
    craftHead.src = flipped ? head1.getAttribute('src') : head2.getAttribute('src');
    craftHead.width = flipped ? 470 : 618;
  }
  // Start loading the artwork as soon as the pointer gets close
  craftBtn.addEventListener('pointerenter', setCraftArt);
  craftBtn.addEventListener('focus', setCraftArt);
  craftBtn.addEventListener('click', function () {
    clearTimeout(craftTimer);
    setCraftArt();
    craft.hidden = false;
    craft.classList.remove('is-on');
    void craft.offsetWidth;                                   // restart the animation
    craft.classList.add('is-on');
    craftTimer = setTimeout(function () {
      craft.classList.remove('is-on');
      craft.hidden = true;
    }, 1550);
  });

  /* ---------- footer text effects ---------- */
  // Badge: each letter gets its own delay for a wave
  document.querySelectorAll('.fx-wave').forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.replaceChildren();
    text.split('').forEach(function (c, i) {
      var ch = document.createElement('span');
      ch.className = 'ch';
      ch.setAttribute('aria-hidden', 'true');
      ch.style.setProperty('--i', i);
      ch.textContent = c;
      el.appendChild(ch);
    });
  });

  // Quotes: random letters settle into the real text, left to right
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=/<>';
  function scramble(el) {
    var text = el.dataset.text;
    var start = performance.now(), dur = 1100;
    var inner = el.firstChild;
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var fixed = Math.floor(t * text.length);
      var out = text.slice(0, fixed);
      for (var k = fixed; k < text.length; k++) {
        out += text[k] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      inner.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  var scrambles = Array.prototype.slice.call(document.querySelectorAll('.fx-scramble'));
  scrambles.forEach(function (el) {
    el.dataset.text = el.textContent;
    el.setAttribute('aria-label', el.textContent);
    var inner = document.createElement('span');
    inner.setAttribute('aria-hidden', 'true');
    inner.textContent = el.textContent;
    el.replaceChildren(inner);
  });
  if (!reduceMotion && scrambles.length) {
    var turn = 0;
    setInterval(function () {
      if (intro.hidden) return;
      scramble(scrambles[turn++ % scrambles.length]);
    }, 3500);
  }

  /* ---------- typing text ---------- */
  var hello = document.getElementById('intro-hello');
  var helloHtml = hello.innerHTML;
  var typeTimer = 0;

  // Types the greeting letter by letter. The untyped rest stays in place but
  // transparent, so the layout does not jump while it types.
  function typeHello() {
    clearTimeout(typeTimer);
    hello.innerHTML = helloHtml;
    if (reduceMotion) return;
    hello.setAttribute('aria-label', hello.textContent.replace(/\s+/g, ' ').trim());
    var parts = [];                                           // characters and line breaks
    hello.childNodes.forEach(function (n) {
      if (n.nodeType === 3) n.textContent.split('').forEach(function (ch) { parts.push(ch); });
      else parts.push(null);
    });
    var typed = document.createElement('span');
    var caret = document.createElement('span');
    var ghost = document.createElement('span');
    caret.className = 'tw-caret';
    ghost.className = 'tw-ghost';
    typed.setAttribute('aria-hidden', 'true');
    ghost.setAttribute('aria-hidden', 'true');
    function fill(el, list) {
      el.replaceChildren();
      var text = '';
      list.forEach(function (ch) {
        if (ch === null) { el.append(text, document.createElement('br')); text = ''; }
        else text += ch;
      });
      el.append(text);
    }
    hello.replaceChildren(typed, caret, ghost);
    var i = 0;
    (function step() {
      fill(typed, parts.slice(0, i));
      fill(ghost, parts.slice(i));
      if (i++ < parts.length) typeTimer = setTimeout(step, parts[i - 1] === null ? 160 : 32);
    })();
  }

  function startIntro() {
    bootMascot();
    typeHello();
  }

  /* ---------- loading screen (only shows up on slow connections) ---------- */
  var loader = document.getElementById('loader');
  var loaderFill = document.getElementById('loader-fill');
  function trackLoading() {
    var imgs = Array.prototype.slice.call(document.images).filter(function (im) { return !im.closest('#loader'); });
    var done = 0;
    function tick() {
      done++;
      var p = Math.min(100, Math.round(done / imgs.length * 100));
      loaderFill.style.setProperty('--p', p + '%');
      loader.setAttribute('aria-valuenow', p);
    }
    imgs.forEach(function (im) {
      if (im.complete) tick();
      else {
        im.addEventListener('load', tick, { once: true });
        im.addEventListener('error', tick, { once: true });
      }
    });
  }
  function finishLoading() {
    loaderFill.style.setProperty('--p', '100%');
    // The loader fades in after a short wait, so fast loads never see it
    if (getComputedStyle(loader).opacity > 0.05) {
      loader.classList.add('is-done');
      setTimeout(function () { loader.remove(); }, 450);
    } else {
      loader.remove();
    }
  }
  trackLoading();

  var skipIntro = sessionFlag('introSeen') || location.hash === '#home';
  if (skipIntro) showHome(false);
  if (document.readyState === 'complete') { finishLoading(); if (!skipIntro) startIntro(); }
  else window.addEventListener('load', function () {
    finishLoading();
    if (!skipIntro) startIntro();
  }, { once: true });

  /* ---------- theme ---------- */
  var toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function flipTheme() {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store('theme', next);
  }
  applyTheme(root.dataset.theme || 'dark');
  toggle.addEventListener('click', flipTheme);

  /* ---------- mobile / tablet menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu-panel');

  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="theme"]')) flipTheme();
    setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
  });

  /* ---------- folder art (layers exported from Figma) ---------- */
  function img(src, cls) {
    var el = document.createElement('img');
    el.src = src;
    el.alt = '';
    el.className = cls;
    return el;
  }

  document.querySelectorAll('.folder').forEach(function (folder) {
    var p = folder.dataset.project;
    var v = folder.dataset.art; // a | b — default artwork variant
    // the intro is always light, so its folders use the light artwork in both themes
    var lite = folder.classList.contains('intro__folder');
    var tab = lite ? 'tab-light' : 'tab-' + v;
    var mid = lite ? 'mid-light' : 'mid';
    var body = lite ? 'body-light' : 'body-' + v;
    var side = lite ? 'side-light' : 'side';
    var chev = lite ? 'chevron-light' : 'chevron';
    var art = document.createElement('span');
    art.className = 'folder__art';
    art.setAttribute('aria-hidden', 'true');

    art.append(
      img('assets/folders/' + tab + '.svg', 'art-tab art-def'),
      img('assets/folders/' + p + '-tab-hover.svg', 'art-tab art-hov'),
      img('assets/folders/' + mid + '.svg', 'art-mid art-def'),
      img('assets/folders/' + p + '-mid-hover.svg', 'art-mid art-hov'),
      img('assets/folders/' + body + '.svg', 'art-body art-def'),
      img('assets/folders/' + p + '-body-hover.svg', 'art-body art-hov'),
      img('assets/folders/' + side + '.svg', 'art-side art-def'),
      img('assets/folders/' + p + '-side-hover.svg', 'art-side art-hov'),
      img('assets/folders/' + chev + '.svg', 'art-chev art-chev--1'),
      img('assets/folders/' + chev + '.svg', 'art-chev art-chev--2'),
      img('assets/folders/' + chev + '.svg', 'art-chev art-chev--3')
    );
    var bar1 = document.createElement('span');
    bar1.className = 'art-bar art-bar--1';
    var bar2 = document.createElement('span');
    bar2.className = 'art-bar art-bar--2';
    art.append(bar1, bar2);

    folder.prepend(art);
  });

  /* ---------- software tools: violet copy of each logo for light mode hover ---------- */
  document.querySelectorAll('.tool__def').forEach(function (def) {
    var mono = document.createElement('span');
    var kind = def.className.match(/tool__def--(\w+)/);
    mono.className = 'tool__mono' + (kind ? ' tool__mono--' + kind[1] : '');
    mono.setAttribute('aria-hidden', 'true');
    // set inline so the URL resolves against the page, not the stylesheet
    mono.style.webkitMaskImage = mono.style.maskImage = 'url("' + def.getAttribute('src') + '")';
    def.after(mono);
  });

  /* ---------- project popups ---------- */
  // cta: position of the "View more" button inside each popup image (% of image)
  var PROJECTS = {
    wikex: {
      image: 'assets/popups/wikex.png',
      alt: 'Wikex Exchange — a centralized cryptocurrency exchange (CEX) built and developed in Vietnam. The UI and branding are designed to be clean, simple, and modern with a yellow theme. Web, Mobile App, Admin CMS.',
      href: 'project.html?p=wikex',
      cta: { x: 7.7, y: 43, w: 12.1, h: 5.4 }
    },
    vpay: {
      image: 'assets/popups/vpay.png',
      alt: 'VPay — P2P personal overseas remittance. A modern digital money transfer app supporting fast sending and receiving of funds, convenient payments, and easy transaction management. Mobile App, Admin OMS.',
      href: 'project.html?p=vpay',
      cta: { x: 9.3, y: 54.6, w: 12.6, h: 6 }
    },
    antarctic: {
      image: 'assets/popups/antarctic.png',
      alt: 'Antarctic Exchange — a perpetual futures exchange built for professional traders, combining institutional-grade execution with on-chain settlement. Web.',
      href: 'project.html?p=antarctic',
      cta: { x: 82, y: 49.7, w: 12.4, h: 6 }
    },
    lppm: {
      image: 'assets/popups/lppm.svg',
      alt: 'LPPM Rental — Liberty Place Property Management. A rental website for luxury New York apartments with no broker fee. Web.',
      href: 'project.html?p=lppm',
      cta: { x: 7, y: 41.17, w: 12.44, h: 6.67 }
    }
  };

  var popup = document.getElementById('popup');
  var popupBody = popup.querySelector('.popup__body');
  var tpl = document.getElementById('popup-tpl');
  var lastFocus = null;

  function openPopup(key) {
    var data = PROJECTS[key];
    if (!data) return;
    var node = tpl.content.cloneNode(true);
    var pic = node.querySelector('img');
    var cta = node.querySelector('.popup__cta');
    pic.src = data.image;
    pic.alt = data.alt;
    if (data.href && data.cta) {
      cta.href = data.href;
      if (/^https?:/.test(data.href)) { cta.target = '_blank'; cta.rel = 'noopener'; }
      cta.style.setProperty('--cta-x', data.cta.x + '%');
      cta.style.setProperty('--cta-y', data.cta.y + '%');
      cta.style.setProperty('--cta-w', data.cta.w + '%');
      cta.style.setProperty('--cta-h', data.cta.h + '%');
    } else {
      cta.remove();
    }
    popupBody.replaceChildren(node);
    popup.dataset.project = key;
    lastFocus = document.activeElement;
    if (typeof popup.showModal === 'function') popup.showModal();
    else popup.setAttribute('open', '');
  }

  function closePopup() {
    if (popup.open && typeof popup.close === 'function') popup.close();
    else popup.removeAttribute('open');
  }

  // the intro folders are plain links to the project pages
  document.querySelectorAll('.folder:not(a)').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      // On phones the popup image is too small to read, so go straight to the project page
      if (window.matchMedia('(max-width: 640px)').matches) {
        var data = PROJECTS[el.dataset.project];
        if (data && data.href) location.href = data.href;
        return;
      }
      openPopup(el.dataset.project);
    });
  });
  popup.querySelector('.popup__close').addEventListener('click', closePopup);
  popup.addEventListener('click', function (e) {
    if (e.target === popup) closePopup(); // click on backdrop
  });
  popup.addEventListener('close', function () {
    if (lastFocus) lastFocus.focus();
  });

  /* ---------- resume popup ---------- */
  var cv = document.getElementById('cv');
  var cvBody = cv.querySelector('.cv__body');

  function openCv() {
    setMenu(false);
    lastFocus = document.activeElement;
    cvBody.scrollTop = 0;
    if (typeof cv.showModal === 'function') cv.showModal();
    else cv.setAttribute('open', '');
  }
  document.querySelectorAll('[data-open-cv]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openCv();
    });
  });
  cv.querySelector('.cv__close').addEventListener('click', function () { cv.close(); });
  cv.addEventListener('click', function (e) { if (e.target === cv) cv.close(); });
  cv.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });
  // If the resume image is missing, say so instead of showing a broken image
  var cvImg = cvBody.querySelector('img');
  function cvMissing() {
    var note = document.createElement('p');
    note.className = 'cv__empty';
    note.textContent = 'The resume is being updated. Please check back soon.';
    cvImg.replaceWith(note);
  }
  if (cvImg.complete && cvImg.naturalWidth === 0 && cvImg.currentSrc) cvMissing();
  else cvImg.addEventListener('error', cvMissing, { once: true });
  cvBody.addEventListener('scroll', function () {
    cv.classList.toggle('is-scrolled', cvBody.scrollTop > 4);
  }, { passive: true });

  /* ---------- playground popup ---------- */
  var play = document.getElementById('play');
  document.querySelectorAll('[data-open-play]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      lastFocus = document.activeElement;
      if (typeof play.showModal === 'function') play.showModal();
      else play.setAttribute('open', '');
    });
  });
  function closePlay() {
    if (play.open && typeof play.close === 'function') play.close();
    else play.removeAttribute('open');
  }
  play.querySelector('.play__close').addEventListener('click', closePlay);
  play.addEventListener('click', function (e) { if (e.target === play) closePlay(); });
  play.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });

  /* ---------- experience tooltips (from the resume) ---------- */
  var JOB_NOTES = {
    orbit: {
      lead: 'Hands-on Experience in Web3 and CEX Exchange Development Projects',
      groups: [
        ['UI design:', [
          'Analyze briefs and product requirements from PMs and clients',
          'Translate requirements into clear user flows, wireframes, and final UI designs',
          'Build and maintain design systems',
          'Design digital products (web, app, mobile) with strong UI/UX thinking and logical structure',
          'Redesign and improve existing websites and applications to enhance usability and engagement',
          'Collaborate with cross-functional teams to support campaigns and product development'
        ]],
        ['Graphics Design:', [
          'Design project logos based on briefs',
          'Establish and maintain a unified visual style, ensuring consistency across all project assets',
          'Design marketing collateral including blog and OG graphics, email newsletters, social media assets, print ads, and infographics',
          'Stay up to date with design trends and best practices, contributing fresh ideas to the team'
        ]]
      ],
      tags: '#Illustration  #UI Design'
    },
    whammy: {
      lead: 'Having the opportunity to participate in company projects and gain experience in Blockchain projects.',
      groups: [
        ['UI design:', [
          'UI Design: Transformed pre-existing wireframes into complete user interfaces, ensuring aesthetic consistency, functionality, and an optimal user experience.',
          'Error Checking and Bug Fixing: Reviewed websites or interfaces to identify design errors, collaborated with developers to address issues, and ensured the final product was polished and deployment-ready.'
        ]],
        ['Graphics Design:', [
          'Illustration: Created unique illustrations that align with the product\'s content and style, enhancing visual appeal and engagement.',
          'Banner Design: Designed banners based on specific requirements, focusing on effectively conveying messages while adhering to brand standards.'
        ]]
      ],
      tags: '#Illustration  #UI Design'
    },
    rebo: {
      lead: 'Participated in designing the projects for company.',
      groups: [
        ['UI design:', [
          'Creating visually appealing and intuitive user interfaces using design tools like Figma to produce designs, mockups, and prototypes to showcase.',
          'Conducting user research activities to gain insights into user needs and preferences, along with writing content requirements for the product.'
        ]],
        ['Graphics Design:', [
          'Provide ideas and actively contribute to enhancing the design process.',
          'Logo and banner designing for customers.'
        ]]
      ],
      tags: '#Prototyping + UI/UX  #Time Management  #Team Work'
    },
    s6k: {
      lead: null,
      groups: [
        ['Graphics Design:', [
          'Branding design: Develop brand identity elements such as logos, brand guidelines, color palettes, fonts, and instructional materials to ensure a cohesive and impactful brand image.',
          'Social banner design: Create social banners, images, and advertising content tailored to the goals and requirements of each social media platform. Some projects: Apto League, Metafi Report, Plan Exodus, Arena of Dragons.',
          'Ideation and collaboration with the marketing team to communicate event promotions effectively.'
        ]]
      ],
      tags: '#Branding  #Design Thinking  #Hand-drawing'
    }
  };

  var tip = document.getElementById('job-tip');
  var tipFor = null;

  function fillTip(note) {
    tip.replaceChildren();
    if (note.lead) {
      var p = document.createElement('p');
      p.textContent = note.lead;
      tip.appendChild(p);
    }
    note.groups.forEach(function (g) {
      if (g[0]) {
        var h = document.createElement('h4');
        h.textContent = g[0];
        tip.appendChild(h);
      }
      var ul = document.createElement('ul');
      g[1].forEach(function (t) {
        var li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });
      tip.appendChild(ul);
    });
    var tags = document.createElement('p');
    tags.className = 'tags';
    tags.textContent = note.tags;
    tip.appendChild(tags);
  }

  // Left of the job when there is room, otherwise below it; kept on screen.
  function placeTip(job) {
    var r = job.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight, gap = 16, pad = 12;
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var x, y;
    if (r.left - gap - 30 - tw >= pad) {
      x = r.left - gap - tw - 30;                            // clear of the timeline rail
      y = r.top + r.height / 2 - th / 2;
    } else {
      x = r.left;
      y = r.bottom + 8;
      if (y + th > vh - pad) y = r.top - 8 - th;
    }
    x = Math.max(pad, Math.min(x, vw - tw - pad));
    y = Math.max(pad, Math.min(y, vh - th - pad));
    tip.style.left = Math.round(x) + 'px';
    tip.style.top = Math.round(y) + 'px';
  }

  function showTip(job) {
    var note = JOB_NOTES[job.dataset.job];
    if (!note) return;
    tipFor = job;
    tip.classList.remove('is-small', 'is-copied');
    fillTip(note);
    tip.hidden = false;
    placeTip(job);
    tip.classList.add('is-on');
  }
  function hideTip(job) {
    if (job && job !== tipFor) return;
    tipFor = null;
    tip.classList.remove('is-on');
    tip.hidden = true;
  }

  /* ---------- contact tooltips and copy ---------- */
  var CONTACTS = {
    linkedin: { title: 'LinkedIn', value: 'Anh Hue', hint: 'linkedin.com/in/anh-hue · click to open' },
    behance: { title: 'Behance', value: 'Vũ Anh', hint: null },
    phone: { title: 'Phone · Zalo', value: '(+84) 83 6337 924', hint: 'Click to copy the number' },
    mail: { title: 'Email', value: 'vunguyenhueanh.gl@gmail.com', hint: 'Click to copy the email' }
  };
  var copiedTimer = 0;

  function fillContactTip(key, copied) {
    var c = CONTACTS[key];
    tip.replaceChildren();
    var h = document.createElement('h4');
    h.textContent = c.title;
    var v = document.createElement('p');
    v.textContent = c.value;
    v.style.fontSize = '12px';
    tip.append(h, v);
    if (c.hint || copied) {
      var hint = document.createElement('p');
      hint.className = 'tip-hint';
      hint.textContent = copied ? 'Copied!' : c.hint;
      tip.appendChild(hint);
    }
    tip.classList.toggle('is-copied', !!copied);
  }

  // Below the icon, or above it when there is no room
  function placeTipNear(el) {
    var r = el.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight, pad = 12;
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var x = r.left + r.width / 2 - tw / 2;
    var y = r.bottom + 10;
    if (y + th > vh - pad) y = r.top - 10 - th;
    tip.style.left = Math.round(Math.max(pad, Math.min(x, vw - tw - pad))) + 'px';
    tip.style.top = Math.round(Math.max(pad, y)) + 'px';
  }

  function showContactTip(el, copied) {
    tipFor = el;
    tip.classList.add('is-small');
    fillContactTip(el.dataset.tip, copied);
    tip.hidden = false;
    placeTipNear(el);
    tip.classList.add('is-on');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  document.querySelectorAll('[data-tip]').forEach(function (el) {
    el.addEventListener('mouseenter', function () { showContactTip(el); });
    el.addEventListener('mouseleave', function () { hideTip(el); });
    el.addEventListener('focus', function () { showContactTip(el); });
    el.addEventListener('blur', function () { hideTip(el); });
    if (!el.dataset.copy) return;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      copyText(el.dataset.copy).then(function () {
        showContactTip(el, true);
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(function () {
          if (tipFor === el) fillContactTip(el.dataset.tip);
          if (!el.matches(':hover') && document.activeElement !== el) hideTip(el);
        }, 1600);
      }, function () {
        location.href = el.getAttribute('href');               // no clipboard: fall back to the link
      });
    });
  });

  document.querySelectorAll('.job[data-job]').forEach(function (job) {
    job.addEventListener('mouseenter', function () { showTip(job); });
    job.addEventListener('mouseleave', function () { hideTip(job); });
    job.addEventListener('focus', function () { showTip(job); });
    job.addEventListener('blur', function () { hideTip(job); });
  });
  window.addEventListener('scroll', function () { hideTip(); }, { passive: true, capture: true });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });

  /* ---------- touch: a tap shows the hover look until the next tap elsewhere ---------- */
  var TAP_TARGETS = '.job, .folder, .card--bio, .card--training, .card--invite, .card--quests, .card--exp, .card--play, .card--tools';
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch') return;
    var hit = [];
    for (var el = e.target.closest(TAP_TARGETS); el; el = el.parentElement && el.parentElement.closest(TAP_TARGETS)) hit.push(el);
    document.querySelectorAll('.is-tap').forEach(function (el) { if (hit.indexOf(el) < 0) el.classList.remove('is-tap'); });
    hit.forEach(function (el) { el.classList.add('is-tap'); });
  }, { passive: true });
})();
