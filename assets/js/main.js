/* Progressive enhancements only: every piece of content is in the HTML and visible without this file. */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;

  /* Layout grid toggle: button + "G" shortcut */
  var gridBtn = d.querySelector('.grid-toggle');
  function setGrid(on) {
    root.classList.toggle('show-grid', on);
    if (gridBtn) gridBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  if (gridBtn) gridBtn.addEventListener('click', function () { setGrid(!root.classList.contains('show-grid')); });
  d.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'g' || e.key === 'G') setGrid(!root.classList.contains('show-grid'));
  });

  /* Mobile menu: close after choosing a link, or on Escape */
  var menu = d.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.removeAttribute('open'); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.hasAttribute('open')) { menu.removeAttribute('open'); menu.querySelector('summary').focus(); }
    });
    d.addEventListener('click', function (e) { if (menu.hasAttribute('open') && !menu.contains(e.target)) menu.removeAttribute('open'); });
  }

  /* Engineering work filters */
  var filters = d.querySelectorAll('.filter');
  var engCards = d.querySelectorAll('.eng-grid .card');
  var status = d.getElementById('filter-status');
  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener('click', function () {
      var area = btn.getAttribute('data-area');
      var shown = 0;
      Array.prototype.forEach.call(filters, function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      Array.prototype.forEach.call(engCards, function (c) {
        var hide = area !== 'all' && c.getAttribute('data-area') !== area;
        c.classList.toggle('is-hidden', hide);
        if (!hide) shown++;
      });
      if (status) status.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
    });
  });

  /* Tiles Game: a tiny playable memory board */
  var board = d.querySelector('[data-tiles]');
  if (board) {
    var tiles = Array.prototype.slice.call(board.querySelectorAll('.tile'));
    var open = [];
    var key = function (t) { return t.getAttribute('data-s') + t.style.getPropertyValue('--c'); };
    tiles.forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.classList.contains('match') || t.classList.contains('up') || open.length === 2) return;
        t.classList.add('up');
        open.push(t);
        if (open.length === 2) {
          var a = open[0], b = open[1];
          if (key(a) === key(b)) { a.classList.add('match'); b.classList.add('match'); open = []; }
          else setTimeout(function () { a.classList.remove('up'); b.classList.remove('up'); open = []; }, 650);
        }
      });
    });
    var shuffle = board.querySelector('.shuffle');
    if (shuffle) shuffle.addEventListener('click', function () {
      var specs = tiles.map(function (t) { return [t.getAttribute('data-s'), t.style.getPropertyValue('--c')]; });
      for (var i = specs.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = specs[i]; specs[i] = specs[j]; specs[j] = x; }
      open = [];
      tiles.forEach(function (t, i) {
        t.className = 'tile';
        t.setAttribute('data-s', specs[i][0]);
        t.style.setProperty('--c', specs[i][1]);
      });
    });
  }

  /* My First App: RGB mixer + light/dark theme */
  var mixer = d.querySelector('[data-mixer]');
  if (mixer) {
    var swatch = mixer.querySelector('.swatch');
    Array.prototype.forEach.call(mixer.querySelectorAll('input[type="range"]'), function (r) {
      r.addEventListener('input', function () { swatch.style.setProperty('--' + r.getAttribute('data-ch'), r.value); });
    });
    var themeBtn = mixer.querySelector('.theme-switch');
    var phone = mixer.querySelector('.phone');
    if (themeBtn && phone) themeBtn.addEventListener('click', function () {
      var dark = !phone.classList.contains('dark');
      phone.classList.toggle('dark', dark);
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.querySelector('span').textContent = dark ? 'Light theme' : 'Dark theme';
    });
  }

  /* Copy email */
  Array.prototype.forEach.call(d.querySelectorAll('.copy'), function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.querySelector('span');
      var done = function () { label.textContent = 'Copied'; setTimeout(function () { label.textContent = 'Copy address'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { label.textContent = 'Select and copy'; });
      else label.textContent = 'Select and copy';
    });
  });
})();
