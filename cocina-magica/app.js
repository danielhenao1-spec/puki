/* =========================================================
   La Cocina Mágica de Yellow
   Modo 1: exploración de grupos alimenticios
   Modo 2: reto del Plato Mágico
   ========================================================= */

(() => {
  "use strict";

  const VIDEO_PLAYLIST = [
    "assets/videos/1-v2.mp4",
    "assets/videos/2.mp4",
    "assets/videos/3.mp4",
    "assets/videos/4.mp4",
    "assets/videos/5.mp4",
  ];

  const GROUP_ORDER = ["proteinas", "lacteos", "carbohidratos", "frutas", "vegetales", "grasas"];

  const GROUPS = {
    proteinas: {
      emoji: "🍗",
      title: "Proteínas",
      pickerSubtitle: "Alimentos que ayudan a crecer fuertes.",
      tint: "#d8f1ff",
      accent: "#5cb7de",
      explanation:
        "Las proteínas nos ayudan a crecer fuertes y a tener músculos sanos. Las encontramos en alimentos como el huevo, el pollo, la carne, el pescado y las caraotas.",
      fact: "Come proteínas en tus comidas para crecer y tener energía para jugar.",
    },
    lacteos: {
      emoji: "🥛",
      title: "Lácteos",
      pickerSubtitle: "Calcio para huesos y dientes sanos.",
      tint: "#e5f6ff",
      accent: "#78b9d8",
      explanation:
        "Los lácteos, como la leche, el queso y el yogurt, cuidan nuestros huesos y dientes. Nos dan calcio para crecer sanos y fuertes.",
      fact: "Los lácteos son una buena fuente de calcio, el amigo de tus huesos.",
    },
    carbohidratos: {
      emoji: "🌾",
      title: "Carbohidratos",
      pickerSubtitle: "Energía para jugar y aprender.",
      tint: "#ffedbb",
      accent: "#e1a019",
      explanation:
        "Los carbohidratos son la energía que nuestro cuerpo usa para correr, jugar y aprender. El arroz, el pan, la arepa y el cereal son buenos amigos de tu energía.",
      fact: "Un alimento con carbohidratos te da energía para jugar y aprender.",
    },
    frutas: {
      emoji: "🍎",
      title: "Frutas",
      pickerSubtitle: "Dulces, coloridas y llenas de vitaminas.",
      tint: "#ffdfd6",
      accent: "#e16b78",
      explanation:
        "Las frutas tienen vitaminas, agua y fibra. Nos ayudan a estar sanos, fuertes y de buen humor. ¡Mientras más colores pruebes, mejor!",
      fact: "Las frutas son un postre natural y delicioso, lleno de vitaminas.",
    },
    vegetales: {
      emoji: "🥦",
      title: "Vegetales",
      pickerSubtitle: "Crujientes, frescos y llenos de color.",
      tint: "#ddf0d3",
      accent: "#5aa34a",
      explanation:
        "Los vegetales tienen vitaminas y fibra que cuidan nuestro cuerpo. Nos ayudan a crecer, a ver bien y a que la barriga funcione bien.",
      fact: "Cada color de vegetal tiene vitaminas diferentes. ¡Prueba varios!",
    },
    grasas: {
      emoji: "💧",
      title: "Grasas Saludables",
      pickerSubtitle: "Un poquito de energía buena.",
      tint: "#edf1c4",
      accent: "#a4ae3f",
      explanation:
        "Las grasas saludables, como el aceite de oliva y los frutos secos, cuidan el corazón y ayudan a nuestro cuerpo a usar las vitaminas. Se comen en pequeñas cantidades.",
      fact: "Las grasas buenas también ayudan a que nuestro cerebro funcione bien.",
    },
  };

  const INGREDIENTS = {
    "harina-maiz": {
      name: "Harina de maíz",
      shortName: "Harina",
      category: "carbohidratos",
      image: "assets/images/ingredients/harina-maiz.webp",
    },
    arroz: { name: "Arroz", category: "carbohidratos", image: "assets/images/ingredients/arroz.webp" },
    pan: { name: "Pan", category: "carbohidratos", image: "assets/images/ingredients/pan.webp" },
    pasta: { name: "Pasta", category: "carbohidratos", image: "assets/images/ingredients/pasta.webp" },
    cereal: { name: "Cereal", category: "carbohidratos", image: "assets/images/ingredients/cereal.webp" },
    pollo: { name: "Pollo", category: "proteinas", image: "assets/images/ingredients/pollo.webp" },
    carne: { name: "Carne", category: "proteinas", image: "assets/images/ingredients/carne.webp" },
    pescado: { name: "Pescado", category: "proteinas", image: "assets/images/ingredients/pescado.webp" },
    huevos: { name: "Huevos", category: "proteinas", image: "assets/images/ingredients/huevos.webp" },
    caraotas: { name: "Caraotas", category: "proteinas", image: "assets/images/ingredients/caraotas.webp" },
    leche: { name: "Leche", category: "lacteos", image: "assets/images/ingredients/leche.webp" },
    queso: { name: "Queso", category: "lacteos", image: "assets/images/ingredients/queso.webp" },
    yogurt: { name: "Yogurt", category: "lacteos", image: "assets/images/ingredients/yogurt.webp" },
    aguacate: { name: "Aguacate", category: "frutas", image: "assets/images/ingredients/aguacate.webp" },
    bananas: {
      name: "Bananas",
      shortName: "Banana",
      category: "frutas",
      image: "assets/images/ingredients/bananas.webp",
    },
    fresas: { name: "Fresas", category: "frutas", image: "assets/images/ingredients/fresas.webp" },
    manzana: { name: "Manzana", category: "frutas", image: "assets/images/ingredients/manzana.webp" },
    naranja: { name: "Naranja", category: "frutas", image: "assets/images/ingredients/naranja.webp" },
    patilla: { name: "Patilla", category: "frutas", image: "assets/images/ingredients/patilla.webp" },
    platanos: { name: "Plátanos", category: "frutas", image: "assets/images/ingredients/platanos.webp" },
    papa: { name: "Papa", category: "vegetales", image: "assets/images/ingredients/papa.webp" },
    zanahoria: { name: "Zanahoria", category: "vegetales", image: "assets/images/ingredients/zanahoria.webp" },
    brocoli: { name: "Brócoli", category: "vegetales", image: "assets/images/ingredients/brocoli.webp" },
    lechuga: { name: "Lechuga", category: "vegetales", image: "assets/images/ingredients/lechuga.webp" },
    tomate: { name: "Tomate", category: "vegetales", image: "assets/images/ingredients/tomate.webp" },
    pimenton: { name: "Pimentón", category: "vegetales", image: "assets/images/ingredients/pimenton.webp" },
    "aceite-oliva": {
      name: "Aceite de oliva",
      category: "grasas",
      image: "assets/images/ingredients/aceite-oliva.webp",
    },
    "frutos-secos": { name: "Frutos secos", category: "grasas", image: "assets/images/ingredients/frutos-secos.webp" },
  };

  const GROUP_INGREDIENTS = {
    proteinas: ["huevos", "caraotas", "pollo", "carne", "pescado"],
    lacteos: ["leche", "queso", "yogurt"],
    carbohidratos: ["harina-maiz", "arroz", "pan", "pasta", "cereal"],
    frutas: ["aguacate", "bananas", "fresas", "manzana", "naranja", "patilla", "platanos"],
    vegetales: ["papa", "zanahoria", "brocoli", "lechuga", "tomate", "pimenton"],
    grasas: ["aceite-oliva", "frutos-secos"],
  };

  const RECIPES = {
    desayuno: {
      id: "desayuno",
      title: "Desayuno Campeón",
      meal: "Desayuno",
      subtitle: "Arepa, huevo y aguacate",
      description: "Un desayuno con energía para empezar el día.",
      ingredients: ["harina-maiz", "huevos", "aguacate"],
      previewImage: "assets/images/preparar-arepa.webp",
      finalImage: "assets/images/plato-arepa.webp",
      successCopy: "¡Bravo! Tu arepa con huevo y aguacate tiene energía para todo el día.",
    },
    almuerzo: {
      id: "almuerzo",
      title: "Almuerzo de los Súper Amigos",
      meal: "Almuerzo",
      subtitle: "Arroz, pollo y puré de papa",
      description: "Un plato completo para jugar con los Súper Amigos.",
      ingredients: ["arroz", "pollo", "papa"],
      previewImage: "assets/images/preparar-arroz.webp",
      finalImage: "assets/images/plato-arroz.webp",
      successCopy: "¡Qué rico! Arroz, pollo y puré de papa para los Súper Amigos.",
    },
    merienda: {
      id: "merienda",
      title: "Súper Merienda Colorida",
      meal: "Merienda",
      subtitle: "Cereal, leche, banana y fresa",
      description: "Una merienda colorida y deliciosa para compartir.",
      ingredients: ["cereal", "leche", "bananas", "fresas"],
      previewImage: "assets/images/preparar-cereal.webp",
      finalImage: "assets/images/plato-cereal.webp",
      successCopy: "¡Colorida y deliciosa! Cereal, leche, banana y fresa para compartir.",
    },
    ensaladaFrutas: {
      id: "ensalada-frutas",
      title: "Ensalada de Frutas Colorida",
      meal: "Merienda",
      subtitle: "Banana, fresa, patilla y naranja",
      description: "Una merienda fresca, colorida y llena de vitaminas.",
      ingredients: ["bananas", "fresas", "patilla", "naranja"],
      previewImage: "assets/images/preparar-ensalada-frutas.webp",
      finalImage: "assets/images/plato-ensalada-frutas.webp",
      successCopy: "¡Fresca y colorida! Tu ensalada de frutas tiene vitaminas para jugar.",
    },
    pastaBolonesa: {
      id: "pasta-bolonesa",
      title: "Pasta Boloñesa Infantil",
      meal: "Almuerzo",
      subtitle: "Pasta, carne, tomate y queso",
      description: "Pasta con carne y queso: un almuerzo que encanta.",
      ingredients: ["pasta", "carne", "tomate", "queso"],
      previewImage: "assets/images/preparar-pasta-bolonesa.webp",
      finalImage: "assets/images/plato-pasta-bolonesa.webp",
      successCopy: "¡Qué rica! La pasta boloñesa tiene energía y proteínas para crecer.",
    },
    pabellon: {
      id: "pabellon",
      title: "Pabellón Criollo",
      meal: "Almuerzo",
      subtitle: "Arroz, carne, caraotas y plátano",
      description: "Un plato venezolano lleno de sabor y energía.",
      ingredients: ["arroz", "carne", "caraotas", "platanos"],
      previewImage: "assets/images/preparar-pabellon.webp",
      finalImage: "assets/images/plato-pabellon.webp",
      successCopy: "¡Un plato venezolano! Arroz, carne, caraotas y plátano para disfrutar.",
    },
    cesar: {
      id: "cesar",
      title: "Ensalada César",
      meal: "Cena",
      subtitle: "Lechuga, pollo y pan tostado",
      description: "Lechuga crujiente, pollo y pan tostado.",
      ingredients: ["lechuga", "pollo", "pan"],
      previewImage: "assets/images/preparar-cesar.webp",
      finalImage: "assets/images/plato-cesar.webp",
      successCopy: "¡Crujiente y deliciosa! Lechuga, pollo y pan tostado para disfrutar.",
    },
  };

  const ERROR_PHRASE = "¡Casi! Ese ingrediente no va en esta receta.";

  const dom = {
    stage: document.getElementById("stage"),
    kitchenScene: document.getElementById("kitchenScene"),
    prepScene: document.getElementById("prepScene"),
    doorTv: document.getElementById("doorTv"),
    videoA: document.getElementById("yellowVideoA"),
    videoB: document.getElementById("yellowVideoB"),
    readyDish: document.getElementById("readyDish"),
    slotbar: document.querySelector(".slotbar"),
    slotBar: document.getElementById("slotBar"),
    slotProgress: document.getElementById("slotProgress"),
    recipeCard: document.getElementById("recipeCard"),
    recipeThumb: document.getElementById("recipeThumb"),
    recipeTitle: document.getElementById("recipeTitle"),
    recipeSubtitle: document.getElementById("recipeSubtitle"),
    recipeSteps: document.getElementById("recipeSteps"),
    recipeCount: document.getElementById("recipeCount"),
    recipeDots: document.getElementById("recipeDots"),
    learnBanner: document.getElementById("learnBanner"),
    soundButton: document.getElementById("soundButton"),
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toastIcon"),
    toastText: document.getElementById("toastText"),
    firstHint: document.getElementById("firstHint"),
    backButton: document.querySelector(".back-button"),
    prepDock: document.getElementById("prepDock"),
    modalRoot: document.getElementById("modalRoot"),
    modalPanel: document.getElementById("modalPanel"),
    successLayer: document.getElementById("successLayer"),
    successTitle: document.getElementById("successTitle"),
    successCopy: document.getElementById("successCopy"),
    confettiCanvas: document.getElementById("confettiCanvas"),
    srAnnouncer: document.getElementById("srAnnouncer"),
    fullscreenButton: document.querySelector('[data-action="fullscreen"]'),
  };

  const state = {
    recipeId: "desayuno",
    added: [],
    wrongTimers: new Map(),
    view: "kitchen",
    completed: false,
    pendingCompletion: false,
    soundOn: readPreference("yellow-sound") !== "off",
    pickerGroup: null,
    modalKind: null,
    infoGroup: null,
    infoIndex: 0,
    infoSwipeStart: null,
    modalReturnFocus: null,
    toastTimer: null,
    completionTimer: null,
    hintTimer: null,
    modalHideTimer: null,
    isFirstInteraction: true,
  };

  const video = {
    active: null,
    standby: null,
    index: 0,
    swapTimer: null,
    retryBound: false,
  };

  let audioContext = null;
  let confettiFrame = null;
  let confettiTimer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* =========================================================
     Utilidades
     ========================================================= */

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return entities[character];
    });
  }

  function readPreference(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function savePreference(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* El juego sigue funcionando sin almacenamiento local. */
    }
  }

  function currentRecipe() {
    return RECIPES[state.recipeId];
  }

  function currentIngredientName(id) {
    return INGREDIENTS[id]?.name ?? "Ingrediente";
  }

  function isIngredientCorrect(id) {
    return currentRecipe().ingredients.includes(id);
  }

  function correctCount() {
    return currentRecipe().ingredients.filter((id) => state.added.includes(id)).length;
  }

  function announce(text) {
    dom.srAnnouncer.textContent = "";
    window.setTimeout(() => {
      dom.srAnnouncer.textContent = text;
    }, 40);
  }

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => {
      if (!(element instanceof HTMLElement)) return false;
      return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
    });
  }

  /* =========================================================
     Sonido y efectos
     ========================================================= */

  function ensureAudioContext() {
    if (!state.soundOn) return null;
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  function playTone(frequency, options = {}) {
    if (!state.soundOn) return;
    const context = ensureAudioContext();
    if (!context) return;

    const {
      duration = 0.16,
      delay = 0,
      gain = 0.075,
      type = "sine",
      glide = null,
    } = options;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (glide) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, glide), start + duration);
    }

    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function playPickupSound() {
    playTone(523.25, { duration: 0.12, gain: 0.05, type: "sine" });
    playTone(659.25, { duration: 0.13, delay: 0.07, gain: 0.045, type: "sine" });
  }

  function playRemoveSound() {
    playTone(392, { duration: 0.1, gain: 0.04, type: "triangle", glide: 330 });
    playTone(293.66, { duration: 0.13, delay: 0.075, gain: 0.035, type: "sine" });
  }

  function playErrorSound() {
    if (!state.soundOn) return;
    playTone(293.66, { duration: 0.17, gain: 0.05, type: "triangle", glide: 220 });
    playTone(220, { duration: 0.22, delay: 0.16, gain: 0.045, type: "sine", glide: 196 });
  }

  function playSuccessSound() {
    if (!state.soundOn) return;
    const melody = [
      [523.25, 0],
      [659.25, 0.11],
      [783.99, 0.23],
      [1046.5, 0.37],
      [1318.51, 0.56],
    ];
    melody.forEach(([frequency, delay], index) => {
      playTone(frequency, {
        duration: index === melody.length - 1 ? 0.5 : 0.2,
        delay,
        gain: index === melody.length - 1 ? 0.06 : 0.055,
        type: index === melody.length - 1 ? "sine" : "triangle",
      });
    });
    playTone(1567.98, { duration: 0.5, delay: 0.58, gain: 0.025, type: "sine" });
  }

  function setSound(on, options = {}) {
    const { silent = false } = options;
    state.soundOn = Boolean(on);
    savePreference("yellow-sound", state.soundOn ? "on" : "off");
    dom.soundButton.classList.toggle("is-muted", !state.soundOn);
    dom.soundButton.setAttribute("aria-pressed", String(state.soundOn));
    dom.soundButton.setAttribute("aria-label", state.soundOn ? "Silenciar sonidos" : "Activar sonidos");

    if (!state.soundOn) {
      if (!silent) {
        showToast("Sonidos en silencio. Puedes activarlos cuando quieras.", "info", "🔇", 2600);
      }
      return;
    }

    if (!silent) {
      ensureAudioContext();
      playTone(659.25, { duration: 0.12, gain: 0.045, type: "sine" });
      playTone(880, { duration: 0.18, delay: 0.08, gain: 0.04, type: "sine" });
      showToast("¡Sonidos activados!", "success", "🔔", 1800);
    }
  }

  /* =========================================================
     Toasts y foco
     ========================================================= */

  function showToast(message, tone = "info", icon = "✨", duration = 3600) {
    window.clearTimeout(state.toastTimer);
    dom.toast.dataset.tone = tone;
    dom.toastIcon.textContent = icon;
    dom.toastText.textContent = message;
    dom.toast.classList.add("is-visible");
    announce(message);

    state.toastTimer = window.setTimeout(() => {
      dom.toast.classList.remove("is-visible");
    }, duration);
  }

  function hideToast() {
    window.clearTimeout(state.toastTimer);
    dom.toast.classList.remove("is-visible");
  }

  function hideFirstHint() {
    if (!dom.firstHint.classList.contains("is-hidden")) {
      dom.firstHint.classList.add("is-hidden");
    }
    window.clearTimeout(state.hintTimer);
  }

  function scheduleFirstHintDismissal() {
    window.clearTimeout(state.hintTimer);
    state.hintTimer = window.setTimeout(hideFirstHint, 9000);
  }

  function handleFirstInteraction() {
    if (!state.isFirstInteraction) return;
    state.isFirstInteraction = false;
    hideFirstHint();
    ensureAudioContext();
    resumeVideoIfNeeded();
  }

  /* =========================================================
     Render de la receta y la bandeja
     ========================================================= */

  function renderRecipeCard() {
    const recipe = currentRecipe();
    const recipeIds = Object.keys(RECIPES);
    const recipePosition = recipeIds.indexOf(state.recipeId);
    dom.recipeThumb.src = recipe.previewImage ?? recipe.finalImage;
    dom.recipeThumb.alt = `Vista previa del plato: ${recipe.title}`;
    dom.recipeTitle.textContent = recipe.title;
    dom.recipeSubtitle.textContent = recipe.subtitle;
    dom.recipeCount.textContent = `${recipePosition + 1} de ${recipeIds.length}`;
    dom.recipeDots.innerHTML = recipeIds
      .map((id, index) => {
        const option = RECIPES[id];
        const isActive = id === state.recipeId;
        return `
          <button class="carousel-dot${isActive ? " is-active" : ""}" type="button"
            data-recipe-choice="${id}" aria-pressed="${isActive}"
            aria-label="Receta ${index + 1}: ${escapeHtml(option.title)}"></button>
        `;
      })
      .join("");
    renderRecipeSteps();
  }

  function renderRecipeSteps() {
    const recipe = currentRecipe();
    dom.recipeSteps.innerHTML = recipe.ingredients
      .map((id) => {
        const ingredient = INGREDIENTS[id];
        const isDone = state.added.includes(id);
        const shortName = ingredient.shortName ?? ingredient.name;
        return `
          <div class="recipe-step${isDone ? " is-done" : ""}" aria-label="${escapeHtml(ingredient.name)}${isDone ? ", ya está en el plato" : ", falta en el plato"}">
            <span class="recipe-step__thumb">
              <img src="${ingredient.image}" alt="" width="512" height="512" draggable="false">
            </span>
            <span class="recipe-step__name">${escapeHtml(shortName)}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderSlotBar() {
    const recipe = currentRecipe();

    if (state.added.length === 0) {
      dom.slotBar.innerHTML = `
        <div class="slot-empty" id="slotEmpty">
          <span class="slot-empty__spark" aria-hidden="true">＋</span>
          <span>Toca un grupo alimenticio para elegir</span>
        </div>
      `;
    } else {
      const pieces = [];
      state.added.forEach((id, index) => {
        const ingredient = INGREDIENTS[id];
        const correct = isIngredientCorrect(id);
        const classes = ["slot-chip", correct ? "is-correct" : "is-wrong"];

        if (index > 0) {
          pieces.push('<span class="plus-symbol" aria-hidden="true">+</span>');
        }

        pieces.push(`
          <div class="${classes.join(" ")}" data-chip-id="${id}" role="listitem" aria-label="${escapeHtml(
          ingredient.name
        )}${correct ? ", ingrediente correcto" : ", ingrediente equivocado"}">
            <div class="slot-chip__thumb">
              <img src="${ingredient.image}" alt="${escapeHtml(ingredient.name)}" width="512" height="512" draggable="false">
              ${
                state.completed
                  ? ""
                  : `<button class="remove-badge" type="button" data-remove="${id}" aria-label="Quitar ${escapeHtml(
                      ingredient.name
                    )} del plato">×</button>`
              }
            </div>
            <span class="slot-chip__name">${escapeHtml(ingredient.name)}</span>
          </div>
        `);
      });
      dom.slotBar.innerHTML = pieces.join("");
    }

    const count = correctCount();
    const total = recipe.ingredients.length;
    dom.slotProgress.textContent = state.completed ? "¡Listo!" : `${count} de ${total}`;
    dom.slotBar.setAttribute(
      "aria-label",
      state.completed
        ? "Plato completo"
        : `Ingredientes en el plato: ${count} de ${total}${state.added.length ? `. ${state.added
            .map((id) => currentIngredientName(id))
            .join(", ")}` : ""}`
    );
  }

  function renderAll() {
    renderRecipeCard();
    renderSlotBar();
  }

  /* =========================================================
     Añadir y quitar ingredientes
     ========================================================= */

  function addIngredient(id) {
    if (state.view !== "prep") return;
    if (!INGREDIENTS[id] || state.completed) return;

    if (state.pendingCompletion) {
      showToast("¡Receta completa! Cierra la ventana para ver la celebración.", "success", "🎉", 2800);
      return;
    }

    ensureAudioContext();
    hideFirstHint();

    if (state.added.includes(id)) {
      showToast(`Ya tienes ${currentIngredientName(id)} en el plato.`, "info", "👀", 2400);
      return;
    }

    const correct = isIngredientCorrect(id);
    state.added.push(id);
    renderSlotBar();
    renderRecipeSteps();
    syncLightbox();

    if (!correct) {
      playErrorSound();
      showToast(`${ERROR_PHRASE} Prueba con otro ingrediente.`, "error", "🙈", 4400);
      window.setTimeout(() => retriggerWrongShake(id), 40);

      if (state.pickerGroup) {
        const categoryToClose = state.pickerGroup;
        window.setTimeout(() => {
          if (state.pickerGroup === categoryToClose) closeModal();
        }, 720);
      }

      const timer = window.setTimeout(() => {
        removeIngredient(id, { silent: true, fromError: true });
      }, 2850);
      state.wrongTimers.set(id, timer);
      return;
    }

    playPickupSound();
    showToast(`¡${currentIngredientName(id)} va en el plato!`, "success", "✅", 1700);
    announce(`${currentIngredientName(id)} agregado al plato.`);

    if (isRecipeReady()) {
      window.clearTimeout(state.completionTimer);
      if (state.modalKind === "picker" && !dom.modalRoot.hidden) {
        state.pendingCompletion = true;
        markPickerReady();
      } else {
        state.completionTimer = window.setTimeout(completeRecipe, 560);
      }
    }
  }

  function markPickerReady() {
    const lead = dom.modalPanel.querySelector(".lightbox__lead");
    if (lead) {
      lead.textContent = "¡Receta completa! Cierra esta ventana para ver la celebración.";
      lead.classList.add("is-ready");
    }

    const doneButton = dom.modalPanel.querySelector('.lightbox__actions [data-action="close-modal"]');
    if (doneButton) {
      doneButton.innerHTML = '¡Ver mi plato! <span aria-hidden="true">🎉</span>';
      doneButton.classList.add("primary-button--celebrate");
    }

    showToast("¡Receta completa! Cierra la ventana para ver la celebración.", "success", "🎉", 5200);
    announce("¡Receta completa! Cierra la ventana para ver la celebración.");
  }

  function retriggerWrongShake(id) {
    const chip = dom.slotBar.querySelector(`[data-chip-id="${id}"]`);
    if (!chip) return;
    chip.classList.remove("is-wrong");
    void chip.offsetWidth;
    chip.classList.add("is-wrong");
  }

  function removeIngredient(id, options = {}) {
    const { silent = false, fromError = false } = options;
    if (state.completed && !fromError) return;
    if (state.pendingCompletion && !fromError) {
      showToast("La receta ya está completa. Cierra la ventana para ver tu plato.", "success", "🌟", 2600);
      return;
    }
    if (!state.added.includes(id)) return;

    const timer = state.wrongTimers.get(id);
    if (timer) {
      window.clearTimeout(timer);
      state.wrongTimers.delete(id);
    }

    const chip = dom.slotBar.querySelector(`[data-chip-id="${id}"]`);
    if (chip) chip.classList.add("is-leaving");

    if (!silent) playRemoveSound();

    window.setTimeout(() => {
      state.added = state.added.filter((ingredientId) => ingredientId !== id);
      renderSlotBar();
      renderRecipeSteps();
      syncLightbox();

      if (!silent) {
        showToast(`Quitamos ${currentIngredientName(id)} del plato.`, "info", "↩️", 2000);
      }
    }, 230);
  }

  function isRecipeReady() {
    if (state.added.length !== currentRecipe().ingredients.length) return false;
    return currentRecipe().ingredients.every((id) => state.added.includes(id));
  }

  /* =========================================================
     Plato mágico
     ========================================================= */

  /* =========================================================
     Cambio entre Modo 1 y Modo 2
     ========================================================= */

  function setChallengeUIActive(active) {
    dom.slotbar.inert = !active;
    dom.recipeCard.inert = !active;
    dom.prepDock.inert = !active;
    dom.learnBanner.setAttribute("aria-hidden", active ? "true" : "false");
  }

  function enterPrep(options = {}) {
    const { silent = false } = options;
    if (state.view === "prep") return;

    state.view = "prep";
    dom.stage.dataset.view = "prep";
    dom.kitchenScene.inert = true;
    dom.prepScene.inert = false;
    dom.backButton.tabIndex = 0;
    setChallengeUIActive(true);
    window.clearTimeout(state.hintTimer);
    hideFirstHint();
    pauseVideo();
    closeModal({ focus: false });
    playTone(523.25, { duration: 0.12, gain: 0.04, type: "sine" });

    if (!silent) {
      showToast("Elige una receta en el carrusel y añade ingredientes por grupo.", "recipe", "🍽️", 4000);
    }

    window.setTimeout(() => {
      if (state.view === "prep") dom.recipeTitle.focus({ preventScroll: true });
    }, 420);
  }

  function exitPrep() {
    if (state.view === "kitchen") return;
    if (state.completed) return;

    state.view = "kitchen";
    dom.stage.dataset.view = "kitchen";
    dom.kitchenScene.inert = false;
    dom.prepScene.inert = true;
    dom.backButton.tabIndex = -1;
    state.pendingCompletion = false;
    setChallengeUIActive(false);
    closeModal({ focus: false });
    resumeVideoIfNeeded();
    showToast("Modo exploración: toca un grupo alimenticio para aprender.", "info", "📖", 3000);

    window.setTimeout(() => {
      document.querySelector("[data-info-group]")?.focus({ preventScroll: true });
    }, 420);
  }

  function resetPlate(options = {}) {
    const { keepView = true, announcement = true } = options;
    window.clearTimeout(state.completionTimer);
    state.completionTimer = null;
    state.wrongTimers.forEach((timer) => window.clearTimeout(timer));
    state.wrongTimers.clear();
    state.added = [];
    state.completed = false;
    state.pendingCompletion = false;
    dom.stage.classList.remove("is-complete");
    dom.readyDish.classList.remove("is-loaded");
    dom.readyDish.removeAttribute("src");
    dom.readyDish.alt = "";
    hideSuccessLayer();
    stopConfetti();
    closeModal({ focus: false });
    renderAll();
    syncLightbox();

    if (!keepView) {
      state.view = "kitchen";
      dom.stage.dataset.view = "kitchen";
      dom.kitchenScene.inert = false;
      dom.prepScene.inert = true;
      dom.backButton.tabIndex = -1;
      resumeVideoIfNeeded();
    }

    if (announcement) {
      showToast("Plato vacío. ¡Vamos a cocinar otra vez!", "info", "🍽️", 2500);
    }
  }

  function completeRecipe() {
    if (state.completed) return;
    if (!isRecipeReady()) return;

    state.completed = true;
    state.pendingCompletion = false;
    window.clearTimeout(state.completionTimer);
    hideToast();
    playSuccessSound();

    if (state.pickerGroup) closeModal({ focus: false });
    if (state.view !== "prep") {
      enterPrep({ silent: true });
    }

    const recipe = currentRecipe();
    dom.readyDish.classList.remove("is-loaded");
    dom.readyDish.src = recipe.finalImage;
    dom.readyDish.alt = `Plato terminado: ${recipe.title}`;

    const reveal = () => {
      dom.stage.classList.add("is-complete");
      dom.readyDish.classList.add("is-loaded");
      renderSlotBar();
      renderRecipeSteps();
      announce(`¡Receta completada! ${recipe.title}.`);
      window.setTimeout(showSuccessLayer, 480);
    };

    if (dom.readyDish.complete) {
      window.requestAnimationFrame(reveal);
    } else {
      dom.readyDish.addEventListener("load", () => window.requestAnimationFrame(reveal), { once: true });
      dom.readyDish.addEventListener(
        "error",
        () => {
          window.requestAnimationFrame(reveal);
        },
        { once: true }
      );
    }
  }

  function showSuccessLayer() {
    const recipe = currentRecipe();
    dom.successTitle.textContent = `¡${recipe.title} listo!`;
    dom.successCopy.textContent = recipe.successCopy;
    dom.successLayer.classList.add("is-visible");
    dom.successLayer.setAttribute("aria-hidden", "false");
    dom.stage.classList.add("is-complete");
    renderSlotBar();
    announce(`¡Receta completada! ${recipe.title}. ${recipe.successCopy}`);
    launchConfetti();

    window.setTimeout(() => {
      dom.successTitle.focus({ preventScroll: true });
    }, 120);
  }

  function hideSuccessLayer() {
    dom.successLayer.classList.remove("is-visible");
    dom.successLayer.setAttribute("aria-hidden", "true");
  }

  /* =========================================================
     Modo 1: Lightbox informativo por grupo alimenticio
     ========================================================= */

  function openGroupInfo(groupId) {
    if (!GROUPS[groupId] || state.view !== "kitchen" || state.completed) return;
    ensureAudioContext();
    hideFirstHint();
    state.modalKind = "info";
    state.infoGroup = groupId;
    state.infoIndex = 0;
    playTone(659.25, { duration: 0.1, gain: 0.035, type: "sine" });
    openModal(buildInfoLightbox(groupId), { kind: "info" });
  }

  function buildInfoLightbox(groupId) {
    const group = GROUPS[groupId];
    const items = GROUP_INGREDIENTS[groupId];
    const currentFood = INGREDIENTS[items[state.infoIndex]];

    const thumbs = items
      .map((id, index) => {
        const ingredient = INGREDIENTS[id];
        const active = index === state.infoIndex;
        return `
          <button class="info-thumb${active ? " is-active" : ""}" type="button"
            data-carousel-index="${index}" aria-pressed="${active}"
            aria-label="Ver ${escapeHtml(ingredient.name)}">
            <img src="${ingredient.image}" alt="" width="512" height="512" draggable="false">
          </button>
        `;
      })
      .join("");

    return `
      <div class="info-lightbox" style="--group-tint: ${group.tint}; --group-accent: ${group.accent}">
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Cerrar información de ${escapeHtml(group.title)}">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>

        <div class="info-lightbox__layout">
          <section class="info-carousel" aria-label="Alimentos del grupo ${escapeHtml(group.title)}">
            <div class="info-carousel__stage">
              <button class="info-nav info-nav--prev" type="button" data-carousel-nav="-1" aria-label="Ver el alimento anterior">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7"/></svg>
              </button>

              <div class="info-slide" id="infoSlide">
                <div class="info-slide__photo">
                  <img id="infoFoodImage" src="${currentFood.image}" alt="${escapeHtml(currentFood.name)}" width="512" height="512" draggable="false">
                </div>
                <div class="info-slide__caption">
                  <span class="info-slide__eyebrow">Alimento del grupo</span>
                  <strong class="info-slide__name" id="infoFoodName">${escapeHtml(currentFood.name)}</strong>
                </div>
              </div>

              <button class="info-nav info-nav--next" type="button" data-carousel-nav="1" aria-label="Ver el siguiente alimento">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7"/></svg>
              </button>
            </div>

            <div class="info-carousel__thumbs" id="infoThumbs">${thumbs}</div>
            <div class="info-carousel__footer">
              <span class="info-carousel__counter" id="infoCounter">1 de ${items.length}</span>
              <span class="info-carousel__hint">Usa las flechas para descubrir</span>
            </div>
          </section>

          <section class="info-copy" aria-labelledby="modalTitle">
            <span class="info-copy__tag">Grupo alimenticio</span>
            <div class="info-copy__title-row">
              <span class="info-copy__emoji" aria-hidden="true">${group.emoji}</span>
              <h2 id="modalTitle">${escapeHtml(group.title)}</h2>
            </div>
            <p class="info-copy__lead">${escapeHtml(group.explanation)}</p>
            <div class="info-copy__fact">
              <span aria-hidden="true">💡</span>
              <div>
                <strong>¿Sabías que...?</strong>
                <p>${escapeHtml(group.fact)}</p>
              </div>
            </div>
            <div class="info-copy__actions">
              <button class="primary-button" type="button" data-action="close-modal">¡Entendido! <span aria-hidden="true">✓</span></button>
            </div>
            <p class="info-copy__note">Cuando cierres, toca el plato del centro para entrar al Plato Mágico.</p>
          </section>
        </div>
      </div>
    `;
  }

  function updateInfoCarousel(nextIndex) {
    if (state.modalKind !== "info" || !state.infoGroup) return;
    const items = GROUP_INGREDIENTS[state.infoGroup];
    if (!items || items.length === 0) return;

    const total = items.length;
    state.infoIndex = ((nextIndex % total) + total) % total;
    const ingredient = INGREDIENTS[items[state.infoIndex]];

    const image = document.getElementById("infoFoodImage");
    const name = document.getElementById("infoFoodName");
    const counter = document.getElementById("infoCounter");
    const slide = document.getElementById("infoSlide");

    if (image) {
      image.src = ingredient.image;
      image.alt = ingredient.name;
    }
    if (name) name.textContent = ingredient.name;
    if (counter) counter.textContent = `${state.infoIndex + 1} de ${total}`;

    dom.modalPanel.querySelectorAll("[data-carousel-index]").forEach((thumb) => {
      const active = Number(thumb.dataset.carouselIndex) === state.infoIndex;
      thumb.classList.toggle("is-active", active);
      thumb.setAttribute("aria-pressed", String(active));
    });

    if (slide) {
      slide.classList.remove("is-changing");
      void slide.offsetWidth;
      slide.classList.add("is-changing");
    }

    announce(`${ingredient.name}. Alimento ${state.infoIndex + 1} de ${total} de ${GROUPS[state.infoGroup].title}.`);
  }

  function stepInfoCarousel(direction) {
    updateInfoCarousel(state.infoIndex + direction);
  }

  /* =========================================================
     Modo 2: selector de ingredientes por grupo
     ========================================================= */

  function openIngredientPicker(groupId) {
    if (state.view !== "prep" || state.completed) return;
    if (!GROUPS[groupId]) return;
    ensureAudioContext();
    hideFirstHint();
    state.modalKind = "picker";
    state.pickerGroup = groupId;
    openModal(buildIngredientPicker(groupId), { kind: "picker" });
  }

  function buildIngredientPicker(groupId) {
    const group = GROUPS[groupId];
    const recipe = currentRecipe();
    const count = correctCount();
    const ingredients = GROUP_INGREDIENTS[groupId];

    const cards = ingredients
      .map((id) => {
        const ingredient = INGREDIENTS[id];
        const isAdded = state.added.includes(id);
        const isWrong = state.added.includes(id) && !recipe.ingredients.includes(id);
        return `
          <button class="ingredient-card${isAdded ? " is-added" : ""}${isWrong ? " is-wrong" : ""}" type="button"
            data-ingredient="${id}" aria-pressed="${isAdded}"
            aria-label="${escapeHtml(ingredient.name)}${isAdded ? ", en el plato. Toca para quitar" : ", toca para añadir al plato"}">
            <span class="ingredient-card__image-wrap">
              <img class="ingredient-card__image" src="${ingredient.image}" alt="" width="512" height="512" draggable="false">
              <span class="ingredient-card__add" aria-hidden="true">${isAdded ? "✓" : "+"}</span>
            </span>
            <span class="ingredient-card__name">
              <span>${escapeHtml(ingredient.name)}</span>
              <span class="ingredient-card__status">${isAdded ? "En el plato" : ""}</span>
            </span>
          </button>
        `;
      })
      .join("");

    return `
      <div class="lightbox" style="--category-tint: ${group.tint}">
        <div class="lightbox__hero">
          <div class="lightbox__icon" aria-hidden="true">${group.emoji}</div>
          <div class="lightbox__heading">
            <span class="lightbox__eyebrow">Grupo alimenticio</span>
            <h2 id="modalTitle">${escapeHtml(group.title)}</h2>
            <p>${escapeHtml(group.pickerSubtitle)} · <strong id="lightboxCount">${count} de ${recipe.ingredients.length}</strong></p>
          </div>
          <button class="modal-close" type="button" data-action="close-modal" aria-label="Cerrar selección de ${escapeHtml(group.title)}">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div class="lightbox__body">
          <p class="lightbox__lead">Elige los ingredientes de este grupo que necesitas para la receta.</p>
          <div class="ingredient-grid">${cards}</div>
        </div>
        <div class="lightbox__footer">
          <div class="lightbox__tray">
            <span class="lightbox__tray-label">Tu plato</span>
            <div class="lightbox__tray-items" id="lightboxTray">${buildTrayMarkup()}</div>
          </div>
          <div class="lightbox__actions">
            <button class="primary-button" type="button" data-action="close-modal">Listo <span aria-hidden="true">✓</span></button>
          </div>
        </div>
      </div>
    `;
  }

  function buildTrayMarkup() {
    if (state.added.length === 0) {
      return '<span class="lightbox__tray-empty">Aún está vacío</span>';
    }
    return state.added
      .map((id) => {
        const ingredient = INGREDIENTS[id];
        const wrong = !isIngredientCorrect(id);
        return `
          <span class="tray-mini${wrong ? " tray-mini--wrong" : ""}" title="${escapeHtml(ingredient.name)}">
            <img src="${ingredient.image}" alt="${escapeHtml(ingredient.name)}" width="512" height="512" draggable="false">
          </span>
        `;
      })
      .join("");
  }

  function syncLightbox() {
    if (!state.pickerGroup || state.modalKind !== "picker" || dom.modalRoot.hidden) return;
    const recipe = currentRecipe();
    const count = correctCount();

    dom.modalPanel.querySelectorAll(".ingredient-card[data-ingredient]").forEach((card) => {
      const id = card.dataset.ingredient;
      const ingredient = INGREDIENTS[id];
      const isAdded = state.added.includes(id);
      const isWrong = isAdded && !recipe.ingredients.includes(id);
      card.classList.toggle("is-added", isAdded);
      card.classList.toggle("is-wrong", isWrong);
      card.setAttribute("aria-pressed", String(isAdded));
      card.setAttribute(
        "aria-label",
        `${ingredient.name}${isAdded ? ", en el plato. Toca para quitar" : ", toca para añadir al plato"}`
      );
      const badge = card.querySelector(".ingredient-card__add");
      if (badge) badge.textContent = isWrong ? "!" : isAdded ? "✓" : "+";
      const status = card.querySelector(".ingredient-card__status");
      if (status) status.textContent = isWrong ? "No va" : isAdded ? "En el plato" : "";
    });

    const countElement = document.getElementById("lightboxCount");
    if (countElement) countElement.textContent = `${count} de ${recipe.ingredients.length}`;

    const tray = document.getElementById("lightboxTray");
    if (tray) tray.innerHTML = buildTrayMarkup();
  }

  function openModal(markup, options = {}) {
    const { kind = "" } = options;
    window.clearTimeout(state.modalHideTimer);
    state.modalReturnFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dom.modalPanel.dataset.kind = kind;
    dom.modalPanel.innerHTML = markup;
    dom.modalPanel.scrollTop = 0;
    dom.modalRoot.hidden = false;
    dom.modalRoot.classList.remove("is-open");

    window.requestAnimationFrame(() => {
      dom.modalRoot.classList.add("is-open");
      const target = dom.modalPanel.querySelector(".modal-close") || dom.modalPanel.querySelector("button");
      if (target) target.focus({ preventScroll: true });
    });
  }

  function closeModal(options = {}) {
    const { focus = true } = options;
    const shouldCelebrate = state.pendingCompletion && state.modalKind === "picker";
    if (shouldCelebrate) state.pendingCompletion = false;

    if (dom.modalRoot.hidden) {
      state.pickerGroup = null;
      state.infoGroup = null;
      state.infoIndex = 0;
      state.modalKind = null;
      if (shouldCelebrate) {
        state.completionTimer = window.setTimeout(completeRecipe, 180);
      }
      return;
    }

    state.pickerGroup = null;
    state.infoGroup = null;
    state.infoIndex = 0;
    state.modalKind = null;
    dom.modalRoot.classList.remove("is-open");
    const returnFocus = state.modalReturnFocus;
    window.clearTimeout(state.modalHideTimer);
    state.modalHideTimer = window.setTimeout(() => {
      if (dom.modalRoot.classList.contains("is-open")) return;
      dom.modalRoot.hidden = true;
      dom.modalPanel.innerHTML = "";
      if (focus && returnFocus?.isConnected) {
        returnFocus.focus({ preventScroll: true });
      }
      if (shouldCelebrate) {
        window.clearTimeout(state.completionTimer);
        state.completionTimer = window.setTimeout(completeRecipe, 180);
      }
    }, 250);
  }

  function handleModalClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.closest('[data-action="close-modal"]')) {
      closeModal();
      return;
    }

    const carouselNav = target.closest("[data-carousel-nav]");
    if (carouselNav) {
      stepInfoCarousel(Number(carouselNav.dataset.carouselNav));
      return;
    }

    const carouselThumb = target.closest("[data-carousel-index]");
    if (carouselThumb) {
      updateInfoCarousel(Number(carouselThumb.dataset.carouselIndex));
      return;
    }

    const ingredientButton = target.closest("[data-ingredient]");
    if (ingredientButton) {
      const id = ingredientButton.dataset.ingredient;
      if (state.added.includes(id)) {
        removeIngredient(id);
      } else {
        addIngredient(id);
      }
    }
  }

  function selectRecipe(recipeId) {
    if (!RECIPES[recipeId] || state.view !== "prep") return;

    if (recipeId === state.recipeId && !state.completed) {
      showToast(`Seguimos cocinando ${currentRecipe().title}.`, "recipe", "📖", 2200);
      return;
    }

    window.clearTimeout(state.completionTimer);
    state.wrongTimers.forEach((timer) => window.clearTimeout(timer));
    state.wrongTimers.clear();
    state.recipeId = recipeId;
    state.added = [];
    state.completed = false;
    state.pendingCompletion = false;
    dom.stage.classList.remove("is-complete");
    hideSuccessLayer();
    stopConfetti();
    dom.readyDish.classList.remove("is-loaded");
    dom.readyDish.removeAttribute("src");
    dom.readyDish.alt = "";
    renderAll();
    syncLightbox();
    playTone(587.33, { duration: 0.1, gain: 0.035, type: "triangle" });
    playTone(783.99, { duration: 0.15, delay: 0.06, gain: 0.032, type: "sine" });
    showToast(`Receta elegida: ${currentRecipe().title}`, "recipe", "🍽️", 3000);
    announce(`Ahora cocinamos ${currentRecipe().title}.`);
    window.requestAnimationFrame(() => {
      dom.recipeTitle.focus({ preventScroll: true });
    });
  }

  function cycleRecipe(direction) {
    if (state.view !== "prep") return;
    const recipeIds = Object.keys(RECIPES);
    const currentIndex = recipeIds.indexOf(state.recipeId);
    const nextIndex = (currentIndex + direction + recipeIds.length) % recipeIds.length;
    selectRecipe(recipeIds[nextIndex]);
  }

  function openHelp() {
    hideFirstHint();
    state.pickerGroup = null;
    state.infoGroup = null;
    state.modalKind = "help";
    openModal(buildHelp(), { kind: "help" });
  }

  function buildHelp() {
    return `
      <div class="help-panel">
        <div class="help-panel__hero">
          <div class="lightbox__icon" aria-hidden="true">🦁</div>
          <div>
            <span class="recipe-book__kicker">La cocina mágica de Yellow</span>
            <h2 id="modalTitle">Cómo jugar</h2>
            <p class="lead">Explora, aprende y después cocina en el Plato Mágico.</p>
          </div>
          <button class="modal-close" type="button" data-action="close-modal" aria-label="Cerrar ayuda">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div class="help-panel__body">
          <div class="help-grid">
            <div class="help-step">
              <span class="help-step__number" aria-hidden="true">1</span>
              <h3>Explora y aprende</h3>
              <p>Toca las etiquetas de los grupos alimenticios. Descubrirás sus alimentos en un carrusel y una explicación sencilla.</p>
            </div>
            <div class="help-step">
              <span class="help-step__number" aria-hidden="true">2</span>
              <h3>Entra al Plato Mágico</h3>
              <p>Toca el plato del centro o el botón ¡A cocinar! Se abrirá el modo de juego con el carrusel de recetas.</p>
            </div>
            <div class="help-step">
              <span class="help-step__number" aria-hidden="true">3</span>
              <h3>Arma la receta</h3>
              <p>Elige una receta y toca los grupos para añadir ingredientes. Usa la X roja para quitar y celebra al completar.</p>
            </div>
          </div>
          <div class="help-note">
            <span aria-hidden="true">💡</span>
            <span>Para dar clase, usa el botón <strong>Pantalla</strong> y el botón <strong>Sonido</strong>. La app se guarda en el dispositivo y puede usarse sin internet después de la primera visita.</span>
          </div>
        </div>
      </div>
    `;
  }

  function handleKeydown(event) {
    if (dom.modalRoot.hidden) return;

    if (state.modalKind === "info" && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      stepInfoCarousel(event.key === "ArrowRight" ? 1 : -1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(dom.modalPanel);
    if (focusable.length === 0) {
      event.preventDefault();
      dom.modalPanel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === dom.modalPanel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* =========================================================
     Acciones globales
     ========================================================= */

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation && typeof screen.orientation.lock === "function") {
          screen.orientation.lock("landscape").catch(() => {});
        }
        showToast("¡Pantalla completa! Ahora la cocina se ve en grande.", "success", "🖥️", 2500);
      } else {
        await document.exitFullscreen();
        showToast("Salimos de pantalla completa.", "info", "🖥️", 2000);
      }
    } catch (error) {
      showToast("Tu navegador no permite pantalla completa en este momento.", "info", "🖥️", 3000);
    }
  }

  function handleAction(action) {
    switch (action) {
      case "open-help":
        openHelp();
        break;
      case "toggle-sound":
        setSound(!state.soundOn);
        break;
      case "fullscreen":
        toggleFullscreen();
        break;
      case "enter-prep":
        enterPrep();
        break;
      case "back-to-kitchen":
        exitPrep();
        break;
      case "prev-recipe":
        cycleRecipe(-1);
        break;
      case "next-recipe":
        cycleRecipe(1);
        break;
      case "play-again":
        resetPlate({ keepView: true, announcement: true });
        break;
      case "close-modal":
        closeModal();
        break;
      default:
        break;
    }
  }

  function handleDocumentClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    handleFirstInteraction();

    if (!dom.modalRoot.hidden) return;

    const removeButton = target.closest("[data-remove]");
    if (removeButton) {
      removeIngredient(removeButton.dataset.remove);
      return;
    }

    const actionElement = target.closest("[data-action]");
    if (actionElement) {
      handleAction(actionElement.dataset.action);
      return;
    }

    const infoGroupElement = target.closest("[data-info-group]");
    if (infoGroupElement) {
      openGroupInfo(infoGroupElement.dataset.infoGroup);
      return;
    }

    const pickerGroupElement = target.closest("[data-picker-group]");
    if (pickerGroupElement) {
      openIngredientPicker(pickerGroupElement.dataset.pickerGroup);
      return;
    }

    const recipeChoice = target.closest("[data-recipe-choice]");
    if (recipeChoice) {
      selectRecipe(recipeChoice.dataset.recipeChoice);
    }
  }

  /* =========================================================
     Secuencia de video del personaje
     ========================================================= */

  function initVideoSequence() {
    video.active = dom.videoA;
    video.standby = dom.videoB;
    video.index = 0;

    [dom.videoA, dom.videoB].forEach((element) => {
      element.muted = true;
      element.defaultMuted = true;
      element.playsInline = true;
      element.addEventListener("ended", onActiveVideoEnded);
      element.addEventListener("error", () => {
        /* El fotograma de respaldo del contenedor sigue visible. */
      });
    });

    video.active.src = VIDEO_PLAYLIST[0];
    video.standby.src = VIDEO_PLAYLIST[1 % VIDEO_PLAYLIST.length];
    video.active.classList.add("is-active");
    video.standby.classList.remove("is-active");

    tryPlayVideo(video.active);
    resumeVideoIfNeeded();

    if (!video.retryBound) {
      video.retryBound = true;
      document.addEventListener(
        "pointerdown",
        () => {
          resumeVideoIfNeeded();
        },
        { once: true }
      );
    }
  }

  function tryPlayVideo(element) {
    if (!element) return;
    const playPromise = element.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        /* Los navegadores permiten reintentar con el primer toque. */
      });
    }
  }

  function onActiveVideoEnded(event) {
    if (event.currentTarget !== video.active) return;
    if (state.view !== "kitchen") return;
    if (!video.standby) return;

    const nextVideo = video.standby;
    nextVideo.currentTime = 0;
    const playPromise = nextVideo.play();

    const swap = () => {
      nextVideo.classList.add("is-active");
      video.active.classList.remove("is-active");
      const previous = video.active;
      video.active = nextVideo;
      video.standby = previous;
      video.index = (video.index + 1) % VIDEO_PLAYLIST.length;
      const followingIndex = (video.index + 1) % VIDEO_PLAYLIST.length;

      window.clearTimeout(video.swapTimer);
      video.swapTimer = window.setTimeout(() => {
        try {
          previous.pause();
          previous.currentTime = 0;
          previous.src = VIDEO_PLAYLIST[followingIndex];
          previous.load();
        } catch (error) {
          /* Si el navegador no permite preparar el siguiente clip, se reintenta al finalizar. */
        }
      }, 260);
    };

    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(swap).catch(() => {
        tryPlayVideo(video.active);
      });
    } else {
      swap();
    }
  }

  function pauseVideo() {
    if (video.active) video.active.pause();
    if (video.standby) video.standby.pause();
  }

  function resumeVideoIfNeeded() {
    if (state.view !== "kitchen" || document.hidden) return;
    if (video.active && video.active.paused) {
      if (video.active.ended) {
        try {
          video.active.currentTime = 0;
        } catch (error) {
          /* Algunos navegadores no permiten cambiar el tiempo antes de cargar. */
        }
      }
      tryPlayVideo(video.active);
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      pauseVideo();
    } else {
      resumeVideoIfNeeded();
    }
  }

  /* =========================================================
     Confeti y estrellas
     ========================================================= */

  function resizeConfettiCanvas() {
    const canvas = dom.confettiCanvas;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = dom.stage.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { context, width: rect.width, height: rect.height };
  }

  function starPath(context, x, y, radius, rotation) {
    context.beginPath();
    for (let point = 0; point < 10; point += 1) {
      const angle = rotation + (Math.PI / 5) * point - Math.PI / 2;
      const distance = point % 2 === 0 ? radius : radius * 0.45;
      const px = x + Math.cos(angle) * distance;
      const py = y + Math.sin(angle) * distance;
      if (point === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();
  }

  function drawStaticCelebration(context, width, height) {
    const colors = ["#F5B324", "#FF7A59", "#53A447", "#47B4E5", "#E86A92", "#FFF1A8", "#F7941D"];
    context.clearRect(0, 0, width, height);

    for (let index = 0; index < 68; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.72;
      const size = 5 + Math.random() * 11;
      const shapeRoll = Math.random();
      context.save();
      context.globalAlpha = 0.55 + Math.random() * 0.42;
      context.translate(x, y);
      context.rotate(Math.random() * Math.PI * 2);
      context.fillStyle = colors[Math.floor(Math.random() * colors.length)];

      if (shapeRoll < 0.46) {
        starPath(context, 0, 0, size, 0);
        context.fill();
      } else if (shapeRoll < 0.74) {
        context.beginPath();
        context.arc(0, 0, size * 0.45, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(-size * 0.55, -size * 0.24, size * 1.1, size * 0.52);
      }
      context.restore();
    }
  }

  function launchConfetti() {
    stopConfetti();
    const { context, width, height } = resizeConfettiCanvas();
    if (reduceMotion.matches) {
      drawStaticCelebration(context, width, height);
      return;
    }

    const colors = ["#F5B324", "#FF7A59", "#53A447", "#47B4E5", "#E86A92", "#FFF1A8", "#F7941D"];
    const particles = [];

    const makeParticle = (overrides = {}) => {
      const shapeRoll = Math.random();
      return {
        x: Math.random() * width,
        y: -30 - Math.random() * height * 0.35,
        vx: (Math.random() - 0.5) * 100,
        vy: 90 + Math.random() * 190,
        gravity: 62 + Math.random() * 65,
        drag: 0.988,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 9,
        shape: shapeRoll < 0.38 ? "star" : shapeRoll < 0.7 ? "circle" : "rectangle",
        wobble: Math.random() * Math.PI * 2,
        alpha: 0.85 + Math.random() * 0.15,
        ...overrides,
      };
    };

    for (let index = 0; index < 95; index += 1) {
      particles.push(makeParticle());
    }

    for (let index = 0; index < 28; index += 1) {
      const fromLeft = index % 2 === 0;
      const angle = fromLeft
        ? -Math.PI / 3 + Math.random() * 0.65
        : -Math.PI * (2 / 3) - Math.random() * 0.65;
      const speed = 380 + Math.random() * 400;
      particles.push(
        makeParticle({
          x: fromLeft ? -10 : width + 10,
          y: height * (0.3 + Math.random() * 0.35),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 330,
          drag: 0.992,
          size: 6 + Math.random() * 9,
        })
      );
    }

    const started = performance.now();
    let lastFrame = started;

    const draw = (now) => {
      const delta = Math.min(0.035, (now - lastFrame) / 1000);
      lastFrame = now;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.vx *= particle.drag;
        particle.vy = particle.vy * particle.drag + particle.gravity * delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.rotation += particle.spin * delta;
        particle.wobble += delta * 5;
        particle.alpha -= delta * 0.042;

        if (particle.alpha <= 0 || particle.y > height + 80) return;

        context.save();
        context.globalAlpha = Math.max(0, particle.alpha);
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;

        if (particle.shape === "star") {
          starPath(context, 0, 0, particle.size, 0);
          context.fill();
        } else if (particle.shape === "circle") {
          context.beginPath();
          context.arc(0, 0, particle.size * 0.48, 0, Math.PI * 2);
          context.fill();
        } else {
          const wobble = Math.sin(particle.wobble) * 0.4;
          context.fillRect(-particle.size * 0.55, -particle.size * 0.24, particle.size * 1.1, particle.size * 0.52);
          context.rotate(wobble);
          context.fillRect(-particle.size * 0.55, -particle.size * 0.24, particle.size * 1.1, particle.size * 0.52);
        }
        context.restore();
      });

      if (now - started < 6800) {
        confettiFrame = window.requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    confettiFrame = window.requestAnimationFrame(draw);
    window.clearTimeout(confettiTimer);
    confettiTimer = window.setTimeout(stopConfetti, 7200);
  }

  function stopConfetti() {
    if (confettiFrame) {
      window.cancelAnimationFrame(confettiFrame);
      confettiFrame = null;
    }
    window.clearTimeout(confettiTimer);
    confettiTimer = null;
    try {
      const context = dom.confettiCanvas.getContext("2d");
      context.clearRect(0, 0, dom.confettiCanvas.width, dom.confettiCanvas.height);
    } catch (error) {
      /* Sin problema si el canvas ya no está disponible. */
    }
  }

  /* =========================================================
     Preferencias, PWA y arranque
     ========================================================= */

  function preloadImages() {
    const urls = new Set([
      ...Object.values(INGREDIENTS).map((ingredient) => ingredient.image),
      ...Object.values(RECIPES).map((recipe) => recipe.finalImage),
      ...Object.values(RECIPES).map((recipe) => recipe.previewImage).filter(Boolean),
      "assets/images/plato-vacio.webp",
    ]);

    const preload = () => {
      urls.forEach((url) => {
        const image = new Image();
        image.decoding = "async";
        image.src = url;
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preload, { timeout: 2500 });
    } else {
      window.setTimeout(preload, 1200);
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (!window.isSecureContext) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* Sin service worker el juego sigue funcionando con conexión. */
      });
    });
  }

  function bindEvents() {
    document.addEventListener("click", handleDocumentClick);
    dom.modalRoot.addEventListener("click", handleModalClick);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    window.addEventListener("resize", () => {
      if (!dom.successLayer.classList.contains("is-visible")) return;
      resizeConfettiCanvas();
    });

    dom.soundButton.addEventListener("contextmenu", (event) => event.preventDefault());
    dom.backButton.tabIndex = -1;

    dom.modalRoot.addEventListener("pointerdown", (event) => {
      if (state.modalKind !== "info") return;
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(".info-carousel__stage")) return;
      if (event.target.closest("button")) return;
      state.infoSwipeStart = event.clientX;
    });

    dom.modalRoot.addEventListener("pointerup", (event) => {
      if (state.infoSwipeStart === null) return;
      const distance = event.clientX - state.infoSwipeStart;
      state.infoSwipeStart = null;
      if (Math.abs(distance) < 42) return;
      stepInfoCarousel(distance > 0 ? -1 : 1);
    });

    dom.modalRoot.addEventListener("pointercancel", () => {
      state.infoSwipeStart = null;
    });

    const prepareGestureAudio = () => {
      ensureAudioContext();
      handleFirstInteraction();
    };
    document.addEventListener("pointerdown", prepareGestureAudio, { passive: true, once: true });
  }

  function updateFullscreenButton() {
    if (!dom.fullscreenButton) return;
    const isFullscreen = Boolean(document.fullscreenElement);
    dom.fullscreenButton.setAttribute(
      "aria-label",
      isFullscreen ? "Salir de pantalla completa" : "Ver a pantalla completa"
    );
  }

  function setupStartupHint() {
    scheduleFirstHintDismissal();
  }

  function init() {
    setSound(state.soundOn, { silent: true });
    renderAll();
    bindEvents();
    initVideoSequence();
    setupStartupHint();
    preloadImages();
    registerServiceWorker();
    updateFullscreenButton();

    dom.kitchenScene.inert = false;
    dom.prepScene.inert = true;
    dom.stage.dataset.view = "kitchen";
    setChallengeUIActive(false);
  }

  init();
})();
