/* ═══════════════════════════════════════════════════════════════════
   ABRID MOROCCO — Shared behaviour
   Handles: mobile menu, sticky header, footer year, search.
   Load at the end of <body> on every page.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile menu */
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    /* Close the mobile menu when a panel link is tapped */
    menu.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Sticky header shadow on scroll */
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.pageYOffset > 60);
    }, { passive: true });
  }

  /* ===== EXPLORE MOROCCO dropdown with 3s auto-hide =====
     Opens on hover/focus (CSS :hover + .open). A setTimeout(3000)
     force-hides it even while still hovered, via .drop-hide
     (override in design.css). mouseleave resets for next hover. */
  var dropItems = document.querySelectorAll('.nav-links li.drop');
  var DROP_TIMEOUT = 3000;

  dropItems.forEach(function (dropLi) {
    var dropTimer = null;

    function showDrop() {
      dropLi.classList.add('open');
      dropLi.classList.remove('drop-hide');
      clearTimeout(dropTimer);
      dropTimer = setTimeout(function () {
        dropLi.classList.remove('open');
        dropLi.classList.add('drop-hide');
      }, DROP_TIMEOUT);
    }

    function hideDrop() {
      clearTimeout(dropTimer);
      dropLi.classList.remove('open');
      dropLi.classList.remove('drop-hide');
    }

    dropLi.addEventListener('mouseenter', showDrop);
    dropLi.addEventListener('mouseleave', hideDrop);
    var trigger = dropLi.querySelector('a');
    if (trigger) {
      trigger.addEventListener('focus', showDrop);
      trigger.addEventListener('blur', hideDrop);
    }
  });


  /* ===== Shared FAQ accordion toggle (all pages) =====
     Works with .faq-item > .faq-question + .faq-answer markup.
     Pages must NOT add their own duplicate toggle (double-toggle bug). */
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var parent = this.closest('.faq-item');
      if (!parent) return;
      var answer = parent.querySelector('.faq-answer');
      if (!answer) return;
      answer.classList.toggle('open');
      parent.classList.toggle('open');
      var icon = this.querySelector('.faq-icon');
      if (icon) icon.textContent = answer.classList.contains('open') ? '-' : '+';
    });
  });

  /* ── Search overlay ── */
  var overlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchOpen = document.getElementById('searchOpen');
  var searchClose = document.getElementById('searchClose');

  function runSearch(q) {
    if (!searchResults) return;
    var idx = window.ABRID_SEARCH || [];
    var query = q.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '<p class="search-nores">Type a destination, trip or topic…</p>';
      return;
    }
    var words = query.split(/\s+/);
    var hits = idx.filter(function (item) {
      var hay = (item.t + ' ' + item.c + ' ' + item.d).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) >= 0; });
    });
    if (!hits.length) {
      searchResults.innerHTML = '<p class="search-nores">No results for "' + q.replace(/</g,'&lt;') + '"</p>';
      return;
    }
    var html = '';
    hits.forEach(function (hit) {
      html += '<a class="search-result" href="' + hit.u + '">' +
        '<span class="search-cat">' + hit.c + '</span>' +
        '<strong>' + hit.t + '</strong>' +
        '<p>' + hit.d + '</p>' +
        '</a>';
    });
    searchResults.innerHTML = html;
  }

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
      runSearch('');
    }
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (searchOpen) searchOpen.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  /* Mobile menu search entry: close the menu, open the search overlay */
  document.querySelectorAll('.mobile-search-link').forEach(function (l) {
    l.addEventListener('click', function (e) {
      e.preventDefault();
      if (menu) menu.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      openSearch();
    });
  });
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      runSearch(this.value);
    });
  }

  /* ── Filter logic for trips / destinations pages ──
     Markup convention (see trips.html):
     <div class="filter-options" data-filter="dur|xp|style">
       <button class="filter-btn active" data-value="">All</button>
       <button class="filter-btn" data-value="day">Day Trip</button>
     </div>
     Cards: <article class="tour-card" data-dur="day short" data-xp="desert atlas">
     Result count: <div class="filter-results" id="filterResults"> */
  var filterBars = document.querySelectorAll('.filter-bar');
  filterBars.forEach(function (bar) {
    var options = bar.querySelectorAll('.filter-options[data-filter]');
    var cards = bar.parentNode.querySelectorAll('.tour-card, .dest-card');
    var countEl = document.getElementById('filterResults') ||
      bar.parentNode.querySelector('#filterResults');

    function applyFilters() {
      var shown = 0;
      var activeGroups = [];
      options.forEach(function (group) {
        var g = group.getAttribute('data-filter');
        var activeVal = null;
        group.querySelectorAll('.filter-btn.active').forEach(function (a) {
          activeVal = a.getAttribute('data-value') || '';
        });
        if (activeVal) activeGroups.push(g + '=' + activeVal);
      });

      cards.forEach(function (card) {
        var match = activeGroups.every(function (kv) {
          var parts = kv.split('=');
          var group = parts[0];
          var value = parts[1];
          return (card.getAttribute('data-' + group) || '').split(/\s+/).indexOf(value) >= 0;
        });
        card.classList.toggle('hidden', !match);
        if (match) shown++;
      });

      if (countEl) {
        countEl.textContent = shown + ' result' + (shown === 1 ? '' : 's') +
          (activeGroups.length ? '' : ' (showing all)');
      }
    }

    options.forEach(function (group) {
      group.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var value = btn.getAttribute('data-value') || '';
          group.querySelectorAll('.filter-btn').forEach(function (a) {
            var av = a.getAttribute('data-value') || '';
            a.classList.toggle('active', av === value);
          });
          applyFilters();
        });
      });
    });

    applyFilters();
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   ABRID MOROCCO — Live traveller reviews (Google Sheet backend)
   Paste your Apps Script Web app URL below (see reviews-backend.gs).
   Empty string = backend disabled: the review form falls back to
   WhatsApp and lists show manual entries only.
   ═══════════════════════════════════════════════════════════════════ */
