(function () {
  function ensureAnimeStart() {
    if (document.body.classList.contains('anime-start')) return;
    var ht = document.querySelector('.hero-title');
    if (ht && !ht.classList.contains('is-ready')) {
      ht.style.visibility = 'visible';
      ht.classList.add('is-ready', 'is-visible', 'animation-finished');
    }
    document.body.classList.add('anime-start');
  }
  // Primary: fire 2.5s after load — gives loader.js plenty of time first
  window.addEventListener('load', function () { setTimeout(ensureAnimeStart, 2500); });
  // Hard stop: fire at 5s regardless (covers slow font loads)
  setTimeout(ensureAnimeStart, 5000);
})();
