/*
 * app.js
 * Máquina de estados, navegación, desbloqueo de audio y ciclo de vida
 * de los medios de cada escena.
 *
 * Estados:
 *   facade · intro · patio · modal-wd · musica · video · dibujo · dibujo-mesa
 *
 * Parámetros de depuración:
 *   ?scene=patio|modal-wd|musica|video|dibujo|dibujo-mesa|intro
 *   ?debug=1  (muestra y etiqueta las zonas interactivas)
 */
(function () {
  "use strict";

  var STATE_ORDER = ["facade", "intro", "patio", "modal-wd", "musica", "video", "dibujo", "dibujo-mesa"];

  var AMBIENT_TRACKS = {
    facade: {
      src: "./recursos/castillo-vistra-frontal-theme.mp3",
      volume: 0.36
    },
    patio: {
      src: "./recursos/castillo-patio-interno-theme.mp3",
      volume: 0.4
    }
  };

  var INTERIOR_STATES = ["patio", "modal-wd", "musica", "video", "dibujo", "dibujo-mesa"];

  var App = {
    currentState: "facade",
    scenes: {},
    initialized: false,
    booted: false,
    intro: {
      started: false,
      playAttempted: false
    },
    debug: false,
    toastTimer: null,
    facadePrepared: false,
    facadeStarted: false,
    hasUserGestured: false,
    audioChannel: null,
    audioInstanceId: null,
    audioSilencedByPeer: false,
    audioFocusClaimed: false,
    audioFocusAt: 0,
    unloading: false
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function sceneEl(name) {
    return document.querySelector('[data-scene="' + name + '"]');
  }

  function isValidState(name) {
    return STATE_ORDER.indexOf(name) !== -1;
  }

  App.init = function () {
    if (this.initialized) return;
    var app = document.getElementById("app");
    if (!app) return;
    this.initialized = true;

    this.root = app;
    this.facadeVideo = document.getElementById("facade-video");
    this.facadeEnter = document.getElementById("facade-enter");
    this.introVideo = document.getElementById("intro-video");
    this.introPlay = document.getElementById("intro-play");
    this.introLoader = document.getElementById("intro-loader");
    this.introProgressBar = document.getElementById("intro-progress-bar");
    this.skipIntro = document.getElementById("skip-intro");
    this.toastEl = document.getElementById("toast");
    this.appLive = document.getElementById("app-live");
    this.debugPanel = document.getElementById("debug-panel");
    this.transitionVeil = document.getElementById("transition-veil");
    this.bootScreen = document.getElementById("boot-screen");

    STATE_ORDER.forEach(function (state) {
      var el = sceneEl(state);
      if (el) this.scenes[state] = el;
    }, this);

    this._initAudioUnlock();
    this._initAmbient();
    this._initAudioLifecycle();
    this._initMuteButton();
    this._initAmbientButton();
    this._initFacade();
    this._initIntro();
    this._initNavigation();
    this._initDebugMode();
    this._initInputHygiene();

    if (window.WDModal && window.WDModal.init) window.WDModal.init();
    if (window.Workshops && window.Workshops.init) window.Workshops.init();
    if (window.DrawingDesk && window.DrawingDesk.init) window.DrawingDesk.init();

    var params = new URLSearchParams(window.location.search);
    var requestedState = params.get("scene");
    var initialState = requestedState && isValidState(requestedState) ? requestedState : "facade";
    this._prepareInitialState(initialState);
    this._claimAudioFocus();

    if (params.get("debug") === "1" || params.get("hotspots") === "1") {
      this._setDebug(true);
    }

    window.addEventListener("load", this._finishBoot.bind(this));
    window.setTimeout(this._finishBoot.bind(this), 1700);
    document.addEventListener("visibilitychange", this._onVisibilityChange.bind(this));
    window.addEventListener("resize", function () {
      // Reservado para futuras recalibraciones responsivas.
      if (window.DrawingDesk) {
        // El pincel conserva su desplazamiento; la escena se reescala sola.
      }
    });
  };

  App.goTo = function (nextState, options) {
    options = options || {};
    if (!isValidState(nextState)) return false;
    if (!this.scenes[nextState]) return false;
    if (nextState === this.currentState) return true;

    var previous = this.currentState;
    this._exitState(previous, nextState);

    var previousEl = this.scenes[previous];
    var nextEl = this.scenes[nextState];

    Object.keys(this.scenes).forEach(function (name) {
      var el = this.scenes[name];
      var isNext = name === nextState;
      el.classList.toggle("is-active", isNext);
      el.setAttribute("aria-hidden", isNext ? "false" : "true");
      if (isNext) {
        el.removeAttribute("inert");
      } else {
        el.setAttribute("inert", "");
      }
    }, this);

    this.currentState = nextState;
    this.root.dataset.state = nextState;
    document.body.dataset.state = nextState;

    if (previousEl && previousEl.contains(document.activeElement)) {
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    }
    void nextEl.offsetWidth;

    this._enterState(nextState);
    this._claimAudioFocus();
    this._announceScene(nextState);

    if (!options.silent) {
      // La transición se apoya en el fundido de cada escena; no usamos
      // el velo mágico para no retrasar la exploración de los talleres.
    }

    return true;
  };

  App.toast = function (message, duration) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add("is-visible");
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(function () {
      if (this.toastEl) this.toastEl.classList.remove("is-visible");
    }.bind(this), duration || 3400);
  };

  App.flashTransition = function () {
    if (!this.transitionVeil) return;
    var veil = this.transitionVeil;
    veil.classList.remove("is-flashing");
    void veil.offsetWidth;
    veil.classList.add("is-flashing");
    window.setTimeout(function () {
      veil.classList.remove("is-flashing");
    }, 1000);
  };

  /* ─────────────────── ESTADO INICIAL ─────────────────── */
  App._prepareInitialState = function (initialState) {
    Object.keys(this.scenes).forEach(function (name) {
      var el = this.scenes[name];
      var active = name === initialState;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) el.removeAttribute("inert");
      else el.setAttribute("inert", "");
    }, this);

    this.currentState = initialState;
    this.root.dataset.state = initialState;
    document.body.dataset.state = initialState;

    if (initialState === "facade") {
      this._prepareFacadeVideo();
      if (window.SoundFX) {
        window.SoundFX.stopAllAmbient(false);
        window.SoundFX.playAmbient("facade", 1400);
      }
    } else if (initialState === "intro") {
      this._prepareFacadeVideo();
      this._enterIntro();
    } else {
      this._prepareFacadeVideo();
      this._enterState(initialState);
    }

    this._announceScene(initialState, true);
  };

  /* ─────────────────── AUDIO ─────────────────── */
  App._initAmbientButton = function () {
    this.ambientPlayButton = document.getElementById("ambient-play");
    if (!this.ambientPlayButton) return;

    var entry = window.SoundFX && window.SoundFX.ambient && window.SoundFX.ambient.facade;
    var audio = entry && entry.audio;
    if (audio) {
      audio.addEventListener("play", this._syncAmbientButton.bind(this));
      audio.addEventListener("pause", this._syncAmbientButton.bind(this));
      audio.addEventListener("volumechange", this._syncAmbientButton.bind(this));
    }

    this.ambientPlayButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!window.SoundFX) return;

      if (window.SoundFX.muted) {
        window.SoundFX.setMuted(false);
        this._syncMuteButton(false);
        window.SoundFX.playAmbient("facade", 350);
        this._syncAmbientButton();
        return;
      }

      var facade = window.SoundFX.ambient.facade;
      var playing = window.SoundFX.ambientCurrent === "facade" &&
        facade && facade.audio && !facade.audio.paused;

      if (playing) {
        window.SoundFX.pauseAmbient();
      } else {
        window.SoundFX.unlock();
        window.SoundFX.playAmbient("facade", 400);
      }
      this._syncAmbientButton();
    }.bind(this));

    this._syncAmbientButtonVisibility(this.currentState);
    this._syncAmbientButton();
  };

  App._syncAmbientButton = function () {
    if (!this.ambientPlayButton) return;
    var entry = window.SoundFX && window.SoundFX.ambient && window.SoundFX.ambient.facade;
    var playing = Boolean(
      entry && entry.audio && !entry.audio.paused &&
      window.SoundFX.ambientCurrent === "facade" && !window.SoundFX.muted
    );
    this.ambientPlayButton.classList.toggle("is-playing", playing);
    this.ambientPlayButton.setAttribute(
      "aria-label",
      playing ? "Pausar sonido de ambiente" : "Reproducir sonido de ambiente"
    );
    this.ambientPlayButton.setAttribute(
      "title",
      playing ? "Pausar sonido de ambiente" : "Reproducir sonido de ambiente"
    );
  };

  App._syncAmbientButtonVisibility = function (state) {
    if (!this.ambientPlayButton) return;
    this.ambientPlayButton.hidden = state !== "facade";
  };

  App._initMuteButton = function () {
    this.muteButton = document.getElementById("app-mute");
    if (!this.muteButton) return;
    this.muteButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var next = !(window.SoundFX && window.SoundFX.muted);
      if (window.SoundFX && window.SoundFX.setMuted) window.SoundFX.setMuted(next);
      this._syncMuteButton(next);
    }.bind(this));
    this._syncMuteButton(Boolean(window.SoundFX && window.SoundFX.muted));
  };

  App._syncMuteButton = function (muted) {
    if (!this.muteButton) return;
    this.muteButton.classList.toggle("is-muted", Boolean(muted));
    if (this._syncAmbientButton) this._syncAmbientButton();
    this.muteButton.setAttribute("aria-pressed", muted ? "true" : "false");
    this.muteButton.setAttribute(
      "aria-label",
      muted ? "Activar sonido de toda la aplicación" : "Silenciar toda la aplicación"
    );
    this.muteButton.setAttribute("title", muted ? "Activar sonido" : "Silenciar todo");
  };

  App._initAmbient = function () {
    if (!window.SoundFX || !window.SoundFX.initAmbient) return;
    window.SoundFX.initAmbient("facade", AMBIENT_TRACKS.facade.src, AMBIENT_TRACKS.facade.volume);
    window.SoundFX.initAmbient("patio", AMBIENT_TRACKS.patio.src, AMBIENT_TRACKS.patio.volume);
  };

  App._startInteriorAmbient = function () {
    if (window.SoundFX) window.SoundFX.playAmbient("patio", 1300);
  };

  App._initAudioUnlock = function () {
    var unlock = function (event) {
      // Los controles de sonido gestionan la reproducción por su cuenta:
      // si el desbloqueo global arrancara la fachada en el pointerdown, el
      // clic del botón la vería ya sonando y la pausaría.
      var target = event && event.target;
      if (target && target.closest && target.closest("#ambient-play, #app-mute")) return;

      this.hasUserGestured = true;
      if (window.SoundFX && window.SoundFX.unlock) window.SoundFX.unlock();
      if (!this.audioFocusClaimed || this.audioSilencedByPeer) this._claimAudioFocus();
    }.bind(this);

    document.addEventListener("pointerdown", unlock, { capture: true, passive: true });
    document.addEventListener("keydown", unlock, { capture: true });
    document.addEventListener("touchstart", unlock, { capture: true, passive: true });
  };

  /*
   * Una sola instancia audible: si se abre otra pestaña/ventana de la
   * experiencia, la anterior deja de sonar. También se detiene todo al
   * descargar la página, para que el tema del patio no sobreviva a un
   * refresco ni a una restauración desde la caché de navegación.
   */
  App._initAudioLifecycle = function () {
    this.audioInstanceId = "alaia-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);

    if (window.BroadcastChannel) {
      try {
        this.audioChannel = new BroadcastChannel("alaia-castillo-audio");
        this.audioChannel.addEventListener("message", function (event) {
          var message = event.data || {};
          if (!message.type || message.source === this.audioInstanceId) return;
          if (message.type === "claim") {
            var peerAt = Number(message.at) || 0;
            var wins = peerAt > this.audioFocusAt ||
              (peerAt === this.audioFocusAt && String(message.source) > String(this.audioInstanceId));
            if (!wins) return;
          }
          if (message.type === "claim" || message.type === "silence") {
            this.audioSilencedByPeer = true;
            this.audioFocusClaimed = false;
            if (window.SoundFX) window.SoundFX.pauseAllAmbient();
          }
        }.bind(this));
      } catch (error) {
        this.audioChannel = null;
      }
    }

    window.addEventListener("pagehide", this._handlePageHide.bind(this));
    window.addEventListener("beforeunload", this._handlePageUnload.bind(this));
    window.addEventListener("unload", this._handlePageUnload.bind(this));
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) this._onVisibilityChange();
    }.bind(this));
  };

  App._broadcastAudio = function (type) {
    if (!this.audioChannel) return;
    try {
      this.audioChannel.postMessage({
        type: type,
        source: this.audioInstanceId,
        at: this.audioFocusAt
      });
    } catch (error) {
      /* noop */
    }
  };

  App._claimAudioFocus = function () {
    if (document.hidden) return;
    this.audioSilencedByPeer = false;
    this.audioFocusClaimed = true;
    this.audioFocusAt = Date.now();
    this._broadcastAudio("claim");
    this._syncAmbientForState(800);
  };

  App._syncAmbientForState = function (fade) {
    if (!window.SoundFX) return;
    if (this.currentState === "facade") {
      if (this.facadeStarted) {
        window.SoundFX.stopAllAmbient(false);
      } else {
        window.SoundFX.playAmbient("facade", fade || 1100);
      }
      return;
    }
    if (this.currentState === "intro") {
      window.SoundFX.stopAllAmbient(false);
      return;
    }
    if (INTERIOR_STATES.indexOf(this.currentState) !== -1) {
      window.SoundFX.playAmbient("patio", fade || 1000);
    }
  };

  App._handlePageHide = function () {
    this._broadcastAudio("release");
    this._pauseEverything();
  };

  App._handlePageUnload = function () {
    if (this.unloading) return;
    this.unloading = true;
    this._broadcastAudio("release");
    this._pauseEverything();
    if (window.SoundFX && window.SoundFX.shutdown) window.SoundFX.shutdown();
    if (this.audioChannel) {
      try { this.audioChannel.close(); } catch (error) { /* noop */ }
      this.audioChannel = null;
    }
  };

  /* ─────────────────── FACHADA ─────────────────── */
  App._initFacade = function () {
    if (!this.facadeVideo || !this.facadeEnter) return;

    this.facadeVideo.addEventListener("loadedmetadata", this._prepareFacadeVideo.bind(this));
    this.facadeVideo.addEventListener("loadeddata", this._prepareFacadeVideo.bind(this));
    this.facadeVideo.addEventListener("play", function () {
      var scene = this.scenes.facade;
      if (scene) scene.classList.add("is-playing");
      this.facadeStarted = true;
    }.bind(this));
    this.facadeVideo.addEventListener("ended", function () {
      if (this.currentState !== "facade") return;
      this.goTo("intro");
    }.bind(this));
    this.facadeVideo.addEventListener("error", function () {
      this.toast("No se pudo cargar el video de entrada. Toca de nuevo para continuar.");
      if (this.facadeEnter) {
        this.facadeEnter.classList.add("has-error");
        var title = this.facadeEnter.querySelector(".facade-action__title");
        if (title) title.textContent = "Continuar";
      }
      this.facadeStarted = false;
    }.bind(this));

    this.facadeEnter.addEventListener("pointerdown", function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      this._startFacade();
    }.bind(this));

    this.facadeEnter.addEventListener("click", function (event) {
      if (event.detail === 0) {
        // Activación por teclado/lector de pantalla.
        this._startFacade();
      }
    }.bind(this));

    this._prepareFacadeVideo();
  };

  App._prepareFacadeVideo = function () {
    if (!this.facadeVideo || this.facadePrepared) return;
    if (this.facadeVideo.readyState >= 1) {
      try {
        this.facadeVideo.pause();
        this.facadeVideo.currentTime = 0;
      } catch (error) {
        /* noop */
      }
      this.facadePrepared = true;
    }
  };

  App._startFacade = function () {
    if (!this.facadeVideo) return;
    if (this.currentState !== "facade") return;

    if (this.facadeVideo.error) {
      this.goTo("intro");
      return;
    }

    if (this.hasUserGestured) {
      if (window.SoundFX) window.SoundFX.unlock();
    }

    var video = this.facadeVideo;
    video.muted = false;
    video.volume = 1;
    try {
      video.currentTime = 0;
    } catch (error) {
      /* noop */
    }

    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        this.toast("No se pudo iniciar el video. Toca de nuevo.");
        if (this.facadeEnter) this.facadeEnter.classList.remove("is-hidden");
      }.bind(this));
    }

    if (this.facadeEnter) {
      this.facadeEnter.setAttribute("aria-hidden", "true");
    }
    this.facadeStarted = true;

    // La música de fachada se mantiene como fondo durante el video de
    // entrada. En navegadores que bloquean el autoplay, el primer toque
    // (este mismo) es el que la inicia; si se retirara de inmediato, nunca
    // llegaría a escucharse. Se detiene al entrar en la introducción.
    if (window.SoundFX) {
      window.SoundFX.duckAmbient(0.55, 500);
    }
  };

  App._pauseFacade = function () {
    if (this.facadeVideo) this.facadeVideo.pause();
  };

  /* ─────────────────── INTRO ─────────────────── */
  App._initIntro = function () {
    if (!this.introVideo) return;

    this.introVideo.addEventListener("playing", function () {
      if (this.currentState !== "intro") {
        this.introVideo.pause();
        return;
      }
      var scene = this.scenes.intro;
      if (scene) scene.classList.add("is-playing");
      if (this.introLoader) this.introLoader.hidden = true;
      if (this.introPlay) this.introPlay.hidden = true;
    }.bind(this));

    this.introVideo.addEventListener("ended", function () {
      if (this.currentState !== "intro") return;
      this.goTo("patio");
    }.bind(this));

    this.introVideo.addEventListener("error", function () {
      if (this.introLoader) this.introLoader.hidden = true;
      this.toast("No se pudo cargar la introducción. Puedes continuar al patio.");
      if (this.introPlay) this.introPlay.hidden = true;
      this._showIntroSkipFallback();
    }.bind(this));

    this.introVideo.addEventListener("timeupdate", this._updateIntroProgress.bind(this));
    this.introVideo.addEventListener("durationchange", this._updateIntroProgress.bind(this));

    if (this.skipIntro) {
      this.skipIntro.addEventListener("click", function () {
        this._skipIntro();
      }.bind(this));
    }

    if (this.introPlay) {
      this.introPlay.addEventListener("click", function () {
        this._playIntro();
      }.bind(this));
    }
  };

  App._enterIntro = function () {
    if (!this.introVideo) {
      this.goTo("patio");
      return;
    }

    if (window.SoundFX) window.SoundFX.stopAllAmbient(false);
    var scene = this.scenes.intro;
    if (scene) scene.classList.add("is-active");
    this.intro.started = true;
    this.intro.playAttempted = false;
    if (this.introLoader) this.introLoader.hidden = false;
    if (this.introPlay) this.introPlay.hidden = true;

    try {
      this.introVideo.pause();
      this.introVideo.currentTime = 0;
    } catch (error) {
      /* noop */
    }
    if (this.introProgressBar) this.introProgressBar.style.width = "0%";
    this.introVideo.muted = false;
    this.introVideo.volume = 1;
    this.introVideo.load();
    this._playIntro();
  };

  App._playIntro = function () {
    if (!this.introVideo || this.currentState !== "intro") return;
    this.introVideo.playAttempted = true;
    var promise = this.introVideo.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        if (this.currentState !== "intro") return;
        if (this.introLoader) this.introLoader.hidden = true;
        if (this.introPlay) this.introPlay.hidden = false;
        this.toast("Toca el botón para reproducir la introducción.");
      }.bind(this));
    }
  };

  App._updateIntroProgress = function () {
    if (!this.introProgressBar || !this.introVideo) return;
    var duration = this.introVideo.duration;
    if (!Number.isFinite(duration) || duration <= 0) {
      this.introProgressBar.style.width = "0%";
      return;
    }
    var percent = Math.max(0, Math.min(100, (this.introVideo.currentTime / duration) * 100));
    this.introProgressBar.style.width = percent.toFixed(2) + "%";
  };

  App._skipIntro = function () {
    if (this.introVideo) {
      this.introVideo.pause();
      this.intro.started = false;
    }
    this.goTo("patio");
  };

  App._pauseIntro = function () {
    if (this.introVideo) this.introVideo.pause();
    if (this.scenes.intro) this.scenes.intro.classList.remove("is-playing");
  };

  App._showIntroSkipFallback = function () {
    if (!this.skipIntro) return;
    this.skipIntro.classList.add("is-prominent");
  };

  /* ─────────────────── NAVEGACIÓN ─────────────────── */
  App._initNavigation = function () {
    var that = this;

    document.addEventListener("click", function (event) {
      var goTarget = event.target.closest("[data-go]");
      if (goTarget) {
        event.preventDefault();
        if (window.SoundFX) window.SoundFX.page();
        that.goTo(goTarget.getAttribute("data-go"));
        return;
      }

      var openTarget = event.target.closest("[data-open]");
      if (openTarget) {
        event.preventDefault();
        if (window.SoundFX) window.SoundFX.page();
        that.goTo(openTarget.getAttribute("data-open"));
      }
    });

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      var isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (isTyping) return;

      if (event.key === "h" || event.key === "H") {
        event.preventDefault();
        that._setDebug(!that.debug);
        return;
      }

      if (event.key === "Escape") {
        if (that.currentState === "dibujo-mesa") {
          event.preventDefault();
          that.goTo("dibujo");
        } else if (that.currentState === "modal-wd" || that.currentState === "musica" || that.currentState === "video" || that.currentState === "dibujo") {
          event.preventDefault();
          that.goTo("patio");
        }
      }
    });
  };

  App._announceScene = function (state, silent) {
    var labels = {
      facade: "Fachada del castillo. Toca para entrar.",
      intro: "Introducción.",
      patio: "Patio interno. Elige un taller o la historia de Walt Disney.",
      "modal-wd": "La historia de Walt Disney.",
      musica: "Taller de Música.",
      video: "Taller de Video.",
      dibujo: "Taller de Dibujo.",
      "dibujo-mesa": "Mesa de dibujo. Arrastra el pincel mágico hasta el boceto."
    };
    if (this.appLive) this.appLive.textContent = labels[state] || "";
    if (!silent) {
      // La etiqueta de la escena ya está en el DOM; este live region añade
      // un contexto breve para lectores de pantalla.
    }
  };

  /* ─────────────────── CICLO DE VIDA DE ESCENAS ─────────────────── */
  App._enterState = function (state) {
    if (this._syncAmbientButtonVisibility) this._syncAmbientButtonVisibility(state);
    if (this._syncAmbientButton) this._syncAmbientButton();
    if (INTERIOR_STATES.indexOf(state) !== -1) this._startInteriorAmbient();

    switch (state) {
      case "facade":
        this._prepareFacadeVideo();
        this.facadeStarted = false;
        if (window.SoundFX) {
          // Al volver a la fachada no puede quedar ningún resto del patio.
          window.SoundFX.stopAllAmbient(false);
          window.SoundFX.playAmbient("facade", 1300);
        }
        break;
      case "intro":
        this._enterIntro();
        break;
      case "patio":
        break;
      case "modal-wd":
        if (window.WDModal) window.WDModal.enter();
        break;
      case "musica":
        if (window.Workshops) window.Workshops.enter("musica");
        break;
      case "video":
        if (window.Workshops) window.Workshops.enter("video");
        break;
      case "dibujo":
        if (window.DrawingDesk) window.DrawingDesk.enterRoom();
        break;
      case "dibujo-mesa":
        if (window.DrawingDesk) window.DrawingDesk.enterMesa();
        break;
      default:
        break;
    }
  };

  App._exitState = function (previousState, nextState) {
    switch (previousState) {
      case "facade":
        this._pauseFacade();
        this.facadeStarted = false;
        if (window.SoundFX) window.SoundFX.stopAllAmbient(false);
        break;
      case "intro":
        this._pauseIntro();
        break;
      case "modal-wd":
        if (window.WDModal) window.WDModal.leave();
        break;
      case "musica":
      case "video":
        if (window.Workshops) window.Workshops.leave();
        break;
      case "dibujo":
        if (window.DrawingDesk) window.DrawingDesk.leaveRoom();
        break;
      case "dibujo-mesa":
        if (window.DrawingDesk) window.DrawingDesk.leaveMesa();
        break;
      default:
        break;
    }

    // Caso especial: si se sale del patio hacia una escena con video,
    // los módulos se encargan de arrancar sus propios medios al entrar.
    void nextState;
  };

  App._pauseEverything = function () {
    this._pauseFacade();
    this._pauseIntro();
    if (window.SoundFX) {
      window.SoundFX.stopAllAmbient(true);
      if (window.SoundFX.suspendContext) window.SoundFX.suspendContext();
    }
    if (window.WDModal) window.WDModal.leave();
    if (window.Workshops) window.Workshops.leave();
    if (window.DrawingDesk) {
      window.DrawingDesk.leaveRoom();
      window.DrawingDesk.leaveMesa();
    }
  };

  App._onVisibilityChange = function () {
    if (document.hidden) {
      // Suspensión no destructiva: conserva la selección de rollo, el
      // boceto actual y las posiciones de los pinceles.
      this._pauseFacade();
      this._pauseIntro();
      if (window.SoundFX) window.SoundFX.pauseAllAmbient();
      if (window.WDModal) window.WDModal.leave();
      if (window.Workshops) window.Workshops.leave();
      if (window.DrawingDesk) window.DrawingDesk.suspendMedia();
    } else {
      // Al volver a la pestaña reanudamos solo los medios de la escena activa.
      this._claimAudioFocus();
      if (this.currentState === "facade" && this.facadeVideo && this.facadeStarted && !this.facadeVideo.ended) {
        this.facadeVideo.play().catch(function () {});
      }
      if (this.currentState === "intro" && this.introVideo && !this.introVideo.ended) {
        this._playIntro();
      }
      if (this.currentState === "modal-wd" && window.WDModal) window.WDModal.resume();
      if (this.currentState === "musica" && window.Workshops) window.Workshops.enter("musica");
      if (this.currentState === "video" && window.Workshops) window.Workshops.enter("video");
      if (this.currentState === "dibujo" && window.DrawingDesk) window.DrawingDesk.enterRoom();
      if (this.currentState === "dibujo-mesa" && window.DrawingDesk) window.DrawingDesk.enterMesa();
    }
  };

  /* ─────────────────── DEBUG / CALIBRACIÓN ─────────────────── */
  App._initDebugMode = function () {
    this._setDebug(false);
  };

  App._setDebug = function (value) {
    this.debug = Boolean(value);
    if (this.root) this.root.setAttribute("data-debug", this.debug ? "true" : "false");
    if (this.debugPanel) this.debugPanel.hidden = !this.debug;
    if (this.debug) {
      this.toast("Modo calibración activo. Pulsa H para ocultarlo.", 2600);
    }
  };

  /* ─────────────────── HIGIENE DE ENTRADA ─────────────────── */
  App._initInputHygiene = function () {
    document.addEventListener("dragstart", function (event) {
      var target = event.target;
      var tag = target && target.tagName;
      if (tag === "IMG" || tag === "VIDEO" || (target && target.closest && target.closest("button"))) {
        event.preventDefault();
      }
    });

    document.addEventListener("selectstart", function (event) {
      var target = event.target;
      if (target && target.closest && target.closest(".stage, .scene")) {
        event.preventDefault();
      }
    });

    // Evita el zoom por doble toque en los botones principales sin
    // bloquear la interacción normal.
    var lastTouchEnd = 0;
    document.addEventListener("touchend", function (event) {
      var now = Date.now();
      if (now - lastTouchEnd <= 300) {
        var target = event.target;
        if (target && target.closest && target.closest("button, [role='button'], .stage")) {
          event.preventDefault();
        }
      }
      lastTouchEnd = now;
    }, { passive: false });
  };

  /* ─────────────────── ARRANQUE ─────────────────── */
  App._finishBoot = function () {
    if (this.booted) return;
    this.booted = true;
    if (this.bootScreen) {
      this.bootScreen.classList.add("is-hidden");
      window.setTimeout(function () {
        if (this.bootScreen) this.bootScreen.hidden = true;
      }.bind(this), 800);
    }
    // Aseguramos que el primer frame de la fachada esté listo.
    this._prepareFacadeVideo();
  };

  document.addEventListener("DOMContentLoaded", function () {
    App.init();
  });

  if (document.readyState !== "loading") {
    // Si el script se carga después del DOMContentLoaded por alguna razón.
    App.init();
  }

  window.App = App;
})();
