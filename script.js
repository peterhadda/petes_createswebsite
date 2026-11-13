document.getElementById('y').textContent = new Date().getFullYear();

// Looping character clips: play only while on screen, and not for reduced-motion users.
// If a clip file is missing, the poster still stays visible.
(function () {
  var vids = document.querySelectorAll('video.loop');
  if (!vids.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.4 });
  vids.forEach(function (v) { io.observe(v); });
})();