window.ABRID_REVIEWS_API = window.ABRID_REVIEWS_API || '';

(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function stars(n) {
    n = Math.max(1, Math.min(5, parseInt(n, 10) || 5));
    var s = '';
    for (var i = 0; i < n; i++) s += '★';
    return s;
  }

  /* Card for the reviews.html grid (global .review-card styles) */
  function gridCard(r) {
    return '<article class="review-card"><div class="stars" aria-label="' +
      (parseInt(r.rating, 10) || 5) + ' out of 5 stars">' + stars(r.rating) + '</div>' +
      '<p class="quote">' + esc(r.text) + '</p>' +
      '<div class="author">' + esc(r.name) + (r.trip ? ' · ' + esc(r.trip) : '') + '</div></article>';
  }

  window.AbridReviews = {
    load: function () {
      var api = window.ABRID_REVIEWS_API || '';
      var grid = document.getElementById('liveReviews');
      if (!api || !grid) return;
      var note = document.getElementById('liveReviewsNote');
      fetch(api, { headers: { 'Accept': 'application/json' } })
        .then(function (res) { return res.json(); })
        .then(function (items) {
          items = Array.isArray(items) ? items : [];
          if (!items.length) {
            if (note) note.textContent = 'No published reviews yet — yours could be the first.';
            return;
          }
          grid.innerHTML = items.map(gridCard).join('');
          if (note) note.textContent = 'Approved reviews from travellers who booked with Abrid Morocco.';
        })
        .catch(function () {
          if (note) note.textContent = 'Reviews appear here once published.';
        });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.AbridReviews.load(); });
  } else {
    window.AbridReviews.load();
  }
})();
  
  
  
  
  
  /* ===== WhatsApp contact chooser ===============================
     Both WhatsApp buttons - the floating one (.wa-float) and the header one
     (.nav-wa) - used to send every visitor to a single number. Each now opens
     the same chooser so the visitor picks Abdellah or Karim.

     The panel is positioned next to whichever button was clicked: above the
     floating button, and just under the header button.

     Progressive enhancement: the original href values are left untouched, so
     if this script fails to run, or JS is off, both buttons still open
     WhatsApp with Abdellah exactly as before.

     Names, roles and locations are taken from about.html:
       Abdellah - Founder, Imilchil / Atlas
       Karim    - Co-founder, Marrakech
     ============================================================ */
  (function () {
    var ABDELLAH = '212762934488';
    var KARIM = '212609282538';

    var COPY = {
      en: {
        title: 'Who would you like to chat with?',
        open: 'Choose who to chat with on WhatsApp',
        close: 'Close',
        note: 'Both reply within 2 hours, 9am-9pm.',
        abd: { name: 'Abdellah', where: 'Imilchil & Atlas', sub: 'Founder' },
        kar: { name: 'Karim', where: 'Marrakech', sub: 'Co-founder' }
      },
      fr: {
        title: 'Avec qui souhaitez-vous discuter ?',
        open: 'Choisissez avec qui discuter sur WhatsApp',
        close: 'Fermer',
        note: 'Les deux répondent sous 2 heures, de 9h à 21h.',
        abd: { name: 'Abdellah', where: 'Imilchil et Atlas', sub: 'Fondateur' },
        kar: { name: 'Karim', where: 'Marrakech', sub: 'Co-fondateur' }
      },
      es: {
        title: '¿Con quién quieres chatear?',
        open: 'Elige con quién chatear por WhatsApp',
        close: 'Cerrar',
        note: 'Ambos responden en 2 horas, de 9h a 21h.',
        abd: { name: 'Abdellah', where: 'Imilchil y Atlas', sub: 'Fundador' },
        kar: { name: 'Karim', where: 'Marrakech', sub: 'Co-fundador' }
      }
    };

    /* EVERY WhatsApp entry point opens the chooser: the floating button, the
       header button, the footer contact link, the footer WhatsApp social icon,
       the "WhatsApp Abdellah" / "WhatsApp Karim" buttons, and inline WhatsApp
       links inside article text. Matching on the href means anything added
       later is covered too, with no class list to maintain. href*= is a plain
       substring selector and needs no JS feature test. The two original
       selectors are kept so nothing can regress if a button loses its href. */
    var triggers = [].slice.call(
      document.querySelectorAll('a[href*="wa.me/"], .wa-float, .nav-wa')
    ).filter(function (el) {
      /* only real, visible buttons - the header nav is hidden on small screens */
      return el.offsetParent !== null || el.className.indexOf('wa-float') > -1;
    });
    if (!triggers.length) return;

    var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    var t = COPY[lang] ? COPY[lang] : COPY.en;

    var WA_ICON = '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-2.8.7.7-2.7-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.7 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.2 3.8 2 .8 2.4.6 2.9.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3l-2-1c-.3-.1-.5-.1-.7.1l-1 1.2c-.2.2-.3.2-.6.1a6.8 6.8 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.3 0-.5l-.9-2.2c-.2-.5-.4-.5-.5-.5h-.4z"/>';

    /* ---------------------------------------------------------- build panel */
    var panel = document.createElement('div');
    panel.className = 'wa-choose';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', t.open);

    var head = document.createElement('div');
    head.className = 'wa-choose-head';

    var title = document.createElement('div');
    title.className = 'wa-choose-title';
    title.textContent = t.title;

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'wa-choose-close';
    closeBtn.setAttribute('aria-label', t.close);
    closeBtn.innerHTML = '&times;';

    head.appendChild(title);
    head.appendChild(closeBtn);
    panel.appendChild(head);

    function makeItem(person, number) {
      var a = document.createElement('a');
      a.className = 'wa-choose-item';
      /* Pre-fill the message so the chat that opens already says where the
         visitor came from - useful to you, and it saves the client typing. */
      var msg = 'Hi, I would like to plan a Morocco trip.' +
                ' (via abridmorocco.com' + location.pathname + ')';
      a.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(msg);
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('data-person', person === t.kar ? 'karim' : 'abdellah');

      var av = document.createElement('span');
      av.className = 'wa-choose-avatar';
      av.setAttribute('aria-hidden', 'true');
      av.textContent = person.name.charAt(0);

      var who = document.createElement('span');
      who.className = 'wa-choose-who';

      var nm = document.createElement('span');
      nm.className = 'wa-choose-name';
      nm.textContent = person.name;

      var wh = document.createElement('span');
      wh.className = 'wa-choose-where';
      wh.textContent = person.sub + ' · ' + person.where;

      who.appendChild(nm);
      who.appendChild(document.createElement('br'));
      who.appendChild(wh);

      var ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ic.setAttribute('class', 'wa-choose-icon');
      ic.setAttribute('viewBox', '0 0 24 24');
      ic.setAttribute('fill', 'currentColor');
      ic.setAttribute('aria-hidden', 'true');
      ic.innerHTML = WA_ICON;

      a.appendChild(av);
      a.appendChild(who);
      a.appendChild(ic);
      return a;
    }

    panel.appendChild(makeItem(t.abd, ABDELLAH));
    panel.appendChild(makeItem(t.kar, KARIM));

    var note = document.createElement('p');
    note.className = 'wa-choose-note';
    note.textContent = t.note;
    panel.appendChild(note);

    document.body.appendChild(panel);

    /* ------------------------------------------------------- positioning */
    var isOpen = false;
    var current = null;   /* the trigger that opened the panel */

    function place() {
      if (!current) return;
      var r = current.getBoundingClientRect();

      if (current.className.indexOf('wa-float') > -1) {
        /* floating button: CSS handles it, just clear any inline overrides */
        panel.style.top = '';
        panel.style.right = '';
        panel.style.left = '';
        panel.style.bottom = '';
        return;
      }

      /* Drop the panel just underneath the trigger, right edges aligned.
         bottom MUST be set to auto - the stylesheet pins bottom:76px for the
         floating button, and a fixed element with both top and bottom set
         stretches to fill the viewport instead of hugging its content.

         Measure against documentElement.clientWidth / clientHeight, NOT
         innerWidth / innerHeight. This panel is position:fixed, so its
         containing block is the viewport WITHOUT the classic scrollbar.
         innerWidth includes the scrollbar (800 vs 785 on a 15px-scrollbar
         screen), so clamping against it lets the panel sit up to one
         scrollbar-width off the left edge. */
      var vw = document.documentElement.clientWidth || window.innerWidth;
      var vh = document.documentElement.clientHeight || window.innerHeight;
      var w = panel.offsetWidth || 268;
      var h = panel.offsetHeight || 300;
      var top = r.bottom + 8;
      var right = vw - r.right;

      /* keep it on screen */
      if (right < 12) right = 12;
      if (right + w > vw - 12) right = vw - w - 12;
      if (right < 12) right = 12;
      /* if there is no room below, sit it above the button instead */
      if (top + h > vh - 12 && r.top - 8 - h > 12) {
        top = r.top - 8 - h;
      }
      if (top < 12) top = 12;

      /* Hard clamp on both axes. The trigger can sit anywhere in a long
         document - an inline link in an article, a footer link - and this
         panel is position:fixed, so a rect taken from an off-screen trigger
         would place it thousands of pixels outside the viewport. The logic
         above assumes the trigger is on screen; this guarantees the result
         is, whatever happened above. */
      var clampH = h;
      var clampW = w;
      if (top < 12) top = 12;
      if (top + clampH > vh - 12) top = vh - clampH - 12;
      if (top < 12) top = 12;
      if (right < 12) right = 12;
      if (right + clampW > vw - 12) right = vw - clampW - 12;
      if (right < 12) right = 12;

      panel.style.bottom = 'auto';
      panel.style.top = Math.round(top) + 'px';
      panel.style.right = Math.round(right) + 'px';
      panel.style.left = '';
    }

    function open(trigger) {
      current = trigger;
      isOpen = true;
      place();
      panel.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      var first = panel.querySelector('.wa-choose-item');
      if (first) first.focus();
    }

    /* Always return focus to the button that opened the panel. Relying on
       document.activeElement is unreliable: a click not started from the
       keyboard leaves the active element as <body>. */
    function closePanel(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('is-open');
      if (current) current.setAttribute('aria-expanded', 'false');
      if (returnFocus && current && typeof current.focus === 'function') current.focus();
      current = null;
    }

    triggers.forEach(function (btn) {
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-expanded', 'false');
      /* Only give icon-only buttons a generic accessible name. Overriding a
         link that already has visible text - e.g. "WhatsApp Karim" - would hide
         that text from screen readers. */
      if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
        btn.setAttribute('aria-label', t.open);
      }

      btn.addEventListener('click', function (e) {
        /* Let modified clicks (new tab) behave normally.
           Test for a real non-primary button instead of comparing to 0,
           because some engines send button as undefined on synthetic clicks,
           which would silently disable the chooser. */
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (typeof e.button === 'number' && e.button !== 0) return;
        e.preventDefault();
        if (isOpen && current === btn) { closePanel(true); } else { open(btn); }
      });
    });

    /* ---- enquiry notification -------------------------------------------
       Fires once per choice, in the background, and NEVER blocks WhatsApp.
       sendBeacon is used rather than fetch because the tab navigates away to
       WhatsApp immediately afterwards, which would cancel a normal fetch.
       The response is deliberately ignored: if /api/enquiry is missing, the
       key is unset or Resend is down, the visitor still reaches WhatsApp. */
    var ENQUIRY_API = '/api/enquiry';
    /* The website cannot know who the visitor is. A wa.me link only opens
       WhatsApp phone-to-phone; nothing is ever reported back to us. So the
       client is asked once, briefly, and only then WhatsApp opens.
       The form is NOT a gate: Skip, Escape, a failed request and a closed
       panel all still land the client in WhatsApp. */
    var FORM_COPY = {
      en: {
        title: 'Almost there',
        name: 'Your name',
        phone: 'Phone or WhatsApp number',
        go: 'Open WhatsApp',
        skip: 'Skip - just open WhatsApp',
        who: 'Chatting with',
        hint: 'So we know who we are speaking to. Country is detected automatically.'
      },
      fr: {
        title: 'Presque terminé',
        name: 'Votre nom',
        phone: 'Téléphone ou numéro WhatsApp',
        go: 'Ouvrir WhatsApp',
        skip: 'Passer - ouvrir WhatsApp directement',
        who: 'Vous discutez avec',
        hint: 'Pour savoir avec qui nous parlons. Le pays est détecté automatiquement.'
      },
      es: {
        title: 'Casi listo',
        name: 'Tu nombre',
        phone: 'Teléfono o número de WhatsApp',
        go: 'Abrir WhatsApp',
        skip: 'Saltar - abrir WhatsApp directamente',
        who: 'Chateas con',
        hint: 'Para saber con quién hablamos. El país se detecta automáticamente.'
      }
    };

    function notify(who, name, phone) {
      try {
        var payload = JSON.stringify({
          person: who,
          name: name || '',
          phone: phone || '',
          page: location.pathname,
          ref: document.referrer ? document.referrer.slice(0, 120) : ''
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(ENQUIRY_API,
            new Blob([payload], { type: 'text/plain;charset=UTF-8' }));
        } else if (window.fetch) {
          window.fetch(ENQUIRY_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          })['catch'](function () {});
        }
      } catch (e) { /* never let reporting break WhatsApp */ }
    }

    function waHref(number, name) {
      var msg = 'Hi'
        + (name ? ', I am ' + name : '')
        + '. I would like to plan a Morocco trip.'
        + ' (via abridmorocco.com' + location.pathname + ')';
      return 'https://wa.me/' + number + '?text=' + encodeURIComponent(msg);
    }

    function openForm(item) {
      var who = item.getAttribute('data-person');
      var number = item.getAttribute('href').split('?')[0].split('/').pop();
      var whoName = (item.querySelector('.wa-choose-name') || {}).textContent || '';
      var c = FORM_COPY[lang] || FORM_COPY.en;

      panel.innerHTML = '';
      panel.classList.add('wa-choose-form');

      var h = document.createElement('div');
      h.className = 'wa-choose-title';
      h.textContent = c.title;
      panel.appendChild(h);

      var whoLine = document.createElement('p');
      whoLine.className = 'wa-choose-who-line';
      whoLine.textContent = c.who + ' ' + whoName;
      panel.appendChild(whoLine);

      var f = document.createElement('form');
      f.setAttribute('novalidate', 'novalidate');

      var l1 = document.createElement('label');
      l1.setAttribute('for', 'waName');
      l1.textContent = c.name;
      var i1 = document.createElement('input');
      i1.id = 'waName';
      i1.name = 'name';
      i1.type = 'text';
      i1.autocomplete = 'name';
      i1.maxLength = 80;
      i1.placeholder = c.name;
      f.appendChild(l1);
      f.appendChild(i1);

      var l2 = document.createElement('label');
      l2.setAttribute('for', 'waPhone');
      l2.textContent = c.phone;
      var i2 = document.createElement('input');
      i2.id = 'waPhone';
      i2.name = 'phone';
      i2.type = 'tel';
      i2.autocomplete = 'tel';
      i2.maxLength = 25;
      i2.inputMode = 'tel';
      i2.placeholder = c.phone;
      f.appendChild(l2);
      f.appendChild(i2);

      var hint = document.createElement('p');
      hint.className = 'wa-choose-note';
      hint.textContent = c.hint;
      f.appendChild(hint);

      var go = document.createElement('button');
      go.type = 'submit';
      go.className = 'wa-choose-go';
      go.textContent = c.go;
      f.appendChild(go);

      var skip = document.createElement('button');
      skip.type = 'button';
      skip.className = 'wa-choose-skip';
      skip.textContent = c.skip;
      f.appendChild(skip);

      panel.appendChild(f);

      function goWhatsApp() {
        var n = (i1.value || '').trim().slice(0, 80);
        var p = (i2.value || '').trim().slice(0, 25);
        notify(who, n, p);
        window.location.href = waHref(number, n);
      }

      f.addEventListener('submit', function (e) {
        e.preventDefault();
        goWhatsApp();
      });
      skip.addEventListener('click', function () {
        notify(who, '', '');
        window.location.href = waHref(number, '');
      });

      if (i1.focus) i1.focus();
    }

    panel.addEventListener('click', function (ev) {
      var item = ev.target && ev.target.closest
        ? ev.target.closest('.wa-choose-item') : null;
      if (!item) return;
      /* stop the link opening yet - the form asks first. Skip and Submit
         navigate themselves, so the client is never trapped here. */
      ev.preventDefault();
      openForm(item);
    });

    closeBtn.addEventListener('click', function () { closePanel(true); });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { closePanel(true); return; }
      /* Keep Tab inside the panel while it is open */
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('button, a[href]');
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      if (panel.contains(e.target)) return;
      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].contains(e.target)) return;
      }
      closePanel(false);
    });

    /* the header button moves with the page, so follow it */
    var ticking = false;
    function onMove() {
      if (!isOpen) return;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        place();
      });
    }
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', function () {
      if (!isOpen) { closePanel(false); return; }
      /* if the trigger vanished (e.g. nav collapsed), just close */
      if (current && !document.contains(current)) { closePanel(false); return; }
      place();
    });
  })();
