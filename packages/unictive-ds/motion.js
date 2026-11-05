/* Unictive Design System · motion.js · reveal on scroll, text splitting, scroll-driven text and pointer effects for motion.css. no dependencies */
(function () {
  // text presets split the element, the rest move the element itself (or its children)
  var TEXT = { 'lines-up': 'lines', 'words-up': 'words', 'words-blur': 'words', 'chars-up': 'chars', 'chars-fade': 'chars' };
  var STAGGER = { lines: '120ms', words: 'var(--stagger-word)', chars: 'var(--stagger-char)', children: 'var(--stagger-item)' };
  var MASKED = { 'lines-up': 1, 'words-up': 1, 'chars-up': 1 };
  // scroll-driven text lights up piece by piece; css does the timing, the script only splits and numbers
  var SCROLL_TEXT = { 'words-fill': 'words', 'chars-fill': 'chars', 'words-blur': 'words' };
  var scrollable = window.CSS && CSS.supports('animation-timeline: view()');
  var items = new Map();
  var scrolls = new Map();
  var io;

  function observer() {
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) show(e.target);
          else if (e.target.hasAttribute('data-motion-repeat') && e.boundingClientRect.top > 0) hide(e.target, true);
        });
      }, { rootMargin: '0px 0px -10% 0px' });
    }
    return io;
  }

  function piece(text, preset, masked, linked) {
    var p = document.createElement('span');
    p.className = linked ? 'm-piece' : 'm-piece m-t';
    if (!linked) p.dataset.m = preset;
    p.textContent = text;
    var wrap = document.createElement('span');
    wrap.className = masked ? 'm-mask' : 'm-split';
    wrap.append(p);
    return wrap;
  }

  // walks text nodes so links, em and br inside the element survive the split
  function split(el, preset, mode, linked) {
    var masked = !linked && MASKED[preset];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(document.createTextNode(part));
        if (mode !== 'chars') return frag.append(piece(part, preset, masked, linked));
        // characters: screen readers get the whole word, the letters are decoration
        var word = document.createElement('span');
        word.className = 'm-word';
        var sr = document.createElement('span');
        sr.className = 'm-sr';
        sr.textContent = part;
        var letters = document.createElement('span');
        letters.setAttribute('aria-hidden', 'true');
        Array.from(part).forEach(function (c) { letters.append(piece(c, preset, masked, linked)); });
        word.append(sr, letters);
        frag.append(word);
      });
      node.replaceWith(frag);
    });
    return Array.from(el.querySelectorAll('.m-piece'));
  }

  // lines are measured when they play, so the split follows the current width
  function lineIndex(targets) {
    var tops = [];
    targets.forEach(function (t) {
      var top = Math.round(t.parentElement.getBoundingClientRect().top);
      var i = tops.findIndex(function (v) { return Math.abs(v - top) < 4; });
      if (i < 0) { tops.push(top); i = tops.length - 1; }
      t.style.setProperty('--m-i', i);
    });
  }

  function setup(el) {
    if (items.has(el)) return;
    var preset = el.dataset.motion;
    var mode = TEXT[preset] || (el.hasAttribute('data-motion-children') ? 'children' : 'self');
    var item = { html: el.innerHTML, mode: mode, targets: [] };
    if (TEXT[preset]) item.targets = split(el, preset, mode);
    else if (mode === 'children') item.targets = Array.from(el.children);
    else item.targets = [el];
    item.targets.forEach(function (t, i) {
      t.classList.add('m-t');
      t.dataset.m = preset;
      if (el.dataset.motionFrom) t.dataset.motionFrom = el.dataset.motionFrom;
      if (mode !== 'self') t.style.setProperty('--m-i', i);
    });
    if (STAGGER[mode]) el.style.setProperty('--m-stagger', STAGGER[mode]);
    items.set(el, item);
    observer().observe(el);
  }

  function show(el) {
    var item = items.get(el);
    if (!item) return;
    if (item.mode === 'lines') lineIndex(item.targets);
    requestAnimationFrame(function () {
      item.targets.forEach(function (t) { t.classList.add('is-in'); });
    });
  }

  // instant snaps back without playing the exit
  function hide(el, instant) {
    var item = items.get(el);
    if (!item) return;
    if (instant) el.classList.add('m-reset');
    item.targets.forEach(function (t) { t.classList.remove('is-in'); });
    if (instant) {
      void el.offsetWidth;
      el.classList.remove('m-reset');
    }
  }

  function replay(el) {
    hide(el, true);
    var item = items.get(el);
    if (!item) return;
    if (item.mode === 'lines') lineIndex(item.targets);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { item.targets.forEach(function (t) { t.classList.add('is-in'); }); });
    });
  }

  function number(list, el) {
    list.forEach(function (t, i) { t.style.setProperty('--m-i', i); });
    el.style.setProperty('--m-n', list.length);
  }

  function scrollSetup(el) {
    if (scrolls.has(el)) return;
    var preset = el.dataset.motionScroll;
    var mode = SCROLL_TEXT[preset];
    if (mode && !scrollable) return;
    scrolls.set(el, el.innerHTML);
    if (mode) {
      el.classList.add('m-scroll-text');
      number(split(el, preset, mode, true), el);
    } else if (preset === 'stack') number(Array.from(el.children), el);
  }

  function destroy(el) {
    (el ? [el] : Array.from(scrolls.keys())).forEach(function (e) {
      if (!scrolls.has(e)) return;
      if (SCROLL_TEXT[e.dataset.motionScroll]) {
        e.innerHTML = scrolls.get(e);
        e.classList.remove('m-scroll-text');
      } else Array.from(e.children).forEach(function (c) { c.style.removeProperty('--m-i'); });
      e.style.removeProperty('--m-n');
      scrolls.delete(e);
    });
    var list = el ? [el] : Array.from(items.keys());
    list.forEach(function (e) {
      var item = items.get(e);
      if (!item) return;
      io.unobserve(e);
      if (item.mode === 'self' || item.mode === 'children') {
        item.targets.forEach(function (t) { t.classList.remove('m-t', 'is-in'); delete t.dataset.m; t.style.removeProperty('--m-i'); });
      } else e.innerHTML = item.html;
      e.style.removeProperty('--m-stagger');
      items.delete(e);
    });
  }

  // pointer effects: magnetic, tilt and spotlight follow a hovering pointer, ripple answers a press
  var bound = new WeakSet();
  var canHover = matchMedia('(hover: hover) and (pointer: fine)');
  var still = matchMedia('(prefers-reduced-motion: reduce)');

  function pointer(el) {
    if (bound.has(el)) return;
    bound.add(el);
    var magnet = el.hasAttribute('data-motion-magnetic');
    var tilt = el.hasAttribute('data-motion-tilt');
    var spot = el.hasAttribute('data-motion-spotlight');
    if (el.hasAttribute('data-motion-ripple')) {
      el.addEventListener('pointerdown', function (e) {
        if (still.matches) return;
        var r = el.getBoundingClientRect();
        var size = Math.hypot(Math.max(e.clientX - r.left, r.right - e.clientX), Math.max(e.clientY - r.top, r.bottom - e.clientY)) * 2;
        var w = document.createElement('span');
        w.className = 'm-ripple';
        w.style.cssText = 'left:' + (e.clientX - r.left) + 'px;top:' + (e.clientY - r.top) + 'px;width:' + size + 'px;height:' + size + 'px';
        w.addEventListener('animationend', function () { w.remove(); });
        el.append(w);
      });
    }
    if (!magnet && !tilt && !spot) return;
    el.addEventListener('pointermove', function (e) {
      if (!canHover.matches) return;
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('is-near');
      if (spot) {
        el.style.setProperty('--m-x', e.clientX - r.left + 'px');
        el.style.setProperty('--m-y', e.clientY - r.top + 'px');
      }
      if (still.matches) return;
      if (magnet) {
        var pull = parseFloat(el.dataset.motionMagnetic) || 0.3;
        el.style.translate = (x * r.width * pull) + 'px ' + (y * r.height * pull) + 'px';
      }
      if (tilt) {
        var max = parseFloat(el.dataset.motionTilt) || 8;
        el.style.transform = 'perspective(800px) rotateX(' + (-y * max * 2) + 'deg) rotateY(' + (x * max * 2) + 'deg)';
      }
    });
    el.addEventListener('pointerleave', function () {
      el.classList.remove('is-near');
      if (magnet) el.style.translate = '';
      if (tilt) el.style.transform = '';
    });
  }

  function init(root) {
    root = root || document;
    var list = Array.from(root.querySelectorAll('[data-motion]'));
    if (root.matches && root.matches('[data-motion]')) list.unshift(root);
    list.forEach(setup);
    var linked = Array.from(root.querySelectorAll('[data-motion-scroll]'));
    if (root.matches && root.matches('[data-motion-scroll]')) linked.unshift(root);
    linked.forEach(scrollSetup);
    root.querySelectorAll('[data-motion-magnetic], [data-motion-tilt], [data-motion-spotlight], [data-motion-ripple]').forEach(pointer);
  }

  window.UnictiveMotion = { init: init, replay: replay, show: show, hide: hide, destroy: destroy };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
