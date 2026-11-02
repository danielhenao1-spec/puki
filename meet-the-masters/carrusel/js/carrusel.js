/* ============================================================
   CARRUSEL · MEET THE MASTERS
   Preescolar Puki · Versión simplificada
   Avatares (video) + fondos + nombre del personaje + audio opcional.
   ============================================================ */

(() => {
  'use strict';

  const CAST = [
    { name: 'San José Gregorio Hernández', role: 'El Doctor Amigo', accent: '#008C51', slug: 'jose-gregorio-hernandez', bg: 'San Jose Gregorio Hernandez.jpg', mascot: 'Yellow - San Jose Gregorio Hernandez.jpg' },
    { name: 'Wolfgang Mozart', role: 'El Niño de la Música Mágica', accent: '#1B549F', slug: 'wolfgang-mozart', bg: 'Wolfgang Mozart.jpg', mascot: 'Yellow - Wolfgang Mozart.jpg' },
    { name: 'Vincent Van Gogh', role: 'El Pintor del Cielo de Cuento', accent: '#E22933', slug: 'vincent-van-gogh', bg: 'Vincent Van Gogh.jpg', mascot: 'Yellow - Vincent Van Gogh.jpg' },
    { name: 'Walt Disney', role: 'El Creador de Sueños', accent: '#1B549F', slug: 'walt-disney', bg: 'Walt Disney.jpg', mascot: 'Yellow - Walt Disney.jpg' },
    { name: 'Pelé', role: 'El Rey del Balón', accent: '#008C51', slug: 'pele', bg: 'Pele.jpg', mascot: 'Yellow - Pele.jpg' },
    { name: 'Leonardo da Vinci', role: 'El Inventor Curioso', accent: '#1B549F', slug: 'leonardo-da-vinci', bg: 'Leonardo da Vinci.jpg', mascot: 'Yellow - Leonardo da Vinci.jpg' },
    { name: 'Steve Jobs', role: 'El Diseñador de Pantallas Mágicas', accent: '#E22933', slug: 'steve-jobs', bg: 'Steve Jobs.jpg', mascot: 'Yellow - Steve Jobs.jpg' },
    { name: 'Yayoi Kusama', role: 'La Reina de los Lunares', accent: '#E22933', slug: 'yayoi-kusama', bg: 'Yayoi Kusama.jpg', mascot: 'Yellow - Yayoi Kusama.jpg' },
    { name: 'Louis Braille', role: 'El Inventor de los Puntos Secretos', accent: '#1B549F', slug: 'louis-braille', bg: 'Louis Braille.jpg', mascot: 'Yellow - Louis Braille.jpg' },
    { name: 'Usain Bolt', role: 'El Corredor Rayo', accent: '#E22933', slug: 'usain-bolt', bg: 'Usain Bolt.jpg', mascot: 'Yellow - Usain Bolt.jpg' },
    { name: 'Jane Goodall', role: 'La Amiga de los Chimpancés', accent: '#008C51', slug: 'jane-goodall', bg: 'Jane Goodall.jpg', mascot: 'Yellow - Jane Goodall.jpg' },
    { name: 'Ole Kirk Christiansen', role: 'El Fabricante de Juguetes', accent: '#E22933', slug: 'ole-kirk-christiansen', bg: 'Ole Kirk Christiansen.jpg', mascot: 'Yellow - Ole Kirk Christiansen.jpg' },
    { name: 'Christina Koch', role: 'La Astronauta de las Estrellas', accent: '#1B549F', slug: 'christina-koch', bg: 'Christina Koch.jpg', mascot: 'Yellow - Christina Koch.jpg' },
    { name: 'Hans Christian Andersen', role: 'El Cuentacuentos', accent: '#008C51', slug: 'hans-christian-andersen', bg: 'Hans Christian Andersen.jpg', mascot: 'Yellow - Hans Christian Andersen.jpg' },
    { name: 'Albert Einstein', role: 'El Científico Divertido', accent: '#E22933', slug: 'albert-einstein', bg: 'Albert Einstein.jpg', mascot: 'Yellow - Albert Einstein.jpg' },
    { name: 'Gandhi', role: 'El Héroe de la Paz', accent: '#008C51', slug: 'gandhi', bg: 'Gandhi.jpg', mascot: 'Yellow - Gandhi.jpg' },
    { name: 'Henry Ford', role: 'El Papá de los Autos', accent: '#1B549F', slug: 'henry-ford', bg: 'Henry Ford.jpg', mascot: 'Yellow - Henry Ford.jpg' },
    { name: 'Antonio Gaudí', role: 'El Arquitecto Fantástico', accent: '#E22933', slug: 'antonio-gaudi', bg: 'Antonio Gaudí.jpg', mascot: 'Yellow - Antonio Gaudí.jpg' }
  ];

  const BASE = {
    backgrounds: '../imagenes/fondos/',
    mascots: '../imagenes/mascota/',
    videos: '../video/'
  };

  /* Audio por personaje. De momento solo Mozart; la estructura permite
     añadir más pistas sin tocar la lógica del carrusel. */
  const CHARACTER_AUDIO = {
    'wolfgang-mozart': {
      src: 'audio/mozart-medley.mp3',
      title: 'Medley de Mozart'
    }
  };

  const AUDIO_VOLUME_KEY = 'puki-carrusel-volume';
  const DEFAULT_AUDIO_VOLUME = 0.55;

  const $ = (selector, scope = document) => scope.querySelector(selector);

  const body = document.body;
  const boot = $('#boot');
  const ambient = $('#ambient');
  const ambientLayers = [$('#ambientA'), $('#ambientB')];
  const stage = $('#stage');
  const card = $('#card');
  const video = $('#mascotVideo');
  const characterName = $('#characterName');
  const characterRole = $('#characterRole');
  const headIndex = $('#headIndex');
  const headTotal = $('#headTotal');
  const progressFill = $('#progressFill');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const toast = $('#toast');
  const characterAudio = $('#characterAudio');
  const audioControl = $('#audioControl');
  const audioPlay = $('#audioPlay');
  const audioVolume = $('#audioVolume');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentIndex = -1;
  let activeBgLayer = 0;
  let backgroundRequest = 0;
  let animationTimer = 0;
  let toastTimer = 0;
  let pointerStart = null;
  let announcementNode = null;

  let activeAudioTrack = null;
  let activeAudioSlug = null;
  let audioBaseVolume = DEFAULT_AUDIO_VOLUME;
  let audioFadeFrame = 0;
  let audioToken = 0;
  let audioWasPlaying = false;

  const pad = (value) => String(value).padStart(2, '0');

  function slugFromLocation() {
    return decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).trim().toLowerCase();
  }

  function initialIndex() {
    const requested = slugFromLocation();
    const match = CAST.findIndex((item) => item.slug === requested);
    return match >= 0 ? match : 0;
  }

  function encodeAsset(path) {
    return encodeURI(path).replace(/'/g, '%27');
  }

  const backgroundUrl = (item) => encodeAsset(`${BASE.backgrounds}${item.bg}`);
  const mascotUrl = (item) => encodeAsset(`${BASE.mascots}${item.mascot}`);
  const videoUrl = (item) => encodeAsset(`${BASE.videos}${item.mascot.replace(/\.jpg$/i, '.mp4')}`);

  /* ---------- Fondo: cruce suave idéntico al Crono-Visor ---------- */

  function crossfadeBackground(item, instant = false) {
    const url = backgroundUrl(item);
    const cssUrl = `url("${url}")`;
    const request = ++backgroundRequest;

    if (instant) {
      ambientLayers.forEach((layer) => layer.classList.remove('is-active'));
      ambientLayers[activeBgLayer].style.backgroundImage = cssUrl;
      ambientLayers[activeBgLayer].classList.add('is-active');
      return;
    }

    const preload = new Image();
    preload.decoding = 'async';
    let revealed = false;

    const reveal = () => {
      if (revealed || request !== backgroundRequest) return;
      revealed = true;

      const nextIndex = activeBgLayer === 0 ? 1 : 0;
      const incoming = ambientLayers[nextIndex];
      const outgoing = ambientLayers[activeBgLayer];

      incoming.style.backgroundImage = cssUrl;
      incoming.classList.add('is-active');
      outgoing.classList.remove('is-active');
      activeBgLayer = nextIndex;
    };

    preload.onload = reveal;
    preload.onerror = reveal;
    preload.src = url;

    if (preload.complete) reveal();
  }

  /* ---------- Contenido ---------- */

  function updateContent(item, animate) {
    body.style.setProperty('--accent', item.accent);
    ambient.style.setProperty('--ambient-accent', item.accent);

    characterName.textContent = item.name;
    characterRole.textContent = item.role;
    headIndex.textContent = pad(currentIndex + 1);
    progressFill.style.width = `${((currentIndex + 1) / CAST.length) * 100}%`;

    const nextVideo = videoUrl(item);
    video.poster = mascotUrl(item);

    if (video.getAttribute('src') !== nextVideo) {
      video.src = nextVideo;
      video.load();
    }

    video.muted = true;
    const playback = video.play();
    if (playback) playback.catch(() => {});

    document.title = `${item.name} · Carrusel | Preescolar Puki`;

    if (!animate) return;

    window.clearTimeout(animationTimer);
    card.classList.remove('is-entering');

    // Reinicia la animación sin provocar saltos de layout.
    void card.offsetWidth;

    card.classList.add('is-entering');
    animationTimer = window.setTimeout(() => card.classList.remove('is-entering'), 900);
  }

  function updateUrl(item) {
    const nextHash = `#${item.slug}`;
    if (window.location.hash === nextHash) return;

    try {
      window.history.replaceState(null, '', nextHash);
    } catch {
      // En file:// algunos navegadores no permiten reescribir la URL.
    }
  }

  function announce(item) {
    if (!announcementNode) return;
    announcementNode.textContent = `Ahora: ${item.name}. ${item.role}. Personaje ${currentIndex + 1} de ${CAST.length}.`;
  }

  /* ---------- Música del personaje ---------- */

  function loadStoredVolume() {
    try {
      const raw = window.localStorage.getItem(AUDIO_VOLUME_KEY);
      if (raw !== null) {
        const value = Number(raw);
        if (Number.isFinite(value) && value >= 0 && value <= 1) return value;
      }
    } catch {
      // file:// o navegación privada pueden bloquear localStorage.
    }
    return DEFAULT_AUDIO_VOLUME;
  }

  function saveStoredVolume() {
    try {
      window.localStorage.setItem(AUDIO_VOLUME_KEY, String(audioBaseVolume));
    } catch {
      // Sin persistencia: el volumen sigue funcionando en esta sesión.
    }
  }

  function syncVolumeUI() {
    const percent = Math.round(audioBaseVolume * 100);
    audioVolume.value = String(percent);
    audioVolume.style.setProperty('--volume-fill', `${percent}%`);
    audioControl.classList.toggle('is-silent', percent === 0);
  }

  function cancelAudioFade() {
    if (audioFadeFrame) {
      window.cancelAnimationFrame(audioFadeFrame);
      audioFadeFrame = 0;
    }
  }

  function fadeAudioTo(target, duration, token) {
    cancelAudioFade();

    if (duration <= 0 || reducedMotion.matches) {
      characterAudio.volume = target;
      return;
    }

    const from = characterAudio.volume;
    const start = window.performance.now();

    const step = (now) => {
      if (token !== audioToken) return;
      const progress = Math.min(1, (now - start) / duration);
      characterAudio.volume = Math.max(0, Math.min(1, from + (target - from) * progress));
      if (progress < 1) {
        audioFadeFrame = window.requestAnimationFrame(step);
      } else {
        audioFadeFrame = 0;
      }
    };

    audioFadeFrame = window.requestAnimationFrame(step);
  }

  function setAudioPlayingUI(playing) {
    audioControl.classList.toggle('is-playing', playing);
    audioPlay.hidden = !activeAudioTrack || playing;
  }

  function resetAudioTime() {
    try {
      characterAudio.currentTime = 0;
    } catch {
      // El navegador aún no tiene metadatos; play() arrancará desde el inicio.
    }
  }

  function startCharacterAudio() {
    if (!activeAudioTrack) return;

    const token = ++audioToken;
    cancelAudioFade();
    characterAudio.volume = 0;

    const started = () => {
      if (token !== audioToken) return;
      setAudioPlayingUI(true);
      if (audioBaseVolume > 0) {
        fadeAudioTo(audioBaseVolume, 600, token);
      } else {
        characterAudio.volume = 0;
      }
    };

    const blocked = () => {
      if (token !== audioToken) return;
      characterAudio.volume = audioBaseVolume;
      setAudioPlayingUI(false);
    };

    let playback;
    try {
      playback = characterAudio.play();
    } catch {
      blocked();
      return;
    }

    if (playback && typeof playback.then === 'function') {
      playback.then(started, blocked);
    } else {
      started();
    }
  }

  function stopCharacterAudio({ reset = true } = {}) {
    audioToken++;
    cancelAudioFade();

    if (characterAudio.paused) {
      characterAudio.volume = audioBaseVolume;
      if (reset) resetAudioTime();
      setAudioPlayingUI(false);
      return;
    }

    const token = audioToken;
    fadeAudioTo(0, 350, token);

    window.setTimeout(() => {
      if (token !== audioToken) return;
      characterAudio.pause();
      characterAudio.volume = audioBaseVolume;
      if (reset) resetAudioTime();
      setAudioPlayingUI(false);
    }, 380);
  }

  function updateCharacterAudio(item) {
    const track = CHARACTER_AUDIO[item.slug] || null;

    if (!track) {
      if (activeAudioTrack || activeAudioSlug) {
        stopCharacterAudio();
        activeAudioTrack = null;
        activeAudioSlug = null;
        audioControl.hidden = true;
        audioControl.classList.remove('is-playing');
        audioPlay.hidden = true;
      }
      return;
    }

    const isNew = activeAudioSlug !== item.slug;
    activeAudioTrack = track;
    activeAudioSlug = item.slug;

    audioControl.hidden = false;
    audioControl.title = track.title;
    audioControl.setAttribute('aria-label', `Música de ${item.name}`);
    audioVolume.setAttribute('aria-label', `Volumen de la música de ${item.name}`);
    audioPlay.setAttribute('aria-label', `Reproducir música de ${item.name}`);
    syncVolumeUI();

    if (isNew) {
      audioToken++;
      cancelAudioFade();
      characterAudio.pause();
      characterAudio.volume = audioBaseVolume;

      if (characterAudio.getAttribute('src') !== track.src) {
        characterAudio.src = track.src;
        characterAudio.load();
      }

      resetAudioTime();
      audioPlay.hidden = true;
      startCharacterAudio();
    } else if (characterAudio.paused) {
      if (characterAudio.ended) resetAudioTime();
      audioPlay.hidden = true;
      startCharacterAudio();
    }
  }

  function setupCharacterAudio() {
    audioBaseVolume = loadStoredVolume();
    syncVolumeUI();

    audioVolume.addEventListener('input', () => {
      const percent = Math.max(0, Math.min(100, Number(audioVolume.value) || 0));
      audioBaseVolume = percent / 100;
      saveStoredVolume();
      cancelAudioFade();
      if (activeAudioTrack) characterAudio.volume = audioBaseVolume;
      syncVolumeUI();

      if (activeAudioTrack && characterAudio.paused && audioBaseVolume > 0) {
        startCharacterAudio();
      }
    });

    audioPlay.addEventListener('click', () => {
      if (!activeAudioTrack) return;
      if (characterAudio.ended) resetAudioTime();
      startCharacterAudio();
    });

    characterAudio.addEventListener('play', () => setAudioPlayingUI(true));
    characterAudio.addEventListener('pause', () => setAudioPlayingUI(false));

    characterAudio.addEventListener('ended', () => {
      resetAudioTime();
      setAudioPlayingUI(false);
    });

    characterAudio.addEventListener('error', () => {
      if (!activeAudioTrack) return;
      setAudioPlayingUI(false);
      showToast(`No se pudo cargar la música de ${CAST[currentIndex]?.name ?? 'este personaje'}.`);
    });

    const unlockAudio = (event) => {
      if (!activeAudioTrack || !characterAudio.paused) return;
      if (event.target instanceof Element && event.target.closest('#audioPlay')) return;
      startCharacterAudio();
    };

    document.addEventListener('pointerdown', unlockAudio, true);
    document.addEventListener('keydown', unlockAudio, true);
  }

  /* ---------- Selección ---------- */

  function selectCard(index, options = {}) {
    const normalized = ((index % CAST.length) + CAST.length) % CAST.length;
    const isInitial = currentIndex === -1;
    const hasChanged = currentIndex !== normalized;
    const item = CAST[normalized];

    if (!hasChanged && !options.force) return;

    currentIndex = normalized;
    updateContent(item, !isInitial && !options.instant);
    crossfadeBackground(item, isInitial || options.instant);
    updateUrl(item);
    announce(item);
    updateCharacterAudio(item);

    if (!isInitial) preloadNeighbours(normalized);
  }

  function goTo(step) {
    selectCard(currentIndex + step);
  }

  /* ---------- Precarga ---------- */

  function preloadImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = src;
    });
  }

  function preloadNeighbours(index) {
    const next = CAST[(index + 1) % CAST.length];
    const prev = CAST[(index - 1 + CAST.length) % CAST.length];

    [next, prev].forEach((item) => {
      preloadImage(backgroundUrl(item));
      preloadImage(mascotUrl(item));
    });
  }

  function preloadEverything() {
    const run = () => {
      CAST.forEach((item) => {
        const bg = new Image();
        bg.decoding = 'async';
        bg.src = backgroundUrl(item);

        const mascot = new Image();
        mascot.decoding = 'async';
        mascot.src = mascotUrl(item);
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 4500 });
    } else {
      window.setTimeout(run, 2400);
    }
  }

  /* ---------- Arranque ---------- */

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function revealApp() {
    window.requestAnimationFrame(() => {
      body.classList.add('is-ready');
      window.setTimeout(() => boot?.remove(), 900);
    });
  }

  /* ---------- Interacción ---------- */

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  function setupSwipe() {
    stage.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      if (event.target.closest('button, a, input, [role="slider"]')) return;
      pointerStart = { x: event.clientX, y: event.clientY };
    });

    stage.addEventListener('pointerup', (event) => {
      if (!pointerStart) return;

      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;

      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      goTo(dx < 0 ? 1 : -1);
    });

    stage.addEventListener('pointercancel', () => {
      pointerStart = null;
    });
  }

  function setupEvents() {
    prevBtn.addEventListener('click', () => goTo(-1));
    nextBtn.addEventListener('click', () => goTo(1));

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select')) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        selectCard(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        selectCard(CAST.length - 1);
      }
    });

    window.addEventListener('hashchange', () => {
      const index = CAST.findIndex((item) => item.slug === slugFromLocation());
      if (index >= 0 && index !== currentIndex) selectCard(index);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pointerStart = null;
        video.pause();
        if (!characterAudio.paused) {
          audioWasPlaying = true;
          characterAudio.pause();
        }
      } else if (currentIndex >= 0) {
        const playback = video.play();
        if (playback) playback.catch(() => {});

        if (activeAudioTrack && audioWasPlaying) {
          audioWasPlaying = false;
          startCharacterAudio();
        }
      }
    });

    video.addEventListener('error', () => {
      showToast(`No encontramos el video de Yellow para ${CAST[currentIndex]?.name ?? 'este personaje'}.`);
    });
  }

  function addScreenReaderAnnouncer() {
    announcementNode = document.createElement('p');
    announcementNode.className = 'sr-only';
    announcementNode.setAttribute('aria-live', 'polite');
    announcementNode.setAttribute('aria-atomic', 'true');
    body.append(announcementNode);
  }

  function init() {
    headTotal.textContent = String(CAST.length);
    addScreenReaderAnnouncer();
    setupEvents();
    setupSwipe();
    setupCharacterAudio();

    const startIndex = initialIndex();
    selectCard(startIndex, { instant: true });

    const firstItem = CAST[startIndex];
    const criticalAssets = [
      mascotUrl(firstItem),
      backgroundUrl(firstItem),
      encodeAsset('../imagenes/Logo PUKI - marca.png')
    ];

    Promise.race([
      Promise.all(criticalAssets.map(preloadImage)),
      wait(2300)
    ]).then(() => {
      revealApp();
      preloadNeighbours(startIndex);
      preloadEverything();
    });
  }

  init();
})();
