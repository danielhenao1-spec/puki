/* =============================================================
   LA NOCHE DEL NACIMIENTO · app.js
   JavaScript puro, sin dependencias. Comentado en español.
   Bloques:
     01. Modo calibración
     02. Geometría del escenario (porcentajes)
     03. Contenido de las cinco historias
     04. Playlist de música
     05. Utilidades y referencias
     06. Posicionamiento y escala
     07. Reproductor de música (con ducking)
     08. Lightbox de historias
     09. Pantalla completa, ayuda y calibración
     10. Arranque
   ============================================================= */

(() => {
  'use strict';

  /* ===========================================================
     01 · MODO CALIBRACIÓN
     Cambia este valor a true para ver bordes y coordenadas sobre
     el pesebre, las cinco esferas y la consola de la mesa.
     También puedes abrir la app con  ?calibracion=1
     =========================================================== */
  const MODO_CALIBRACION = false;

  const parametros = new URLSearchParams(window.location.search);
  const calibracionActiva = MODO_CALIBRACION || parametros.get('calibracion') === '1';

  /* ===========================================================
     02 · GEOMETRÍA DEL ESCENARIO
     Todas las medidas son porcentajes respecto de la imagen
     fondo-genral.webp (2752 × 1536). El escenario conserva esa
     misma proporción, así que las posiciones encajan en cualquier
     resolución.
       · x / y / w / h  -> caja (esquina superior izquierda)
       · cx / cy / d    -> círculo (centro y diámetro)
     =========================================================== */
  const ESCENA = {
    // Hueco central del establo. Se dibuja un pelín más grande que
    // el hueco transparente para que no queden fisuras.
    pesebre: { x: 34.05, y: 44.92, w: 32.18, h: 31.66 },

    // Las cinco esferas del árbol. El índice coincide con HISTORIAS.
    // Ajustes manuales aplicados. El ángel conserva la posición anterior
    // porque su bloque llegó repetido con los valores de María y José.
    bambalinas: [
      { cx: 15.56, cy: 68.00, d: 14.90 }, // 1 · María y José
      { cx: 26.72, cy: 30.20, d: 14.00 }, // 2 · Pastores y ángeles (posición previa)
      { cx: 50.20, cy: 12.20, d: 16.70 }, // 3 · Estrella de Belén
      { cx: 77.35, cy: 36.40, d: 13.60 }, // 4 · Reyes Magos
      { cx: 87.60, cy: 70.95, d: 14.80 }  // 5 · San Nicolás
    ],

    // Consola tallada en el friso de la mesa.
    consola: {
      disco:     { cx: 50.10, cy: 89.40, d: 7.00 }, // nicho central
      anterior:  { cx: 42.90, cy: 88.90, d: 2.60 }, // nicho izquierdo
      siguiente: { cx: 57.05, cy: 88.90, d: 2.60 }, // nicho derecho
      volumen:   { x: 61.50, y: 86.20, w: 12.30, h: 5.00 } // canal derecho
    }
  };

  /* ===========================================================
     03 · CONTENIDO DE LAS CINCO HISTORIAS
     El orden del arreglo se corresponde con las esferas:
       0 María y José · 1 Pastores · 2 Estrella · 3 Reyes · 4 San Nicolás
     Si un video falta, se usa "respaldo" automáticamente y se avisa
     con una nota discreta, sin romper la experiencia.
     =========================================================== */
  const HISTORIAS = [
    {
      id: 'maria-jose',
      protagonistas: 'María y José',
      titulo: 'El Viaje a Belén',
      video: 'recursos/1. María y José (El Viaje a Belén).mp4',
      respaldo: 'recursos/5. Los Pastores y los Ángeles (La Fiesta del Cielo y la Tierra).mp4',
      capitulos: [
        {
          titulo: 'El camino largo',
          texto: 'María y José caminaron con mucha paciencia y cariño bajo el cielo de la noche, preparándose para recibir un regalo muy especial.'
        },
        {
          titulo: 'Un lugar para descansar',
          texto: 'Al llegar a Belén, buscaron un rinconcito tranquilo y acogedor donde el Niño Jesús pudiera nacer en paz.'
        },
        {
          titulo: 'El corazón lleno de amor',
          texto: 'Con una cuna de paja suave y el cuidado de José y María, el establo se llenó de ternura.'
        }
      ]
    },
    {
      id: 'pastores',
      protagonistas: 'Los Pastores y los Ángeles',
      titulo: 'La Fiesta del Cielo y la Tierra',
      video: 'recursos/5. Los Pastores y los Ángeles (La Fiesta del Cielo y la Tierra).mp4',
      respaldo: 'recursos/1. María y José (El Viaje a Belén).mp4',
      capitulos: [
        {
          titulo: 'Cuidando el rebaño',
          texto: 'En las colinas tranquilas, los pastores cuidaban sus ovejas cuando una luz brillante iluminó la noche.'
        },
        {
          titulo: 'Un anuncio de alegría',
          texto: 'Los ángeles trajeron una noticia maravillosa: había nacido el Niño Jesús, trayendo paz y esperanza a todos.'
        },
        {
          titulo: 'Corriendo a conocerlo',
          texto: 'Sin dudarlo, los pastores fueron a visitar el pesebre para celebrar con alegría el nacimiento del Niño.'
        }
      ]
    },
    {
      id: 'estrella',
      protagonistas: 'La Estrella de Belén',
      titulo: 'La Guía de Luz',
      video: 'recursos/3. La Estrella de Belén (La Guía de Luz).mp4',
      respaldo: 'recursos/4. Los Reyes Magos (El Viaje de la Generosidad).mp4',
      capitulos: [
        {
          titulo: 'Un brillo diferente',
          texto: 'Entre todas las estrellas del cielo, una brilló con más fuerza para señalar un momento único.'
        },
        {
          titulo: 'Rumbo al pesebre',
          texto: 'Su resplandor dorado guio los pasos de quienes buscaban el lugar donde nació el Niño Jesús.'
        },
        {
          titulo: 'Luz que no se apaga',
          texto: 'La estrella brilló sobre el establo recordándonos que el amor y la bondad siempre iluminan el camino.'
        }
      ]
    },
    {
      id: 'reyes',
      protagonistas: 'Los Reyes Magos',
      titulo: 'El Viaje de la Generosidad',
      video: 'recursos/4. Los Reyes Magos (El Viaje de la Generosidad).mp4',
      respaldo: 'recursos/3. La Estrella de Belén (La Guía de Luz).mp4',
      capitulos: [
        {
          titulo: 'Siguiendo la señal',
          texto: 'Desde tierras lejanas, los Reyes Magos viajaron en sus camellos guiados por la gran estrella.'
        },
        {
          titulo: 'Regalos del corazón',
          texto: 'Llevaban cofres y ofrendas preparadas con respeto para honrar al recién nacido.'
        },
        {
          titulo: 'Compartir lo mejor',
          texto: 'Al llegar ante el Niño Jesús, aprendieron que el mejor regalo es entregar lo que tenemos con amor.'
        }
      ]
    },
    {
      id: 'san-nicolas',
      protagonistas: 'San Nicolás',
      titulo: 'El Ayudante del Cumpleañero',
      // Video de Santa/San Nicolás ya incluido en recursos/. El respaldo
      // sigue configurado por si el archivo se mueve o se renombra.
      video: 'recursos/2. San Nicolás (El Ayudante del Cumpleañero).mp4',
      respaldo: 'recursos/1. María y José (El Viaje a Belén).mp4',
      capitulos: [
        {
          titulo: 'Celebrar el cumpleaños',
          texto: 'En Nochebuena recordamos que la Navidad celebra el nacimiento del Niño Jesús.'
        },
        {
          titulo: 'Llevar alegría a otros',
          texto: 'Inspirado en ese amor, San Nicolás recorre la noche llevando sorpresas y sonrisas a los niños.'
        },
        {
          titulo: 'El espíritu de dar',
          texto: 'Cada regalo nos recuerda la alegría de compartir, agradecer y cuidar a los demás.'
        }
      ]
    }
  ];

  /* ===========================================================
     04 · PLAYLIST DE MÚSICA
     =========================================================== */
  const PISTAS = [
    { titulo: 'Como Se Llega A Belén',          archivo: 'recursos/Como Se Llega A Belén.mp3' },
    { titulo: 'El Burrito Sabanero',            archivo: 'recursos/El Burrito Sabanero.mp3' },
    { titulo: 'Gloria',                          archivo: 'recursos/Gloria.mp3' },
    { titulo: 'Santa Claus Is Coming To Town',   archivo: 'recursos/Santa Claus Is Coming To Town.mp3' }
  ];

  const VOLUMEN_INICIAL = 0.8;
  const FACTOR_DUCKING = 0.20; // al 20 % del volumen mientras se lee

  /* ===========================================================
     05 · UTILIDADES Y REFERENCIAS
     =========================================================== */
  const $  = (selector, contexto = document) => contexto.querySelector(selector);
  const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];
  const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

  // Referencias del escenario
  const escenario       = $('#escenario');
  const envoltorio      = $('.escenario-envoltorio');
  const videoPesebre    = $('#videoPesebre');
  const zonasBambalina  = $$('.zona-bambalina');
  const reproductor     = $('#reproductor');
  const discoMarco      = $('#discoMarco');
  const btnPlay         = $('#btnPlay');
  const btnAnterior     = $('#btnAnterior');
  const btnSiguiente    = $('#btnSiguiente');
  const volumenCaja     = $('#volumenCaja');
  const volumen         = $('#volumen');
  const tituloPista     = $('#tituloPista');
  const contadorPista   = $('#contadorPista');
  const etiquetaPista   = $('#pistaActual');
  const ayudaInicial    = $('#ayudaInicial');
  const btnPantalla     = $('#btnPantalla');
  const capaCalibracion = $('#capaCalibracion');
  const veloCarga       = $('#veloCarga');
  const aviso           = $('#aviso');

  // Referencias del lightbox
  const lightbox          = $('#lightbox');
  const btnCerrar         = $('#btnCerrar');
  const contadorHistoria  = $('#contadorHistoria');
  const kickerHistoria    = $('#kickerHistoria');
  const tituloHistoria    = $('#tituloHistoria');
  const bloqueCapitulo    = $('#bloqueCapitulo');
  const etiquetaCapitulo  = $('#etiquetaCapitulo');
  const tituloCapitulo    = $('#tituloCapitulo');
  const textoCapitulo     = $('#textoCapitulo');
  const btnAnteriorCap    = $('#btnAnteriorCap');
  const btnSiguienteCap   = $('#btnSiguienteCap');
  const puntosCapitulos   = $('#puntosCapitulos');
  const indicadorCapitulo = $('#indicadorCapitulo');
  const videoHistoria     = $('#videoHistoria');
  const marcoVideo        = $('.bambalina-marco-video');
  const notaVideo         = $('#notaVideo');
  const contadorCapitulos = $('#contadorCapitulosBambalina');
  const columnaTexto      = $('#columnaTexto');
  const destellos         = $('#destellos');

  // Estado del reproductor
  const audio         = new Audio();
  let pistaActual     = 0;
  let volumenBase     = VOLUMEN_INICIAL;
  let duckActivo      = false;
  let rafVolumen      = null;
  let audioSolicitado = false;

  // Estado de las historias
  let historiaActual = 0;
  let capituloActual = 0;
  let ultimoFoco     = null;

  // Temporizadores
  let temporizadorAviso = null;
  let temporizadorVolumenSeguro = null;
  let temporizadorPista = null;
  let ayudaOculta = false;

  /* ===========================================================
     06 · POSICIONAMIENTO Y ESCALA
     =========================================================== */
  function posicionarCaja(elemento, caja) {
    if (!elemento) return;
    elemento.style.left   = caja.x + '%';
    elemento.style.top    = caja.y + '%';
    elemento.style.width  = caja.w + '%';
    elemento.style.height = caja.h + '%';
  }

  function posicionarCirculo(elemento, circulo) {
    if (!elemento) return;
    elemento.style.left  = circulo.cx + '%';
    elemento.style.top   = circulo.cy + '%';
    elemento.style.width = circulo.d + '%';
  }

  function aplicarPosiciones() {
    posicionarCaja(videoPesebre, ESCENA.pesebre);

    zonasBambalina.forEach((zona) => {
      const indice = Number(zona.dataset.historia);
      const config = ESCENA.bambalinas[indice];
      if (config) posicionarCirculo(zona, config);
    });

    posicionarCirculo(discoMarco, ESCENA.consola.disco);
    posicionarCirculo(btnAnterior, ESCENA.consola.anterior);
    posicionarCirculo(btnSiguiente, ESCENA.consola.siguiente);
    posicionarCaja(volumenCaja, ESCENA.consola.volumen);
  }

  // La variable --u equivale a 1 % del ancho del escenario y permite
  // que iconos, textos y botones crezcan proporcionalmente.
  function ajustarUnidad() {
    const ancho = escenario.clientWidth;
    if (ancho > 0) escenario.style.setProperty('--u', (ancho / 100).toFixed(3) + 'px');
  }

  /* ===========================================================
     07 · REPRODUCTOR DE MÚSICA
     =========================================================== */
  audio.preload = 'metadata';

  function volumenDeseado() {
    return limitar(volumenBase * (duckActivo ? FACTOR_DUCKING : 1), 0, 1);
  }

  // Fundido suave de volumen con requestAnimationFrame.
  function fundirVolumen(destino, duracion = 500) {
    cancelAnimationFrame(rafVolumen);
    const inicio = audio.volume;

    if (duracion <= 0 || Math.abs(inicio - destino) < 0.002) {
      audio.volume = destino;
      return;
    }

    const t0 = performance.now();
    const paso = (t) => {
      const progreso = Math.min(1, (t - t0) / duracion);
      // Curva suave (ease-in-out) para que el cambio no se note.
      const suave = progreso < 0.5
        ? 2 * progreso * progreso
        : 1 - Math.pow(-2 * progreso + 2, 2) / 2;

      audio.volume = limitar(inicio + (destino - inicio) * suave, 0, 1);

      if (progreso < 1) rafVolumen = requestAnimationFrame(paso);
    };

    rafVolumen = requestAnimationFrame(paso);

    // Red de seguridad: si el navegador suspende los frames (pestaña
    // oculta, ahorro de energía), el volumen igual llega al destino.
    window.clearTimeout(temporizadorVolumenSeguro);
    temporizadorVolumenSeguro = window.setTimeout(() => {
      if (!audio.paused) audio.volume = volumenDeseado();
    }, duracion + 320);
  }

  function actualizarEstadoReproductor() {
    const sonando = !audio.paused && !audio.ended;

    reproductor.classList.toggle('reproduciendo', sonando);
    btnPlay.setAttribute('aria-pressed', String(sonando));
    btnPlay.setAttribute('aria-label', sonando ? 'Pausar música' : 'Reproducir música');
  }

  // El rótulo de la canción se muestra unos segundos y se oculta solo.
  function mostrarPistaTemporal(duracion = 6000) {
    if (!etiquetaPista) return;
    etiquetaPista.classList.remove('oculta');
    window.clearTimeout(temporizadorPista);
    temporizadorPista = window.setTimeout(() => {
      etiquetaPista.classList.add('oculta');
    }, duracion);
  }

  function actualizarPistaUI() {
    tituloPista.textContent = PISTAS[pistaActual].titulo;
    contadorPista.textContent = `${pistaActual + 1}/${PISTAS.length}`;
    tituloPista.title = `${PISTAS[pistaActual].titulo} · pista ${pistaActual + 1} de ${PISTAS.length}`;
    mostrarPistaTemporal(6000);
  }

  function actualizarVolumenUI() {
    volumen.value = String(volumenBase);
    volumen.style.setProperty('--vol', (volumenBase * 100).toFixed(1) + '%');
    volumen.setAttribute('aria-valuetext', Math.round(volumenBase * 100) + ' %');
  }

  function cargarPista(indice, reproducir) {
    pistaActual = (indice + PISTAS.length) % PISTAS.length;
    cancelAnimationFrame(rafVolumen);

    audio.src = PISTAS[pistaActual].archivo;
    audio.load();
    actualizarPistaUI();

    if (reproducir) {
      audioSolicitado = true;
      audio.volume = 0;
      const promesa = audio.play();
      if (promesa && typeof promesa.then === 'function') {
        promesa.then(() => {
          fundirVolumen(volumenDeseado(), 550);
        }).catch(() => {
          actualizarEstadoReproductor();
          avisar('No se pudo reproducir la canción. Toca ▶ para intentarlo de nuevo.');
        });
      }
    }
  }

  function alternarMusica() {
    ayudaOcultar();
    mostrarPistaTemporal(4500);

    if (audio.paused || audio.ended) {
      audioSolicitado = true;
      reproductor.classList.add('ha-sonado');

      if (!audio.getAttribute('src')) {
        cargarPista(pistaActual, false);
      }

      audio.volume = 0;
      const promesa = audio.play();

      if (promesa && typeof promesa.then === 'function') {
        promesa.then(() => {
          fundirVolumen(volumenDeseado(), 650);
        }).catch(() => {
          actualizarEstadoReproductor();
          avisar('El navegador necesita un toque más para activar el sonido.');
        });
      }
    } else {
      cancelAnimationFrame(rafVolumen);
      audio.pause();
    }
  }

  function cambiarPista(delta, forzarReproduccion = false) {
    const estabaSonando = forzarReproduccion || (!audio.paused && !audio.ended);
    cargarPista(pistaActual + delta, estabaSonando);
  }

  // Al abrir una historia bajamos el volumen al 20 %; al cerrarla,
  // vuelve suavemente al nivel elegido en el control deslizante.
  function aplicarDucking(activar) {
    if (duckActivo === activar) return;
    duckActivo = activar;

    if (!audio.paused) {
      fundirVolumen(volumenDeseado(), activar ? 550 : 750);
    }
  }

  function configurarAudio() {
    audio.volume = VOLUMEN_INICIAL;

    audio.addEventListener('play', actualizarEstadoReproductor);
    audio.addEventListener('pause', actualizarEstadoReproductor);
    audio.addEventListener('playing', actualizarEstadoReproductor);

    audio.addEventListener('ended', () => {
      cambiarPista(1, true);
    });

    audio.addEventListener('error', () => {
      if (!audioSolicitado) return;
      avisar('No encontramos el archivo de esta canción en la carpeta recursos.');
      actualizarEstadoReproductor();
    });

    btnPlay.addEventListener('click', alternarMusica);

    btnAnterior.addEventListener('click', () => {
      ayudaOcultar();
      cambiarPista(-1);
    });

    btnSiguiente.addEventListener('click', () => {
      ayudaOcultar();
      cambiarPista(1);
    });

    volumen.addEventListener('input', () => {
      volumenBase = limitar(parseFloat(volumen.value) || 0, 0, 1);
      cancelAnimationFrame(rafVolumen);
      audio.volume = volumenDeseado();
      actualizarVolumenUI();
      mostrarPistaTemporal(3500);
      ayudaOcultar();
    });

    actualizarPistaUI();
    actualizarVolumenUI();

    // Dejamos preparada la primera pista sin reproducirla (los
    // navegadores exigen un gesto del usuario para el audio).
    audio.src = PISTAS[pistaActual].archivo;
    audio.load();
  }

  /* ===========================================================
     08 · LIGHTBOX DE HISTORIAS
     =========================================================== */
  function crearPuntos() {
    puntosCapitulos.innerHTML = '';
    const total = HISTORIAS[historiaActual].capitulos.length;

    for (let i = 0; i < total; i += 1) {
      const punto = document.createElement('button');
      punto.type = 'button';
      punto.className = 'punto';
      punto.setAttribute('aria-label', `Ir al capítulo ${i + 1}`);
      punto.setAttribute('aria-current', i === capituloActual ? 'true' : 'false');
      punto.addEventListener('click', () => irACapitulo(i));
      puntosCapitulos.appendChild(punto);
    }
  }

  function renderCapitulo(animar) {
    const historia = HISTORIAS[historiaActual];
    const capitulo = historia.capitulos[capituloActual];
    const total = historia.capitulos.length;

    etiquetaCapitulo.textContent = `Capítulo ${capituloActual + 1}`;
    tituloCapitulo.textContent = capitulo.titulo;
    textoCapitulo.textContent = capitulo.texto;
    indicadorCapitulo.textContent = `${capituloActual + 1} / ${total}`;

    btnAnteriorCap.disabled = capituloActual === 0;
    btnSiguienteCap.disabled = capituloActual === total - 1;

    [...puntosCapitulos.children].forEach((punto, i) => {
      punto.setAttribute('aria-current', i === capituloActual ? 'true' : 'false');
    });

    if (animar) {
      bloqueCapitulo.classList.remove('animando');
      void bloqueCapitulo.offsetWidth; // reinicia la animación CSS
      bloqueCapitulo.classList.add('animando');
    }
  }

  function renderHistoria() {
    const historia = HISTORIAS[historiaActual];

    kickerHistoria.textContent = `Historia ${historiaActual + 1} · ${historia.protagonistas}`;
    tituloHistoria.textContent = historia.titulo;
    contadorHistoria.textContent = `Historia ${historiaActual + 1} de ${HISTORIAS.length}`;
    contadorCapitulos.textContent = `${historia.capitulos.length} capítulos`;

    crearPuntos();
    renderCapitulo(false);
  }

  function irACapitulo(indice) {
    const total = HISTORIAS[historiaActual].capitulos.length;
    const destino = limitar(indice, 0, total - 1);
    if (destino === capituloActual) return;
    capituloActual = destino;
    renderCapitulo(true);
  }

  function cargarVideoHistoria(historia) {
    let usandoRespaldo = false;

    videoHistoria.onerror = null;
    marcoVideo.classList.remove('error');
    notaVideo.hidden = true;
    notaVideo.textContent = '';

    videoHistoria.onerror = () => {
      if (usandoRespaldo) {
        marcoVideo.classList.add('error');
        notaVideo.hidden = false;
        notaVideo.textContent = 'No pudimos cargar este video. Puedes seguir leyendo la historia.';
        return;
      }

      usandoRespaldo = true;
      videoHistoria.src = historia.respaldo || HISTORIAS[0].video;
      videoHistoria.load();
      videoHistoria.play().catch(() => {});

      notaVideo.hidden = false;
      notaVideo.textContent = 'Vista previa · el video de esta historia se agregará pronto.';
    };

    videoHistoria.src = historia.video;
    videoHistoria.load();
    videoHistoria.play().catch(() => {});
  }

  function limpiarVideoHistoria() {
    videoHistoria.onerror = null;
    videoHistoria.pause();
    videoHistoria.removeAttribute('src');
    videoHistoria.load();
    marcoVideo.classList.remove('error');
    notaVideo.hidden = true;
    notaVideo.textContent = '';
  }

  function abrirHistoria(indice) {
    if (lightbox.classList.contains('abierto')) return;
    if (!Number.isInteger(indice) || indice < 0 || indice >= HISTORIAS.length) return;

    ultimoFoco = zonasBambalina[indice] || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    historiaActual = indice;
    capituloActual = 0;

    renderHistoria();

    lightbox.removeAttribute('inert');
    lightbox.setAttribute('aria-hidden', 'false');

    // Fuerza un reflow para que la transición de entrada se ejecute.
    void lightbox.offsetWidth;
    lightbox.classList.add('abierto');

    document.body.classList.add('con-modal');
    envoltorio.setAttribute('inert', '');

    videoPesebre.pause();
    aplicarDucking(true);
    cargarVideoHistoria(HISTORIAS[historiaActual]);
    ayudaOcultar();

    window.setTimeout(() => {
      if (lightbox.classList.contains('abierto')) {
        btnCerrar.focus({ preventScroll: true });
      }
    }, 120);
  }

  function cerrarHistoria() {
    if (!lightbox.classList.contains('abierto')) return;

    lightbox.classList.remove('abierto');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('inert', '');
    document.body.classList.remove('con-modal');
    envoltorio.removeAttribute('inert');

    limpiarVideoHistoria();
    aplicarDucking(false);

    // Reanudamos el nacimiento del establo.
    videoPesebre.play().catch(() => {});

    if (ultimoFoco && typeof ultimoFoco.focus === 'function') {
      ultimoFoco.focus({ preventScroll: true });
    }
  }

  function configurarLightbox() {
    btnCerrar.addEventListener('click', cerrarHistoria);
    btnAnteriorCap.addEventListener('click', () => irACapitulo(capituloActual - 1));
    btnSiguienteCap.addEventListener('click', () => irACapitulo(capituloActual + 1));

    // Navegación con teclado y trampa de foco dentro del modal.
    document.addEventListener('keydown', (evento) => {
      if (!lightbox.classList.contains('abierto')) return;

      if (evento.key === 'Escape') {
        evento.preventDefault();
        cerrarHistoria();
        return;
      }

      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        irACapitulo(capituloActual - 1);
        return;
      }

      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        irACapitulo(capituloActual + 1);
        return;
      }

      if (evento.key !== 'Tab') return;

      const enfocables = $$('button:not(:disabled), [href], input, [tabindex]:not([tabindex="-1"])', lightbox)
        .filter((elemento) => elemento.offsetParent !== null);

      if (enfocables.length === 0) return;

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    });

    // Deslizar horizontalmente sobre el texto para cambiar de capítulo.
    let inicioX = null;
    let inicioY = null;

    columnaTexto.addEventListener('touchstart', (evento) => {
      if (evento.touches.length !== 1) return;
      inicioX = evento.touches[0].clientX;
      inicioY = evento.touches[0].clientY;
    }, { passive: true });

    columnaTexto.addEventListener('touchend', (evento) => {
      if (inicioX === null) return;

      const toque = evento.changedTouches[0];
      const deltaX = toque.clientX - inicioX;
      const deltaY = toque.clientY - inicioY;
      inicioX = null;

      if (Math.abs(deltaX) > 55 && Math.abs(deltaY) < 70) {
        irACapitulo(capituloActual + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });

    videoHistoria.muted = true;
  }

  /* ===========================================================
     09 · PANTALLA COMPLETA, AYUDA Y CALIBRACIÓN
     =========================================================== */
  function actualizarBotonPantalla() {
    const activa = Boolean(document.fullscreenElement);
    btnPantalla.setAttribute('aria-pressed', String(activa));
    btnPantalla.setAttribute('aria-label', activa ? 'Salir de pantalla completa' : 'Entrar en pantalla completa');
    btnPantalla.title = activa ? 'Salir de pantalla completa' : 'Pantalla completa';
  }

  async function alternarPantallaCompleta() {
    try {
      if (!document.fullscreenElement) {
        if (!document.documentElement.requestFullscreen) {
          avisar('Este navegador no permite pantalla completa.');
          return;
        }
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      avisar('No se pudo cambiar a pantalla completa.');
    }
  }

  function ayudaOcultar() {
    if (ayudaOculta) return;
    ayudaOculta = true;
    ayudaInicial.classList.add('oculta');
  }

  function avisar(mensaje, duracion = 4200) {
    if (!aviso) return;
    aviso.textContent = mensaje;
    aviso.classList.add('visible');
    window.clearTimeout(temporizadorAviso);
    temporizadorAviso = window.setTimeout(() => {
      aviso.classList.remove('visible');
    }, duracion);
  }

  function crearDestellos() {
    if (!destellos) return;
    const cantidad = 20;

    for (let i = 0; i < cantidad; i += 1) {
      const destello = document.createElement('span');
      const tamano = 2 + Math.random() * 6;

      destello.className = 'destello';
      destello.style.left = (4 + Math.random() * 92) + '%';
      destello.style.top = (6 + Math.random() * 86) + '%';
      destello.style.width = tamano.toFixed(1) + 'px';
      destello.style.height = tamano.toFixed(1) + 'px';
      destello.style.setProperty('--dur', (4 + Math.random() * 5).toFixed(2) + 's');
      destello.style.setProperty('--retraso', (-Math.random() * 9).toFixed(2) + 's');
      destello.style.setProperty('--opacidad', (0.35 + Math.random() * 0.5).toFixed(2));
      destellos.appendChild(destello);
    }
  }

  // --- Modo calibración ---
  function numero(valor) {
    return Number(valor).toFixed(2);
  }

  function crearEtiquetaCalibracion(texto) {
    const etiqueta = document.createElement('span');
    etiqueta.className = 'cal-etiqueta';
    etiqueta.textContent = texto;
    return etiqueta;
  }

  function crearCalibracion() {
    if (!capaCalibracion) return;

    if (!calibracionActiva) {
      capaCalibracion.hidden = true;
      return;
    }

    capaCalibracion.hidden = false;
    capaCalibracion.innerHTML = '';

    const titulo = document.createElement('div');
    titulo.className = 'cal-titulo';
    titulo.textContent = 'MODO CALIBRACIÓN · ajusta ESCENA en app.js';
    capaCalibracion.appendChild(titulo);

    const ejes = document.createElement('div');
    ejes.className = 'cal-ejes';
    capaCalibracion.appendChild(ejes);

    // Pesebre (caja)
    const cajaPesebre = document.createElement('div');
    cajaPesebre.className = 'cal-caja';
    posicionarCaja(cajaPesebre, ESCENA.pesebre);
    cajaPesebre.appendChild(crearEtiquetaCalibracion(
      `Pesebre · x ${numero(ESCENA.pesebre.x)} · y ${numero(ESCENA.pesebre.y)} · w ${numero(ESCENA.pesebre.w)} · h ${numero(ESCENA.pesebre.h)}`
    ));
    capaCalibracion.appendChild(cajaPesebre);

    // Las cinco esferas
    ESCENA.bambalinas.forEach((config, indice) => {
      const circulo = document.createElement('div');
      circulo.className = 'cal-circulo';
      posicionarCirculo(circulo, config);

      const historia = HISTORIAS[indice];
      const etiqueta = crearEtiquetaCalibracion(
        `${indice + 1}. ${historia.protagonistas} · cx ${numero(config.cx)} · cy ${numero(config.cy)} · ⌀ ${numero(config.d)}`
      );

      // La esfera superior está pegada al borde: su etiqueta va debajo.
      if (config.cy < 12) {
        etiqueta.style.bottom = 'auto';
        etiqueta.style.top = 'calc(100% + 4px)';
      }

      circulo.appendChild(etiqueta);
      capaCalibracion.appendChild(circulo);
    });

    // Elementos de la consola
    const elementosConsola = [
      { config: ESCENA.consola.disco,     nombre: 'Disco / Play',       tipo: 'circulo' },
      { config: ESCENA.consola.anterior,  nombre: 'Canción anterior',   tipo: 'circulo' },
      { config: ESCENA.consola.siguiente, nombre: 'Canción siguiente',  tipo: 'circulo' },
      { config: ESCENA.consola.volumen,   nombre: 'Volumen',            tipo: 'caja' }
    ];

    elementosConsola.forEach(({ config, nombre, tipo }) => {
      let elemento;

      if (tipo === 'circulo') {
        elemento = document.createElement('div');
        elemento.className = 'cal-circulo';
        posicionarCirculo(elemento, config);
        elemento.appendChild(crearEtiquetaCalibracion(
          `${nombre} · cx ${numero(config.cx)} · cy ${numero(config.cy)} · ⌀ ${numero(config.d)}`
        ));
      } else {
        elemento = document.createElement('div');
        elemento.className = 'cal-caja';
        posicionarCaja(elemento, config);
        const etiqueta = crearEtiquetaCalibracion(
          `${nombre} · x ${numero(config.x)} · y ${numero(config.y)} · w ${numero(config.w)} · h ${numero(config.h)}`
        );
        // El volumen está muy cerca del botón "siguiente": desplazamos
        // su etiqueta para que ambas se lean sin superponerse.
        if (nombre === 'Volumen') etiqueta.style.left = '18%';
        elemento.appendChild(etiqueta);
      }

      capaCalibracion.appendChild(elemento);
    });

    console.info('[Calibración] Ajusta las coordenadas en ESCENA (app.js).', ESCENA);
  }

  /* ===========================================================
     10 · ARRANQUE Y EVENTOS GENERALES
     =========================================================== */
  function configurarEscena() {
    zonasBambalina.forEach((zona) => {
      const indice = Number(zona.dataset.historia);
      zona.addEventListener('click', () => abrirHistoria(indice));
    });

    // Si el video del establo no existe, el hueco queda con un
    // degradado cálido en lugar de un parpadeo negro.
    videoPesebre.addEventListener('error', () => {
      videoPesebre.style.opacity = '0';
    });

    // Muchos navegadores bloquean el autoplay hasta el primer toque.
    document.addEventListener('pointerdown', () => {
      if (videoPesebre.paused) videoPesebre.play().catch(() => {});
    }, { once: true });

    // Primer toque en cualquier parte: la pista de ayuda desaparece.
    document.addEventListener('pointerdown', ayudaOcultar, { once: true });

    // Evitamos menús contextuales y arrastres accidentales.
    document.addEventListener('contextmenu', (evento) => evento.preventDefault());
    document.addEventListener('dragstart', (evento) => evento.preventDefault());

    if (btnPantalla) {
      if (!document.documentElement.requestFullscreen) {
        btnPantalla.style.display = 'none';
      } else {
        btnPantalla.addEventListener('click', alternarPantallaCompleta);
        document.addEventListener('fullscreenchange', actualizarBotonPantalla);
        actualizarBotonPantalla();
      }
    }

    // Al cambiar el tamaño (rotación, pantalla completa, ventana),
    // recalculamos la unidad de escala del escenario.
    if ('ResizeObserver' in window) {
      const observador = new ResizeObserver(ajustarUnidad);
      observador.observe(escenario);
    } else {
      window.addEventListener('resize', ajustarUnidad);
    }

    // La ayuda se retira sola aunque nadie toque la pantalla.
    window.setTimeout(ayudaOcultar, 11000);
  }

  function ocultarVelo() {
    if (!veloCarga || veloCarga.classList.contains('oculto')) return;
    veloCarga.classList.add('oculto');
    window.setTimeout(() => veloCarga.remove(), 1000);
  }

  function iniciar() {
    // 1. Geometría
    ajustarUnidad();
    aplicarPosiciones();

    // 2. Luz, marcos y calibración
    crearDestellos();
    crearCalibracion();

    // 3. Contenido y controles
    configurarAudio();
    configurarEscena();
    configurarLightbox();

    // Pequeño inspector de solo lectura para afinar la experiencia:
    // abre la app con ?debug=1 y consulta window.__nocheDebug
    if (parametros.get('debug') === '1') {
      window.__nocheDebug = {
        audio,
        ESCENA,
        HISTORIAS,
        get volumenBase() { return volumenBase; },
        get duckActivo() { return duckActivo; },
        abrirHistoria,
        cerrarHistoria
      };
    }

    // 4. El escenario se revela cuando la imagen maestra está lista.
    const imagenFondo = $('.fondo-escena');
    if (imagenFondo && !imagenFondo.complete) {
      imagenFondo.addEventListener('load', ocultarVelo, { once: true });
      imagenFondo.addEventListener('error', ocultarVelo, { once: true });
    }
    window.addEventListener('load', () => window.setTimeout(ocultarVelo, 250), { once: true });
    window.setTimeout(ocultarVelo, 2800); // respaldo por si "load" tarda

    // 5. Enlace directo opcional: ?historia=1 … ?historia=5
    const historiaParam = Number(parametros.get('historia'));
    if (Number.isInteger(historiaParam) && historiaParam >= 1 && historiaParam <= HISTORIAS.length) {
      window.setTimeout(() => abrirHistoria(historiaParam - 1), 700);
    }

    console.info(
      '%cLa Noche del Nacimiento',
      'color:#e8c27a;font-family:Georgia,serif;font-size:20px;',
      '\nCinco historias, una noche. · MODO_CALIBRACION =', MODO_CALIBRACION
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
