(function () {
  var btn = document.getElementById("btnInstalar");
  if (!btn) return;

  var ua = navigator.userAgent.toLowerCase();
  var iOS =
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var standalone =
    window.matchMedia && matchMedia("(display-mode: standalone)").matches;

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

  btn.style.display = "inline-block";
  btn.textContent = iOS ? "Instalar en iPhone" : "Instalar app";

  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    btn.textContent = "Instalar Tunguis Games";
    btn.onclick = function () {
      deferred.prompt();
      deferred.userChoice.then(function (c) {
        if (c.outcome === "accepted") instalada();
        deferred = null;
      });
    };
  });

  btn.onclick = function () {
    if (iOS) {
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
      return;
    }
    btn.textContent = "Menú (⋮) → 'Instalar app' o 'Añadir a pantalla de inicio'";
  };
})();