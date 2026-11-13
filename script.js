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
