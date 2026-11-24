# La Noche del Nacimiento

Aplicación web interactiva para pantallas táctiles grandes (kiosco, tablet o pizarra). Cinco esferas del árbol abren cinco historias navideñas con narración por capítulos, y la mesa tallada esconde un pequeño reproductor de música.

Construida con **HTML5, CSS3 y JavaScript puro**, sin frameworks ni dependencias de ejecución.

---

## Cómo abrirla

- **Rápido:** haz doble clic en `index.html` (funciona con `file://` en Chrome/Edge).
- **Recomendado para kiosco:** sirve la carpeta con un servidor local para evitar restricciones del navegador:

  ```bash
  # desde la carpeta del proyecto
  python -m http.server 8080
  # luego abre http://localhost:8080
  ```

- Activa la **pantalla completa** con el botón de la esquina superior derecha.

> Las tipografías se cargan desde Google Fonts. Sin conexión, el navegador usa una serif de respaldo; el resto de recursos son locales.

---

## Estructura

```
la-noche-del-nacimiento/
├── index.html
├── styles.css
├── app.js
├── README.md
└── recursos/
    ├── fondo-genral.webp
    ├── Nacimiento.mp4
    ├── fondo-bambalina.jpg
    ├── bambalina.webp
    ├── disco.webp
    ├── 1. María y José (El Viaje a Belén).mp4
    ├── 2. San Nicolás (El Ayudante del Cumpleañero).mp4
    ├── 3. La Estrella de Belén (La Guía de Luz).mp4
    ├── 4. Los Reyes Magos (El Viaje de la Generosidad).mp4
    ├── 5. Los Pastores y los Ángeles (La Fiesta del Cielo y la Tierra).mp4
    ├── Como Se Llega A Belén.mp3
    ├── El Burrito Sabanero.mp3
    ├── Gloria.mp3
    └── Santa Claus Is Coming To Town.mp3
```

### Video de San Nicolás

El archivo `2. San Nicolás (El Ayudante del Cumpleañero).mp4` ya está incluido en `recursos/` y es el que se muestra en la quinta esfera. El objeto `HISTORIAS` conserva además un video de respaldo y una nota de «Vista previa» por si el archivo se mueve o se renombra; con el archivo presente, esa nota no aparece.

---

## Controles

| Zona | Acción |
|---|---|
| Esferas del árbol | Abren la historia y su video en la bambalina |
| Disco central ▶ / ⏸ | Reproduce o pausa la música; el disco gira solo al sonar |
| Botones laterales ⏮ / ⏭ | Canción anterior / siguiente (la lista se repite) |
| Control deslizante derecho | Volumen (0 % – 100 %) |
| Rótulo de pista | Muestra la canción unos segundos al cargar, cambiar de pista o tocar el volumen, y se oculta solo |
| `← Volver al Árbol` | Cierra la historia, pausa el video del modal y restaura la música |
| Flechas ‹ › | Cambian de capítulo |
| Teclado | `Esc` cierra; `←` y `→` cambian de capítulo |
| Deslizar | En el texto de la historia, desliza a izquierda/derecha para pasar capítulo (táctil) |

**Audio ducking:** al abrir una historia, si la música suena, el volumen baja suavemente al **20 %** del nivel elegido; al cerrar, vuelve al nivel original.

---

## Modo calibración

Las posiciones de todos los elementos están centralizadas en el objeto `ESCENA` de `app.js`, expresadas en porcentajes sobre la imagen maestra (2752 × 1536). Para ajustarlas:

1. Cambia el flag:

   ```js
   const MODO_CALIBRACION = true;
   ```

   o abre la app con `index.html?calibracion=1`.

2. Verás una rejilla, bordes discontinuos y las coordenadas de:
   - el hueco del pesebre (`x`, `y`, `w`, `h`);
   - las cinco esferas (`cx`, `cy`, `d`);
   - el disco, los dos botones de canción y el volumen de la mesa.

3. Edita los valores en `ESCENA`, recarga y repite hasta que encajen. Vuelve a poner el flag en `false` al terminar.

Coordenadas actuales:

| Elemento | Valores |
|---|---|
| Pesebre | x 34.05 · y 44.92 · w 32.18 · h 31.66 |
| María y José | cx 15.56 · cy 68.00 · ⌀ 14.90 |
| Pastores y ángeles | cx 26.72 · cy 30.20 · ⌀ 14.00 |
| Estrella de Belén | cx 50.20 · cy 12.20 · ⌀ 16.70 |
| Reyes Magos | cx 77.35 · cy 36.40 · ⌀ 13.60 |
| San Nicolás | cx 87.60 · cy 70.95 · ⌀ 14.80 |
| Disco / Play | cx 50.10 · cy 89.40 · ⌀ 7.00 |
| Canción anterior | cx 42.90 · cy 88.90 · ⌀ 2.60 |
| Canción siguiente | cx 57.05 · cy 88.90 · ⌀ 2.60 |
| Volumen | x 61.50 · y 86.20 · w 12.30 · h 5.00 |

> Pastores conserva la posición anterior: su bloque llegó repetido con los valores de María y José. El resto de posiciones son las ajustadas manualmente.

---

## Enlaces directos útiles

- `?historia=1` … `?historia=5` — abre directamente una historia (útil para probar).
- `?calibracion=1` — activa la rejilla de calibración.
- `?debug=1` — expone `window.__nocheDebug` (audio, estado del ducking, `ESCENA`, etc.) para inspección desde la consola.

---

## Notas técnicas

- El escenario mantiene la proporción **1.7917 : 1** de la imagen maestra y se adapta a cualquier resolución sin scroll. En pantallas que no son 16:9 se rellena con una copia difuminada del fondo.
- El video del nacimiento va **detrás** de la imagen; la zona transparente del establo lo deja ver con bordes perfectos.
- La capa de video de la bambalina lleva `clip-path` y máscara circular para evitar desbordes de composición en GPU.
- El video del lightbox es `muted` (no compite con la música) y se limpia al cerrar para liberar el decodificador.
- Se evita la selección de texto, el menú contextual y el arrastre accidental; `touch-action: manipulation` reduce el doble toque de zoom.
- Respeta `prefers-reduced-motion`: se desactivan pulsos y flotación; el giro del disco y su brillo se conservan como indicador de reproducción.
- El vinilo es casi simétrico, así que lleva un reflejo dorado giratorio que hace perceptible el movimiento.
- El botón de pantalla completa se oculta solo si el navegador no soporta la API (por ejemplo, Safari en iPhone).
