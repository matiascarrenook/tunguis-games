(function () {
  var btn = document.getElementById("btnInstalar");
  if (!btn) return;
  var msj = document.getElementById("instalarMsj");

  function aviso(texto) {
    if (msj) {
      msj.textContent = texto;
      msj.hidden = false;
    }
  }

  var ua = navigator.userAgent.toLowerCase();
  var iOS =
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var standalone =
    window.matchMedia && matchMedia("(display-mode: standalone)").matches;

  function instalada() {
    btn.textContent = "✓ Instalada";
    btn.disabled = true;
    btn.classList.add("ok");
    if (msj) msj.hidden = true;
  }

  window.addEventListener("appinstalled", instalada);

  if (standalone) {
    instalada();
    return;
  }

  btn.style.display = "inline-block";

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

  btn.onclick = function () {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function (c) {
        if (c.outcome === "accepted") instalada();
        deferred = null;
      });
      return;
    }
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
        aviso("Safari → Compartir → «Añadir a pantalla de inicio»");
      }
      return;
    }
    aviso("Si no aparece la instalación, usá el menú (⋮) → «Instalar app» o «Añadir a pantalla de inicio».");
  };
})();