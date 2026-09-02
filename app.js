/* ---------------------------------------------------------------
   Page logic. Reads content.json and builds the page from it.
   You normally won't need to edit this file — change content.json.
   --------------------------------------------------------------- */

(function () {
  'use strict';

  var state = { content: null, choice: null, maybes: {} };

  // ---- small helpers -------------------------------------------------

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(id) { return document.getElementById(id); }
  function has(v) { return typeof v === 'string' && v.trim() !== ''; }

  function bootFail(msg) {
    $('boot-msg').textContent = msg;
    $('boot-error').hidden = false;
  }

  // ---- load ----------------------------------------------------------

  fetch('content.json?v=' + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error('content.json returned HTTP ' + r.status);
      return r.text();
    })
    .then(function (text) {
      var data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('content.json is not valid JSON: ' + e.message);
      }
      state.content = data;
      render(data);
    })
    .catch(function (e) { bootFail(e.message); });

  // ---- render --------------------------------------------------------

  function render(c) {
    var site = c.site || {};
    var form = c.form || {};
    var tours = Array.isArray(c.tours) ? c.tours : [];

    if (has(site.accentColor)) {
      var a = site.accentColor.trim();
      document.documentElement.style.setProperty('--accent', a);
      document.documentElement.style.setProperty('--accent-soft', hexA(a, 0.08));
      document.documentElement.style.setProperty('--accent-line', hexA(a, 0.22));
    }

    document.title = (has(site.headline) ? site.headline : 'Visits') +
      (has(site.organization) ? ' — ' + site.organization : '');

    $('eyebrow').textContent = site.eyebrow || '';
    $('headline').textContent = site.headline || '';
    $('intro').textContent = site.intro || '';

    if (has(site.heroImage)) {
      var hero = $('hero');
      hero.classList.add('has-image');
      hero.style.backgroundImage = 'url("' + site.heroImage.replace(/"/g, '') + '")';
    }

    $('closing').textContent = site.closingNote || '';
    var contact = $('contact');
    if (has(site.contactEmail)) {
      contact.href = 'mailto:' + site.contactEmail;
      contact.textContent = site.contactEmail;
    } else {
      contact.parentNode.hidden = true;
    }

    // form field visibility / labels
    if (form.askForGuestCount === false) $('row-extra').hidden = true;
    if (form.askForNotes === false) {
      $('lbl-notes').hidden = true;
    } else if (has(form.notesLabel)) {
      $('lbl-notes').childNodes[0].nodeValue = form.notesLabel + ' ';
    }
    $('fineprint').textContent = has(form.endpoint)
      ? ''
      : 'Heads up: responses aren’t being collected yet — the form isn’t connected to the spreadsheet.';

    // cards
    var grid = $('grid');
    if (!tours.length) {
      grid.innerHTML = '<p style="color:var(--ink-3)">No visits listed yet.</p>';
      return;
    }
    grid.innerHTML = tours.map(card).join('');
    grid.addEventListener('click', onGridClick);
    grid.addEventListener('change', onGridChange);

    $('form').addEventListener('submit', onSubmit);
  }

  function card(t, i) {
    var id = has(t.id) ? t.id : 'tour-' + (i + 1);
    var thumb = has(t.image)
      ? '<img src="' + esc(t.image) + '" alt="' + esc(t.imageAlt || t.title || '') + '" loading="lazy">'
      : '<div class="thumb-empty">Add a photo in content.json</div>';

    var meta = [];
    if (has(t.time)) meta.push('<span>' + esc(t.time) + '</span>');
    if (has(t.location)) meta.push('<span>' + esc(t.location) + '</span>');
    if (has(t.capacity)) meta.push('<span>' + esc(t.capacity) + '</span>');

    var hl = Array.isArray(t.highlights) && t.highlights.length
      ? '<ul class="highlights">' + t.highlights.map(function (h) {
          return '<li>' + esc(h) + '</li>';
        }).join('') + '</ul>'
      : '';

    return '' +
      '<article class="tour" role="listitem" data-id="' + esc(id) + '" data-title="' + esc(t.title || id) + '">' +
        '<div class="thumb">' + thumb +
          (has(t.date) ? '<div class="datechip">' + esc(t.date) + '</div>' : '') +
        '</div>' +
        '<div class="tour-body">' +
          '<h3>' + esc(t.title || 'Untitled visit') + '</h3>' +
          (meta.length ? '<p class="meta">' + meta.join('') + '</p>' : '') +
          (has(t.summary) ? '<p class="summary">' + esc(t.summary) + '</p>' : '') +
          hl +
          (has(t.hostedBy) ? '<p class="host">Hosted by <strong>' + esc(t.hostedBy) + '</strong></p>' : '') +
        '</div>' +
        '<div class="tour-actions">' +
          '<button type="button" class="pick">This is my first choice</button>' +
          '<label class="maybe"><input type="checkbox" class="maybe-box"> I’d consider this one too</label>' +
        '</div>' +
      '</article>';
  }

  // ---- selection -----------------------------------------------------

  function onGridClick(e) {
    var btn = e.target.closest('.pick');
    if (!btn) return;
    var el = btn.closest('.tour');
    var id = el.dataset.id;

    if (state.choice === id) {
      state.choice = null;
    } else {
      state.choice = id;
      delete state.maybes[id];
      var box = el.querySelector('.maybe-box');
      if (box) box.checked = false;
    }
    syncCards();
    updateChosen();
  }

  function onGridChange(e) {
    if (!e.target.classList.contains('maybe-box')) return;
    var el = e.target.closest('.tour');
    var id = el.dataset.id;
    if (e.target.checked) state.maybes[id] = el.dataset.title;
    else delete state.maybes[id];
    updateChosen();
  }

  function syncCards() {
    document.querySelectorAll('.tour').forEach(function (el) {
      var on = el.dataset.id === state.choice;
      el.classList.toggle('selected', on);
      el.querySelector('.pick').textContent = on ? '✓ Your first choice' : 'This is my first choice';
    });
  }

  function titleOf(id) {
    var el = document.querySelector('.tour[data-id="' + id + '"]');
    return el ? el.dataset.title : id;
  }

  function updateChosen() {
    var box = $('chosen');
    if (!state.choice) {
      box.className = 'chosen';
      box.innerHTML = '<span class="chosen-empty">No visit selected yet — choose one above.</span>';
      return;
    }
    var also = Object.keys(state.maybes);
    box.className = 'chosen filled';
    box.innerHTML = 'First choice: <strong>' + esc(titleOf(state.choice)) + '</strong>' +
      (also.length
        ? '<span class="also">Also open to: ' + also.map(function (i) { return esc(state.maybes[i]); }).join(', ') + '</span>'
        : '');
  }

  // ---- submit --------------------------------------------------------

  function onSubmit(e) {
    e.preventDefault();
    var form = state.content.form || {};
    var err = $('err');
    err.hidden = true;

    var name = $('f-name').value.trim();
    var email = $('f-email').value.trim();

    if (!state.choice) return fail('Please choose a first choice above before sending.');
    if (!name) return fail('Please add your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please add a valid email address.');

    var also = Object.keys(state.maybes).map(function (i) { return state.maybes[i]; });

    var payload = {
      submittedAt: new Date().toISOString(),
      name: name,
      email: email,
      guests: $('row-extra').hidden ? '' : $('f-guests').value,
      firstChoiceId: state.choice,
      firstChoice: titleOf(state.choice),
      alsoInterested: also.join('; '),
      notes: $('lbl-notes').hidden ? '' : $('f-notes').value.trim(),
      page: location.href
    };

    if (!has(form.endpoint)) {
      return fail('This form isn’t connected to the spreadsheet yet, so nothing was sent. ' +
        (has((state.content.site || {}).contactEmail)
          ? 'Please email ' + state.content.site.contactEmail + ' instead.'
          : ''));
    }

    var btn = $('submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    post(form.endpoint, payload)
      .then(function () { showDone(form); })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Send my preference';
        fail('Something went wrong sending that. Please try again, or email us directly.');
      });

    function fail(msg) {
      err.textContent = msg;
      err.hidden = false;
      err.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
  }

  // Apps Script accepts a plain-text body, which avoids a CORS preflight.
  // If the browser still blocks reading the response, retry opaquely.
  function post(url, payload) {
    var body = JSON.stringify(payload);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body,
      redirect: 'follow'
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return true;
    }).catch(function () {
      return fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body
      }).then(function () { return true; });
    });
  }

  function showDone(form) {
    $('form').hidden = true;
    $('chosen').hidden = true;
    $('done-h').textContent = form.successHeadline || 'Thank you — we’ve got it.';
    $('done-b').textContent = form.successBody || 'We’ll be in touch soon.';
    $('done').hidden = false;
    $('rsvp').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---- color helper --------------------------------------------------

  function hexA(hex, alpha) {
    var h = hex.replace('#', '').trim();
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return 'rgba(31,111,92,' + alpha + ')';
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
  }
})();
