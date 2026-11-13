document.getElementById('y').textContent = new Date().getFullYear();

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The room drifts up slower than the page, so scrolling feels like walking through the apartment.
// The photo is 130% of the screen height; over the whole page it travels the spare 30%.
// Only a GPU transform changes per frame, which keeps it smooth on iPhone.
(function () {
  var img = document.getElementById('room-img');
  if (!img || reduceMotion) return;
  var ticking = false;
  function place() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    img.style.transform = 'translate3d(0,' + (-p * 23.07).toFixed(3) + '%,0)';
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(place); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  place();
})();

// Looping character clips: play only while on screen. If a clip file is missing, the still stays.
(function () {
  var vids = document.querySelectorAll('video.loop');
  if (!vids.length || !('IntersectionObserver' in window) || reduceMotion) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.4 });
  vids.forEach(function (v) { io.observe(v); });
})();

// Contact form. Paste a form endpoint (for example a Formspree URL) into FORM_ENDPOINT to connect it to an inbox.
var FORM_ENDPOINT = 'https://formspree.io/f/mdegkwql';
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  function say(t) { status.textContent = t; status.hidden = false; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), note = form.elements.message.value.trim();
    if (!name || !note || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { say('Please add your name, a valid email and a note.'); return; }
    if (!FORM_ENDPOINT) { say('This form is not connected to an inbox yet. Please DM @petes_creates on Instagram for now.'); return; }
    var btn = form.querySelector('button'); btn.disabled = true; say('Sending...');
    fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: name, email: email, message: note }) })
      .then(function (r) { if (!r.ok) throw new Error(); form.reset(); say('Sent. Thanks, ' + name + '. I will reply by email.'); })
      .catch(function () { say('That did not send. Please try again, or DM @petes_creates on Instagram.'); })
      .then(function () { btn.disabled = false; });
  });
})();
