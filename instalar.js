(function () {
  var btn = document.getElementById("btnInstalar");
  if (!btn) return;

  var iOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  var standalone = window.matchMedia && matchMedia("(display-mode: standalone)").matches;

  function instalada() {
    btn.textContent = "✓ Tunguis Games instalada";
    btn.disabled = true;
    btn.classList.add("ok");
  }

  window.addEventListener("appinstalled", instalada);

  if (standalone) {
    instalada();
    return;
  }

  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    btn.onclick = function () {
      deferred.prompt();
      deferred.userChoice.then(function (c) {
        if (c.outcome === "accepted") instalada();
        deferred = null;
      });
    };
  });

  if (iOS) {
    btn.onclick = function () {
      var url = location.href.split("?")[0];
      if (navigator.share) {
        navigator
          .share({
            title: "Tunguis Games",
            text: "Instalá Tunguis Games: emulador Pokémon con tus juegos.",
            url: url
          })
          .catch(function () {});
      } else {
        btn.textContent = "Safari → Compartir → Añadir a pantalla de inicio";
      }
    };
  }
})();