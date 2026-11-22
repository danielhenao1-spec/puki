/*
 * sound-fx.js
 * Pequeño motor de audio procedural para la experiencia.
 *
 * - No necesita archivos externos: sintetiza instrumentos, proyector,
 *   magia y transiciones con Web Audio API.
 * - El contexto se crea/desbloquea con el primer gesto real del usuario.
 * - Si más adelante se agregan audios a ./recursos/, se pueden enlazar con
 *   SoundFX.setExternal('xylophone', './recursos/xilofono.mp3') y el motor
 *   usará el archivo en lugar del sintetizador (con fallback automático).
 */
(function () {
  "use strict";

  var NOTE = {
    C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
    C6: 1046.5, E6: 1318.51, G6: 1567.98
  };

  var PENTATONIC = [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5, NOTE.C6];

  /*
   * Audio externo opcional.
   * Si más adelante se agregan archivos a ./recursos/, escribe su ruta aquí.
   * Si el archivo no existe o falla, el sintetizador actúa como respaldo.
   *
   * Ejemplo:
   *   xylophone: "./recursos/sonido-xilofono.mp3",
   *   projector: "./recursos/proyector.mp3"
   */
  var EXTERNAL_AUDIO = {
    xylophone: null,
    cymbal: null,
    trumpet: null,
    drum: null,
    bell: null,
    projector: null,
    magic: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function SoundFXBus() {
    this.ctx = null;
    this.master = null;
    this.compressor = null;
    this.noiseBuffer = null;
    this.enabled = true;
    this.external = Object.create(null);
    this.externalCache = Object.create(null);
    this.volume = 0.72;
    this.muted = false;
    this._mutedMedia = new WeakMap();
    this._mediaMuteBound = false;
    this._lastCymbal = 0;
    this._lastMagic = 0;
    this.ambient = Object.create(null);
    this.ambientCurrent = null;
    this.ambientPending = null;
    this.ambientDuck = 1;
    this.ambientTimers = Object.create(null);
  }

  SoundFXBus.prototype._ensureContext = function () {
    if (this.ctx) return true;
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 5;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.22;

      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      this._buildNoise();
      return true;
    } catch (error) {
      this.ctx = null;
      return false;
    }
  };

  SoundFXBus.prototype.unlock = function () {
    try {
      if (!this._ensureContext()) return;
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(function () {});
      }
      if (this.ambientPending) {
        var pending = this.ambientPending;
        this.ambientPending = null;
        this._startAmbient(pending);
      } else if (this.ambientCurrent && !document.hidden) {
        var current = this.ambient[this.ambientCurrent];
        if (current && current.audio.paused) {
          this._startAmbient(this.ambientCurrent, 700);
        }
      }
    } catch (error) {
      // El audio es un refuerzo, nunca debe romper la navegación.
      this.ctx = null;
    }
  };

  /* ───────────────────── AUDIO AMBIENTAL ───────────────────── */
  SoundFXBus.prototype.initAmbient = function (name, url, volume) {
    if (!name || !url || this.ambient[name]) return;
    try {
      var audio = new Audio();
      audio.src = url;
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audio.setAttribute("playsinline", "");
      audio.setAttribute("aria-hidden", "true");
      audio.dataset.ambientTrack = name;
      audio.style.display = "none";
      // Mantenerlo en el documento permite que el navegador lo detenga de
      // forma fiable al descargar la página.
      if (document.body) document.body.appendChild(audio);
      this.ambient[name] = {
        audio: audio,
        volume: clamp(volume == null ? 0.36 : volume, 0, 1)
      };
    } catch (error) {
      this.ambient[name] = null;
    }
  };

  SoundFXBus.prototype.playAmbient = function (name, fade) {
    var entry = this.ambient[name];
    if (!entry) return;
    if (this.ambientCurrent === name && !entry.audio.paused) return;

    // Ninguna otra pista puede quedar sonando: se agota también cualquier
    // audio huérfano que hubiera quedado de una transición anterior.
    Object.keys(this.ambient).forEach(function (other) {
      if (other === name) return;
      var otherEntry = this.ambient[other];
      if (!otherEntry || !otherEntry.audio) return;
      if (!otherEntry.audio.paused) {
        if (fade && fade > 0) this._fadeOutAmbient(other, fade);
        else {
          try { otherEntry.audio.pause(); } catch (error) { /* noop */ }
          otherEntry.audio.volume = 0;
        }
      } else {
        otherEntry.audio.volume = 0;
      }
    }, this);

    // Cada pista nueva arranca a su volumen natural. El ducking es temporal
    // y pertenece al medio que estaba sonando, no a la siguiente escena.
    if (this.ambientCurrent !== name) this.ambientDuck = 1;
    this.ambientCurrent = name;
    this.ambientPending = null;
    this._startAmbient(name, fade || 1100);
  };

  SoundFXBus.prototype._startAmbient = function (name, fade) {
    var entry = this.ambient[name];
    if (!entry) return;
    // Una pestaña oculta no debe iniciar música. Se deja pendiente para
    // reanudarla cuando la instancia vuelva a estar visible.
    if (document.hidden) {
      if (this.ambientCurrent === name) this.ambientPending = name;
      return;
    }
    var audio = entry.audio;
    var self = this;
    var target = entry.volume * this.ambientDuck;
    var promise = audio.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        // El navegador puede bloquear el autoplay hasta el primer gesto.
        if (self.ambientCurrent === name) self.ambientPending = name;
        try { audio.pause(); } catch (error) { /* noop */ }
      });
    }
    this._fadeAmbientTo(audio, target, fade || 0);
  };

  SoundFXBus.prototype._fadeAmbientTo = function (audio, target, duration) {
    if (!audio) return;
    var key = audio.src;
    var self = this;
    if (this.ambientTimers[key]) {
      window.clearInterval(this.ambientTimers[key]);
      delete this.ambientTimers[key];
    }
    var from = Number.isFinite(audio.volume) ? audio.volume : 0;
    var to = clamp(target, 0, 1);
    if (!duration || duration <= 0) {
      audio.volume = to;
      return;
    }
    var start = performance.now();
    this.ambientTimers[key] = window.setInterval(function () {
      var progress = Math.min(1, (performance.now() - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 2);
      audio.volume = clamp(from + (to - from) * eased, 0, 1);
      if (progress >= 1) {
        window.clearInterval(self.ambientTimers[key]);
        delete self.ambientTimers[key];
      }
    }, 40);
  };

  SoundFXBus.prototype._fadeOutAmbient = function (name, duration) {
    var entry = this.ambient[name];
    if (!entry) return;
    var audio = entry.audio;
    this._fadeAmbientTo(audio, 0, duration || 900);
    window.setTimeout(function () {
      if (this.ambientCurrent !== name) {
        try { audio.pause(); } catch (error) { /* noop */ }
      }
    }.bind(this), (duration || 900) + 60);
  };

  SoundFXBus.prototype.stopAmbient = function (fade) {
    var current = this.ambientCurrent;
    this.ambientCurrent = null;
    this.ambientPending = null;
    this.ambientDuck = 1;

    Object.keys(this.ambient).forEach(function (name) {
      var entry = this.ambient[name];
      if (!entry || !entry.audio) return;
      if (name === current && fade && fade > 0) {
        this._fadeOutAmbient(name, fade);
      } else {
        if (this.ambientTimers[entry.audio.src]) {
          window.clearInterval(this.ambientTimers[entry.audio.src]);
          delete this.ambientTimers[entry.audio.src];
        }
        try { entry.audio.pause(); } catch (error) { /* noop */ }
        entry.audio.volume = 0;
      }
    }, this);
  };

  SoundFXBus.prototype.stopAllAmbient = function (resetTime) {
    this.ambientCurrent = null;
    this.ambientPending = null;
    this.ambientDuck = 1;

    Object.keys(this.ambientTimers).forEach(function (key) {
      window.clearInterval(this.ambientTimers[key]);
      delete this.ambientTimers[key];
    }, this);

    Object.keys(this.ambient).forEach(function (name) {
      var entry = this.ambient[name];
      if (!entry || !entry.audio) return;
      try {
        entry.audio.pause();
        if (resetTime !== false) entry.audio.currentTime = 0;
      } catch (error) {
        /* noop */
      }
      entry.audio.volume = 0;
    }, this);
  };

  SoundFXBus.prototype.pauseAllAmbient = function () {
    Object.keys(this.ambient).forEach(function (name) {
      var entry = this.ambient[name];
      if (!entry || !entry.audio) return;
      try { entry.audio.pause(); } catch (error) { /* noop */ }
    }, this);
  };

  SoundFXBus.prototype.duckAmbient = function (factor, fade) {
    this.ambientDuck = clamp(factor == null ? 0.24 : factor, 0, 1);
    if (!this.ambientCurrent) return;
    var entry = this.ambient[this.ambientCurrent];
    if (entry) this._fadeAmbientTo(entry.audio, entry.volume * this.ambientDuck, fade || 500);
  };

  SoundFXBus.prototype.restoreAmbient = function (fade) {
    this.ambientDuck = 1;
    if (!this.ambientCurrent) return;
    var entry = this.ambient[this.ambientCurrent];
    if (entry) this._fadeAmbientTo(entry.audio, entry.volume, fade || 700);
  };

  SoundFXBus.prototype.pauseAmbient = function () {
    this.pauseAllAmbient();
  };

  SoundFXBus.prototype.resumeAmbient = function () {
    if (!this.ambientCurrent) return;
    var name = this.ambientCurrent;
    var entry = this.ambient[name];
    if (!entry) return;
    if (this.ambientPending === name || entry.audio.paused) {
      this.ambientPending = null;
      this._startAmbient(name, 900);
    }
  };

  SoundFXBus.prototype.suspendContext = function () {
    if (this.ctx && this.ctx.state === "running") {
      this.ctx.suspend().catch(function () {});
    }
  };

  SoundFXBus.prototype.shutdown = function () {
    this.stopAllAmbient(true);
    if (this.ctx) {
      try { this.ctx.close(); } catch (error) { /* noop */ }
      this.ctx = null;
      this.master = null;
      this.compressor = null;
    }
  };

  SoundFXBus.prototype.setEnabled = function (value) {
    this.enabled = Boolean(value);
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime, 0.03);
    }
  };

  SoundFXBus.prototype._bindMediaMute = function () {
    if (this._mediaMuteBound) return;
    this._mediaMuteBound = true;
    document.addEventListener("play", function (event) {
      var media = event.target;
      if (!this.muted || !media || (media.tagName !== "AUDIO" && media.tagName !== "VIDEO")) return;
      if (!this._mutedMedia.has(media)) this._mutedMedia.set(media, media.muted);
      media.muted = true;
    }.bind(this), true);
  };

  SoundFXBus.prototype.setMuted = function (value) {
    var muted = Boolean(value);
    this.muted = muted;
    this.setEnabled(!muted);
    this._bindMediaMute();

    var mediaList = document.querySelectorAll("audio, video");
    Array.prototype.forEach.call(mediaList, function (media) {
      if (muted) {
        if (!this._mutedMedia.has(media)) this._mutedMedia.set(media, media.muted);
        media.muted = true;
      } else if (this._mutedMedia.has(media)) {
        media.muted = this._mutedMedia.get(media);
        this._mutedMedia.delete(media);
      }
    }, this);
  };

  SoundFXBus.prototype.setVolume = function (value) {
    this.volume = clamp(Number(value) || 0, 0, 1);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime, 0.03);
    }
  };

  SoundFXBus.prototype.setExternal = function (name, url) {
    if (!name) return;
    if (!url) {
      delete this.external[name];
      return;
    }
    this.external[name] = url;
    // Al crear el elemento dentro del objeto permitimos reutilizarlo.
    try {
      var audio = new Audio();
      audio.preload = "auto";
      audio.src = url;
      this.externalCache[name] = audio;
    } catch (error) {
      this.externalCache[name] = null;
    }
  };

  SoundFXBus.prototype._buildNoise = function () {
    if (!this.ctx || this.noiseBuffer) return;
    var length = Math.floor(this.ctx.sampleRate * 1.8);
    var buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  };

  SoundFXBus.prototype._ready = function () {
    if (!this.enabled) return false;
    this.unlock();
    return Boolean(this.ctx && this.master);
  };

  SoundFXBus.prototype._playExternal = function (name, gain, fallback) {
    var audio = this.externalCache[name];
    if (this.external[name] && audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = clamp(gain == null ? 0.9 : gain, 0, 1);
        var promise = audio.play();
        if (promise && promise.catch) {
          promise.catch(function () { fallback(); });
        }
        return true;
      } catch (error) {
        /* seguimos con síntesis */
      }
    }
    fallback();
    return false;
  };

  SoundFXBus.prototype._now = function () {
    return this.ctx.currentTime;
  };

  SoundFXBus.prototype._tone = function (frequency, duration, options) {
    if (!this._ready()) return;
    options = options || {};
    var ctx = this.ctx;
    var t0 = this._now() + (options.delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = null;
    var panner = null;

    osc.type = options.type || "sine";
    osc.frequency.setValueAtTime(Math.max(20, frequency), t0);
    if (options.endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.endFrequency), t0 + duration);
    }
    if (options.detune) {
      osc.detune.setValueAtTime(options.detune, t0);
    }

    var peak = Math.max(0.0001, options.gain == null ? 0.22 : options.gain);
    var attack = Math.max(0.001, options.attack == null ? 0.008 : options.attack);
    var release = Math.max(0.03, options.release == null ? duration : options.release);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(attack, duration * 0.5));
    if (options.sustain) {
      gain.gain.setValueAtTime(peak * options.sustain, t0 + Math.max(attack, duration * 0.28));
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration + release);

    var node = osc;
    if (options.filterFrequency) {
      filter = ctx.createBiquadFilter();
      filter.type = options.filterType || "lowpass";
      filter.frequency.setValueAtTime(options.filterFrequency, t0);
      if (options.filterEnd) {
        filter.frequency.exponentialRampToValueAtTime(Math.max(40, options.filterEnd), t0 + duration);
      }
      filter.Q.value = options.q == null ? 0.7 : options.q;
      node.connect(filter);
      node = filter;
    }

    if (ctx.createStereoPanner) {
      panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(clamp(options.pan || 0, -1, 1), t0);
      node.connect(gain);
      gain.connect(panner);
      panner.connect(this.master);
    } else {
      node.connect(gain);
      gain.connect(this.master);
    }

    osc.start(t0);
    osc.stop(t0 + duration + release + 0.03);
  };

  SoundFXBus.prototype._noise = function (duration, options) {
    if (!this._ready()) return;
    options = options || {};
    var ctx = this.ctx;
    var t0 = this._now() + (options.delay || 0);
    var source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    var filter = ctx.createBiquadFilter();
    filter.type = options.filterType || "bandpass";
    filter.frequency.setValueAtTime(options.frequency || 1200, t0);
    if (options.endFrequency) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, options.endFrequency), t0 + duration);
    }
    filter.Q.value = options.q == null ? 0.8 : options.q;
    var gain = ctx.createGain();
    var peak = Math.max(0.0001, options.gain == null ? 0.2 : options.gain);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + (options.attack || 0.006));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(t0);
    source.stop(t0 + duration + 0.03);
  };

  SoundFXBus.prototype._bellPartial = function (frequency, duration, gainValue, pan, delay, type) {
    this._tone(frequency, duration, {
      type: type || "sine",
      gain: gainValue,
      attack: 0.004,
      release: 0.18,
      pan: pan,
      delay: delay || 0
    });
  };

  SoundFXBus.prototype.xylophone = function (index, pan) {
    var self = this;
    var noteIndex = typeof index === "number" ? Math.abs(index) % PENTATONIC.length : Math.floor(Math.random() * PENTATONIC.length);
    var frequency = PENTATONIC[noteIndex];
    this._playExternal("xylophone", 0.95, function () {
      self._tone(frequency, 0.58, {
        type: "triangle",
        gain: 0.34,
        attack: 0.002,
        release: 0.36,
        pan: pan || 0
      });
      self._tone(frequency * 2, 0.22, {
        type: "sine",
        gain: 0.18,
        attack: 0.002,
        release: 0.16,
        pan: pan || 0
      });
      self._tone(frequency * 3.01, 0.12, {
        type: "sine",
        gain: 0.08,
        attack: 0.002,
        release: 0.1,
        pan: pan || 0
      });
    });
  };

  SoundFXBus.prototype.cymbal = function (pan) {
    var self = this;
    var now = performance.now();
    if (now - this._lastCymbal < 120) return;
    this._lastCymbal = now;
    this._playExternal("cymbal", 0.95, function () {
      self._noise(1.6, {
        filterType: "highpass",
        frequency: 3200,
        gain: 0.24,
        attack: 0.004
      });
      self._noise(1.25, {
        filterType: "bandpass",
        frequency: 8600,
        q: 1.2,
        gain: 0.15,
        attack: 0.002
      });
      self._tone(521, 0.9, {
        type: "triangle",
        gain: 0.065,
        attack: 0.002,
        release: 0.75,
        pan: pan || 0
      });
    });
  };

  SoundFXBus.prototype._brassTone = function (frequency, duration, gainValue, pan) {
    if (!this._ready()) return;
    var ctx = this.ctx;
    var t0 = this._now();
    var end = t0 + duration;
    var output = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    var main = ctx.createOscillator();
    var second = ctx.createOscillator();
    var body = ctx.createOscillator();
    var lfo = ctx.createOscillator();
    var lfoGain = ctx.createGain();
    var panner = null;

    filter.type = "lowpass";
    filter.Q.setValueAtTime(3.1, t0);
    filter.frequency.setValueAtTime(1050, t0);
    filter.frequency.exponentialRampToValueAtTime(4800, t0 + 0.07);
    filter.frequency.exponentialRampToValueAtTime(1900, end);

    output.gain.setValueAtTime(0.0001, t0);
    output.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.045);
    output.gain.setValueAtTime(gainValue * 0.82, t0 + duration * 0.32);
    output.gain.exponentialRampToValueAtTime(0.0001, end + 0.16);

    main.type = "sawtooth";
    main.frequency.setValueAtTime(frequency, t0);
    second.type = "sawtooth";
    second.frequency.setValueAtTime(frequency, t0);
    second.detune.setValueAtTime(7, t0);
    body.type = "square";
    body.frequency.setValueAtTime(frequency * 0.5, t0);

    // Vibrato de instrumento de viento.
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(5.4, t0);
    lfoGain.gain.setValueAtTime(6.5, t0);
    lfo.connect(lfoGain);
    lfoGain.connect(main.detune);
    lfoGain.connect(second.detune);

    var bodyGain = ctx.createGain();
    bodyGain.gain.value = 0.12;
    main.connect(filter);
    second.connect(filter);
    body.connect(bodyGain);
    bodyGain.connect(filter);
    filter.connect(output);

    if (ctx.createStereoPanner) {
      panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(clamp(pan || 0, -1, 1), t0);
      output.connect(panner);
      panner.connect(this.master);
    } else {
      output.connect(this.master);
    }

    main.start(t0);
    second.start(t0);
    body.start(t0);
    lfo.start(t0);
    main.stop(end + 0.2);
    second.stop(end + 0.2);
    body.stop(end + 0.2);
    lfo.stop(end + 0.2);

    // Aire inicial de la boquilla.
    this._noise(0.09, {
      filterType: "bandpass",
      frequency: 1600,
      endFrequency: 3200,
      q: 1.1,
      gain: 0.03,
      attack: 0.004
    });
  };

  SoundFXBus.prototype.trumpet = function (pan) {
    var self = this;
    var seq = [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5];
    var index = Math.floor(Math.random() * seq.length);
    var frequency = seq[index];
    this._playExternal("trumpet", 0.95, function () {
      self._brassTone(frequency, 0.52, 0.3, pan || 0);
      self._tone(frequency * 2, 0.28, {
        type: "sine",
        gain: 0.05,
        attack: 0.04,
        release: 0.16,
        pan: pan || 0
      });
    });
  };

  SoundFXBus.prototype.drum = function (pan) {
    var self = this;
    this._playExternal("drum", 0.95, function () {
      self._tone(138, 0.34, {
        type: "sine",
        gain: 0.5,
        attack: 0.001,
        endFrequency: 46,
        release: 0.22,
        pan: pan || 0
      });
      self._noise(0.2, {
        filterType: "bandpass",
        frequency: 2300,
        endFrequency: 1300,
        q: 0.8,
        gain: 0.34,
        attack: 0.001
      });
      self._noise(0.11, {
        filterType: "highpass",
        frequency: 4200,
        gain: 0.2,
        attack: 0.001
      });
      self._noise(0.06, {
        filterType: "highpass",
        frequency: 6200,
        gain: 0.14,
        attack: 0.001,
        delay: 0.018
      });
      self._tone(310, 0.09, {
        type: "triangle",
        gain: 0.1,
        attack: 0.001,
        release: 0.06,
        pan: pan || 0,
        delay: 0.012
      });
    });
  };

  SoundFXBus.prototype.bell = function (pan) {
    var self = this;
    this._playExternal("bell", 0.95, function () {
      var base = 987.77;
      self._bellPartial(base, 2.2, 0.23, pan || 0, 0, "sine");
      self._bellPartial(base * 2.01, 1.55, 0.12, pan || 0, 0.004, "sine");
      self._bellPartial(base * 2.4, 1.18, 0.08, pan || 0, 0.008, "sine");
      self._bellPartial(base * 3.02, 0.9, 0.055, pan || 0, 0.01, "sine");
      self._bellPartial(base * 4.18, 0.62, 0.032, pan || 0, 0.012, "triangle");
      self._bellPartial(base * 5.43, 0.38, 0.018, pan || 0, 0.014, "sine");
      self._noise(0.055, {
        filterType: "highpass",
        frequency: 5200,
        gain: 0.055,
        attack: 0.001
      });
    });
  };

  SoundFXBus.prototype.instrument = function (name, detail) {
    detail = detail || {};
    var pan = detail.pan || 0;
    switch (name) {
      case "xylophone": this.xylophone(detail.index, pan); break;
      case "cymbal": this.cymbal(pan); break;
      case "trumpet": this.trumpet(pan); break;
      case "drum": this.drum(pan); break;
      case "bell": this.bell(pan); break;
      default: this.bell(pan);
    }
  };

  SoundFXBus.prototype.projector = function () {
    var self = this;
    this._playExternal("projector", 0.8, function () {
      // Motor del proyector: un zumbido corto con pequeñas variaciones.
      self._tone(48, 0.9, {
        type: "sawtooth",
        gain: 0.055,
        attack: 0.07,
        release: 0.3,
        filterType: "lowpass",
        filterFrequency: 165,
        q: 1
      });
      self._tone(96, 0.72, {
        type: "triangle",
        gain: 0.025,
        attack: 0.1,
        release: 0.3
      });

      // Golpes mecánicos y paso del celuloide.
      var delays = [0.03, 0.19, 0.28, 0.41, 0.58, 0.73];
      delays.forEach(function (delay, index) {
        self._noise(0.055 + (index % 2) * 0.015, {
          filterType: "bandpass",
          frequency: 1400 + index * 420,
          q: 1.6,
          gain: 0.12 - index * 0.007,
          attack: 0.001,
          delay: delay
        });
        if (index % 2 === 0) {
          self._tone(140 + index * 15, 0.055, {
            type: "square",
            gain: 0.025,
            attack: 0.001,
            release: 0.035,
            delay: delay
          });
        }
      });

      self._noise(0.55, {
        filterType: "highpass",
        frequency: 2600,
        gain: 0.045,
        attack: 0.02,
        delay: 0.1
      });
    });
  };

  SoundFXBus.prototype.magic = function (intensity) {
    var self = this;
    var now = performance.now();
    if (now - this._lastMagic < 90) return;
    this._lastMagic = now;
    var boost = clamp(intensity == null ? 1 : intensity, 0.4, 1.6);
    this._playExternal("magic", 0.8, function () {
      var notes = [NOTE.C6, NOTE.E6, NOTE.G6, NOTE.C6 * 2];
      notes.forEach(function (freq, index) {
        self._tone(freq, 0.5 + index * 0.1, {
          type: "sine",
          gain: (0.09 - index * 0.012) * boost,
          attack: 0.004,
          release: 0.42,
          pan: (index % 2 === 0 ? -0.2 : 0.2),
          delay: index * 0.085
        });
        self._bellPartial(freq * 2.01, 0.34 + index * 0.08, (0.022 - index * 0.003) * boost, (index % 2 === 0 ? -0.25 : 0.25), index * 0.085, "sine");
      });
      self._noise(0.9, {
        filterType: "highpass",
        frequency: 4200,
        gain: 0.035 * boost,
        attack: 0.08,
        delay: 0.06
      });
      self._tone(392, 0.8, {
        type: "sine",
        gain: 0.04 * boost,
        attack: 0.04,
        release: 0.6,
        delay: 0.16
      });
    });
  };

  SoundFXBus.prototype.transition = function () {
    if (!this._ready()) return;
    this._noise(0.55, {
      filterType: "bandpass",
      frequency: 420,
      endFrequency: 3400,
      q: 0.9,
      gain: 0.035,
      attack: 0.08
    });
    this._tone(523.25, 0.38, {
      type: "sine",
      gain: 0.035,
      attack: 0.03,
      release: 0.32
    });
    this._tone(783.99, 0.42, {
      type: "sine",
      gain: 0.028,
      attack: 0.03,
      release: 0.34,
      delay: 0.06
    });
  };

  SoundFXBus.prototype.page = function () {
    if (!this._ready()) return;
    this._noise(0.18, {
      filterType: "bandpass",
      frequency: 2300,
      q: 0.8,
      gain: 0.03,
      attack: 0.01
    });
    this._tone(880, 0.16, {
      type: "sine",
      gain: 0.018,
      attack: 0.005,
      release: 0.12
    });
  };

  SoundFXBus.prototype.success = function () {
    var self = this;
    if (!this._ready()) return;
    [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach(function (freq, index) {
      self._tone(freq, 0.45, {
        type: "sine",
        gain: 0.06,
        attack: 0.006,
        release: 0.3,
        delay: index * 0.075
      });
    });
  };

  var instance = new SoundFXBus();
  Object.keys(EXTERNAL_AUDIO).forEach(function (name) {
    if (EXTERNAL_AUDIO[name]) instance.setExternal(name, EXTERNAL_AUDIO[name]);
  });

  // Red de seguridad independiente de la máquina de estados: si la página
  // se oculta o se descarga, ninguna pista ambiental debe seguir sonando.
  window.addEventListener("pagehide", function () {
    instance.pauseAllAmbient();
    instance.stopAllAmbient(true);
  });
  window.addEventListener("beforeunload", function () {
    instance.shutdown();
  });
  window.addEventListener("unload", function () {
    instance.shutdown();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) instance.pauseAllAmbient();
  });

  window.SoundFX = instance;
})();
