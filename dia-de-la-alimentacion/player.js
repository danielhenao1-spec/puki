/* ==========================================================================
   Día de la Alimentación — reproductor secuencial en bucle
   Dos etiquetas <video> (doble buffer) para que el cambio sea instantáneo:
   mientras una reproduce, la otra precarga el siguiente clip.
   ========================================================================== */

(() => {
  "use strict";

  /** Playlist editable. Si agregas o quitas clips, actualiza esta lista. */
  const SOURCES = [
    "fuentes/1.mp4",
    "fuentes/2.mp4",
    "fuentes/3.mp4",
  ];

  const CROSSFADE_MS = 180;

  const elements = [
    document.getElementById("video-a"),
    document.getElementById("video-b"),
  ];

  const statusEl = document.getElementById("status");
  const curtain = document.getElementById("curtain");
  const hint = document.getElementById("hint");

  if (elements.some((el) => !el) || !statusEl || !curtain || !hint) {
    console.warn("[player] Faltan elementos del reproductor en el DOM.");
    return;
  }

  const buffers = elements.map((el, slot) => ({
    el,
    slot,
    srcIndex: -1,
    failed: false,
  }));

  const failedSources = new Set();

  let activeSlot = 0;
  let currentIndex = 0;
  let switching = false;
  let hasStarted = false;
  let gestureArmed = false;

  elements.forEach(configureVideo);

  boot();

  /* ---------------------------------------------------------------------- */
  /* Configuración                                                          */
  /* ---------------------------------------------------------------------- */

  function configureVideo(el) {
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.controls = false;
    el.autoplay = false;
    el.loop = false;
    el.playsInline = true;

    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.setAttribute("disablepictureinpicture", "");
    el.setAttribute("disableremoteplayback", "");
    el.setAttribute("tabindex", "-1");
    el.setAttribute("aria-hidden", "true");

    el.addEventListener("contextmenu", (event) => event.preventDefault());
    el.addEventListener("ended", () => advance());
    el.addEventListener("error", () => handleSourceError(el));
    el.addEventListener("playing", () => {
      if (buffers[activeSlot].el === el) reveal();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Arranque                                                               */
  /* ---------------------------------------------------------------------- */

  async function boot() {
    loadBuffer(buffers[0], 0);
    loadBuffer(buffers[1], 1);

    const ready = await waitUntilPlayable(buffers[0].el, 8000);
    if (!ready) {
      if (buffers[0].el.error) failedSources.add(0);
      armGestureFallback("No se pudo cargar el primer video. Toca para reintentar.");
      return;
    }

    buffers[0].el.classList.add("is-active");
    const started = await playBuffer(buffers[0]);

    if (started) {
      reveal();
    } else {
      armGestureFallback("Toca la pantalla para comenzar");
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Transición entre clips (evento `ended`)                                */
  /* ---------------------------------------------------------------------- */

  async function advance() {
    if (switching) return;
    switching = true;

    try {
      const nextIndex = nextPlayableIndex(currentIndex);
      if (nextIndex === -1) {
        fail("No se encontraron videos disponibles.");
        return;
      }

      const next = buffers[1 - activeSlot];

      if (next.srcIndex !== nextIndex || next.failed) {
        loadBuffer(next, nextIndex);
      }

      if (next.el.readyState < 3) {
        const ready = await waitUntilPlayable(next.el, 6000);
        if (!ready) {
          failedSources.add(nextIndex);
          next.failed = true;
          switching = false;
          return advance();
        }
      }

      // El clip precargado puede estar al final: vuelve al inicio antes de entrar.
      try {
        next.el.currentTime = 0;
      } catch {
        /* metadata aún no disponible; play() lo resolverá */
      }

      const started = await playBuffer(next);
      if (!started) {
        armGestureFallback("Toca la pantalla para continuar");
        return;
      }

      const outgoing = buffers[activeSlot];

      // Doble buffer: el siguiente ya está decodificado, así que el cambio
      // ocurre sobre un fotograma listo (nunca una pantalla negra).
      next.el.classList.add("is-active");
      outgoing.el.classList.remove("is-active");

      activeSlot = 1 - activeSlot;
      currentIndex = nextIndex;

      if (!hasStarted) reveal();
      announce();

      const previous = outgoing;
      window.setTimeout(() => {
        previous.el.pause();
        try {
          previous.el.currentTime = 0;
        } catch {
          /* ignora */
        }

        // Deja cargado el clip que seguirá, mientras el actual reproduce.
        const upcoming = nextPlayableIndex(currentIndex);
        if (upcoming !== -1 && previous.srcIndex !== upcoming) {
          loadBuffer(previous, upcoming);
        }
      }, CROSSFADE_MS + 80);
    } finally {
      switching = false;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Utilidades                                                             */
  /* ---------------------------------------------------------------------- */

  function nextPlayableIndex(from) {
    for (let step = 1; step <= SOURCES.length; step += 1) {
      const candidate = (from + step) % SOURCES.length;
      if (candidate === from) break;
      if (!failedSources.has(candidate)) return candidate;
    }
    return -1;
  }

  function loadBuffer(buffer, index) {
    buffer.srcIndex = index;
    buffer.failed = false;

    const el = buffer.el;
    el.classList.remove("is-active");
    el.src = SOURCES[index];
    el.load();
  }

  function waitUntilPlayable(el, timeoutMs) {
    if (el.error) return Promise.resolve(false);
    if (el.readyState >= 3) return Promise.resolve(true);

    return new Promise((resolve) => {
      let settled = false;

      const finish = (value) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        el.removeEventListener("canplay", onReady);
        el.removeEventListener("loadeddata", onReady);
        el.removeEventListener("error", onError);
        resolve(value);
      };

      const onReady = () => finish(true);
      const onError = () => finish(false);
      const timer = window.setTimeout(() => finish(false), timeoutMs);

      el.addEventListener("canplay", onReady);
      el.addEventListener("loadeddata", onReady);
      el.addEventListener("error", onError, { once: true });
    });
  }

  async function playBuffer(buffer) {
    const el = buffer.el;
    el.muted = true;
    el.volume = 0;

    try {
      await el.play();
      return !el.paused;
    } catch (error) {
      console.warn("[player] No se pudo reproducir el video:", error);
      return false;
    }
  }

  function handleSourceError(el) {
    const buffer = buffers.find((item) => item.el === el);
    if (!buffer || buffer.srcIndex < 0 || !el.error) return;

    failedSources.add(buffer.srcIndex);
    buffer.failed = true;
    console.warn(`[player] No se pudo cargar "${SOURCES[buffer.srcIndex]}".`);

    if (buffer === buffers[activeSlot] && hasStarted) {
      currentIndex = buffer.srcIndex;
      window.setTimeout(advance, 80);
    }
  }

  function reveal() {
    if (hasStarted) return;
    hasStarted = true;
    curtain.classList.add("is-hidden");
    curtain.classList.remove("is-waiting");
    announce();
  }

  function announce() {
    statusEl.textContent =
      `Reproduciendo video ${currentIndex + 1} de ${SOURCES.length}`;
  }

  function fail(message) {
    hint.textContent = message;
    curtain.classList.remove("is-hidden");
    curtain.classList.add("is-waiting");
  }

  /* Si el navegador bloquea el autoplay, el primer toque reanuda la emisión. */
  function armGestureFallback(message) {
    if (gestureArmed) return;
    gestureArmed = true;

    hint.textContent = message || "Toca la pantalla para comenzar";
    curtain.classList.remove("is-hidden");
    curtain.classList.add("is-waiting");

    const unlock = async () => {
      const buffer = buffers[activeSlot];
      buffer.el.classList.add("is-active");
      const started = await playBuffer(buffer);

      if (started) {
        detach();
        reveal();
      }
    };

    const detach = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
      gestureArmed = false;
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
  }

  /* Al volver de segundo plano, retoma sin reiniciar la playlist. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden || !hasStarted) return;

    const el = buffers[activeSlot].el;
    if (el.ended) {
      advance();
    } else if (el.paused) {
      playBuffer(buffers[activeSlot]);
    }
  });

  window.addEventListener("pageshow", () => {
    if (!hasStarted) return;
    const el = buffers[activeSlot].el;
    if (el.paused && !el.ended) playBuffer(buffers[activeSlot]);
  });

  // Red de seguridad: si a los 9 s nada se reprodujo, muestra el aviso táctil.
  window.setTimeout(() => {
    if (!hasStarted) armGestureFallback("Toca la pantalla si el video no inicia");
  }, 9000);
})();
