/* ============================================================
   CRONO-VISOR · MEET THE MASTERS
   Preescolar Puki
   ============================================================ */

(() => {
  'use strict';

  const CAST = [
    {
      date: 'Nov. 2 al 6',
      month: 'NOV',
      range: '2–6',
      name: 'San José Gregorio Hernández',
      role: 'El Doctor Amigo',
      student: 'Alan',
      accent: '#008C51',
      slug: 'jose-gregorio-hernandez',
      bg: 'San Jose Gregorio Hernandez.jpg',
      mascot: 'Yellow - San Jose Gregorio Hernandez.jpg'
    },
    {
      date: 'Nov. 9 al 13',
      month: 'NOV',
      range: '9–13',
      name: 'Wolfgang Mozart',
      role: 'El Niño de la Música Mágica',
      student: 'Alessia',
      accent: '#1B549F',
      slug: 'wolfgang-mozart',
      bg: 'Wolfgang Mozart.jpg',
      mascot: 'Yellow - Wolfgang Mozart.jpg'
    },
    {
      date: 'Nov. 16 al 20',
      month: 'NOV',
      range: '16–20',
      name: 'Vincent Van Gogh',
      role: 'El Pintor del Cielo de Cuento',
      student: 'Elisa',
      accent: '#E22933',
      slug: 'vincent-van-gogh',
      bg: 'Vincent Van Gogh.jpg',
      mascot: 'Yellow - Vincent Van Gogh.jpg'
    },
    {
      date: 'Nov. 23 al 27',
      month: 'NOV',
      range: '23–27',
      name: 'Walt Disney',
      role: 'El Creador de Sueños',
      student: 'Matteo',
      accent: '#1B549F',
      slug: 'walt-disney',
      bg: 'Walt Disney.jpg',
      mascot: 'Yellow - Walt Disney.jpg'
    },
    {
      date: 'Ene. 18 al 22',
      month: 'ENE',
      range: '18–22',
      name: 'Pelé',
      role: 'El Rey del Balón',
      student: 'Roberto',
      accent: '#008C51',
      slug: 'pele',
      bg: 'Pele.jpg',
      mascot: 'Yellow - Pele.jpg'
    },
    {
      date: 'Ene. 25 al 29',
      month: 'ENE',
      range: '25–29',
      name: 'Leonardo da Vinci',
      role: 'El Inventor Curioso',
      student: 'María A.',
      accent: '#1B549F',
      slug: 'leonardo-da-vinci',
      bg: 'Leonardo da Vinci.jpg',
      mascot: 'Yellow - Leonardo da Vinci.jpg'
    },
    {
      date: 'Feb. 1 al 5',
      month: 'FEB',
      range: '1–5',
      name: 'Steve Jobs',
      role: 'El Diseñador de Pantallas Mágicas',
      student: 'Aquiles',
      accent: '#E22933',
      slug: 'steve-jobs',
      bg: 'Steve Jobs.jpg',
      mascot: 'Yellow - Steve Jobs.jpg'
    },
    {
      date: 'Feb. 15 al 19',
      month: 'FEB',
      range: '15–19',
      name: 'Yayoi Kusama',
      role: 'La Reina de los Lunares',
      student: 'Galilea',
      accent: '#E22933',
      slug: 'yayoi-kusama',
      bg: 'Yayoi Kusama.jpg',
      mascot: 'Yellow - Yayoi Kusama.jpg'
    },
    {
      date: 'Feb. 22 al 26',
      month: 'FEB',
      range: '22–26',
      name: 'Louis Braille',
      role: 'El Inventor de los Puntos Secretos',
      student: 'Santiago',
      accent: '#1B549F',
      slug: 'louis-braille',
      bg: 'Louis Braille.jpg',
      mascot: 'Yellow - Louis Braille.jpg'
    },
    {
      date: 'Mar. 1 al 5',
      month: 'MAR',
      range: '1–5',
      name: 'Usain Bolt',
      role: 'El Corredor Rayo',
      student: 'Guillermo',
      accent: '#E22933',
      slug: 'usain-bolt',
      bg: 'Usain Bolt.jpg',
      mascot: 'Yellow - Usain Bolt.jpg'
    },
    {
      date: 'Mar. 8 al 12',
      month: 'MAR',
      range: '8–12',
      name: 'Jane Goodall',
      role: 'La Amiga de los Chimpancés',
      student: 'Felipe',
      accent: '#008C51',
      slug: 'jane-goodall',
      bg: 'Jane Goodall.jpg',
      mascot: 'Yellow - Jane Goodall.jpg'
    },
    {
      date: 'Mar. 15 al 19',
      month: 'MAR',
      range: '15–19',
      name: 'Ole Kirk Christiansen',
      role: 'El Fabricante de Juguetes',
      student: 'Camila',
      accent: '#E22933',
      slug: 'ole-kirk-christiansen',
      bg: 'Ole Kirk Christiansen.jpg',
      mascot: 'Yellow - Ole Kirk Christiansen.jpg'
    },
    {
      date: 'Mar. 29 al Abr. 2',
      month: 'MAR',
      range: '29–2',
      name: 'Christina Koch',
      role: 'La Astronauta de las Estrellas',
      student: 'Olivia',
      accent: '#1B549F',
      slug: 'christina-koch',
      bg: 'Christina Koch.jpg',
      mascot: 'Yellow - Christina Koch.jpg'
    },
    {
      date: 'Abr. 5 al 9',
      month: 'ABR',
      range: '5–9',
      name: 'Hans Christian Andersen',
      role: 'El Cuentacuentos',
      student: 'Lucas',
      accent: '#008C51',
      slug: 'hans-christian-andersen',
      bg: 'Hans Christian Andersen.jpg',
      mascot: 'Yellow - Hans Christian Andersen.jpg'
    },
    {
      date: 'Abr. 12 al 16',
      month: 'ABR',
      range: '12–16',
      name: 'Albert Einstein',
      role: 'El Científico Divertido',
      student: 'Maximiliano',
      accent: '#E22933',
      slug: 'albert-einstein',
      bg: 'Albert Einstein.jpg',
      mascot: 'Yellow - Albert Einstein.jpg'
    },
    {
      date: 'Abr. 20 al 23',
      month: 'ABR',
      range: '20–23',
      name: 'Gandhi',
      role: 'El Héroe de la Paz',
      student: 'Eva',
      accent: '#008C51',
      slug: 'gandhi',
      bg: 'Gandhi.jpg',
      mascot: 'Yellow - Gandhi.jpg'
    },
    {
      date: 'Abr. 26 al 30',
      month: 'ABR',
      range: '26–30',
      name: 'Henry Ford',
      role: 'El Papá de los Autos',
      student: 'Elias',
      accent: '#1B549F',
      slug: 'henry-ford',
      bg: 'Henry Ford.jpg',
      mascot: 'Yellow - Henry Ford.jpg'
    },
    {
      date: 'May. 3 al 7',
      month: 'MAY',
      range: '3–7',
      name: 'Antonio Gaudí',
      role: 'El Arquitecto Fantástico',
      student: 'Emiliano',
      accent: '#E22933',
      slug: 'antonio-gaudi',
      bg: 'Antonio Gaudí.jpg',
      mascot: 'Yellow - Antonio Gaudí.jpg'
    }
  ];

  const FACTS = {
    'jose-gregorio-hernandez': 'Médico venezolano que dedicó su vida a cuidar a los enfermos.',
    'wolfgang-mozart': 'Compositor austriaco que empezó a crear música siendo muy niño.',
    'vincent-van-gogh': 'Pintor neerlandés que llenó sus cuadros de color y cielos estrellados.',
    'walt-disney': 'Creador de Mickey Mouse y de mundos llenos de imaginación.',
    'pele': 'Futbolista brasileño que ganó tres Copas del Mundo.',
    'leonardo-da-vinci': 'Artista e inventor que estudió las aves y pintó La Mona Lisa.',
    'steve-jobs': 'Cofundador de Apple, apasionado por crear herramientas que cambian la vida.',
    'yayoi-kusama': 'Artista japonesa reconocida por sus lunares de colores y sus calabazas.',
    'louis-braille': 'Inventó un sistema de puntos en relieve para que las personas ciegas pudieran leer.',
    'usain-bolt': 'Velocista jamaiquino considerado el hombre más rápido del mundo.',
    'jane-goodall': 'Científica británica que ha estudiado a los chimpancés durante décadas.',
    'ole-kirk-christiansen': 'Carpintero danés que fundó LEGO y convirtió los bloques en juguetes.',
    'christina-koch': 'Astronauta estadounidense que ha vivido y trabajado en el espacio.',
    'hans-christian-andersen': 'Escritor danés de cuentos como El patito feo y La sirenita.',
    'albert-einstein': 'Físico alemán que cambió nuestra manera de entender el tiempo y el espacio.',
    'gandhi': 'Líder indio que enseñó a resolver los conflictos con la paz y la no violencia.',
    'henry-ford': 'Fundador de Ford y pionero en la producción de automóviles en serie.',
    'antonio-gaudi': 'Arquitecto catalán que imaginó la Sagrada Familia inspirada en la naturaleza.'
  };

  CAST.forEach((item) => {
    item.fact = FACTS[item.slug] || 'Una historia para descubrir, imaginar y soñar en grande.';
  });

  const BASE = {
    backgrounds: 'fondos/',
    mascots: 'mascota/',
    logo: 'imagenes/Logo PUKI - marca.png',
    frame: 'imagenes/Crono-Visor.png'
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const body = document.body;
  const app = $('#app');
  const boot = $('#boot');
  const ambient = $('#ambient');
  const ambientLayers = [$('#ambientA'), $('#ambientB')];
  const screen = $('#screen');
  const tablist = $('#tablist');
  const timelineViewport = $('#timelineViewport');
  const infoPanel = $('#infoPanel');
  const mascotPanel = $('#mascotPanel');
  const mascotBg = $('#mascotBg');
  const dateBadge = $('#dateBadge');
  const dateBadgeText = $('.date-badge__text', dateBadge);
  const characterName = $('#characterName');
  const characterRole = $('#characterRole');
  const characterFact = $('#characterFact');
  const studentName = $('#studentName');
  const studentNumber = $('#studentNumber');
  const headIndex = $('#headIndex');
  const tripIndex = $('#tripIndex');
  const tripProgressFill = $('#tripProgressFill');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const rotate = $('#rotate');
  const toast = $('#toast');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portraitQuery = window.matchMedia('(orientation: portrait)');

  let currentIndex = -1;
  let activeBgLayer = 0;
  let backgroundRequest = 0;
  let animationTimer = 0;
  let toastTimer = 0;
  let tabElements = [];
  let pointerStart = null;
  let announcementNode = null;

  const DIRECTION = {
    next: 1,
    prev: -1
  };

  const pad = (value) => String(value).padStart(2, '0');

  function slugFromLocation() {
    const raw = decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).trim().toLowerCase();
    return raw;
  }

  function initialIndex() {
    const requested = slugFromLocation();
    const match = CAST.findIndex((item) => item.slug === requested);
    return match >= 0 ? match : 0;
  }

  function encodeAsset(path) {
    return encodeURI(path).replace(/'/g, '%27');
  }

  function backgroundUrl(item) {
    return encodeAsset(`${BASE.backgrounds}${item.bg}`);
  }

  function mascotUrl(item) {
    return encodeAsset(`${BASE.mascots}${item.mascot}`);
  }

  function buildTabs() {
    const fragment = document.createDocumentFragment();

    CAST.forEach((item, index) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'date-tab';
      tab.id = `tab-${item.slug}`;
      tab.dataset.index = String(index);
      tab.style.setProperty('--accent', item.accent);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'infoPanel');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('aria-label', `${item.date}: ${item.name}, ${item.role}. Alumno: ${item.student}.`);
      tab.tabIndex = -1;

      const date = document.createElement('span');
      date.className = 'date-tab__date';

      const month = document.createElement('span');
      month.className = 'date-tab__month';
      month.textContent = item.month;

      const day = document.createElement('span');
      day.className = 'date-tab__day';
      day.textContent = item.range;

      date.append(month, day);

      const copy = document.createElement('span');
      copy.className = 'date-tab__body';

      const name = document.createElement('span');
      name.className = 'date-tab__name';
      name.textContent = item.name;

      const role = document.createElement('span');
      role.className = 'date-tab__role';
      role.textContent = item.role;

      copy.append(name, role);

      const indicator = document.createElement('span');
      indicator.className = 'date-tab__indicator';
      indicator.setAttribute('aria-hidden', 'true');

      tab.append(date, copy, indicator);
      fragment.append(tab);
    });

    tablist.replaceChildren(fragment);
    tabElements = $$('.date-tab', tablist);
  }

  function updateTabs() {
    tabElements.forEach((tab, index) => {
      const isActive = index === currentIndex;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
  }

  function centerActiveTab(behavior = 'smooth') {
    const activeTab = tabElements[currentIndex];
    if (!activeTab) return;

    const viewportRect = timelineViewport.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const offset = tabRect.top - viewportRect.top;
    const targetTop = timelineViewport.scrollTop + offset - (timelineViewport.clientHeight - activeTab.offsetHeight) / 2;

    timelineViewport.scrollTo({
      top: Math.max(0, targetTop),
      behavior: reducedMotion.matches ? 'auto' : behavior
    });
  }

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

  function updateContent(item, animate) {
    screen.style.setProperty('--accent', item.accent);
    ambient.style.setProperty('--ambient-accent', item.accent);

    dateBadgeText.textContent = item.date;
    characterName.textContent = item.name;
    characterRole.textContent = item.role;
    characterFact.textContent = item.fact;
    studentName.textContent = item.student;
    studentNumber.textContent = pad(currentIndex + 1);
    headIndex.textContent = pad(currentIndex + 1);
    tripIndex.textContent = pad(currentIndex + 1);
    infoPanel.dataset.number = pad(currentIndex + 1);
    tripProgressFill.style.width = `${((currentIndex + 1) / CAST.length) * 100}%`;

    mascotBg.src = mascotUrl(item);
    mascotBg.alt = `Yellow, la mascota del Preescolar Puki, caracterizada como ${item.name}`;

    document.title = `${item.name} · Crono-Visor | Preescolar Puki`;

    if (!animate) return;

    window.clearTimeout(animationTimer);
    infoPanel.classList.remove('is-entering');
    mascotPanel.classList.remove('is-entering');

    // Reinicia las animaciones sin provocar un salto de layout.
    void infoPanel.offsetWidth;

    infoPanel.classList.add('is-entering');
    mascotPanel.classList.add('is-entering');

    animationTimer = window.setTimeout(() => {
      infoPanel.classList.remove('is-entering');
      mascotPanel.classList.remove('is-entering');
    }, 900);
  }

  function updateUrl(item) {
    const nextHash = `#${item.slug}`;
    if (window.location.hash === nextHash) return;

    try {
      window.history.replaceState(null, '', nextHash);
    } catch {
      // En algunos navegadores file:// no permite reescribir la URL.
      // La aplicación sigue funcionando sin enlace profundo.
    }
  }

  function announce(item) {
    if (!announcementNode) return;
    announcementNode.textContent = `Ahora: ${item.name}, ${item.role}. ${item.fact} Alumno asignado: ${item.student}.`;
  }

  function selectTab(index, options = {}) {
    const normalized = ((index % CAST.length) + CAST.length) % CAST.length;
    const isInitial = currentIndex === -1;
    const hasChanged = currentIndex !== normalized;
    const item = CAST[normalized];

    if (!hasChanged && !options.force) {
      if (!isInitial) centerActiveTab();
      return;
    }

    currentIndex = normalized;
    updateTabs();
    updateContent(item, !isInitial && !options.instant);
    crossfadeBackground(item, isInitial || options.instant);
    updateUrl(item);
    announce(item);

    window.requestAnimationFrame(() => {
      centerActiveTab(isInitial || options.instant ? 'auto' : 'smooth');
    });

    if (!isInitial) preloadNeighbours(normalized);
  }

  function goTo(step) {
    selectTab(currentIndex + step);
  }

  function handleTabKeydown(event) {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    let next = currentIndex;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (currentIndex + 1) % CAST.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (currentIndex - 1 + CAST.length) % CAST.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = CAST.length - 1;
    }

    selectTab(next);
    window.requestAnimationFrame(() => {
      tabElements[next]?.focus();
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  function setupSwipe() {
    const stage = $('.stage');

    stage.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      if (event.target.closest('button')) return;
      pointerStart = { x: event.clientX, y: event.clientY };
    });

    stage.addEventListener('pointerup', (event) => {
      if (!pointerStart) return;

      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;

      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
      if (dx < 0) {
        goTo(DIRECTION.next);
      } else {
        goTo(DIRECTION.prev);
      }
    });

    stage.addEventListener('pointercancel', () => {
      pointerStart = null;
    });
  }

  function setupOrientationGuard() {
    rotate.tabIndex = -1;

    const sync = () => {
      const isPortrait = portraitQuery.matches;
      app.inert = isPortrait;
      rotate.setAttribute('aria-hidden', String(!isPortrait));

      if (isPortrait) {
        window.setTimeout(() => rotate.focus({ preventScroll: true }), 80);
      } else if (document.activeElement === rotate) {
        tabElements[currentIndex]?.focus({ preventScroll: true });
      }
    };

    sync();

    if (typeof portraitQuery.addEventListener === 'function') {
      portraitQuery.addEventListener('change', sync);
    } else {
      portraitQuery.addListener(sync);
    }

    window.addEventListener('orientationchange', () => {
      window.setTimeout(sync, 220);
    });
  }

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

  function revealApp() {
    window.requestAnimationFrame(() => {
      body.classList.add('is-ready');
      window.setTimeout(() => {
        boot?.remove();
      }, 900);
    });
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function setupImageErrorHandling() {
    mascotBg.addEventListener('error', () => {
      showToast(`No encontramos la imagen de Yellow para ${CAST[currentIndex]?.name ?? 'este personaje'}.`);
    });

    const frame = $('.crono__frame');
    frame?.addEventListener('error', () => {
      showToast('No se pudo cargar el marco del Crono-Visor.');
    });
  }

  function setupEvents() {
    tablist.addEventListener('click', (event) => {
      const tab = event.target.closest('.date-tab');
      if (!tab) return;
      selectTab(Number(tab.dataset.index));
    });

    tablist.addEventListener('keydown', handleTabKeydown);

    prevBtn.addEventListener('click', () => goTo(DIRECTION.prev));
    nextBtn.addEventListener('click', () => goTo(DIRECTION.next));

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[role="tab"], input, textarea, select')) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(DIRECTION.next);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(DIRECTION.prev);
      }
    });

    window.addEventListener('hashchange', () => {
      const index = CAST.findIndex((item) => item.slug === slugFromLocation());
      if (index >= 0 && index !== currentIndex) {
        selectTab(index);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pointerStart = null;
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
    buildTabs();
    addScreenReaderAnnouncer();
    setupEvents();
    setupSwipe();
    setupOrientationGuard();
    setupImageErrorHandling();

    const startIndex = initialIndex();
    selectTab(startIndex, { instant: true });
    tabElements[startIndex]?.setAttribute('tabindex', '0');

    const firstItem = CAST[startIndex];
    const criticalAssets = [
      mascotUrl(firstItem),
      backgroundUrl(firstItem),
      encodeAsset(BASE.frame),
      encodeAsset(BASE.logo)
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
