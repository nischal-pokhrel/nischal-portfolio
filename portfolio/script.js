(function () {
  'use strict';

  var D = window.PORTFOLIO;
  if (!D) {
    console.error('[portfolio] data.js did not load. Check that it sits next to index.html.');
    return;
  }

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isPlaceholder(v) { return /YOUR_|XXXX|your\.email/i.test(String(v == null ? '' : v)); }
  function phoneDigits() { return String(D.phone || '').replace(/\D/g, ''); }
  function phoneReady() { return !!D.phone && !isPlaceholder(D.phone) && phoneDigits().length >= 8; }
  function emailReady() { return !!D.email && !isPlaceholder(D.email); }
  function firstName() { return String(D.name || '').trim().split(/\s+/)[0] || 'there'; }
  function initials() {
    return String(D.name || '').trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  }

  function socialIcon(name) {
    var key = String(name || '').toLowerCase();
    var paths = {
      linkedin: '<path d="M6.5 8.5v9M6.5 5.5v.1M10.5 17.5v-5a3 3 0 0 1 6 0v5M10.5 12.5a3 3 0 0 1 6 0"/><rect x="3" y="3" width="18" height="18" rx="3"/>',
      github: '<path d="M9 19c-4 .9-4-2-5.5-2.5M14.5 19v-2.2c0-.7.1-1.3-.5-1.8 2.1-.2 4.3-1 4.3-4.6 0-1-.4-1.8-1-2.5.1-.2.4-1.2-.1-2.5 0 0-.8-.3-2.6 1a9 9 0 0 0-4.7 0c-1.8-1.3-2.6-1-2.6-1-.5 1.3-.2 2.3-.1 2.5-.6.7-1 1.5-1 2.5 0 3.6 2.2 4.4 4.3 4.6-.4.4-.6 1-.6 1.8V19"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/>',
      tiktok: '<path d="M15 5v9.5a3.5 3.5 0 1 1-3-3.5M15 5c.5 2 1.8 3.2 4 3.5"/>',
      facebook: '<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.5V3.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.5v8"/>',
      'x (twitter)': '<path d="m4 4 16 16M20 4 4 20"/>',
      discord: '<path d="M8.5 10.5h.01M15.5 10.5h.01M9 15c2 1.2 4 1.2 6 0M7.5 7.5a14 14 0 0 1 9 0l1.5 9a12 12 0 0 1-3.5 1.5L13 16.5M7.5 7.5 6 16.5a12 12 0 0 0 3.5 1.5L11 16.5"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (paths[key] || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }

  function removeSection(id) {
    var section = document.getElementById(id);
    if (section) section.remove();
    $$('a[href="#' + id + '"]').forEach(function (a) { a.remove(); });
  }

  function setPhoto(img, src, ratioStyle) {
    if (!img) return;
    img.alt = 'Portrait of ' + D.name;
    img.addEventListener('error', function () {
      var frame = img.parentNode;
      if (frame) frame.innerHTML = '<div class="portrait-initials" aria-hidden="true"' + (ratioStyle ? ' style="' + ratioStyle + '"' : '') + '>' + esc(initials()) + '</div>';
    });
    img.src = src || '';
  }

  function renderHero() {
    document.title = D.name + ' | ' + D.role;

    var parts = String(D.name).trim().split(/\s+/);
    var first = parts.shift();
    var rest = parts.join(' ');
    $('#hero-name').innerHTML =
      '<span class="line"><span class="line-inner">' + esc(first) + '</span></span>' +
      (rest ? '<span class="line"><span class="line-inner">' + esc(rest) + '</span></span>' : '');

    var brandName = document.getElementById('brand-name');
    if (brandName) brandName.textContent = first;
    $('#hero-role').textContent = D.role;
    $('#hero-intro').textContent = D.intro;
    $('#footer-text').textContent = '\u00A9 ' + new Date().getFullYear() + ' ' + D.name;

    if (D.badge && D.badge.text) {
      $('#badge-text').textContent = D.badge.text;
      $('#badge-sub').textContent = D.badge.sub || '';
      $('#hero-badge').hidden = false;
    }

    $('#hero-caps').innerHTML = (D.capabilities || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');

    var labels = D.photoLabels || [];
    ['a', 'b'].forEach(function (k, i) {
      var chip = $('#chip-' + k);
      if (chip && labels[i]) { $('span', chip).textContent = labels[i]; chip.hidden = false; }
    });

    setPhoto($('#hero-photo'), D.heroImage);
    setPhoto($('#about-photo'), D.aboutImage || D.heroImage, 'aspect-ratio:4/5');
  }

  function renderAbout() {
    $('#about-text').innerHTML = (D.about || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('#facts').innerHTML = (D.facts || []).map(function (f) {
      return '<div class="fact"><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
    }).join('');
  }

  function renderEducation() {
    if (!(D.education || []).length) { removeSection('education'); return; }
    $('#education-list').innerHTML = D.education.map(function (e) {
      return '<article class="education-item">' +
        '<span class="education-level">' + esc(e.level) + '</span>' +
        '<div><h3>' + esc(e.program) + '</h3><p class="institution">' + esc(e.institution) + '</p></div>' +
        '<p class="education-detail">' + esc(e.detail) + '</p>' +
      '</article>';
    }).join('');
  }

  function renderProjects() {
    if (!(D.projects || []).length) { removeSection('projects'); return; }
    $('#project-grid').innerHTML = D.projects.map(function (p) {
      var mono = String(p.title).split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
      var livePreview = p.live
        ? '<iframe class="project-preview" src="' + esc(p.live) + '" title="Preview of ' + esc(p.title) + '" loading="lazy" referrerpolicy="no-referrer"></iframe>'
        : '<span class="project-mono" aria-hidden="true">' + esc(mono) + '</span>';
      var visual = p.image
        ? '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.title) + '" loading="lazy" decoding="async">'
        : livePreview;

      var links = [];
      links.push('<button class="text-link" type="button" data-open-message>Message me</button>');
      if (p.live) links.push('<a class="text-link" href="' + esc(p.live) + '" target="_blank" rel="noopener">Live demo</a>');
      if (p.code) links.push('<a class="text-link" href="' + esc(p.code) + '" target="_blank" rel="noopener">Source code</a>');

      return '<article class="project-card" data-tilt>' +
        '<div class="project-visual">' + visual + '</div>' +
        '<div class="card-body">' +
          (p.note ? '<p class="card-note">' + esc(p.note) + '</p>' : '') +
          '<h3 class="card-title">' + esc(p.title) + '</h3>' +
          '<p class="card-text">' + esc(p.blurb) + '</p>' +
          '<div class="tags">' + (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
          '<div class="card-links">' + links.join('') + '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderCertificates() {
    if (!(D.certificates || []).length) { removeSection('certificates'); return; }
    $('#certificate-grid').innerHTML = D.certificates.map(function (c) {
      var project = '';
      if (c.project) {
        var title = typeof c.project === 'string' ? c.project : c.project.title;
        var url = typeof c.project === 'string' ? '' : c.project.url;
        project = '<p class="card-meta"><strong>Project:</strong> ' +
          (url ? '<a class="text-link" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(title) + '</a>' : esc(title)) + '</p>';
      }
      var thumb = c.image
        ? '<div class="certificate-thumb" aria-label="Certificate preview: ' + esc(c.title) + '">' +
            '<img src="' + esc(c.image) + '" alt="' + esc(c.title) + ' certificate" loading="lazy" decoding="async"></div>'
        : '';
      return '<article class="certificate-card" data-tilt>' +
        thumb +
        '<div class="card-body">' +
          '<p class="card-note">' + esc(c.type) + '</p>' +
          '<h3 class="card-title">' + esc(c.title) + '</h3>' +
          '<p class="card-meta">' + esc(c.issuer) + (c.venue ? ' · ' + esc(c.venue) : '') + '</p>' +
          '<p class="card-meta">' + esc(c.date) + '</p>' +
          (c.description ? '<p class="card-text">' + esc(c.description) + '</p>' : '') +
          project +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderSkills() {
    if (!(D.skills || []).length) { removeSection('skills'); return; }
    $('#skill-groups').innerHTML = D.skills.map(function (g) {
      return '<div class="skill-group"><h3 class="skill-group-name">' + esc(g.group) + '</h3>' +
        '<div class="skill-items">' + (g.items || []).map(function (i) { return '<span class="skill-item">' + esc(i) + '</span>'; }).join('') + '</div></div>';
    }).join('');
  }

  function renderGallery() {
    var items = (D.gallery || []).filter(function (g) { return g && g.image; });
    if (!items.length) { removeSection('gallery'); return; }
    $('#gallery-grid').innerHTML = items.map(function (g) {
      var alt = 'Photo of ' + firstName() + (g.caption ? ': ' + g.caption : '');
      return '<button type="button" class="gallery-item" data-lightbox="gallery" data-full="' + esc(g.image) + '" data-alt="' + esc(alt) + '" data-caption="' + esc(g.caption || '') + '" aria-label="Open photo' + (g.caption ? ': ' + esc(g.caption) : '') + '">' +
        '<img src="' + esc(g.image) + '" alt="" loading="lazy" decoding="async">' +
        (g.caption ? '<span class="cap">' + esc(g.caption) + '</span>' : '') +
      '</button>';
    }).join('');
  }

  function renderContact() {
    var digits = phoneDigits();
    var actions = ['<button class="btn btn-primary" type="button" data-open-message>Message me</button>'];
    if (emailReady()) actions.push('<a class="btn btn-ghost" href="mailto:' + esc(D.email) + '">Email</a>');
    if (phoneReady()) {
      actions.push('<a class="btn btn-ghost" href="tel:+' + digits + '">Call</a>');
      actions.push('<a class="btn btn-ghost" href="https://wa.me/' + digits + '" target="_blank" rel="noopener">WhatsApp</a>');
    }
    $('#contact-actions').innerHTML = actions.join('');

    var rows = [];
    if (emailReady()) rows.push('<div class="row"><dt>Email</dt><dd><a href="mailto:' + esc(D.email) + '">' + esc(D.email) + '</a></dd></div>');
    if (phoneReady()) rows.push('<div class="row"><dt>Phone and WhatsApp</dt><dd><a href="tel:+' + digits + '">' + esc(D.phone) + '</a></dd></div>');
    var details = $('#contact-details');
    details.innerHTML = rows.join('');
    details.hidden = !rows.length;

    var chips = (D.socials || []).map(function (s) {
      if (isPlaceholder(s.url) || isPlaceholder(s.handle)) return '';
      if (s.url) return '<a class="chip-link" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="Open ' + esc(s.name) + ' profile" title="' + esc(s.name) + '">' + socialIcon(s.name) + '</a>';
      if (s.handle) return '<button class="chip-link" type="button" data-copy="' + esc(s.handle) + '" data-label="' + esc(s.name) + '" aria-label="Copy ' + esc(s.name) + ' username" title="' + esc(s.name) + '">' + socialIcon(s.name) + '</button>';
      return '';
    }).join('');
    var socials = $('#socials');
    socials.innerHTML = chips;
    socials.hidden = !chips;

    $$('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var original = btn.textContent;
        try {
          navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
            btn.textContent = 'Copied ' + btn.getAttribute('data-label') + ' username';
            setTimeout(function () { btn.textContent = original; }, 2000);
          }, function () {});
        } catch (e) {}
      });
    });
  }

  function initTheme() {
    var btn = $('#theme-toggle');
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function current() {
      try {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
      } catch (e) {}
      return media.matches ? 'dark' : 'light';
    }
    function apply(theme, save) {
      root.dataset.theme = theme;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      if (save) { try { localStorage.setItem('theme', theme); } catch (e) {} }
      document.dispatchEvent(new CustomEvent('themechange'));
    }

    apply(current(), false);
    btn.addEventListener('click', function () { apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true); });
  }

  function initNav() {
    var header = $('#site-header');
    var nav = $('#nav');
    var toggle = $('#menu-toggle');

    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    if ('IntersectionObserver' in window) {
      var links = {};
      $$('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          if (links[en.target.id]) links[en.target.id].setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main section[id]').forEach(function (s) { io.observe(s); });
    }
  }

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    ['.section-head', '.about-portrait', '.about-content', '.education-item', '.project-card',
     '.certificate-card', '.skill-group', '.gallery-item', '.tabs', '.embed-panel', '.contact-panel'
    ].forEach(function (selector) {
      $$(selector).forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.setProperty('--i', String(i % 6));
        io.observe(el);
      });
    });
  }

  function initTilt() {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    $$('[data-tilt]').forEach(function (card) {
      var max = card.classList.contains('about-portrait') ? 6 : 5;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
        card.classList.add('is-tilting');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.classList.remove('is-tilting');
      });
    });
  }

  function initLightbox() {
    var dlg = $('#lightbox');
    var img = $('#lb-img');
    var cap = $('#lb-cap');
    var prev = $('#lb-prev');
    var next = $('#lb-next');
    var items = [];
    var index = 0;

    function show() {
      var item = items[index];
      img.src = item.src;
      img.alt = item.alt;
      cap.textContent = item.caption;
      prev.hidden = next.hidden = items.length < 2;
    }
    function step(delta) { index = (index + delta + items.length) % items.length; show(); }
    function open() {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-lightbox]');
      if (!trigger) return;
      var nodes = $$('[data-lightbox="' + trigger.getAttribute('data-lightbox') + '"]');
      items = nodes.map(function (n) {
        return { src: n.getAttribute('data-full'), alt: n.getAttribute('data-alt') || '', caption: n.getAttribute('data-caption') || '' };
      });
      index = nodes.indexOf(trigger);
      show();
      open();
    });

    $('#lb-close').addEventListener('click', close);
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    $('#lightbox-inner').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
    dlg.addEventListener('close', function () { document.body.style.overflow = ''; img.removeAttribute('src'); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function cleanUser(value) {
    return String(value || '').trim()
      .replace(/^https?:\/\/[^/]+\//i, '')
      .replace(/^@/, '')
      .split(/[/?#]/)[0];
  }

  function makeFrame(src, title) {
    var f = document.createElement('iframe');
    f.className = 'embed-frame';
    f.src = src;
    f.title = title;
    f.loading = 'lazy';
    f.setAttribute('scrolling', 'no');
    f.setAttribute('allowtransparency', 'true');
    f.setAttribute('allowfullscreen', 'true');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    return f;
  }

  function showEmbedFallback(box, label, url, note, avatar) {
    box.innerHTML =
      '<div class="profile-card">' +
        (avatar ? '<img class="profile-avatar" src="' + esc(avatar) + '" alt="" width="96" height="96">' : '') +
        '<p class="profile-name">' + esc(label) + '</p>' +
        '<p class="profile-handle">' + esc(url) + '</p>' +
        '<p class="embed-note">' + esc(note) + '</p>' +
        '<a class="btn btn-primary btn-sm" href="' + esc(url) + '" target="_blank" rel="noopener">Open profile</a>' +
      '</div>';
  }

  function bindEmbedFallback(frame, box, label, url, note, avatar) {
    var loaded = false;
    var timer = setTimeout(function () {
      if (!loaded) {
        showEmbedFallback(box, label, url, note, avatar);
      }
    }, 5000);
    frame.addEventListener('load', function () {
      loaded = true;
      clearTimeout(timer);
      if (frame.contentWindow && frame.contentWindow.location && frame.contentWindow.location.href && frame.contentWindow.location.href.indexOf('about:blank') === 0) {
        showEmbedFallback(box, label, url, note, avatar);
      }
    });
    frame.addEventListener('error', function () {
      loaded = true;
      clearTimeout(timer);
      showEmbedFallback(box, label, url, note, avatar);
    });
  }

  function initSocial() {
    var links = (D.socials || []).filter(function (s) {
      return s && s.name && s.url && !isPlaceholder(s.url);
    });
    var section = $('#social');
    var container = $('#social-links');
    if (!links.length || !section || !container) {
      if (section && !links.length) section.remove();
      return;
    }

    container.innerHTML = links.map(function (s) {
      return '<a class="social-link" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="Open ' + esc(s.name) + ' profile">' +
        socialIcon(s.name) + '<span>' + esc(s.name) + '</span></a>';
    }).join('');
  }

  function initLegacySocial() {
    var cfg = D.embeds || {};
    var fb = typeof cfg.facebook === 'string' ? { url: cfg.facebook, type: 'profile' } : (cfg.facebook || {});
    var platforms = [];

    if (cfg.instagram) {
      var ig = cleanUser(cfg.instagram);
      var igUrl = 'https://www.instagram.com/' + ig + '/';
      platforms.push({
        id: 'instagram', label: 'Instagram', setup: isPlaceholder(cfg.instagram), setupText: 'your Instagram username',
        link: igUrl,
        mount: function (box) {
          showEmbedFallback(box, 'Instagram', igUrl, 'Instagram does not reliably allow profile pages inside third-party frames. Open the profile to view the current posts and account.', D.heroImage || '');
        }
      });
    }
    if (cfg.tiktok) {
      var tt = cleanUser(cfg.tiktok);
      var ttUrl = 'https://www.tiktok.com/@' + tt;
      platforms.push({
        id: 'tiktok', label: 'TikTok', setup: isPlaceholder(cfg.tiktok), setupText: 'your TikTok username',
        link: ttUrl,
        mount: function (box) {
          showEmbedFallback(box, 'TikTok', ttUrl, 'TikTok profile pages are commonly blocked inside third-party frames. Open the profile to view the current videos and account.', D.heroImage || '');
        }
      });
    }
    if (fb.url) {
      platforms.push({
        id: 'facebook', label: 'Facebook', setup: isPlaceholder(fb.url), setupText: 'your Facebook link',
        link: fb.url,
        mount: function (box) {
          var handle = cleanUser(fb.url.replace(/\/+$/, ''));
          if (fb.type === 'page') {
            box.innerHTML = '<p class="embed-loading">Loading Facebook...</p>';
            var src = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent(fb.url) +
              '&tabs=timeline&width=500&height=580&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false';
            var f = makeFrame(src, 'Facebook Page of ' + D.name);
            bindEmbedFallback(f, box, 'Facebook', fb.url, 'Facebook preview is restricted on some browsers, so the direct page link remains available.', D.heroImage || '');
            box.appendChild(f);
            return;
          }
          showEmbedFallback(box, 'Facebook', fb.url, 'Live preview is unavailable for personal Facebook profiles, but the direct profile link is ready to open.', D.heroImage || '');
        }
      });
    }

    var tabs = $('#social-tabs');
    var panels = $('#social-panels');
    if (!platforms.length) { removeSection('social'); return; }

    tabs.innerHTML = platforms.map(function (p, i) {
      return '<button class="tab" type="button" role="tab" id="tab-' + p.id + '" aria-controls="panel-' + p.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-tab="' + p.id + '">' + esc(p.label) + '</button>';
    }).join('');
    panels.innerHTML = platforms.map(function (p, i) {
      return '<div class="embed-panel" role="tabpanel" id="panel-' + p.id + '" aria-labelledby="tab-' + p.id + '"' + (i === 0 ? '' : ' hidden') + '>' +
        '<div class="embed-box" id="box-' + p.id + '"></div>' +
        '<p class="embed-note">Preview availability follows each platform\'s embed rules. Use Open profile for the current account.</p>' +
      '</div>';
    }).join('');

    var byId = {};
    var loaded = {};
    platforms.forEach(function (p) { byId[p.id] = p; });

    function load(id) {
      if (loaded[id]) return;
      loaded[id] = true;
      var p = byId[id];
      var box = $('#box-' + id);
      if (p.setup) {
        box.innerHTML = '<p class="embed-note">Add ' + esc(p.setupText) + ' in data.js and this profile will appear here.</p>';
        return;
      }
      p.mount(box);
    }

    var active = platforms[0].id;
    function select(id) {
      active = id;
      $$('.tab', tabs).forEach(function (t) {
        var on = t.getAttribute('data-tab') === id;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      $$('.embed-panel', panels).forEach(function (panel) { panel.hidden = panel.id !== 'panel-' + id; });
      load(id);
    }

    tabs.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tab]');
      if (t) select(t.getAttribute('data-tab'));
    });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var ids = platforms.map(function (p) { return p.id; });
      var next = ids[(ids.indexOf(active) + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length];
      select(next);
      $('#tab-' + next).focus();
    });

    var section = $('#social');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { load(active); io.disconnect(); }
      }, { rootMargin: '300px 0px' });
      io.observe(section);
    } else {
      load(active);
    }
  }

  function initDialog() {
    var dialog = $('#message-dialog');
    var form = $('#message-form');
    var statusEl = $('#form-status');
    var emailBtn = $('#send-email');
    var waBtn = $('#send-whatsapp');

    function setStatus(text, state) {
      statusEl.textContent = text || '';
      if (state) statusEl.setAttribute('data-state', state); else statusEl.removeAttribute('data-state');
    }

    function openDialog() {
      setStatus('');
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
      $('#msg-name').focus();
    }
    function closeDialog() {
      if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-open-message]')) openDialog();
      if (e.target.closest('[data-close-dialog]')) closeDialog();
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closeDialog(); });
    dialog.addEventListener('close', function () { document.body.style.overflow = ''; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var message = String(data.get('message') || '').trim();
      var key = D.formAccessKey || '';

      if (!name || !email || !message) {
        setStatus('Please fill in your name, email, and message.', 'error');
        return;
      }

      if (!key || isPlaceholder(key)) {
        var subject = encodeURIComponent('Portfolio message from ' + name);
        var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
        window.location.href = 'mailto:' + encodeURIComponent(D.email || 'nischalpokhrel623@gmail.com') + '?subject=' + subject + '&body=' + body;
        setStatus('Your email app opened with the message ready to send.', 'success');
        form.reset();
        return;
      }

      emailBtn.disabled = true;
      setStatus('Sending...');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: 'New portfolio message from ' + name,
          from_name: 'Portfolio website',
          name: name,
          email: email,
          message: message
        })
      })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (r) {
          if (r.ok && r.json.success) {
            form.reset();
            setStatus('Message sent. Thank you, I will get back to you soon.', 'success');
          } else {
            throw new Error(r.json.message || 'Request failed');
          }
        })
        .catch(function () {
          var fallbackSubject = encodeURIComponent('Portfolio message from ' + name);
          var fallbackBody = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
          window.location.href = 'mailto:' + encodeURIComponent(D.email || 'nischalpokhrel623@gmail.com') + '?subject=' + fallbackSubject + '&body=' + fallbackBody;
          setStatus('Direct send was unavailable, so your email app opened with the message ready.', 'success');
          form.reset();
        })
        .then(function () { emailBtn.disabled = false; });
    });

    waBtn.addEventListener('click', function () {
      var name = $('#msg-name').value.trim();
      var message = $('#msg-body').value.trim();
      if (!name || !message) {
        setStatus('Add your name and a message first.', 'error');
        (name ? $('#msg-body') : $('#msg-name')).focus();
        return;
      }
      if (!phoneReady()) {
        setStatus('The WhatsApp number is not set up yet. Please use email.', 'error');
        return;
      }
      var text = 'Hi ' + firstName() + ', this is ' + name + '. ' + message;
      window.open('https://wa.me/' + phoneDigits() + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      setStatus('WhatsApp opened in a new tab. Press send there to deliver your message.', 'success');
    });
  }

  renderHero();
  renderAbout();
  renderEducation();
  renderProjects();
  renderCertificates();
  renderSkills();
  renderGallery();
  renderContact();

  initTheme();
  initNav();
  initTilt();
  initLightbox();
  initSocial();
  initDialog();
  initReveal();

  if (/YOUR_|XXXX|your\.email/i.test(JSON.stringify(D))) {
    console.info('[portfolio] data.js still has placeholder values (YOUR_..., XXXX). They are hidden on the page until you replace them.');
  }
})();
