# El Castillo de los Sueños

Experiencia narrativa e interactiva inspirada en Walt Disney y sus talleres creativos. Está pensada para pantallas táctiles escolares, pero también funciona con ratón y teclado en escritorio.

HTML5, CSS3 y JavaScript vanilla. Sin dependencias, sin compilación y sin conexión a internet.

---

## Cómo abrirla

### Opción recomendada: servidor local

Requiere Node.js 18 o superior.

```bash
node servidor-local.js
```

Luego abre:

```text
http://127.0.0.1:4177
```

El servidor incluido soporta peticiones HTTP `Range`, necesarias para que los videos MP4 se reproduzcan y busquen correctamente. Si necesitas acceder desde otra pantalla de la misma red:

```powershell
$env:HOST="0.0.0.0"; node servidor-local.js
```

### Opción rápida

También puedes abrir `index.html` directamente en el navegador. Los scripts son clásicos (no módulos ES) para permitir esta modalidad, pero algunos navegadores restringen la reproducción de video desde `file://`; por eso se recomienda el servidor local.

---

## Flujo de navegación

1. **Fachada**: el castillo con el video de cortinas pausado en el primer fotograma y su tema musical. Al tocar se reproduce la entrada con sonido, la música de fachada se mantiene atenuada de fondo y, al terminar, avanza a la introducción.
2. **Introducción**: video a pantalla completa; finaliza automáticamente al patio. Incluye el botón **Saltar introducción**.
3. **Patio interno**: cuatro zonas táctiles calibrables sobre los letreros.
4. **Walt Disney**: galería automática de 6 fotos, marco ornamental, pergamino y tres banderines que cambian el relato.
5. **Taller de Música**: personaje en el arco, televisor animado y cinco instrumentos táctiles con sonido sintetizado.
6. **Taller de Video**: cuatro rollos de película, sonido de proyector y reproductor cinematográfico con controles propios.
7. **Taller de Dibujo**: personaje animado y acceso a la mesa de dibujo.
8. **Mesa de dibujo**: cinco pares boceto/animación. El pincel mágico se arrastra hasta el centro del papel para revelar el video, con destellos y sonido. Al terminar la animación no avanza sola: el usuario decide cuándo cambiar de boceto.

---

## Calibración de zonas

Todas las coordenadas se expresan en porcentaje del escenario, que conserva la proporción original de las imágenes (`2752 × 1536`, equivalente a `43:24`).

Abre la aplicación con:

```text
?debug=1
```

o pulsa la tecla **H** en cualquier momento. Aparecerán los contornos y las etiquetas de las zonas interactivas. El panel de depuración recuerda que los ajustes se hacen en `css/styles.css`.

Bloques principales de calibración:

| Elemento | Selector / clase |
| --- | --- |
| Zonas del patio | `.hotspot--music`, `.hotspot--drawing`, `.hotspot--video`, `.hotspot--wd` |
| Arco del personaje (Música) | `.portal-music` |
| Televisor | `.tv-screen` |
| Instrumentos | `.instrument-zone--xylophone`, `--cymbal`, `--trumpet`, `--drum`, `--bell` |
| Arco del personaje (Video) | `.portal-video` |
| Pantalla de cine | `.cinema-screen` |
| Rollos | `.film-reel--1` … `.film-reel--4` |
| Arco del personaje (Dibujo) | `.portal-drawing` |
| Mesa interactiva | `.desk-hotspot` |
| Papel de dibujo | `.sketch-wrap` |
| Centro del boceto | `.sketch-stage` (zona central calculada en `drawing-desk.js`) |
| Pincel | `.magic-brush` |

También puedes abrir directamente una escena con:

```text
?scene=facade
?scene=intro
?scene=patio
?scene=modal-wd
?scene=musica
?scene=video
?scene=dibujo
?scene=dibujo-mesa
```

Ejemplo: `?scene=dibujo-mesa&debug=1`.

---

## Audio

El audio se desbloquea con el primer gesto real del usuario, normalmente al tocar la fachada. La aplicación sintetiza con Web Audio API:

- notas de xilófono,
- címbalo,
- trompeta,
- tambor,
- campana,
- motor y golpes del proyector,
- destellos mágicos,
- transiciones y pasos de página.

### Música ambiental

La experiencia usa dos pistas en bucle:

| Escena | Archivo | Volumen base |
| --- | --- | --- |
| Fachada | `recursos/castillo-vistra-frontal-theme.mp3` | `0.36` |
| Patio, Walt Disney y talleres | `recursos/castillo-patio-interno-theme.mp3` | `0.40` |

