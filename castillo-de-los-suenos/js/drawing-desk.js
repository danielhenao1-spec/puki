/*
 * drawing-desk.js
 * Taller de Dibujo y mesa mágica:
 * - 5 pares boceto JPG / animación MP4.
 * - Pincel arrastrable con colisión en el centro del boceto.
 * - Cruce suave entre bocetos y retorno mágico del pincel.
 */
(function () {
  "use strict";

  var SKETCHES = [
    { still: "./recursos/caricatura-1-boceto.jpg", video: "./recursos/caricatura-1-animacion.mp4", title: "Boceto 1" },
    { still: "./recursos/caricatura-2-boceto.jpg", video: "./recursos/caricatura-2-animacion.mp4", title: "Boceto 2" },
    { still: "./recursos/caricatura-3-boceto.jpg", video: "./recursos/caricatura-3-animacion.mp4", title: "Boceto 3" },
    { still: "./recursos/caricatura-4-boceto.jpg", video: "./recursos/caricatura-4-animacion.mp4", title: "Boceto 4" },
    { still: "./recursos/caricatura-5-boceto.jpg", video: "./recursos/caricatura-5-animacion.mp4", title: "Boceto 5" }
  ];

  // Todos los bocetos se animan durante el mismo tramo que el primero.
  // El archivo del boceto 2 contiene una animación mucho más larga; sin este
  // límite parecía seguir reproduciendo escenas después de la primera.
  var ANIMATION_MAX_SECONDS = 9.9;

  var SPARKLE_GLYPHS = ["✦", "✧", "⋆", "✩", "·", "★"];

  var DrawingDesk = {
    initialized: false,
    currentIndex: 0,
    isRevealed: false,
    isActive: false,
    isDragging: false,
    isChanging: false,
    animationEnded: false,
    animationTimer: null,
    dragPointerId: null,
    dragStartX: 0,
    dragStartY: 0,
    offsetX: 0,
    offsetY: 0,
    liveX: 0,
    liveY: 0,
    lastPointerAction: 0,
    lastSketchChange: 0,
    loadToken: 0,
    returnAnimation: null,
    roomVideo: null,
    deskButton: null,
    stage: null,
    sketchWrap: null,
    sketchStage: null,
    sketchVideo: null,
    sketchStill: null,
    sketchStillIncoming: null,
    sketchPrev: null,
    sketchNext: null,
    sketchCount: null,
    sketchDots: [],
    sketchHint: null,
    brush: null,
    sparkles: null,
    lives: null,

    init: function () {
      if (this.initialized) return;
      this.initialized = true;

      this.roomVideo = document.getElementById("dibujo-personaje");
      this.deskButton = document.getElementById("desk-open");
      this.stage = document.getElementById("mesa-stage");
      this.sketchWrap = document.querySelector(".sketch-wrap");
      this.sketchStage = document.getElementById("sketch-stage");
      this.sketchVideo = document.getElementById("sketch-anim-video");
      this.sketchStill = document.getElementById("sketch-still-img");
      this.sketchStillIncoming = document.getElementById("sketch-still-next");
      this.sketchFreeze = document.getElementById("sketch-freeze");
      this.sketchPrev = document.getElementById("sketch-prev");
      this.sketchNext = document.getElementById("sketch-next");
      this.sketchCount = document.getElementById("sketch-count");
      this.sketchDots = Array.prototype.slice.call(document.querySelectorAll("#sketch-dots span"));
      this.sketchHint = document.getElementById("sketch-hint");
      this.brush = document.getElementById("magic-brush");
      this.sparkles = document.getElementById("sketch-sparkles");
      this.lives = document.getElementById("drawing-live");
      if (this.sketchVideo) this.sketchVideo.loop = false;

      this._bindDesk();
      this._bindSketch();
      this._bindBrush();
      this._bindVideoEvents();
      this._preloadStills();
      this.loadSketch(0, true);
    },

    enterRoom: function () {
      this.isActive = true;
      if (!this.roomVideo) return;
      var promise = this.roomVideo.play();
      if (promise && promise.catch) promise.catch(function () {});
    },

    leaveRoom: function () {
      if (this.roomVideo) this.roomVideo.pause();
    },

    enterMesa: function () {
      this.isActive = true;
      this.loadSketch(this.currentIndex, true);
      window.requestAnimationFrame(function () {
        this.resetBrush(true);
      }.bind(this));
    },

    suspendMedia: function () {
      this._pauseVideo();
      if (this.roomVideo) this.roomVideo.pause();
      this._cancelDrag();
      this._cancelReturn();
    },

    leaveMesa: function () {
      this.isActive = false;
      this._cancelDrag();
      this._cancelReturn();
      this._pauseVideo();
      this._clearSparkles();
      this.isRevealed = false;
      if (this.sketchStage) this.sketchStage.classList.remove("is-revealed", "is-near", "is-changing");
      this._setStillActive(this.sketchStill, true);
      this.resetBrush(true);
      this.loadSketch(0, true);
    },

    /* ───────────────────── CARGA Y TRANSICIÓN DE BOCETOS ───────────────────── */
    loadSketch: function (index, silent, fromNavigation) {
      // Cambiar de boceto es una acción exclusivamente manual. Las cargas
      // internas (entrar a la mesa, restaurar la escena) son silenciosas; si
      // algún evento intentara avanzar solo, aquí queda bloqueado.
      if (!silent && !fromNavigation) return;
      var safeIndex = ((index % SKETCHES.length) + SKETCHES.length) % SKETCHES.length;
      var data = SKETCHES[safeIndex];
      var wasRevealed = this.isRevealed || (this.sketchStage && this.sketchStage.classList.contains("is-revealed"));
      var token = ++this.loadToken;
      this.animationEnded = false;

      this.currentIndex = safeIndex;
      this.isRevealed = false;
      this.isChanging = true;
      this._clearAnimationTimer();
      this._pauseVideo();
      this._clearSparkles();

      if (this.sketchStage) {
        this.sketchStage.classList.remove("is-near", "is-finished");
        this.sketchStage.classList.add("is-changing");
      }

      if (this.sketchCount) this.sketchCount.textContent = "Boceto " + (safeIndex + 1) + " de 5";
      this.sketchDots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === safeIndex);
      });
      if (this.sketchHint) this.sketchHint.textContent = "Pincel listo ✦";
      if (this.sketchStage) {
        this.sketchStage.setAttribute(
          "aria-label",
          "Boceto " + (safeIndex + 1) + " de 5. Toca el centro del dibujo o arrastra la punta del pincel mágico hasta su centro para animarlo."
        );
      }

      this.resetBrush(true);
      this._prepareVideo(data.video);

      var outgoing = this.sketchStill;
      var incoming = this.sketchStillIncoming;
      if (!outgoing || !incoming) return;

      // La capa entrante se carga oculta para no mostrar nunca el boceto
      // anterior cuando se avanza desde una animación.
      incoming.classList.remove("is-active");
      incoming.setAttribute("aria-hidden", "true");
      incoming.alt = data.title + ": dibujo a lápiz";

      var finishSwap = function () {
        if (token !== this.loadToken) return;

        outgoing.classList.remove("is-active");
        outgoing.setAttribute("aria-hidden", "true");
        incoming.classList.add("is-active");
        incoming.removeAttribute("aria-hidden");
        this.sketchStill = incoming;
        this.sketchStillIncoming = outgoing;

        if (wasRevealed) {
          // Se mantiene oculto el boceto hasta que la nueva imagen está
          // decodificada, evitando el parpadeo del boceto anterior.
          window.setTimeout(function () {
            if (token === this.loadToken && this.sketchStage) {
              this.sketchStage.classList.remove("is-revealed");
            }
          }.bind(this), 50);
        }

        window.setTimeout(function () {
          if (token === this.loadToken) {
            this.isChanging = false;
            if (this.sketchStage) this.sketchStage.classList.remove("is-changing");
          }
        }.bind(this), 620);

        if (!silent) this._announce("Boceto " + (safeIndex + 1) + " de 5.");
      }.bind(this);

      var failSwap = function () {
        if (token !== this.loadToken) return;
        this.isChanging = false;
        if (this.sketchStage) this.sketchStage.classList.remove("is-changing");
        if (wasRevealed && this.sketchStage) this.sketchStage.classList.remove("is-revealed");
        this._announce("No se pudo cargar el boceto.");
      }.bind(this);

      var showWhenDecoded = function () {
        if (token !== this.loadToken) return;
        if (incoming.decode) {
          incoming.decode().then(finishSwap).catch(finishSwap);
        } else {
          finishSwap();
        }
      }.bind(this);

      if (incoming.getAttribute("src") === data.still && incoming.complete && incoming.naturalWidth) {
        showWhenDecoded();
      } else {
        incoming.onload = showWhenDecoded;
        incoming.onerror = failSwap;
        incoming.src = data.still;
      }
    },

    _prepareVideo: function (src) {
      if (!this.sketchVideo) return;
      var video = this.sketchVideo;
      video.pause();
      video.muted = true;
      video.src = src;
      video.load();
      var onMeta = function () {
        video.removeEventListener("loadedmetadata", onMeta);
        try {
          video.currentTime = 0;
        } catch (error) {
          /* noop */
        }
        video.pause();
      };
      video.addEventListener("loadedmetadata", onMeta);
    },

    _bindVideoEvents: function () {
      if (!this.sketchVideo) return;
      this.sketchVideo.addEventListener("ended", function () {
        this._finishSketchAnimation();
      }.bind(this));

      this.sketchVideo.addEventListener("timeupdate", function () {
        if (!this.isRevealed || this.animationEnded) return;
        if (this.sketchVideo.currentTime >= this._animationStopTime()) {
          this._finishSketchAnimation();
        }
      }.bind(this));

      this.sketchVideo.addEventListener("error", function () {
        if (window.SoundFX) window.SoundFX.restoreAmbient(600);
        if (this.sketchHint) this.sketchHint.textContent = "Pincel listo ✦";
      }.bind(this));
    },

    _finishSketchAnimation: function () {
      if (!this.sketchVideo || this.animationEnded) return;
      // El final de una animación no navega a otro boceto: se queda en el
      // último fotograma hasta que el usuario pulse una flecha.
      this.animationEnded = true;
      this.isRevealed = true;
      this._clearAnimationTimer();
      try {
        this.sketchVideo.pause();
      } catch (error) {
        /* noop */
      }
      this._freezeSketchFrame();
      if (this.sketchStage) {
        // El canvas congelado y el video quedan visibles hasta que el usuario
        // pulse una flecha o toque de nuevo para repetir.
        this.sketchStage.classList.add("is-revealed", "is-finished");
        this.sketchStage.classList.remove("is-changing");
      }
      if (window.SoundFX) window.SoundFX.restoreAmbient(900);
      if (this.sketchHint) this.sketchHint.textContent = "Toca para repetir ✦";
      this._announce("La animación terminó. Toca el dibujo para repetirla.");
    },

    _animationStopTime: function () {
      var duration = this.sketchVideo && isFinite(this.sketchVideo.duration)
        ? this.sketchVideo.duration
        : ANIMATION_MAX_SECONDS;
      // Se detiene un poco antes del final: algunos mp4 muestran un último
      // fotograma en blanco y negro que parecía devolver la mesa al boceto.
      return Math.min(ANIMATION_MAX_SECONDS, Math.max(0, duration - 0.25));
    },

    _scheduleAnimationStop: function (restart) {
      this._clearAnimationTimer();
      if (!this.sketchVideo) return;
      var current = restart ? 0 : this.sketchVideo.currentTime;
      var remaining = Math.max(
        0,
        (this._animationStopTime() - current) / (this.sketchVideo.playbackRate || 1)
      ) * 1000;
      this.animationTimer = window.setTimeout(function () {
        this._finishSketchAnimation();
      }.bind(this), remaining);
    },

    _clearAnimationTimer: function () {
      if (this.animationTimer) {
        window.clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }
    },

    _freezeSketchFrame: function () {
      var video = this.sketchVideo;
      var canvas = this.sketchFreeze;
      if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext("2d");
        // Se recorta el borde oscuro de 2 px del lado izquierdo del mp4.
        var crop = Math.min(2, canvas.width - 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          video,
          crop, 0, canvas.width - crop, canvas.height,
          0, 0, canvas.width, canvas.height
        );
      } catch (error) {
        /* Si el navegador no permite dibujar el video, queda el video pausado. */
      }
    },

    nextSketch: function () {
      this._changeSketch(1);
    },

    prevSketch: function () {
      this._changeSketch(-1);
    },

    _changeSketch: function (delta) {
      var now = Date.now();
      if (this.isChanging || now - this.lastSketchChange < 700) return;
      this.lastSketchChange = now;
      if (window.SoundFX) window.SoundFX.page();
      this.loadSketch(this.currentIndex + delta, false, true);
    },

    /* ───────────────────── PINCEL ───────────────────── */
    resetBrush: function (instant) {
      if (!this.brush) return;
      if (this.isDragging) this._cancelDrag();
      if (instant) {
        this._cancelReturn();
        this.offsetX = 0;
        this.offsetY = 0;
        this.liveX = 0;
        this.liveY = 0;
        this.brush.classList.remove("is-dragging", "is-returning");
        this.brush.style.transform = "translate3d(0px, 0px, 0)";
      } else {
        this._returnBrush(false);
      }
    },

    _returnBrush: function (instant) {
      if (!this.brush) return;
      this._cancelReturn();
      var fromX = this.liveX;
      var fromY = this.liveY;
      this.brush.classList.remove("is-dragging");
      if (instant || (!fromX && !fromY) || !this.brush.animate) {
        this._finishBrushReturn();
        return;
      }

      var lift = Math.min(90, 34 + Math.abs(fromY) * 0.16);
      var midX = fromX * 0.48;
      var midY = fromY * 0.48 - lift;
      this.brush.classList.add("is-returning");
      this.returnAnimation = this.brush.animate([
        { transform: "translate3d(" + fromX + "px, " + fromY + "px, 0) rotate(0deg) scale(1)" },
        { transform: "translate3d(" + midX + "px, " + midY + "px, 0) rotate(-7deg) scale(0.88)", offset: 0.55 },
        { transform: "translate3d(0px, 0px, 0) rotate(0deg) scale(1)" }
      ], {
        duration: 1180,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
      this.returnAnimation.onfinish = function () {
        this._finishBrushReturn();
      }.bind(this);
      this.returnAnimation.oncancel = function () {
        this.returnAnimation = null;
      }.bind(this);
    },

    _finishBrushReturn: function () {
      var animation = this.returnAnimation;
      this.returnAnimation = null;
      if (animation) {
        try {
          animation.cancel();
        } catch (error) {
          /* noop */
        }
      }
      if (this.brush) {
        this.brush.style.transform = "translate3d(0px, 0px, 0)";
        this.brush.classList.remove("is-returning");
      }
      this.offsetX = 0;
      this.offsetY = 0;
      this.liveX = 0;
      this.liveY = 0;
    },

    _cancelReturn: function () {
      if (this.returnAnimation) {
        try {
          this.returnAnimation.cancel();
        } catch (error) {
          /* noop */
        }
        this.returnAnimation = null;
      }
      if (this.brush) this.brush.classList.remove("is-returning");
    },

    _bindDesk: function () {
      if (!this.deskButton) return;
      this.deskButton.addEventListener("pointerdown", function (event) {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        this.lastPointerAction = Date.now();
        this._openDesk();
      }.bind(this));
      this.deskButton.addEventListener("click", function () {
        if (Date.now() - this.lastPointerAction < 500) return;
        this._openDesk();
      }.bind(this));
    },

    _openDesk: function () {
      if (window.SoundFX) window.SoundFX.magic(0.55);
      if (window.App && typeof window.App.goTo === "function") {
        window.App.goTo("dibujo-mesa");
      }
    },

    _bindSketch: function () {
      if (this.sketchPrev) {
        this.sketchPrev.addEventListener("pointerdown", function (event) {
          if (event.button !== undefined && event.button !== 0) return;
          event.preventDefault();
          this.lastPointerAction = Date.now();
          this.prevSketch();
        }.bind(this));
        this.sketchPrev.addEventListener("click", function (event) {
          if (Date.now() - this.lastPointerAction < 650) return;
          if (event.detail === 0) this.prevSketch();
        }.bind(this));
      }

      if (this.sketchNext) {
        this.sketchNext.addEventListener("pointerdown", function (event) {
          if (event.button !== undefined && event.button !== 0) return;
          event.preventDefault();
          this.lastPointerAction = Date.now();
          this.nextSketch();
        }.bind(this));
        this.sketchNext.addEventListener("click", function (event) {
          if (Date.now() - this.lastPointerAction < 650) return;
          if (event.detail === 0) this.nextSketch();
        }.bind(this));
      }

      if (this.sketchStage) {
        this.sketchStage.addEventListener("click", function (event) {
          if (Date.now() - this.lastPointerAction < 240) return;
          if (event.detail === 0) {
            this._reveal();
            return;
          }
          if (this._pointerInCore(event.clientX, event.clientY)) {
            this._reveal(event.clientX, event.clientY);
          } else {
            if (this.sketchHint) this.sketchHint.textContent = "Lleva el pincel al centro ✦";
            this._announce("Acerca el pincel al centro del dibujo para darle vida.");
          }
        }.bind(this));

        this.sketchStage.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this._reveal();
          }
        }.bind(this));
      }
    },

    _bindBrush: function () {
      if (!this.brush) return;

      this.brush.addEventListener("pointerdown", function (event) {
        if (event.button !== undefined && event.button !== 0) return;
        if (!this.isActive) return;
        event.preventDefault();
        event.stopPropagation();
        this._cancelReturn();
        this._finishBrushReturn();
        this.lastPointerAction = Date.now();
        this.isDragging = true;
        this.dragPointerId = event.pointerId;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.brush.classList.remove("is-returning");
        this.brush.classList.add("is-dragging");
        try {
          this.brush.setPointerCapture(event.pointerId);
        } catch (error) {
          /* noop */
        }
        if (window.SoundFX) window.SoundFX.page();
      }.bind(this));

      this.brush.addEventListener("pointermove", function (event) {
        if (!this.isDragging || event.pointerId !== this.dragPointerId) return;
        event.preventDefault();
        this.liveX = this.offsetX + (event.clientX - this.dragStartX);
        this.liveY = this.offsetY + (event.clientY - this.dragStartY);
        this.brush.style.transform = "translate3d(" + this.liveX + "px, " + this.liveY + "px, 0)";
        this._nearSketch(event.clientX, event.clientY);
        if (!this.isRevealed && this._brushTipInCore()) {
          this._triggerOnSketch(event.clientX, event.clientY);
        }
      }.bind(this));

      var finishDrag = function (event) {
        if (!this.isDragging || (event.pointerId !== undefined && event.pointerId !== this.dragPointerId)) return;
        var wasOver = this._brushTipInCore();
        this.offsetX = this.liveX;
        this.offsetY = this.liveY;
        this._endDrag();
        if (!this.isRevealed && wasOver) {
          this._triggerOnSketch(event.clientX, event.clientY);
        } else {
          this._nearSketch(-1, -1);
          this._returnBrush(false);
        }
      }.bind(this);

      this.brush.addEventListener("pointerup", finishDrag);
      this.brush.addEventListener("pointercancel", function () {
        this._endDrag();
        this._nearSketch(-1, -1);
        this._returnBrush(false);
      }.bind(this));

      this.brush.addEventListener("click", function (event) {
        if (Date.now() - this.lastPointerAction < 650) return;
        if (event.detail === 0) this._reveal();
      }.bind(this));
    },

    _endDrag: function () {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.brush) this.brush.classList.remove("is-dragging");
      if (this.dragPointerId !== null && this.brush) {
        try {
          this.brush.releasePointerCapture(this.dragPointerId);
        } catch (error) {
          /* noop */
        }
      }
      this.dragPointerId = null;
    },

    _cancelDrag: function () {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.brush) {
        this.brush.classList.remove("is-dragging");
        if (this.dragPointerId !== null) {
          try {
            this.brush.releasePointerCapture(this.dragPointerId);
          } catch (error) {
            /* noop */
          }
        }
      }
      this.dragPointerId = null;
    },

    _coreRect: function () {
      if (!this.sketchStage) return null;
      var rect = this.sketchStage.getBoundingClientRect();
      return {
        left: rect.left + rect.width * 0.25,
        right: rect.right - rect.width * 0.25,
        top: rect.top + rect.height * 0.22,
        bottom: rect.bottom - rect.height * 0.22
      };
    },

    _pointerInCore: function (clientX, clientY) {
      var core = this._coreRect();
      if (!core) return false;
      return clientX >= core.left && clientX <= core.right && clientY >= core.top && clientY <= core.bottom;
    },

    _brushTipInCore: function () {
      if (!this.brush) return false;
      var core = this._coreRect();
      if (!core) return false;
      var brushRect = this.brush.getBoundingClientRect();
      // La punta de la brocha está en la esquina inferior izquierda del PNG.
      var tipX = brushRect.left + brushRect.width * 0.14;
      var tipY = brushRect.top + brushRect.height * 0.9;
      return tipX >= core.left && tipX <= core.right && tipY >= core.top && tipY <= core.bottom;
    },

    _nearSketch: function (clientX, clientY) {
      if (!this.sketchStage) return;
      var isNear = false;
      if (clientX >= 0 && clientY >= 0) {
        var rect = this.sketchStage.getBoundingClientRect();
        var margin = rect.width * 0.18;
        isNear = clientX >= rect.left - margin && clientX <= rect.right + margin &&
          clientY >= rect.top - margin && clientY <= rect.bottom + margin;
      }
      this.sketchStage.classList.toggle("is-near", Boolean(isNear) && !this.isRevealed);
    },

    _triggerOnSketch: function (clientX, clientY) {
      if (this.isRevealed || this.isChanging) return;
      this._endDrag();
      this._returnBrush(false);
      this._reveal(clientX, clientY);
    },

    _reveal: function (clientX, clientY) {
      if (!this.sketchVideo || this.isChanging) return;

      if (this.isRevealed) {
        // Un segundo toque central repite la animación.
        try {
          this.sketchVideo.currentTime = 0;
        } catch (error) {
          /* noop */
        }
        this.sketchVideo.muted = false;
        this.sketchVideo.volume = 0.92;
        this.animationEnded = false;
        if (this.sketchStage) {
          this.sketchStage.classList.add("is-revealed");
          this.sketchStage.classList.remove("is-finished");
        }
        var replay = this.sketchVideo.play();
        // El seek a 0 todavía puede estar pendiente: programar desde el inicio.
        this._scheduleAnimationStop(true);
        if (replay && replay.catch) {
          replay.catch(function () {
            this._clearAnimationTimer();
            if (this.sketchStill) this._setStillActive(this.sketchStill, true);
          }.bind(this));
        }
        if (window.SoundFX) {
          window.SoundFX.magic(0.7);
          window.SoundFX.duckAmbient(0.16, 450);
        }
        this._clearSparkles();
        this._spawnSparkles(clientX, clientY);
        return;
      }

      this.isRevealed = true;
      this.animationEnded = false;
      if (this.sketchStage) {
        this.sketchStage.classList.add("is-revealed");
        this.sketchStage.classList.remove("is-near", "is-finished");
      }

      try {
        this.sketchVideo.currentTime = 0;
      } catch (error) {
        /* noop */
      }
      // El toque del usuario permite reproducir con su audio original.
      this.sketchVideo.muted = false;
      this.sketchVideo.volume = 0.92;
      var playPromise = this.sketchVideo.play();
      this._scheduleAnimationStop(true);
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          this._clearAnimationTimer();
          this.isRevealed = false;
          if (this.sketchStage) this.sketchStage.classList.remove("is-revealed");
          this._setStillActive(this.sketchStill, true);
          if (window.SoundFX) window.SoundFX.restoreAmbient(500);
          this._announce("No se pudo reproducir la animación. Prueba con otro boceto.");
        }.bind(this));
      }

      this._spawnSparkles(clientX, clientY);
      if (this.sketchHint) this.sketchHint.textContent = "¡Magia! ✦";
      if (window.SoundFX) {
        window.SoundFX.magic(1);
        window.SoundFX.duckAmbient(0.16, 450);
      }
      this._announce("¡Magia! El boceto " + (this.currentIndex + 1) + " cobró vida.");
    },

    _setStillActive: function (image, active) {
      if (!image) return;
      image.classList.toggle("is-active", active);
      if (active) image.removeAttribute("aria-hidden");
      else image.setAttribute("aria-hidden", "true");
    },

    _spawnSparkles: function (clientX, clientY) {
      if (!this.sparkles) return;
      var count = 24;
      for (var i = 0; i < count; i += 1) {
        var particle = document.createElement("span");
        particle.className = "sparkle-particle";
        particle.textContent = SPARKLE_GLYPHS[Math.floor(Math.random() * SPARKLE_GLYPHS.length)];
        var angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
        var distance = 18 + Math.random() * 34;
        var dx = Math.cos(angle) * distance;
        var dy = Math.sin(angle) * distance;
        particle.style.setProperty("--dx", dx.toFixed(1) + "vmin");
        particle.style.setProperty("--dy", dy.toFixed(1) + "vmin");
        particle.style.setProperty("--size", (0.7 + Math.random() * 1.5).toFixed(2) + "vmin");
        particle.style.setProperty("--duration", (0.8 + Math.random() * 0.9).toFixed(2) + "s");
        particle.style.setProperty("--delay", (Math.random() * 0.26).toFixed(2) + "s");
        particle.style.setProperty("--rot", (Math.random() * 360 - 180).toFixed(0) + "deg");
        particle.style.setProperty("--scale", (0.7 + Math.random() * 0.8).toFixed(2));
        this.sparkles.appendChild(particle);
        window.setTimeout(function (node) {
          return function () { node.remove(); };
        }(particle), 2200);
      }
      void clientX;
      void clientY;
    },

    _clearSparkles: function () {
      if (this.sparkles) this.sparkles.innerHTML = "";
    },

    _pauseVideo: function () {
      if (!this.sketchVideo) return;
      this._clearAnimationTimer();
      this.sketchVideo.pause();
      if (window.SoundFX) window.SoundFX.restoreAmbient(700);
    },

    _preloadStills: function () {
      window.setTimeout(function () {
        SKETCHES.forEach(function (sketch) {
          var image = new Image();
          image.src = sketch.still;
        });
      }, 900);
    },

    _announce: function (message) {
      if (!this.lives) return;
      this.lives.textContent = "";
      window.setTimeout(function () {
        if (this.lives) this.lives.textContent = message;
      }.bind(this), 30);
    }
  };

  window.DrawingDesk = DrawingDesk;
})();
