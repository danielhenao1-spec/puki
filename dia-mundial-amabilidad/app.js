/* =========================================================
   Día Mundial de la Amabilidad · Escuela Puki
   Lógica de la experiencia interactiva.
   ========================================================= */

(() => {
  "use strict";

  const SOUND_KEY = "puki-amabilidad-sound";
  const INTRO_HINT = "Toca un orbe para comenzar";

  const VALUES = {
    transito: {
      name: "Saludar al personal de tránsito",
      copy: "¡Saludar alegra el día de quienes nos cuidan!",
    },
    limpieza: {
      name: "Saludar al personal de limpieza",
      copy: "¡Un «gracias» hace brillar a todo el equipo!",
    },
    cortesia: {
      name: "Pedir por favor y dar las gracias",
      copy: "«Por favor» y «gracias» son magia amable.",
    },
    abrazo: {
      name: "Dar un abrazo suave",
      copy: "Un abrazo suavecito calienta el corazón.",
    },
    juguetes: {
      name: "Compartir juguetes",
      copy: "¡Compartir multiplica la diversión!",
    },
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const stage = $("#stage");
  const missionCard = $("#missionCard");
  const missionCopy = $("#missionCopy");
  const missionProgress = $("#missionProgress");
  const missionDots = $$("#missionDots span");
  const progressCount = $("#progressCount");
  const heartWindow = $("#heartWindow");
  const heartLights = $$(".heart-light");
  const orbDock = $(".orb-dock");
  const orbs = $$(".orb");
  const orbHint = $("#orbHint");
  const hintText = $("#hintText") || orbHint;
  const climaxTitle = $("#climaxTitle");
  const confetti = $("#confetti");
  const toast = $("#toast");
  const liveRegion = $("#liveRegion");
  const soundButton = $("#soundButton");
  const fullscreenButton = $("#fullscreenButton");
  const installButton = $("#installButton");
  const resetButton = $("#resetButton");
  const replayButton = $("#replayButton");
  const missionDone = $("#missionDone");

  const portalVideos = {
    idle: $("#videoIdle"),
    happy: $("#videoHappy"),
    transform: $("#videoTransform"),
    superhero: $("#videoSuperhero"),
  };

  const orbVideos = new Map(
    orbs.map((orb) => [orb, $(".orb-video", orb)])
  );

  const state = {
    lit: new Set(),
    activeOrb: null,
    portalState: "idle",
    transforming: false,
    completed: false,
    sound: readSoundPreference(),
    audioUnlocked: false,
    transformToken: 0,
    toastTimer: null,
    climaxTimer: null,
    confettiTimer: null,
    announceTimer: null,
    transformEndedHandler: null,
    transformErrorHandler: null,
    deferredInstallPrompt: null,
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------
     Preparación
     --------------------------------------------------------- */

  function readSoundPreference() {
    try {
      return localStorage.getItem(SOUND_KEY) !== "off";
    } catch {
      return true;
    }
  }

  function saveSoundPreference(value) {
    try {
      localStorage.setItem(SOUND_KEY, value ? "on" : "off");
    } catch {
      /* El modo privado puede bloquear el almacenamiento. */
    }
  }

  function configureVideos() {
    portalVideos.idle.muted = true;
    portalVideos.idle.loop = true;
    portalVideos.happy.loop = false;
    portalVideos.happy.muted = true;
    portalVideos.transform.loop = false;
    portalVideos.transform.muted = true;
    portalVideos.superhero.loop = true;
    portalVideos.superhero.muted = true;

    // Los cuatro estados de Yellow llevan audio. El primer toque en la página
    // desbloquea el sonido; hasta entonces se mantienen silenciosos para que
    // el autoplay no sea bloqueado por el navegador.
    Object.values(portalVideos).forEach((video) => {
      video.playsInline = true;
      video.volume = 1;
      video.addEventListener("contextmenu", (event) => event.preventDefault());
    });

    orbVideos.forEach((video) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.addEventListener("contextmenu", (event) => event.preventDefault());
    });
  }

  function startIdle() {
    showPortal("idle", { restart: false });
  }

  function showPortal(name, { restart = true } = {}) {
    const next = portalVideos[name];
    if (!next) return;

    Object.entries(portalVideos).forEach(([key, video]) => {
      if (key === name) return;
      video.classList.remove("is-active");
      video.pause();
      video.muted = true;
    });

    next.classList.add("is-active");
    next.loop = name === "idle" || name === "superhero";
    next.muted = !(state.sound && state.audioUnlocked);
    next.volume = 1;

    if (restart) {
      try {
        next.currentTime = 0;
      } catch {
        /* El video puede no tener metadatos todavía. */
      }
    }

    const playPromise = next.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Si el navegador bloquea el audio (por ejemplo, en Safari antes de
        // una interacción), el clip sigue viéndose aunque quede silenciado.
        if (!next.muted) {
          next.muted = true;
          next.play().catch(() => {});
        }
      });
    }

    state.portalState = name;
  }

  function pauseAllOrbVideos({ reset = false } = {}) {
    orbVideos.forEach((video) => {
      video.pause();
      video.muted = true;
      if (reset) {
        try {
          video.currentTime = 0;
        } catch {
          /* Sin metadatos todavía. */
        }
      }
    });
  }

  function playOrb(orb) {
    const video = orbVideos.get(orb);
    if (!video) return;

    orbVideos.forEach((otherVideo, otherOrb) => {
      if (otherOrb === orb) return;
      otherVideo.pause();
      otherVideo.muted = true;
      otherOrb.classList.remove("is-current");
    });

    orb.classList.add("is-current");
    video.muted = !(state.sound && state.audioUnlocked);
    try {
      video.currentTime = 0;
    } catch {
      /* Sin metadatos todavía. */
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Si el navegador no permite el audio, reproducimos al menos la imagen.
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    state.activeOrb = orb;
  }

  /* ---------------------------------------------------------
     Progreso
     --------------------------------------------------------- */

  function updateProgress() {
    const count = state.lit.size;
    const label = `${count} de 5 actos de amabilidad completados`;

    progressCount.textContent = String(count);
    missionProgress.setAttribute("aria-valuenow", String(count));
    missionProgress.setAttribute("aria-valuetext", label);

    heartWindow.style.setProperty("--lit", String(count));
    heartWindow.setAttribute("aria-valuenow", String(count));
    heartWindow.setAttribute(
      "aria-label",
      `Corazón de Yellow: ${count} de 5 luces encendidas`
    );
    heartWindow.classList.toggle("is-full", count === 5);
  }

  function lightOrb(orb, number, isNew) {
    if (isNew) {
      state.lit.add(number);
      orb.classList.add("is-lit");
      orb.setAttribute("aria-pressed", "true");
      missionDots[number - 1].classList.add("is-on");
      heartLights[number - 1].classList.add("is-on");
      updateProgress();
    }
  }

  function setHint(message) {
    if (hintText.id === "hintText") {
      hintText.textContent = message;
    } else {
      orbHint.textContent = message;
    }
  }

  function announce(message) {
    window.clearTimeout(state.announceTimer);
    liveRegion.textContent = "";
    state.announceTimer = window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 40);
  }

  function showToast(message, duration = 2800) {
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    state.toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, duration);
  }

  /* ---------------------------------------------------------
     Interacción con los orbes
     --------------------------------------------------------- */

  function handleOrbClick(event) {
    const orb = event.currentTarget;
    if (state.transforming || state.completed) return;

    // Este clic ya es una interacción válida: desde aquí todos los videos de
    // Yellow pueden reproducir su audio.
    state.audioUnlocked = true;

    const number = Number(orb.dataset.orb);
    const value = VALUES[orb.dataset.value];
    if (!value) return;

    const isNew = !state.lit.has(number);
    lightOrb(orb, number, isNew);
    playOrb(orb);

    if (!state.lit.size) return;

    const count = state.lit.size;

    if (count === 5) {
      setHint("La magia está sucediendo…");
      startFinale();
      announce(
        `¡Cinco actos de amabilidad! ${value.name}. Yellow está comenzando su transformación.`
      );
      return;
    }

    missionCopy.textContent = isNew
      ? value.copy
      : `¡Otra vez! ${value.copy}`;
    setHint(
      count === 1
        ? "¡Muy bien! Sigue descubriendo los orbes"
        : `${count} de 5 corazones brillan`
    );

    triggerHappy();
    announce(
      isNew
        ? `${value.name}. ${value.copy} Llevas ${count} de 5 actos de amabilidad.`
        : `Repetiste ${value.name}. Llevas ${count} de 5 actos de amabilidad.`
    );
  }

  function returnToIdleAfterHappy() {
    if (
      state.portalState !== "happy" ||
      state.transforming ||
      state.completed
    ) {
      return;
    }

    // La transición la dicta el final real del video (10.027 s), nunca un
    // temporizador de reloj que pueda adelantarse si la decodificación tarda.
    showPortal("idle", { restart: true });
  }

  function triggerHappy() {
    if (state.transforming || state.completed) return;

    portalVideos.happy.muted = true;
    portalVideos.happy.loop = false;
    showPortal("happy", { restart: true });
  }

  function bindHappyEnd() {
    portalVideos.happy.addEventListener("ended", returnToIdleAfterHappy);
  }

  /* ---------------------------------------------------------
     Clímax y transformación
     --------------------------------------------------------- */

  function startFinale() {
    if (state.transforming || state.completed) return;

    state.transforming = true;
    state.transformToken += 1;
    const token = state.transformToken;

    // El orbe final sigue en bucle, pero sin audio para dejar respirar
    // al sonido del momento de transformación de Yellow.
    const activeVideo = state.activeOrb ? orbVideos.get(state.activeOrb) : null;
    if (activeVideo) activeVideo.muted = true;

    stage.classList.add("is-transforming");
    climaxTitle.classList.remove("is-visible");

    showPortal("transform", { restart: true });

    const finish = () => finishFinale(token);

    state.transformEndedHandler = finish;
    portalVideos.transform.addEventListener("ended", finish, { once: true });

    state.transformErrorHandler = () => {
      if (!state.transforming) return;
      // Si el archivo no puede reproducirse, no dejamos a la clase atrapada.
      // Esto solo ocurre ante un error real de carga, no por duración.
      window.setTimeout(() => finishFinale(token), 700);
    };
    portalVideos.transform.addEventListener("error", state.transformErrorHandler, { once: true });
  }

  function finishFinale(token) {
    if (
      token !== state.transformToken ||
      state.completed ||
      !state.transforming
    ) {
      return;
    }

    state.transforming = false;
    state.completed = true;
    stage.classList.remove("is-transforming");
    stage.classList.add("is-complete");

    if (state.transformEndedHandler) {
      portalVideos.transform.removeEventListener(
        "ended",
        state.transformEndedHandler
      );
      state.transformEndedHandler = null;
    }
    if (state.transformErrorHandler) {
      portalVideos.transform.removeEventListener(
        "error",
        state.transformErrorHandler
      );
      state.transformErrorHandler = null;
    }

    // Pausamos los orbes para dejar todo el protagonismo al nuevo Yellow.
    pauseAllOrbVideos();

    showPortal("superhero", { restart: true });

    state.lit.add(5);
    updateProgress();

    orbs.forEach((orb) => {
      orb.classList.add("is-lit", "is-complete");
      orb.classList.remove("is-current");
      orb.setAttribute("aria-pressed", "true");
      orb.disabled = true;
    });
    orbDock.classList.add("is-complete");
    missionCard.classList.add("is-complete");
    missionCard.setAttribute("aria-labelledby", "doneTitle");
    missionDots.forEach((dot) => dot.classList.add("is-on"));
    heartLights.forEach((light) => light.classList.add("is-on"));
    setHint("¡El corazón de Yellow está lleno de amabilidad!");

    climaxTitle.classList.add("is-visible");
    window.clearTimeout(state.climaxTimer);
    state.climaxTimer = window.setTimeout(() => {
      climaxTitle.classList.remove("is-visible");
    }, 4200);

    launchConfetti();
    showToast("¡Misión cumplida! Yellow es un superhéroe de la amabilidad.", 4600);
    announce(
      "¡Misión cumplida! Yellow se ha transformado en un superhéroe de la amabilidad. Puedes jugar otra vez cuando quieras."
    );

    window.setTimeout(() => {
      if (state.completed) replayButton.focus({ preventScroll: true });
    }, 500);
  }

  function launchConfetti() {
    if (reducedMotion.matches) return;

    window.clearTimeout(state.confettiTimer);
    confetti.replaceChildren();

    const colors = ["#ffd447", "#ff8ebd", "#49c7ff", "#7bdb70", "#bf9bff", "#fff3bb", "#ff9d48"];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 46; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const color = colors[index % colors.length];
      const x = 3 + Math.random() * 94;
      const drift = (Math.random() * 22 - 11).toFixed(1);
      const duration = (4 + Math.random() * 2.8).toFixed(2);
      const delay = (Math.random() * 0.7).toFixed(2);
      const width = (0.28 + Math.random() * 0.34).toFixed(2);
      const height = (0.52 + Math.random() * 0.55).toFixed(2);
      const rotation = Math.round(Math.random() * 180);

      piece.style.setProperty("--x", `${x}%`);
      piece.style.setProperty("--c", color);
      piece.style.setProperty("--drift", `${drift}vw`);
      piece.style.setProperty("--dur", `${duration}s`);
      piece.style.setProperty("--delay", `${delay}s`);
      piece.style.setProperty("--w", `${width}cqw`);
      piece.style.setProperty("--h", `${height}cqw`);
      piece.style.setProperty("--rot", `${rotation}deg`);
      piece.style.setProperty(
        "--radius",
        Math.random() > 0.68 ? "50%" : "0.1cqw"
      );
      fragment.appendChild(piece);
    }

    confetti.appendChild(fragment);
    state.confettiTimer = window.setTimeout(() => {
      confetti.replaceChildren();
    }, 8500);
  }

  /* ---------------------------------------------------------
     Reinicio
     --------------------------------------------------------- */

  function resetActivity({ withToast = true } = {}) {
    const focusWasInDone = missionDone.contains(document.activeElement);

    window.clearTimeout(state.climaxTimer);
    window.clearTimeout(state.confettiTimer);
    window.clearTimeout(state.toastTimer);

    state.climaxTimer = null;
    state.confettiTimer = null;
    state.transformToken += 1;
    state.lit.clear();
    state.activeOrb = null;
    state.transforming = false;
    state.completed = false;

    if (state.transformEndedHandler) {
      portalVideos.transform.removeEventListener(
        "ended",
        state.transformEndedHandler
      );
      state.transformEndedHandler = null;
    }
    if (state.transformErrorHandler) {
      portalVideos.transform.removeEventListener(
        "error",
        state.transformErrorHandler
      );
      state.transformErrorHandler = null;
    }

    orbs.forEach((orb) => {
      orb.disabled = false;
      orb.classList.remove("is-lit", "is-current", "is-complete");
      orb.setAttribute("aria-pressed", "false");
    });

    pauseAllOrbVideos({ reset: true });

    heartLights.forEach((light) => light.classList.remove("is-on"));
    heartWindow.classList.remove("is-full");
    heartWindow.setAttribute("aria-valuenow", "0");
    heartWindow.setAttribute(
      "aria-label",
      "Corazón de Yellow: 0 de 5 luces encendidas"
    );
    heartWindow.style.setProperty("--lit", "0");

    missionDots.forEach((dot) => dot.classList.remove("is-on"));
    missionProgress.setAttribute("aria-valuenow", "0");
    missionProgress.setAttribute(
      "aria-valuetext",
      "0 de 5 actos de amabilidad completados"
    );
    progressCount.textContent = "0";
    missionCopy.textContent =
      "Toca los cinco orbes y descubre cómo llenar de luz su corazón.";
    missionCard.classList.remove("is-complete");
    missionCard.setAttribute("aria-labelledby", "missionTitle");
    orbDock.classList.remove("is-complete");
    setHint(INTRO_HINT);

    stage.classList.remove("is-transforming", "is-complete");
    climaxTitle.classList.remove("is-visible");
    confetti.replaceChildren();
    toast.classList.remove("is-visible");

    portalVideos.superhero.muted = true;
    showPortal("idle", { restart: true });

    if (withToast) {
      showToast("¡Todo listo para otra ronda de amabilidad!", 2600);
    }

    announce(
      "Actividad reiniciada. Toca los cinco orbes para llenar el corazón de Yellow."
    );

    if (focusWasInDone) {
      orbs[0].focus({ preventScroll: true });
    }
  }

  /* ---------------------------------------------------------
     Sonido, pantalla completa e instalación
     --------------------------------------------------------- */

  function updateSoundButton() {
    const enabled = state.sound;
    soundButton.classList.toggle("is-muted", !enabled);
    soundButton.setAttribute("aria-pressed", String(enabled));
    soundButton.setAttribute(
      "aria-label",
      enabled ? "Silenciar sonido" : "Activar sonido"
    );
    soundButton.title = enabled ? "Silenciar sonido" : "Activar sonido";
  }

  function applySoundPolicy() {
    const canSound = state.sound && state.audioUnlocked;

    // Todos los estados del león (idle, feliz, transformación y superhéroe)
    // comparten la preferencia de sonido. Solo el que está en pantalla queda
    // audible; los demás se pausan y silencian para no superponer pistas.
    Object.entries(portalVideos).forEach(([name, video]) => {
      video.muted = !(canSound && name === state.portalState);
    });

    if (state.activeOrb && !state.completed) {
      const video = orbVideos.get(state.activeOrb);
      if (video) video.muted = !canSound || state.transforming;
    } else {
      orbVideos.forEach((video) => {
        video.muted = true;
      });
    }

    updateSoundButton();
  }

  function toggleSound() {
    state.audioUnlocked = true;
    state.sound = !state.sound;
    saveSoundPreference(state.sound);
    applySoundPolicy();

    const currentVideo = portalVideos[state.portalState];
    if (state.sound && currentVideo && currentVideo.paused) {
      currentVideo.play().catch(() => {});
    }

    showToast(
      state.sound ? "Sonido activado en todos los videos." : "Sonido silenciado.",
      2200
    );
    announce(state.sound ? "Sonido activado." : "Sonido silenciado.");
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showToast("Este navegador no permite pantalla completa.", 3000);
    }
  }

  function updateFullscreenButton() {
    const isFullscreen = Boolean(document.fullscreenElement);
    stage.classList.toggle("is-fullscreen", isFullscreen);
    fullscreenButton.setAttribute(
      "aria-label",
      isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
    );
    fullscreenButton.title = isFullscreen
      ? "Salir de pantalla completa"
      : "Pantalla completa";
  }

  async function installApp() {
    if (!state.deferredInstallPrompt) {
      showToast("Abre el menú del navegador y elige «Instalar aplicación».", 3600);
      return;
    }

    const prompt = state.deferredInstallPrompt;
    state.deferredInstallPrompt = null;
    prompt.prompt();

    try {
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        showToast("¡Instalando la experiencia de la Escuela Puki!", 2800);
      } else {
        showToast("Puedes instalarla cuando quieras desde el menú del navegador.", 3000);
      }
    } catch {
      showToast("No se pudo completar la instalación.", 2800);
    }

    installButton.hidden = true;
  }

  /* ---------------------------------------------------------
     Eventos
     --------------------------------------------------------- */

  function bindEvents() {
    orbs.forEach((orb) => {
      orb.addEventListener("click", handleOrbClick);
    });

    resetButton.addEventListener("click", () => resetActivity());
    replayButton.addEventListener("click", () => resetActivity());
    soundButton.addEventListener("click", toggleSound);

    if (document.fullscreenEnabled) {
      fullscreenButton.addEventListener("click", toggleFullscreen);
      document.addEventListener("fullscreenchange", updateFullscreenButton);
    } else {
      fullscreenButton.hidden = true;
    }

    installButton.addEventListener("click", installApp);

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      state.deferredInstallPrompt = event;
      installButton.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      installButton.hidden = true;
      state.deferredInstallPrompt = null;
      showToast("¡La aplicación ya está instalada!", 3000);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        Object.values(portalVideos).forEach((video) => video.pause());
        orbVideos.forEach((video) => video.pause());
      } else if (!state.completed) {
        if (state.transforming) {
          portalVideos.transform.play().catch(() => {});
        } else {
          portalVideos.idle.play().catch(() => {});
        }
        if (state.activeOrb) {
          const video = orbVideos.get(state.activeOrb);
          if (video) video.play().catch(() => {});
        }
      } else {
        portalVideos.superhero.play().catch(() => {});
      }
    });
  }

  function registerServiceWorker() {
    if (
      !("serviceWorker" in navigator) ||
      !/^https?:$/.test(window.location.protocol)
    ) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // La app sigue funcionando aunque el registro falle.
      });
    });
  }

  function init() {
    configureVideos();
    updateSoundButton();
    startIdle();
    bindHappyEnd();
    bindEvents();
    updateProgress();
    updateFullscreenButton();
    registerServiceWorker();

    // Primer toque o clic en la pantalla: los navegadores no permiten audio
    // automático, así que desbloqueamos todos los videos del león y el orbe
    // activo en la primera interacción real.
    const unlockMedia = () => {
      state.audioUnlocked = true;
      applySoundPolicy();

      const currentVideo = portalVideos[state.portalState];
      if (currentVideo && currentVideo.paused && !document.hidden) {
        currentVideo.play().catch(() => {});
      }

      if (state.activeOrb && !state.transforming && !state.completed) {
        const video = orbVideos.get(state.activeOrb);
        if (video && video.paused) video.play().catch(() => {});
      }
    };

    document.addEventListener("pointerdown", unlockMedia, {
      once: true,
      capture: true,
    });
    document.addEventListener("click", unlockMedia, {
      once: true,
      capture: true,
    });
  }

  init();
})();
