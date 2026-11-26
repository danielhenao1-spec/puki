/* ============================================================
   Día de Gracias · El Árbol de la Gratitud
   Lógica de la escena, de las 30 hojas y del editor de calibración
   ============================================================ */

(() => {
  "use strict";

  /* ------------------------------------------------------------
     1. Contenido de las 30 tarjetas
     ------------------------------------------------------------ */

  const CATEGORIES = {
    agradecer: {
      label: "Agradecer",
      file: "Agradecer",
      glow: "#ffd27a",
      cards: [
        {
          palabra: "Familia",
          titulo: "Las personas que nos cuidan",
          texto: "Hoy agradecemos a quienes nos acompañan, nos escuchan y nos ayudan cada día. ¿A quién de tu familia te gustaría darle las gracias hoy?"
        },
        {
          palabra: "Hogar",
          titulo: "Un lugar seguro y cálido",
          texto: "Damos gracias por tener un techo, una cama cómoda y un espacio donde descansar después de un día de aventuras."
        },
        {
          palabra: "Comida",
          titulo: "Los alimentos que nos dan fuerza",
          texto: "Pensamos en todo el trabajo que hay detrás de cada plato: la tierra, el agua, quienes cultivan y quienes preparan nuestra comida."
        },
        {
          palabra: "Amistad",
          titulo: "Quienes juegan y ríen con nosotros",
          texto: "Agradecer también es valorar a los amigos que nos alegran el recreo y nos acompañan en los buenos momentos."
        },
        {
          palabra: "Aprender",
          titulo: "Descubrir cosas nuevas",
          texto: "Hoy celebramos la alegría de hacer preguntas, equivocarnos sin miedo y aprender algo nuevo cada día en clase."
        },
        {
          palabra: "Salud",
          titulo: "Nuestro cuerpo y nuestra energía",
          texto: "Damos gracias por poder correr, saltar, respirar profundo y sentirnos bien para disfrutar de nuestro día."
        },
        {
          palabra: "Naturaleza",
          titulo: "El cielo, las plantas y los animales",
          texto: "Hoy miramos el jardín, el viento suave y las luces del atardecer para agradecer la belleza de la naturaleza que nos rodea."
        },
        {
          palabra: "Abrazos",
          titulo: "El cariño que se siente",
          texto: "A veces un abrazo sincero o una palabra amable cambia todo el día. ¿Qué gesto cariñoso agradeces recibir?"
        },
        {
          palabra: "Risas",
          titulo: "Los momentos felices juntos",
          texto: "Agradecemos las carcajadas compartidas, los chistes sanos y esos instantes que nos llenan de alegría."
        },
        {
          palabra: "Crecimiento",
          titulo: "Lo mucho que hemos avanzado",
          texto: "Hoy miramos atrás y agradecemos todo lo que hemos logrado superar y crecer desde que empezó el año escolar."
        }
      ]
    },

    amabilidad: {
      label: "Gesto de Amabilidad",
      file: "Amabilidad",
      glow: "#ff9f7c",
      cards: [
        {
          palabra: "Ayudar",
          titulo: "Tender una mano cuando hace falta",
          texto: "Un gesto de amabilidad es notar cuando alguien necesita apoyo —al recoger o al resolver una tarea— y ofrecer ayuda con gusto."
        },
        {
          palabra: "Escuchar",
          titulo: "Prestar atención de corazón",
          texto: "Escuchar sin interrumpir y mirar a quien nos habla es una forma preciosa de demostrar respeto y cariño."
        },
        {
          palabra: "Incluir",
          titulo: "Invitar a sumarse al juego",
          texto: "Cuando ves a alguien solo o dudando, invitarlo a jugar o a sentarse cerca hace que nadie se sienta por fuera."
        },
        {
          palabra: "Saludar",
          titulo: "Una bienvenida con alegría",
          texto: 'Decir "buenos días", "hola" o regalar una sonrisa al llegar transforma el ambiente del salón desde el primer minuto.'
        },
        {
          palabra: "Paciencia",
          titulo: "Esperar con calma y buen trato",
          texto: "Tener paciencia cuando alguien tarda un poco más o está aprendiendo demuestra empatía y buen corazón."
        },
        {
          palabra: "Animar",
          titulo: "Dar palabras que levantan el ánimo",
          texto: "Si un compañero se siente triste o frustrado por algo, unas palabras de ánimo pueden recordarle que siga intentándolo."
        },
        {
          palabra: "Cuidar",
          titulo: "Tratar bien lo que nos rodea",
          texto: "Cuidar los materiales del aula, las plantas y los espacios comunes es una manera de ser amables con todos."
        },
        {
          palabra: "Perdonar",
          titulo: "Hacer las paces y seguir adelante",
          texto: "Pedir disculpas cuando nos equivocamos y aceptar las disculpas de otros ayuda a mantener la paz entre amigos."
        },
        {
          palabra: "Ordenar",
          titulo: "Dejar todo listo para el grupo",
          texto: "Ayudar a ordenar sin que te lo pidan facilita el trabajo de todos y hace más agradable el próximo momento."
        },
        {
          palabra: "Agradecer",
          titulo: 'Decir "gracias" con sinceridad',
          texto: 'Responder con un "gracias" claro y de corazón hace que quien nos dio algo o nos ayudó se sienta valorado.'
        }
      ]
    },

    compartir: {
      label: "Compartir",
      file: "Compartir",
      glow: "#b8d79a",
      cards: [
        {
          palabra: "Prestar",
          titulo: "Compartir lo que tenemos a mano",
          texto: "Prestar un color, un borrador o un cuento por un rato permite que todos puedan participar y crear juntos."
        },
        {
          palabra: "Turnos",
          titulo: "Repartir el tiempo con justicia",
          texto: "Compartir también es ceder el turno con alegría para que cada compañero tenga su momento de participar."
        },
        {
          palabra: "Ideas",
          titulo: "Sumar lo que cada uno imagina",
          texto: "Cuando compartimos nuestras ideas, nacen soluciones y juegos mucho más creativos que si los pensamos solos."
        },
        {
          palabra: "Alegría",
          titulo: "Contagiar lo bueno que sentimos",
          texto: "Compartir una buena noticia, un logro o una sonrisa multiplica la felicidad de quienes están a nuestro alrededor."
        },
        {
          palabra: "Tiempo",
          titulo: "Regalar momentos juntos",
          texto: "A veces lo más valioso que podemos compartir no es un objeto, sino nuestro tiempo para jugar o conversar."
        },
        {
          palabra: "Merienda",
          titulo: "Compartir en la mesa",
          texto: "Compartir el pan, la fruta o la merienda nos recuerda que la mesa es un lugar de encuentro y cercanía."
        },
        {
          palabra: "Conocimiento",
          titulo: "Enseñar lo que ya sabemos",
          texto: "Si ya sabes hacer algo o entendiste una pista, compartirlo con un compañero ayuda a que todo el grupo avance."
        },
        {
          palabra: "Cuentos",
          titulo: "Viajar juntos por una historia",
          texto: "Compartir historias, recuerdos o cuentos nos permite conocer cómo piensan y sienten los demás."
        },
        {
          palabra: "Espacio",
          titulo: "Hacer lugar para todos",
          texto: "Compartir el espacio en el salón o en el patio con respeto hace que todos se sientan bienvenidos."
        },
        {
          palabra: "Gratitud",
          titulo: "Compartir lo que llevamos en el corazón",
          texto: "Al decir en voz alta por qué estamos agradecidos, compartimos un pedacito de nuestro corazón con toda la clase."
        }
      ]
    }
  };

  /* ------------------------------------------------------------
     2. Coordenadas calibradas de las 30 hojas
     (x e y en % de la escena 16:9; rot en grados)
     ------------------------------------------------------------ */

  const LEAF_SLOTS = [
    { id: 1, x: 44.2, y: 59.1, rot: -120, modelo: "Agradecer-1" },
    { id: 2, x: 45.4, y: 30.5, rot: 6, modelo: "Agradecer-2" },
    { id: 3, x: 60.9, y: 52.4, rot: 100, modelo: "Agradecer-3" },
    { id: 4, x: 36.0, y: 28.4, rot: -45, modelo: "Agradecer-1" },
    { id: 5, x: 66.9, y: 15.2, rot: 71, modelo: "Agradecer-2" },
    { id: 6, x: 53.6, y: 6.0, rot: 50, modelo: "Agradecer-3" },
    { id: 7, x: 35.8, y: 6.7, rot: -75, modelo: "Agradecer-1" },
    { id: 8, x: 54.0, y: 19.4, rot: -24, modelo: "Agradecer-2" },
    { id: 9, x: 32.6, y: 49.4, rot: -75, modelo: "Agradecer-3" },
    { id: 10, x: 69.4, y: 37.4, rot: 37, modelo: "Agradecer-1" },
    { id: 11, x: 58.0, y: 32.2, rot: 86, modelo: "Amabilidad-2" },
    { id: 12, x: 72.6, y: 20.6, rot: 0, modelo: "Amabilidad-3" },
    { id: 13, x: 42.7, y: 10.9, rot: -17, modelo: "Amabilidad-1" },
    { id: 14, x: 43.8, y: 47.2, rot: -32, modelo: "Amabilidad-2" },
    { id: 15, x: 28.6, y: 24.4, rot: -52, modelo: "Amabilidad-3" },
    { id: 16, x: 32.7, y: 39.1, rot: -83, modelo: "Amabilidad-1" },
    { id: 17, x: 62.1, y: 41.9, rot: -8, modelo: "Amabilidad-2" },
    { id: 18, x: 50.2, y: 34.7, rot: -7, modelo: "Amabilidad-3" },
    { id: 19, x: 60.1, y: 8.3, rot: -13, modelo: "Amabilidad-1" },
    { id: 20, x: 73.6, y: 41.9, rot: 53, modelo: "Amabilidad-2" },
    { id: 21, x: 38.4, y: 53.7, rot: -140, modelo: "Compartir-3" },
    { id: 22, x: 40.6, y: 36.5, rot: -54, modelo: "Compartir-1" },
    { id: 23, x: 27.0, y: 34.2, rot: -63, modelo: "Compartir-2" },
    { id: 24, x: 67.5, y: 27.7, rot: -29, modelo: "Compartir-3" },
    { id: 25, x: 59.7, y: 23.0, rot: 19, modelo: "Compartir-1" },
    { id: 26, x: 48.1, y: 13.8, rot: -42, modelo: "Compartir-2" },
    { id: 27, x: 37.2, y: 18.7, rot: -109, modelo: "Compartir-3" },
    { id: 28, x: 54.5, y: 48.7, rot: 0, modelo: "Compartir-1" },
    { id: 29, x: 67.3, y: 6.0, rot: 12, modelo: "Compartir-2" },
    { id: 30, x: 68.7, y: 50.3, rot: 59, modelo: "Compartir-3" }
  ];

  const STORAGE_KEY = "diaDeGracias.slots.v3";

  /* ------------------------------------------------------------
     3. Utilidades y referencias
     ------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const round1 = (value) => Math.round(value * 10) / 10;
  const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const CHECK_SVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12.5l4.4 4.4L19 7.4"></path>
    </svg>`;

  const stage = $("#stage");
  const leafLayer = $("#leafLayer");
  const categoryButtons = $("#categoryButtons");
  const calibLayer = $("#calibLayer");
  const calibPanel = $("#calibPanel");
  const calibBtn = $("#calibBtn");
  const lightbox = $("#lightbox");
  const lbCard = $("#lbCard");
  const lbClose = $("#lbClose");
  const lbBack = $("#lbBack");
  const lbCat = $("#lbCat");
  const lbTitle = $("#lbTitle");
  const lbText = $("#lbText");
  const lbWord = $("#lbWord");
  const lbLeafImg = $("#lbLeafImg");
  const signBtn = $("#signBtn");
  const signModal = $("#signModal");
  const signCard = $("#signCard");
  const signClose = $("#signClose");
  const signCloseBtn = $("#signCloseBtn");
  const confirmEl = $("#confirm");
  const confirmCancel = $("#confirmCancel");
  const confirmReset = $("#confirmReset");
  const toastEl = $("#toast");
  const music = $("#music");
  const playBtn = $("#playBtn");
  const audioPill = $("#audioPill");
  const volume = $("#volume");
  const fullscreenBtn = $("#fullscreenBtn");
  const angleRange = $("#angleRange");
  const angleValue = $("#angleValue");
  const calibNodeLabel = $("#calibNodeLabel");
  const calibPos = $("#calibPos");
  const calibModel = $("#calibModel");

  const categoryButtonsByKey = new Map(
    $$(".cat-btn").map((button) => [button.dataset.cat, button])
  );
  const originalIcons = new Map(
    $$(".cat-btn").map((button) => [button.dataset.cat, button.querySelector(".cat-icon").innerHTML])
  );
  const usedCards = {
    agradecer: new Set(),
    amabilidad: new Set(),
    compartir: new Set()
  };

  let slots = loadSlots();
  const usedSlots = new Set();
  const calibNodes = new Map();

  let busy = false;
  let calibrating = false;
  let selectedSlotId = null;
  let lastFocused = null;
  let pendingCelebration = false;
  let sessionToken = 0;
  let openingTimer = 0;
  let toastTimer = 0;
  let pulseFrame = 0;

  /* ------------------------------------------------------------
     4. Escala de la escena (coordenadas 16:9 exactas)
     ------------------------------------------------------------ */

  function updateStageUnit() {
    const width = stage.clientWidth;
    if (!width) return;
    stage.style.setProperty("--u", `${width / 100}px`);
    resizeFireflies();
  }

  /* ------------------------------------------------------------
     5. Luciérnagas (canvas ligero)
     ------------------------------------------------------------ */

  const fireflies = (() => {
    const canvas = $("#fireflies");
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = [];
    const sprites = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastTime = 0;
    let running = false;

    function createSprite(r, g, b) {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 64;
      const sctx = sprite.getContext("2d");
      const gradient = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, `rgba(255, 253, 240, 0.95)`);
      gradient.addColorStop(0.22, `rgba(${r}, ${g}, ${b}, 0.85)`);
      gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.22)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, 64, 64);
      return sprite;
    }

    function makeParticles() {
      const total = window.innerWidth > 1200 ? 30 : 22;
      for (let i = 0; i < total; i += 1) {
        particles.push({
          bx: Math.random(),
          y: Math.random(),
          amp: 0.004 + Math.random() * 0.018,
          wobble: 0.25 + Math.random() * 0.55,
          speed: 0.0035 + Math.random() * 0.008,
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.35 + Math.random() * 1.1,
          alpha: 0.28 + Math.random() * 0.55,
          radius: 1.1 + Math.random() * 2.2,
          spriteIndex: Math.random() > 0.35 ? 0 : 1
        });
      }
    }

    function resize() {
      if (!ctx) return;
      width = stage.clientWidth;
      height = stage.clientHeight;
      if (!width || !height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion || !running) drawStatic();
    }

    function drawParticle(particle, time) {
      const x = (particle.bx + Math.sin(time * particle.wobble + particle.phase) * particle.amp) * width;
      const y = particle.y * height;
      const twinkle = 0.55 + 0.45 * Math.sin(time * particle.twinkle + particle.phase * 3);
      const size = particle.radius * 9 * (0.85 + twinkle * 0.3);
      ctx.globalAlpha = clamp(particle.alpha * twinkle, 0, 1);
      ctx.drawImage(sprites[particle.spriteIndex], x - size / 2, y - size / 2, size, size);
    }

    function drawStatic() {
      if (!ctx || !width || !height) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((particle) => drawParticle(particle, particle.phase * 3));
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function tick(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
      lastTime = now;
      const time = now / 1000;

      particles.forEach((particle) => {
        particle.y -= particle.speed * dt;
        if (particle.y < -0.03) {
          particle.y = 1.03;
          particle.bx = Math.random();
        }
      });

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((particle) => drawParticle(particle, time));
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (reduceMotion || running) return;
      running = true;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function init() {
      if (!ctx) return;
      sprites.push(createSprite(255, 196, 104), createSprite(255, 232, 170));
      makeParticles();
      resize();
      if (reduceMotion) drawStatic();
      else start();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
        else if (!reduceMotion) start();
      });
    }

    return { init, resize, drawStatic };
  })();

  function resizeFireflies() {
    fireflies.resize();
  }

  /* ------------------------------------------------------------
     6. Carga y guardado de coordenadas y modelos de hoja
     ------------------------------------------------------------ */

  function defaultModelo(id) {
    const index = clamp(Number(id) - 1, 0, 29);
    const category = index < 10 ? "agradecer" : index < 20 ? "amabilidad" : "compartir";
    return `${CATEGORIES[category].file}-${(index % 3) + 1}`;
  }

  function parseModelo(value) {
    if (typeof value !== "string") return null;
    const match = /^(Agradecer|Amabilidad|Compartir)-([123])$/.exec(value.trim());
    if (!match) return null;
    const category = Object.keys(CATEGORIES).find((key) => CATEGORIES[key].file === match[1]);
    return category ? { cat: category, variant: Number(match[2]) } : null;
  }

  function modeloOf(slot) {
    return parseModelo(slot.modelo) ? slot.modelo : defaultModelo(slot.id);
  }

  function slotCategory(slot) {
    return parseModelo(modeloOf(slot)).cat;
  }

  function clampSlot(slot) {
    return {
      id: slot.id,
      x: round1(clamp(Number(slot.x), 0, 100)),
      y: round1(clamp(Number(slot.y), 0, 100)),
      rot: Math.round(clamp(Number(slot.rot), -180, 180)),
      modelo: modeloOf(slot)
    };
  }

  function freshSlots() {
    return LEAF_SLOTS.map((slot) => ({ ...slot }));
  }

  function loadSlots() {
    const base = freshSlots();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      if (!Array.isArray(saved) || saved.length !== base.length) return base;
      return base.map((slot, index) => {
        const candidate = saved[index];
        if (!candidate || ![candidate.x, candidate.y, candidate.rot].every(Number.isFinite)) {
          return slot;
        }
        return clampSlot({
          id: slot.id,
          x: candidate.x,
          y: candidate.y,
          rot: candidate.rot,
          modelo: parseModelo(candidate.modelo) ? candidate.modelo : slot.modelo
        });
      });
    } catch (error) {
      return base;
    }
  }

  function slotsToJson() {
    const lines = slots.map(
      (slot) =>
        `  { id: ${slot.id}, x: ${slot.x.toFixed(1)}, y: ${slot.y.toFixed(1)}, rot: ${Math.round(slot.rot)}, modelo: "${modeloOf(slot)}" }`
    );
    return `[\n${lines.join(",\n")}\n]`;
  }

  function getSlot(id) {
    return slots.find((slot) => slot.id === id) || null;
  }

  /* ------------------------------------------------------------
     7. Hojas que nacen en el árbol
     ------------------------------------------------------------ */

  function wordScale(word, large = false) {
    const length = word.length;
    if (large) {
      if (length <= 7) return 1;
      if (length <= 9) return 0.86;
      if (length <= 11) return 0.76;
      return 0.68;
    }
    if (length <= 6) return 1;
    if (length <= 8) return 0.9;
    if (length <= 10) return 0.82;
    return 0.74;
  }

  function createLeaf(record) {
    const slot = getSlot(record.slotId);
    if (!slot) return null;
    const category = CATEGORIES[record.cat];
    const card = record.card;

    const leaf = document.createElement("button");
    leaf.type = "button";
    leaf.className = "leaf";
    leaf.dataset.cat = record.cat;
    leaf.dataset.slotId = String(slot.id);
    leaf.style.setProperty("--x", `${slot.x}%`);
    leaf.style.setProperty("--y", `${slot.y}%`);
    leaf.style.setProperty("--rot", `${slot.rot}deg`);
    leaf.style.setProperty("--sway", `${(3.8 + Math.random() * 1.8).toFixed(2)}s`);
    leaf.style.setProperty("--sway-delay", `${(-Math.random() * 4).toFixed(2)}s`);
    leaf.setAttribute("aria-label", `${card.palabra}: ${card.titulo}. Toca para leer la tarjeta.`);

    const inner = document.createElement("span");
    inner.className = "leaf-inner";

    const img = document.createElement("img");
    img.src = `${category.file}-${record.variant}.webp`;
    img.alt = "";
    img.draggable = false;

    const word = document.createElement("span");
    word.className = "leaf-word";
    word.textContent = card.palabra;
    word.style.setProperty("--fs", wordScale(card.palabra));

    inner.append(img, word);
    leaf.append(inner);
    leaf.addEventListener("click", () => {
      if (!busy && !calibrating) openLightbox(record);
    });

    leafLayer.append(leaf);
    return leaf;
  }

  function syncLeafPositions() {
    $$(".leaf", leafLayer).forEach((leaf) => {
      const slot = getSlot(Number(leaf.dataset.slotId));
      if (!slot) return;
      leaf.style.setProperty("--x", `${slot.x}%`);
      leaf.style.setProperty("--y", `${slot.y}%`);
      leaf.style.setProperty("--rot", `${slot.rot}deg`);
    });
  }

  /* ------------------------------------------------------------
     8. Botones de categoría
     ------------------------------------------------------------ */

  function updateCategoryButton(key) {
    const button = categoryButtonsByKey.get(key);
    if (!button) return;
    const meta = CATEGORIES[key];
    const used = usedCards[key].size;
    const icon = button.querySelector(".cat-icon");
    const metaLabel = button.querySelector("[data-meta]");

    if (used >= meta.cards.length) {
      button.classList.add("is-complete");
      button.disabled = true;
      button.setAttribute("aria-label", `${meta.label}: completado, 10 de 10 tarjetas`);
      icon.innerHTML = CHECK_SVG;
      metaLabel.textContent = "Completado";
    } else {
      button.classList.remove("is-complete");
      button.disabled = false;
      button.setAttribute("aria-label", `${meta.label}: añadir una hoja, ${used} de 10 tarjetas`);
      if (!icon.querySelector("svg") || icon.dataset.completed === "true") {
        icon.innerHTML = originalIcons.get(key);
      }
      icon.dataset.completed = "false";
      metaLabel.textContent = `${used} / 10`;
    }

    if (used >= meta.cards.length) icon.dataset.completed = "true";
  }

  function updateAllCategoryButtons() {
    Object.keys(CATEGORIES).forEach(updateCategoryButton);
  }

  function markThreadSpent(key) {
    const group = document.querySelector(`.thread[data-thread="${key}"]`);
    if (group) group.classList.toggle("is-spent", usedCards[key].size >= 10);
  }

  function castLeaf(key) {
    if (busy || calibrating || !signModal.hidden) return;
    const meta = CATEGORIES[key];
    if (!meta || usedCards[key].size >= meta.cards.length) return;

    const freeSlots = slots.filter(
      (slot) => !usedSlots.has(slot.id) && slotCategory(slot) === key
    );
    if (!freeSlots.length) {
      showToast("Esta categoría ya no tiene posiciones libres. Revisa la calibración.", 4000);
      return;
    }

    const availableCards = meta.cards
      .map((_, index) => index)
      .filter((index) => !usedCards[key].has(index));
    const cardIndex = randomItem(availableCards);
    const slot = randomItem(freeSlots);
    const variant = parseModelo(modeloOf(slot)).variant;

    usedCards[key].add(cardIndex);
    usedSlots.add(slot.id);

    const record = {
      slotId: slot.id,
      cat: key,
      cardIndex,
      variant,
      card: meta.cards[cardIndex]
    };

    createLeaf(record);
    updateCategoryButton(key);
    markThreadSpent(key);

    if (Object.values(usedCards).every((set) => set.size >= 10)) {
      pendingCelebration = true;
    }

    busy = true;
    categoryButtons.classList.add("is-busy");
    firePulse(key);

    const token = sessionToken;
    clearTimeout(openingTimer);
    openingTimer = window.setTimeout(() => {
      if (token !== sessionToken) return;
      busy = false;
      categoryButtons.classList.remove("is-busy");
      openLightbox(record);
    }, 1180);
  }

  /* ------------------------------------------------------------
     9. Pulso de energía por el hilo mágico
     ------------------------------------------------------------ */

  const energyPulse = $("#energyPulse");
  const heartBead = $(".heart-bead");

  function firePulse(key) {
    const group = document.querySelector(`.thread[data-thread="${key}"]`);
    if (!group) return;
    const path = group.querySelector(".thread-core");
    if (!path) return;

    cancelAnimationFrame(pulseFrame);
    group.classList.add("is-firing");
    energyPulse.setAttribute("opacity", "1");
    energyPulse.setAttribute("r", "7");
    heartBead.classList.remove("is-pulsing");

    const totalLength = path.getTotalLength();
    const duration = 880;
    const started = performance.now();

    function step(now) {
      const t = clamp((now - started) / duration, 0, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const point = path.getPointAtLength(totalLength * eased);
      energyPulse.setAttribute("cx", point.x.toFixed(2));
      energyPulse.setAttribute("cy", point.y.toFixed(2));
      energyPulse.setAttribute("r", (6 + Math.sin(Math.PI * t) * 4.5).toFixed(2));

      if (t < 1) {
        pulseFrame = requestAnimationFrame(step);
      } else {
        energyPulse.setAttribute("opacity", "0");
        heartBead.classList.add("is-pulsing");
        window.setTimeout(() => {
          group.classList.remove("is-firing");
          heartBead.classList.remove("is-pulsing");
        }, 420);
      }
    }

    pulseFrame = requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------
     10. Lightbox de lectura
     ------------------------------------------------------------ */

  function openLightbox(record) {
    if (!record || !signModal.hidden) return;
    const meta = CATEGORIES[record.cat];
    const card = record.card;

    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    lbCard.dataset.cat = record.cat;
    lbCat.textContent = meta.label;
    lbTitle.textContent = card.titulo;
    lbText.textContent = card.texto;
    lbWord.textContent = card.palabra;
    lbWord.style.setProperty("--fs", wordScale(card.palabra, true));
    lbLeafImg.src = `${meta.file}-${record.variant}.webp`;
    lbLeafImg.alt = `Hoja de la categoría ${meta.label} con la palabra ${card.palabra}`;

    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");

    requestAnimationFrame(() => {
      lbClose.focus({ preventScroll: true });
    });
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    const restoreTarget = lastFocused && lastFocused.isConnected ? lastFocused : null;
    if (restoreTarget) restoreTarget.focus({ preventScroll: true });

    if (pendingCelebration) {
      pendingCelebration = false;
      window.setTimeout(() => {
        showToast("El árbol está lleno de gratitud. ¡Gracias, clase!", 6200);
      }, 260);
    }
  }

  /* ------------------------------------------------------------
     10.1. Explicación del letrero Día de Gracias
     ------------------------------------------------------------ */

  function openSignModal() {
    if (!signModal.hidden || calibrating || busy || !lightbox.hidden || !confirmEl.hidden) return;
    signCard.scrollTop = 0;
    signModal.hidden = false;
    requestAnimationFrame(() => {
      signClose.focus({ preventScroll: true });
    });
  }

  function closeSignModal() {
    if (signModal.hidden) return;
    signModal.hidden = true;
    signBtn.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------
     10.2. Pantalla completa
     ------------------------------------------------------------ */

  function isFullscreenActive() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function updateFullscreenButton() {
    const active = isFullscreenActive();
    fullscreenBtn.classList.toggle("is-fullscreen", active);
    fullscreenBtn.setAttribute("aria-pressed", String(active));
    fullscreenBtn.setAttribute(
      "aria-label",
      active ? "Salir de pantalla completa" : "Activar pantalla completa"
    );
    fullscreenBtn.title = active ? "Salir de pantalla completa" : "Pantalla completa";
  }

  async function toggleFullscreen() {
    try {
      if (isFullscreenActive()) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        const root = document.documentElement;
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          root.webkitRequestFullscreen();
        } else {
          throw new Error("fullscreen-unsupported");
        }
      }
    } catch (error) {
      showToast("No se pudo activar la pantalla completa en este navegador.", 3600);
    }
    updateFullscreenButton();
  }

  /* ------------------------------------------------------------
     11. Sonido ambiental
     ------------------------------------------------------------ */
  function initAudio() {
    music.volume = 0.4;
    volume.value = "0.4";

    playBtn.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
        } catch (error) {
          showToast("No se pudo iniciar la música. Revisa el archivo de audio.", 3800);
        }
      } else {
        music.pause();
      }
    });

    volume.addEventListener("input", () => {
      const value = Number(volume.value);
      music.volume = clamp(value, 0, 1);
    });

    const syncState = () => {
      const playing = !music.paused;
      audioPill.classList.toggle("is-playing", playing);
      playBtn.setAttribute("aria-pressed", String(playing));
      playBtn.setAttribute("aria-label", playing ? "Pausar música ambiental" : "Reproducir música ambiental");
    };

    music.addEventListener("play", syncState);
    music.addEventListener("pause", syncState);
    music.addEventListener("ended", syncState);
    syncState();
  }

  /* ------------------------------------------------------------
     12. Reinicio de la sesión
     ------------------------------------------------------------ */

  function resetTree() {
    sessionToken += 1;
    clearTimeout(openingTimer);
    busy = false;
    categoryButtons.classList.remove("is-busy");
    pendingCelebration = false;

    $$(".leaf", leafLayer).forEach((leaf) => leaf.remove());
    usedSlots.clear();
    Object.values(usedCards).forEach((set) => set.clear());

    updateAllCategoryButtons();
    Object.keys(CATEGORIES).forEach(markThreadSpent);

    if (!lightbox.hidden) closeLightbox();
    if (!confirmEl.hidden) hideConfirm();

    showToast("El árbol está listo para una nueva sesión.", 3400);
  }

  function showConfirm() {
    confirmEl.hidden = false;
    window.setTimeout(() => confirmCancel.focus({ preventScroll: true }), 30);
  }

  function hideConfirm() {
    if (confirmEl.hidden) return;
    confirmEl.hidden = true;
  }

  /* ------------------------------------------------------------
     13. Editor de calibración
     ------------------------------------------------------------ */

  function renderCalibrationNodes() {
    if (!calibrating) return;
    calibLayer.replaceChildren();
    calibNodes.clear();
    const fragment = document.createDocumentFragment();

    slots.forEach((slot) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = "calib-node";
      node.dataset.slotId = String(slot.id);
      node.style.setProperty("--x", `${slot.x}%`);
      node.style.setProperty("--y", `${slot.y}%`);
      node.style.setProperty("--rot", `${slot.rot}deg`);
      node.setAttribute(
        "aria-label",
        `Hoja ${slot.id}, modelo ${modeloOf(slot)}. x ${slot.x.toFixed(1)} por ciento, y ${slot.y.toFixed(1)} por ciento, rotación ${Math.round(slot.rot)} grados.`
      );

      const img = document.createElement("img");
      img.src = `${modeloOf(slot)}.webp`;
      img.alt = "";
      img.draggable = false;

      const anchor = document.createElement("span");
      anchor.className = "node-anchor";

      const number = document.createElement("span");
      number.className = "node-num";
      number.textContent = slot.id;

      node.append(img, anchor, number);
      bindNodeDrag(node);
      calibNodes.set(slot.id, node);
      fragment.append(node);
    });

    calibLayer.append(fragment);
    if (selectedSlotId == null || !getSlot(selectedSlotId)) selectedSlotId = slots[0].id;
    selectSlot(selectedSlotId);
  }

  function bindNodeDrag(node) {
    node.addEventListener("pointerdown", (event) => {
      if (!calibrating) return;
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();

      const id = Number(node.dataset.slotId);
      selectedSlotId = id;
      selectSlot(id);
      node.classList.add("is-dragging");

      try {
        node.setPointerCapture(event.pointerId);
      } catch (error) { /* ignorado */ }

      const move = (moveEvent) => {
        const rect = stage.getBoundingClientRect();
        const x = clamp(((moveEvent.clientX - rect.left) / rect.width) * 100, 0.4, 99.6);
        const y = clamp(((moveEvent.clientY - rect.top) / rect.height) * 100, 0.4, 99.6);
        const slot = getSlot(id);
        if (!slot) return;
        slot.x = round1(x);
        slot.y = round1(y);
        updateNodeVisual(id);
        updateCalibPanel();
      };

      const end = (endEvent) => {
        node.classList.remove("is-dragging");
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerup", end);
        node.removeEventListener("pointercancel", end);
        try {
          node.releasePointerCapture(endEvent.pointerId);
        } catch (error) { /* ignorado */ }
      };

      node.addEventListener("pointermove", move);
      node.addEventListener("pointerup", end);
      node.addEventListener("pointercancel", end);
    });
  }

  function updateNodeVisual(id) {
    const slot = getSlot(id);
    const node = calibNodes.get(id);
    if (!slot || !node) return;
    node.style.setProperty("--x", `${slot.x}%`);
    node.style.setProperty("--y", `${slot.y}%`);
    node.style.setProperty("--rot", `${slot.rot}deg`);
    node.setAttribute(
      "aria-label",
      `Hoja ${slot.id}, modelo ${modeloOf(slot)}. x ${slot.x.toFixed(1)} por ciento, y ${slot.y.toFixed(1)} por ciento, rotación ${Math.round(slot.rot)} grados.`
    );
  }

  function selectSlot(id) {
    selectedSlotId = id;
    calibNodes.forEach((node, nodeId) => {
      node.classList.toggle("is-selected", nodeId === id);
    });
    updateCalibPanel();
  }

  function updateCalibPanel() {
    const slot = getSlot(selectedSlotId);
    if (!slot) {
      calibNodeLabel.textContent = "Sin hoja seleccionada";
      calibPos.textContent = "";
      calibModel.textContent = "Modelo: —";
      angleRange.value = "0";
      angleRange.disabled = true;
      angleValue.textContent = "—";
      return;
    }
    calibNodeLabel.textContent = `Hoja #${slot.id}`;
    calibPos.textContent = `x ${slot.x.toFixed(1)}% · y ${slot.y.toFixed(1)}%`;
    calibModel.textContent = `Modelo: ${modeloOf(slot)}`;
    angleRange.disabled = false;
    angleRange.value = String(Math.round(slot.rot));
    angleValue.textContent = `${Math.round(slot.rot)}°`;
  }

  function setRotation(id, value) {
    const slot = getSlot(id);
    if (!slot) return;
    slot.rot = Math.round(clamp(value, -180, 180));
    updateNodeVisual(id);
    updateCalibPanel();
  }

  function enterCalibration() {
    if (calibrating || !lightbox.hidden || !confirmEl.hidden || !signModal.hidden) return;
    calibrating = true;
    document.body.classList.add("calibrating");
    calibBtn.setAttribute("aria-pressed", "true");
    calibLayer.setAttribute("aria-hidden", "false");
    calibPanel.hidden = false;
    selectedSlotId = selectedSlotId && getSlot(selectedSlotId) ? selectedSlotId : slots[0].id;
    renderCalibrationNodes();
    showToast("Modo calibración: arrastra las hojas y gira con la rueda del ratón.", 4200);
  }

  function exitCalibration() {
    if (!calibrating) return;
    calibrating = false;
    document.body.classList.remove("calibrating");
    calibBtn.setAttribute("aria-pressed", "false");
    calibLayer.setAttribute("aria-hidden", "true");
    calibPanel.hidden = true;
    calibLayer.replaceChildren();
    calibNodes.clear();
    syncLeafPositions();
    showToast("Coordenadas aplicadas al árbol.", 2600);
  }

  function toggleCalibration() {
    if (calibrating) exitCalibration();
    else enterCalibration();
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.style.position = "fixed";
      helper.style.top = "-9999px";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.focus();
      helper.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (execError) {
        copied = false;
      }
      helper.remove();
      return copied;
    }
  }

  /* ------------------------------------------------------------
     14. Avisos flotantes
     ------------------------------------------------------------ */

  function showToast(message, duration = 3000) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, duration);
  }

  /* ------------------------------------------------------------
     15. Eventos generales
     ------------------------------------------------------------ */

  function trapFocus(event, container = lbCard) {
    const focusables = $$("button:not([disabled])", container);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (!container.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function bindEvents() {
    $$(".cat-btn").forEach((button) => {
      button.addEventListener("click", () => castLeaf(button.dataset.cat));
    });

    $("#resetBtn").addEventListener("click", showConfirm);
    confirmCancel.addEventListener("click", hideConfirm);
    confirmReset.addEventListener("click", () => {
      hideConfirm();
      resetTree();
    });
    $(".confirm-backdrop").addEventListener("click", hideConfirm);

    calibBtn.addEventListener("click", toggleCalibration);
    $("#exitCalibBtn").addEventListener("click", exitCalibration);
    fullscreenBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

    signBtn.addEventListener("click", openSignModal);
    signClose.addEventListener("click", closeSignModal);
    signCloseBtn.addEventListener("click", closeSignModal);
    $(".sign-backdrop", signModal).addEventListener("click", closeSignModal);

    $(".calib-angle").addEventListener("click", (event) => {
      const button = event.target.closest("[data-rot]");
      if (!button) return;
      const slot = getSlot(selectedSlotId);
      if (!slot) return;
      setRotation(slot.id, slot.rot + Number(button.dataset.rot));
    });

    angleRange.addEventListener("input", () => {
      if (selectedSlotId == null) return;
      setRotation(selectedSlotId, Number(angleRange.value));
    });

    $("#copyJsonBtn").addEventListener("click", async () => {
      const ok = await copyToClipboard(slotsToJson());
      showToast(
        ok
          ? "JSON con posición, rotación y modelo copiado. Pégalo en LEAF_SLOTS dentro de app.js."
          : "No se pudo copiar automáticamente. Revisa los permisos del navegador.",
        4200
      );
    });

    $("#saveSlotsBtn").addEventListener("click", () => {
      try {
        const compact = slots.map(({ id, x, y, rot, modelo }) => ({ id, x, y, rot, modelo }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
        syncLeafPositions();
        showToast("Coordenadas y modelos guardados en LocalStorage para este navegador.", 3200);
      } catch (error) {
        showToast("No se pudo guardar en LocalStorage.", 3200);
      }
    });

    $("#restoreSlotsBtn").addEventListener("click", () => {
      slots = freshSlots();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) { /* ignorado */ }
      renderCalibrationNodes();
      syncLeafPositions();
      showToast("Coordenadas originales restauradas.", 3000);
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "e" || event.key === "E")) {
        event.preventDefault();
        toggleCalibration();
        return;
      }

      if (event.key === "Escape") {
        if (!confirmEl.hidden) {
          hideConfirm();
          return;
        }
        if (!lightbox.hidden) {
          closeLightbox();
          return;
        }
        if (!signModal.hidden) {
          closeSignModal();
          return;
        }
        if (calibrating) {
          exitCalibration();
          return;
        }
      }

      if (!lightbox.hidden && event.key === "Tab") trapFocus(event, lbCard);
      if (!signModal.hidden && event.key === "Tab") trapFocus(event, signCard);
    });

    stage.addEventListener(
      "wheel",
      (event) => {
        if (!calibrating) return;
        if (event.target.closest(".calib-panel")) return;
        event.preventDefault();
        const slot = getSlot(selectedSlotId);
        if (!slot) return;
        const step = event.shiftKey ? 1 : 3;
        setRotation(slot.id, slot.rot + (event.deltaY > 0 ? step : -step));
      },
      { passive: false }
    );

    lbClose.addEventListener("click", closeLightbox);
    lbBack.addEventListener("click", closeLightbox);
    $(".lightbox-backdrop", lightbox).addEventListener("click", closeLightbox);

    stage.addEventListener("contextmenu", (event) => event.preventDefault());

    window.addEventListener("resize", updateStageUnit);
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateStageUnit).observe(stage);
    }
  }

  /* ------------------------------------------------------------
     16. Arranque
     ------------------------------------------------------------ */

  function init() {
    updateStageUnit();
    fireflies.init();
    initAudio();
    updateAllCategoryButtons();
    bindEvents();
    updateFullscreenButton();

    document.documentElement.dataset.ready = "true";
  }

  init();
})();
