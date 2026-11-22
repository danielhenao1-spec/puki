/*
 * wd-modal.js
 * Galería de Walt Disney, pergamino y tres banderines.
 */
(function () {
  "use strict";

  var PANELS = [
    {
      title: "El Niño que Amaba Dibujar",
      text: "Antes de construir castillos mágicos, Walt Disney era un niño curioso al que le encantaba dibujar animales en su cuaderno y soñar con historias donde los lápices cobraban vida."
    },
    {
      title: "Un Ratón y el Sonido Mágico",
      text: "Junto a su amigo Mickey, creó las primeras caricaturas con música y efectos de sonido sincronizados, demostrando que un dibujo podía hacernos reír, bailar y emocionarnos."
    },
    {
      title: "El Castillo de los Sueños",
      text: "Su mayor deseo fue crear un lugar donde niños y adultos pudieran entrar dentro de sus cuentos favoritos. Hoy, su legado nos recuerda que si puedes soñarlo, puedes hacerlo."
    }
  ];

  var SLIDE_COUNT = 6;
  var AUTOPLAY_MS = 3800;

  var WDModal = {
    root: null,
    slides: [],
    dots: [],
    tabs: [],
    currentTab: 0,
    currentSlide: 0,
    timer: null,
    isActive: false,
    panelTitle: null,
    panelText: null,
    panelContent: null,
    frameInterval: null,

    init: function () {
      this.root = document.querySelector('[data-scene="modal-wd"]');
      if (!this.root) return;

      this.slides = Array.prototype.slice.call(this.root.querySelectorAll(".wd-slide"));
      this.tabs = Array.prototype.slice.call(this.root.querySelectorAll(".wd-tab"));
      this.panelTitle = this.root.querySelector("#wd-panel-title");
      this.panelText = this.root.querySelector("#wd-panel-text");
      this.panelContent = this.root.querySelector(".wd-scroll__content");

      var dotsHost = this.root.querySelector("#wd-dots");
      if (dotsHost) {
        dotsHost.setAttribute("role", "group");
        dotsHost.setAttribute("aria-label", "Seleccionar fotografía");
        for (var i = 0; i < SLIDE_COUNT; i += 1) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "wd-dot" + (i === 0 ? " is-active" : "");
          dot.setAttribute("aria-label", "Ver fotografía " + (i + 1) + " de " + SLIDE_COUNT);
          dot.setAttribute("aria-pressed", i === 0 ? "true" : "false");
          dot.dataset.slide = String(i);
          dot.addEventListener("click", this._onDotClick.bind(this, i));
          dotsHost.appendChild(dot);
          this.dots.push(dot);
        }
      }

      var prev = this.root.querySelector("#wd-prev");
      var next = this.root.querySelector("#wd-next");
      if (prev) prev.addEventListener("click", this._onPrev.bind(this));
      if (next) next.addEventListener("click", this._onNext.bind(this));

      this.tabs.forEach(function (tab, index) {
        tab.addEventListener("click", this._onTabClick.bind(this, index));
        tab.addEventListener("keydown", this._onTabKeydown.bind(this));
      }, this);

      var slider = this.root.querySelector("#wd-slider");
      if (slider) {
        slider.addEventListener("pointerenter", this._pauseAutoplay.bind(this));
        slider.addEventListener("pointerleave", this._maybeResumeAutoplay.bind(this));
      }

      document.addEventListener("visibilitychange", this._onVisibilityChange.bind(this));

      var firstPanel = PANELS[0];
      if (this.panelTitle) this.panelTitle.textContent = firstPanel.title;
      if (this.panelText) this.panelText.textContent = firstPanel.text;

      // Precalienta las imágenes para que el carrusel no parpadee.
      window.setTimeout(function () {
        for (var n = 1; n <= SLIDE_COUNT; n += 1) {
          var image = new Image();
          image.src = "./recursos/wd-" + n + ".jpg";
        }
      }, 800);
    },

    enter: function () {
      this.isActive = true;
      this.setTab(0, true);
      this.setSlide(0, true);
      this._startAutoplay();
    },

    leave: function () {
      this.isActive = false;
      this._stopAutoplay();
    },

    resume: function () {
      if (this.isActive) this._startAutoplay();
    },

    setTab: function (index, skipSound) {
      var safeIndex = ((index % PANELS.length) + PANELS.length) % PANELS.length;
      if (safeIndex === this.currentTab && this.isActive && skipSound !== true) {
        // Aun así refresca el contenido si se llama de forma explícita.
      }
      this.currentTab = safeIndex;
      var panel = PANELS[safeIndex];

      this.tabs.forEach(function (tab, i) {
        var isSelected = i === safeIndex;
        tab.classList.toggle("is-active", isSelected);
        tab.setAttribute("aria-selected", isSelected ? "true" : "false");
        tab.setAttribute("tabindex", isSelected ? "0" : "-1");
      });

      if (this.panelTitle) this.panelTitle.textContent = panel.title;
      if (this.panelText) this.panelText.textContent = panel.text;

      if (this.panelContent && !skipSound) {
        this.panelContent.classList.remove("is-changing");
        // Forzamos reinicio de la animación.
        void this.panelContent.offsetWidth;
        this.panelContent.classList.add("is-changing");
        window.setTimeout(function () {
          if (this.panelContent) this.panelContent.classList.remove("is-changing");
        }.bind(this), 540);
      }

      var panelElement = this.root.querySelector("#wd-panel");
      if (panelElement) {
        panelElement.setAttribute("aria-labelledby", "wd-tab-" + safeIndex);
      }

      if (!skipSound && window.SoundFX) {
        window.SoundFX.page();
      }
    },

    setSlide: function (index, instant) {
      var safeIndex = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
      this.currentSlide = safeIndex;

      this.slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === safeIndex);
        slide.setAttribute("aria-hidden", i === safeIndex ? "false" : "true");
      });

      this.dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === safeIndex);
        dot.setAttribute("aria-pressed", i === safeIndex ? "true" : "false");
      });

      if (!instant && window.SoundFX) {
        window.SoundFX.page();
      }
    },

    nextSlide: function () {
      this.setSlide(this.currentSlide + 1);
      this._restartAutoplay();
    },

    prevSlide: function () {
      this.setSlide(this.currentSlide - 1);
      this._restartAutoplay();
    },

    _onTabClick: function (index) {
      this.setTab(index);
    },

    _onPrev: function () {
      this.prevSlide();
    },

    _onNext: function () {
      this.nextSlide();
    },

    _onDotClick: function (index) {
      this.setSlide(index);
      this._restartAutoplay();
    },

    _onTabKeydown: function (event) {
      var key = event.key;
      var index = this.currentTab;
      var nextIndex = null;

      if (key === "ArrowDown" || key === "ArrowRight") nextIndex = index + 1;
      else if (key === "ArrowUp" || key === "ArrowLeft") nextIndex = index - 1;
      else if (key === "Home") nextIndex = 0;
      else if (key === "End") nextIndex = PANELS.length - 1;

      if (nextIndex === null) return;
      event.preventDefault();
      var safe = ((nextIndex % PANELS.length) + PANELS.length) % PANELS.length;
      this.setTab(safe);
      this.tabs[safe].focus();
    },

    _startAutoplay: function () {
      this._stopAutoplay();
      if (!this.isActive || document.hidden) return;
      this.timer = window.setInterval(function () {
        this.setSlide(this.currentSlide + 1);
      }.bind(this), AUTOPLAY_MS);
    },

    _restartAutoplay: function () {
      this._startAutoplay();
    },

    _stopAutoplay: function () {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    },

    _pauseAutoplay: function () {
      this._stopAutoplay();
    },

    _maybeResumeAutoplay: function () {
      if (this.isActive) this._startAutoplay();
    },

    _onVisibilityChange: function () {
      if (document.hidden) this._stopAutoplay();
      else if (this.isActive) this._startAutoplay();
    }
  };

  window.WDModal = WDModal;
})();
