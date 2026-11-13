/* The web entry is deliberately outside /join/* universal links: older installed
 * apps understand ourpins://join/CODE but cannot parse the new query URL. */
(function () {
  'use strict';
  var codes = new URLSearchParams(location.search).getAll('code');
  var code = codes.length === 1 ? codes[0] : '';
  if (!/^[A-Za-z0-9]{6,64}$/.test(code)) {
    var invalid = document.getElementById('invite-invalid');
    invalid.hidden = false;
    document.getElementById('invite-title').textContent = invalid.dataset.title;
    document.getElementById('invite-description').textContent = invalid.dataset.description;
    return;
  }
  document.getElementById('invite-valid').hidden = false;
  document.getElementById('invite-code').textContent = code.toUpperCase();
  document.getElementById('invite-open').setAttribute('href', 'ourpins://join/' + code.toUpperCase());
  var ua = navigator.userAgent || '';
  var mobile = /iPad|iPhone|iPod|Android/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  document.getElementById('invite-open').hidden = !mobile;
  document.getElementById('invite-desktop').hidden = mobile;
  document.getElementById('invite-line').hidden = !/Line\//i.test(ua);
  // Never infer installation from a timer or redirect to a store automatically.
  // Only an explicit tap opens the app, and joining is confirmed inside the app.
})();
