/*
 * workshops.js
 * Taller de Música (instrumentos + sintetizador) y Taller de Video
 * (proyector, cuatro rollos y controles táctiles).
 */
(function () {
  "use strict";

  var FILMS = [
    {
      title: "Dumbo",
      label: "Un clásico que aprendió a volar",
      src: "./recursos/taller-de-video-1-dumbo.mp4"
    },
    {
      title: "Pinocho",
      label: "La aventura de un niño de madera",
      src: "./recursos/taller-de-video-2-pinocho.mp4"
    },
    {
      title: "Toy Story",
      label: "Los juguetes también tienen historias",
      src: "./recursos/taller-de-video-3-toystory.mp4"
    },
    {
      title: "Lilo & Stitch",
      label: "Una amistad llegada de las estrellas",
      src: "./recursos/taller-de-video-4-lilo&stith.mp4"
    }
  ];

  var INSTRUMENT_LABELS = {
    xylophone: "xilófono",
    cymbal: "címbalo",
    trumpet: "trompeta",
    drum: "tambor",
    bell: "campana"
  };

  var NOTE_GLYPHS = ["♪", "♫", "♬", "✦", "❋"];

  var Workshops = {
    current: null,
    initialized: false,
    musicVideos: [],
    videoPerson: null,
    cinemaScreen: null,
    cinemaVideo: null,
    cinemaIdle: null,
    cinemaToggle: null,
    cinemaMute: null,
    cinemaProgress: null,
    cinemaTime: null,
    cinemaCaptionLabel: null,
    cinemaCaptionTitle: null,
    cinemaBigPlay: null,
    cinemaLoading: null,
    filmButtons: [],
    selectedFilm: -1,
    filmToken: 0,
    lastFilmPointer: 0,
    waveTimer: null,
    loadedFilmIndex: -1,

    init: function () {
      if (this.initialized) return;
      this.initialized = true;

      this.musicVideos = [
        document.getElementById("musica-personaje"),
        document.getElementById("musica-tv")
      ].filter(Boolean);

      this.videoPerson = document.getElementById("video-personaje");
      this.cinemaScreen = document.getElementById("cinema-screen");
      this.cinemaVideo = document.getElementById("cinema-screen-video");
      this.cinemaIdle = document.getElementById("cinema-idle");
      this.cinemaToggle = document.getElementById("cinema-toggle");
      this.cinemaMute = document.getElementById("cinema-mute");
      this.cinemaProgress = document.getElementById("cinema-progress");
      this.cinemaTime = document.getElementById("cinema-time");
      this.cinemaCaptionLabel = document.getElementById("cinema-caption-label");
      this.cinemaCaptionTitle = document.getElementById("cinema-caption-title");
      this.cinemaBigPlay = document.getElementById("cinema-big-play");
      this.cinemaLoading = document.getElementById("cinema-loading");
      this.filmButtons = Array.prototype.slice.call(document.querySelectorAll(".film-reel"));

      this._initMusic();
      this._initCinema();
    },

    enter: function (name) {
      this.current = name;
      if (name === "musica") {
        this._playMusicVideos();
      } else if (name === "video") {
        this._playVideoScene();
      }
    },

    leave: function () {
      this.current = null;
      this._pauseMusicVideos();
      this._pauseVideoScene();
      this._hideWave();
      if (window.SoundFX) window.SoundFX.restoreAmbient(700);
    },

    /* ───────────────────────── MÚSICA ───────────────────────── */
    _initMusic: function () {
      var buttons = document.querySelectorAll("[data-instrument]");
      buttons.forEach(function (button) {
        var name = button.getAttribute("data-instrument");
        var handler = this._onInstrumentDown.bind(this, name, button);
        button.addEventListener("pointerdown", handler);
        button.addEventListener("click", function (event) {
          // Activación por teclado o lector de pantalla.
          if (event.detail === 0) {
            this._onInstrumentDown(
              name,
              button,
              new PointerEvent("pointerdown", { clientX: 0, clientY: 0 }),
              true
            );
          }
        }.bind(this));
      }, this);
    },

    _onInstrumentDown: function (name, button, event, keyboard) {
      if (event && event.preventDefault) event.preventDefault();
      if (!button) return;

      var stage = button.closest(".stage");
      var pointerX = event && event.clientX ? event.clientX : 0;
      var pointerY = event && event.clientY ? event.clientY : 0;
      var stageRect = stage ? stage.getBoundingClientRect() : null;
      var buttonRect = button.getBoundingClientRect();

      var pan = 0;
      var localX = 0.5;
      if (stageRect && stageRect.width) {
        pan = Math.max(-1, Math.min(1, ((pointerX - stageRect.left) / stageRect.width - 0.5) * 1.5));
      }
      if (buttonRect.width) {
        localX = Math.max(0, Math.min(1, (pointerX - buttonRect.left) / buttonRect.width));
      }

      var detail = { pan: pan };
      if (name === "xylophone") {
        detail.index = Math.round(localX * 4);
        if (!pointerX && keyboard) detail.index = Math.floor(Math.random() * 5);
      }

      if (window.SoundFX) {
        window.SoundFX.instrument(name, detail);
      }

      this._pulseInstrument(button);
      this._showWave();

      if (!keyboard && stageRect) {
        this._spawnRipple(stage, pointerX, pointerY);
        this._spawnNote(stage, pointerX, pointerY, name);
      } else if (stageRect) {
        var rect = button.getBoundingClientRect();
        this._spawnRipple(stage, rect.left + rect.width / 2, rect.top + rect.height / 2);
        this._spawnNote(stage, rect.left + rect.width / 2, rect.top + rect.height / 2, name);
      }

      var live = document.getElementById("music-live");
      if (live) live.textContent = "Suena " + (INSTRUMENT_LABELS[name] || "el instrumento") + ".";
    },

    _pulseInstrument: function (button) {
      button.classList.remove("is-hit");
      void button.offsetWidth;
      button.classList.add("is-hit");
      window.setTimeout(function () {
        button.classList.remove("is-hit");
      }, 380);
    },

    _spawnRipple: function (stage, clientX, clientY) {
      var stageRect = stage.getBoundingClientRect();
      var x = clientX - stageRect.left;
      var y = clientY - stageRect.top;
      if (x < 0 || y < 0 || x > stageRect.width || y > stageRect.height) return;

      var ripple = document.createElement("span");
      ripple.className = "hit-ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      stage.appendChild(ripple);
      window.setTimeout(function () {
        ripple.remove();
      }, 650);
    },

    _spawnNote: function (stage, clientX, clientY, instrument) {
      var stageRect = stage.getBoundingClientRect();
      var x = clientX - stageRect.left;
      var y = clientY - stageRect.top;
      if (x < 0 || y < 0 || x > stageRect.width || y > stageRect.height) {
        x = stageRect.width * 0.5;
        y = stageRect.height * 0.8;
      }

      var note = document.createElement("span");
      note.className = "floating-note";
      note.textContent = NOTE_GLYPHS[Math.floor(Math.random() * NOTE_GLYPHS.length)];
      note.style.left = x + "px";
      note.style.top = y + "px";
      note.style.color = instrument === "drum" ? "#ffd9a0" : "";
      stage.appendChild(note);
      window.setTimeout(function () {
        note.remove();
      }, 1300);
    },

    _showWave: function () {
      var wave = document.getElementById("music-wave");
      if (!wave) return;
      wave.classList.add("is-visible");
      if (this.waveTimer) window.clearTimeout(this.waveTimer);
      this.waveTimer = window.setTimeout(function () {
        wave.classList.remove("is-visible");
      }, 2400);
    },

    _hideWave: function () {
      var wave = document.getElementById("music-wave");
      if (wave) wave.classList.remove("is-visible");
      if (this.waveTimer) {
        window.clearTimeout(this.waveTimer);
        this.waveTimer = null;
      }
    },

    _playMusicVideos: function () {
      var self = this;
      this.musicVideos.forEach(function (video) {
        if (!video) return;
        var promise = video.play();
        if (promise && promise.then) {
          promise.then(function () {
            if (self.current !== "musica") video.pause();
          }).catch(function () {});
        }
      });
      // Reanuda el personaje justo al entrar, sin reiniciar su animación.
    },

    _pauseMusicVideos: function () {
      this.musicVideos.forEach(function (video) {
        if (video) video.pause();
      });
    },

    /* ───────────────────────── VIDEO ───────────────────────── */
    _initCinema: function () {
      if (!this.cinemaVideo) return;

      this.filmButtons.forEach(function (button) {
        var index = Number(button.getAttribute("data-film"));
        button.addEventListener("pointerdown", function (event) {
          if (event.button !== undefined && event.button !== 0) return;
          event.preventDefault();
          this.lastFilmPointer = Date.now();
          this.selectFilm(index);
        }.bind(this));
        button.addEventListener("click", function (event) {
          if (Date.now() - this.lastFilmPointer < 500) return;
          this.selectFilm(index);
        }.bind(this));
      }, this);

      if (this.cinemaToggle) {
        this.cinemaToggle.addEventListener("click", this.togglePlayback.bind(this));
      }

      if (this.cinemaBigPlay) {
        this.cinemaBigPlay.addEventListener("click", this.togglePlayback.bind(this));
      }

      if (this.cinemaMute) {
        this.cinemaMute.addEventListener("click", this.toggleMute.bind(this));
      }

      if (this.cinemaProgress) {
        this.cinemaProgress.addEventListener("input", this._onSeek.bind(this));
      }

      this.cinemaVideo.addEventListener("timeupdate", this._syncProgress.bind(this));
      this.cinemaVideo.addEventListener("durationchange", this._syncProgress.bind(this));
      this.cinemaVideo.addEventListener("loadedmetadata", this._syncProgress.bind(this));
      this.cinemaVideo.addEventListener("play", function () {
        this._syncPlaybackUI();
        if (this.current === "video" && window.SoundFX) window.SoundFX.duckAmbient(0.22, 500);
      }.bind(this));
      this.cinemaVideo.addEventListener("pause", function () {
        this._syncPlaybackUI();
        if (window.SoundFX) window.SoundFX.restoreAmbient(800);
      }.bind(this));
      this.cinemaVideo.addEventListener("ended", function () {
        this._syncPlaybackUI();
        if (window.SoundFX) window.SoundFX.restoreAmbient(800);
      }.bind(this));
      this.cinemaVideo.addEventListener("error", this._onCinemaError.bind(this));
      this.cinemaVideo.addEventListener("click", function () {
        if (this.selectedFilm >= 0) this.togglePlayback();
      }.bind(this));
    },

    _playVideoScene: function () {
      if (this.videoPerson) {
        var video = this.videoPerson;
        var promise = video.play();
        if (promise && promise.then) {
          promise.then(function () {
            if (this.current !== "video") video.pause();
          }.bind(this)).catch(function () {});
        }
      }
      this._syncPlaybackUI();
    },

    _pauseVideoScene: function () {
      if (this.cinemaVideo) this.cinemaVideo.pause();
      if (this.videoPerson) this.videoPerson.pause();
    },

    selectFilm: function (index) {
      if (!FILMS[index] || !this.cinemaVideo || !this.cinemaScreen) return;
      if (this.current !== "video") {
        // Permite probar el taller desde una URL de depuración.
        this.current = "video";
      }

      var film = FILMS[index];
      this.selectedFilm = index;
      this.filmToken += 1;
      var token = this.filmToken;

      this.filmButtons.forEach(function (button, i) {
        var isActive = i === index;
        button.classList.toggle("is-active", isActive);
        button.classList.toggle("is-loading", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      if (window.SoundFX) window.SoundFX.projector();

      if (this.cinemaCaptionLabel) {
        this.cinemaCaptionLabel.textContent = "Rollo " + (index + 1) + " · " + film.title;
      }
      if (this.cinemaCaptionTitle) {
        this.cinemaCaptionTitle.textContent = film.label;
      }

      this.cinemaScreen.classList.add("is-projecting");
      this.cinemaScreen.classList.add("has-film");
      if (this.cinemaIdle) this.cinemaIdle.setAttribute("aria-hidden", "true");
      if (this.cinemaBigPlay) this.cinemaBigPlay.hidden = true;
      if (this.cinemaLoading) this.cinemaLoading.hidden = false;

      this.cinemaVideo.pause();
      this.cinemaVideo.removeAttribute("poster");
      this.cinemaVideo.src = film.src;
      this.cinemaVideo.load();
      this.loadedFilmIndex = -1;

      var startWhenReady = function () {
        if (token !== this.filmToken) return;
        if (this.current !== "video") {
          if (this.cinemaLoading) this.cinemaLoading.hidden = true;
          this.filmButtons.forEach(function (button) { button.classList.remove("is-loading"); });
          return;
        }
        if (this.cinemaVideo.dataset.startedToken === String(token)) return;
        this.cinemaVideo.dataset.startedToken = String(token);
        if (this.cinemaLoading) this.cinemaLoading.hidden = true;
        var loaders = this.filmButtons[index];
        if (loaders) loaders.classList.remove("is-loading");
        var playPromise = this.cinemaVideo.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            if (token !== this.filmToken || this.current !== "video") return;
            this._syncPlaybackUI();
            this._notify("Toca el botón de reproducción para ver la película.");
          }.bind(this));
        }
      }.bind(this);

      var readyEvent = function () {
        if (token !== this.filmToken || this.current !== "video") return;
        this.loadedFilmIndex = index;
        this.cinemaVideo.removeEventListener("canplay", readyEvent);
        // Pequeño compás de proyector antes de revelar la imagen.
        window.setTimeout(startWhenReady, 380);
      }.bind(this);

      this.cinemaVideo.addEventListener("canplay", readyEvent);
      this.cinemaVideo.addEventListener("loadeddata", function onLoadedData() {
        this.cinemaVideo.removeEventListener("loadeddata", onLoadedData);
        if (this.cinemaVideo.readyState >= 2) readyEvent();
      }.bind(this));

      var live = document.getElementById("video-live");
      if (live) live.textContent = "Cargando " + film.title + " en el proyector.";
    },

    togglePlayback: function () {
      if (!this.cinemaVideo || this.selectedFilm < 0) return;
      if (this.cinemaVideo.paused || this.cinemaVideo.ended) {
        if (this.cinemaVideo.ended) this.cinemaVideo.currentTime = 0;
        var promise = this.cinemaVideo.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            this._notify("No se pudo iniciar la reproducción. Vuelve a tocar el rollo.");
          }.bind(this));
        }
      } else {
        this.cinemaVideo.pause();
      }
    },

    toggleMute: function () {
      if (!this.cinemaVideo) return;
      this.cinemaVideo.muted = !this.cinemaVideo.muted;
      if (this.cinemaMute) {
        this.cinemaMute.classList.toggle("is-muted", this.cinemaVideo.muted);
        this.cinemaMute.setAttribute(
          "aria-label",
          this.cinemaVideo.muted ? "Activar sonido de la película" : "Silenciar película"
        );
      }
    },

    _syncPlaybackUI: function () {
      if (!this.cinemaVideo) return;
      var hasFilm = this.selectedFilm >= 0;
      var isPlaying = hasFilm && !this.cinemaVideo.paused && !this.cinemaVideo.ended;

      if (this.cinemaToggle) {
        this.cinemaToggle.disabled = !hasFilm;
        this.cinemaToggle.classList.toggle("is-playing", isPlaying);
        this.cinemaToggle.setAttribute("aria-label", isPlaying ? "Pausar película" : "Reproducir película");
      }
      if (this.cinemaMute) this.cinemaMute.disabled = !hasFilm;
      if (this.cinemaProgress) this.cinemaProgress.disabled = !hasFilm;

      if (this.cinemaBigPlay) {
        this.cinemaBigPlay.hidden = !hasFilm || isPlaying || (this.cinemaVideo.currentTime > 0 && !this.cinemaVideo.ended);
        if (this.cinemaVideo.ended) this.cinemaBigPlay.hidden = false;
      }

      if (this.cinemaScreen) {
        this.cinemaScreen.classList.toggle("is-projecting", hasFilm);
      }

      this._syncProgress();
    },

    _syncProgress: function () {
      if (!this.cinemaVideo) return;
      var duration = Number.isFinite(this.cinemaVideo.duration) ? this.cinemaVideo.duration : 0;
      var current = Number.isFinite(this.cinemaVideo.currentTime) ? this.cinemaVideo.currentTime : 0;
      var percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

      if (this.cinemaProgress) {
        this.cinemaProgress.value = String(percent);
        this.cinemaProgress.style.setProperty("--progress", percent.toFixed(2) + "%");
        this.cinemaProgress.setAttribute(
          "aria-valuetext",
          this._formatTime(current) + " de " + this._formatTime(duration)
        );
      }
      if (this.cinemaTime) {
        this.cinemaTime.textContent = this._formatTime(current) + " / " + this._formatTime(duration);
      }
    },

    _onSeek: function () {
      if (!this.cinemaVideo) return;
      var duration = Number.isFinite(this.cinemaVideo.duration) ? this.cinemaVideo.duration : 0;
      if (!duration) return;
      this.cinemaVideo.currentTime = (Number(this.cinemaProgress.value) / 100) * duration;
      this._syncProgress();
    },

    _onCinemaError: function () {
      if (!this.cinemaVideo || this.selectedFilm < 0) return;
      if (this.cinemaLoading) this.cinemaLoading.hidden = true;
      if (this.cinemaScreen) this.cinemaScreen.classList.remove("is-projecting");
      this.filmButtons.forEach(function (button) {
        button.classList.remove("is-loading");
      });
      this._notify("No se pudo cargar este rollo. Revisa el archivo de video.");
    },

    _formatTime: function (seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
      var total = Math.floor(seconds);
      var mins = Math.floor(total / 60);
      var secs = total % 60;
      return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    },

    _notify: function (message) {
      if (window.App && typeof window.App.toast === "function") {
        window.App.toast(message);
      }
    }
  };

  window.Workshops = Workshops;
})();
