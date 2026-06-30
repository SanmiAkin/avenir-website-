/* Shared mobile navigation: injects a hamburger toggle + slide-down menu
   on small screens, cloned from each page's own nav links + actions.
   No per-page markup required. */
(function () {
  function init() {
    var nav = document.querySelector('nav');
    if (!nav || nav.querySelector('.nav-toggle')) return;

    // Inject styles once
    if (!document.getElementById('mobile-nav-style')) {
      var css = document.createElement('style');
      css.id = 'mobile-nav-style';
      css.textContent =
        '.nav-toggle{display:none;}' +
        '.mobile-menu{display:none;}' +
        '@media(max-width:900px){' +
        'nav .nav-right{display:none !important;}' +
        '.nav-toggle{display:flex;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;padding:0;margin-left:auto;background:none;border:none;cursor:pointer;}' +
        '.nav-toggle span{display:block;width:26px;height:2px;background:var(--dark,#0f2d1f);border-radius:2px;transition:transform .25s,opacity .2s;}' +
        '.nav-toggle.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}' +
        '.nav-toggle.open span:nth-child(2){opacity:0;}' +
        '.nav-toggle.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}' +
        '.mobile-menu{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:var(--white,#fff);border-bottom:1px solid var(--border,#ddebd5);box-shadow:0 14px 28px rgba(15,45,31,.10);padding:8px 24px 20px;}' +
        '.mobile-menu.open{display:flex;}' +
        '.mobile-menu a{font-size:16px;font-weight:600;color:var(--text-mid,#3a4d3e);text-decoration:none;padding:15px 2px;border-bottom:1px solid var(--border,#ddebd5);}' +
        '.mobile-menu a:last-of-type{border-bottom:none;}' +
        '.mobile-actions{display:flex;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap;}' +
        '.mobile-actions .lang-toggle{margin:0;}' +
        '.mobile-actions .lang-btn{padding:11px 16px;}' +
        '.mobile-actions .btn-primary{flex:1;justify-content:center;padding:15px 20px;}' +
        '}';
      document.head.appendChild(css);
    }

    // Hamburger button
    var tg = document.createElement('button');
    tg.className = 'nav-toggle';
    tg.setAttribute('aria-label', 'Menu');
    tg.setAttribute('aria-expanded', 'false');
    tg.innerHTML = '<span></span><span></span><span></span>';

    // Menu panel cloned from existing nav
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';

    var links = nav.querySelector('.nav-links');
    if (links) {
      links.querySelectorAll('a').forEach(function (a) { menu.appendChild(a.cloneNode(true)); });
    }
    var right = nav.querySelector('.nav-right');
    if (right) {
      var actions = document.createElement('div');
      actions.className = 'mobile-actions';
      Array.prototype.forEach.call(right.children, function (el) { actions.appendChild(el.cloneNode(true)); });
      menu.appendChild(actions);
    }

    nav.appendChild(tg);
    nav.appendChild(menu);

    function close() { menu.classList.remove('open'); tg.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); }
    tg.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      tg.classList.toggle('open', open);
      tg.setAttribute('aria-expanded', String(open));
    });
    // Close after navigating or applying (but keep open for language toggle)
    menu.querySelectorAll('a, .btn-primary').forEach(function (el) {
      el.addEventListener('click', close);
    });

    // Sync language state onto the freshly cloned controls
    if (typeof setLang === 'function') {
      try { setLang(document.documentElement.lang || 'fr'); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