La configuración está en `AMBIENT_TRACKS`, al inicio de `js/app.js`. El tema del patio se mantiene al abrir la historia de Walt Disney y al entrar en cualquier taller. Durante una película o una animación de boceto se atenúa automáticamente y se restaura al pausar o salir. El tema de fachada se mantiene atenuado durante el video de entrada —así también se escucha cuando el navegador exige un primer toque— y se retira al comenzar la introducción.

La música ambiental se reproduce directamente con elementos `<audio>` dentro del documento, sin enrutarse por Web Audio. Así se evita el silencio que Chrome producía al conectar una pista que ya estaba sonando. La música se detiene por completo al volver a la fachada, al refrescar, al ocultar la pestaña y al cerrar el navegador; al descargar la página se pausan y se reinicia su posición. Además, solo una pestaña/instancia de la experiencia puede sonar a la vez: al abrir otra, la anterior se silencia y la música se reanuda cuando esa instancia vuelve a estar visible o recibe un toque.

El botón circular de sonido de la esquina inferior derecha silencia o reactiva **toda** la aplicación: música ambiental, efectos sintetizados y audio de los videos. Se mantiene visible en todas las escenas.

Los navegadores solo permiten audio con sonido tras un primer gesto del usuario. Por eso, al abrir la fachada puede ser necesario tocar la pantalla una vez; el sistema reintenta la pista pendiente en ese momento y la mantiene durante la entrada. En un kiosco se recomienda iniciar Chrome con `--autoplay-policy=no-user-gesture-required`.

### Conectar audios externos

Si se agregan archivos `.mp3` o `.wav` a `./recursos/`, edita el objeto `EXTERNAL_AUDIO` al inicio de `js/sound-fx.js`:

```js
var EXTERNAL_AUDIO = {
  xylophone: "./recursos/xilofono.mp3",
  cymbal: null,
  trumpet: null,
  drum: null,
  bell: null,
  projector: "./recursos/proyector.mp3",
  magic: null
};
```

Si el archivo no existe o falla, se usa automáticamente el sintetizador como respaldo.

---

## Estructura

```text
/
├── index.html
├── servidor-local.js
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js           # máquina de estados, transiciones y ciclo de vida
│   ├── wd-modal.js      # slider de Walt Disney, pergamino y banderines
│   ├── workshops.js     # instrumentos, rollos de cine y reproductor
│   ├── drawing-desk.js  # pincel arrastrable, bocetos y revelado mágico
│   └── sound-fx.js      # síntesis Web Audio y audio externo opcional
└── recursos/            # imágenes y videos originales
```

---

## Notas técnicas

- Todos los controles críticos usan **Pointer Events** y los elementos arrastrables tienen `touch-action: none`.
- Se evitan la selección de texto, el arrastre nativo de imágenes y el doble toque de zoom.
- Los videos de fondo de los talleres se reproducen solo al entrar en su escena y se pausan al salir, para no consumir recursos en segundo plano.
- En Música, Video y Dibujo el video del personaje va detrás del fondo con transparencia; el fondo conserva en primer plano el marco del arco. El televisor y la pantalla de cine usan la misma técnica de recorte.
- La mesa usa `recursos/taller-de-dibujo-mesa-2.webp`, con la hoja en blanco. El boceto se funde con el papel mediante `mix-blend-mode: multiply` y un ajuste de brillo, sin sombra paralela. El video recorta el borde oscuro de 2 px que trae el archivo original en el lado izquierdo.
- El pincel solo revela cuando su punta llega a la zona central del boceto, no al borde lateral.
- Los bocetos solo cambian con las flechas de navegación. Al terminar una animación, el último fotograma se congela en un canvas y permanece visible; no se vuelve al boceto ni avanza automáticamente. Todas las animaciones se detienen un poco antes del final (como máximo hacia los 9,9 s) para no capturar el último fotograma en blanco de algunos mp4; el canvas conserva el último frame coloreado. El video usa el mismo rectángulo que el boceto (`object-fit: fill`) para conservar sus proporciones.
- El título y la descripción del rollo se muestran fuera del cuadro de proyección, en una placa superior.
- La escena se adapta a cualquier relación de aspecto manteniendo el encuadre completo; el espacio restante se rellena con una versión desenfocada del mismo fondo.
- El botón de retorno de cada vista pausa y limpia los medios o temporizadores correspondientes.
- `prefers-reduced-motion` reduce las animaciones decorativas.
- El nombre del cuarto video se conserva exactamente como existe en los recursos: `taller-de-video-4-lilo&stith.mp4`.
