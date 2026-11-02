# Carrusel · Meet The Masters

Versión simplificada del **Crono-Visor**: solo los avatares en video de Yellow y los fondos de cada personaje, con flechas laterales para pasar de uno a otro. Incluye un medley de Mozart con control de volumen, y no incluye línea del tiempo ni fichas de alumnos.

## Cómo abrirla

No necesita instalación ni compilación.

1. Abre `carrusel/index.html` con doble clic en un navegador moderno.
2. O sirve la carpeta principal del proyecto y visita:

   ```bash
   python -m http.server 8000
   ```

   ```
   http://localhost:8000/carrusel/
   ```

Los recursos se toman de las carpetas existentes del proyecto (`../imagenes/` y `../video/`). No hay archivos duplicados.

## Qué conserva

- **Fondos**: el mismo cruce suave, el zoom de entrada, la viñeta, el brillo del color de acento y las chispas del Crono-Visor.
- **Avatares**: los 18 videos verticales (360 × 640) de Yellow, silenciados, en bucle y a pantalla completa dentro de una tarjeta vertical.
- **Nombre**: el personaje centrado muestra su nombre y su rol sobre la parte inferior del avatar, con una animación de entrada en cada cambio.
- **Música**: en Mozart aparece un control de volumen sobre la tarjeta. La pista arranca al entrar en el personaje si el navegador lo permite; si no, aparece un botón de reproducir. Al cambiar de personaje la música se detiene y el control se oculta. El volumen se recuerda en el navegador.
- **Navegación**: flechas laterales, deslizamiento táctil, teclado (`←`, `→`, `Inicio`, `Fin`) y enlaces profundos (`#albert-einstein`).
- **Adaptación**: la tarjeta se dimensiona con la altura y el ancho disponibles, con márgenes de respiro arriba y abajo. Funciona en móvil vertical, móvil apaisado, tablet y escritorio.

## Estructura

```
carrusel/
├── index.html
├── LEEME.md
├── audio/
│   └── mozart-medley.mp3       → 3:14, sintetizado (160 kbps)
├── css/
│   └── carrusel.css
└── js/
    └── carrusel.js
```

## Música

El medley es una **grabación instrumental sintetizada y original** creada para este proyecto a partir de temas de dominio público de Mozart. No usa grabaciones de terceros ni extractos comerciales.

Orden de los temas, pensado para que los niños reconozcan algo desde el principio:

1. *Ah, vous dirai-je, Maman* (la melodía de “Estrellita” / “Twinkle”)
2. *Eine kleine Nachtmusik*
3. *Marcha turca* (Sonata K.331)
4. Sinfonía n.º 40
5. Sonata K.545

El archivo está en `audio/mozart-medley.mp3` (unos 3,9 MB, 160 kbps). El audio solo existe en la tarjeta de Mozart; el video de Yellow sigue siempre en silencio.

### Control de volumen

- Aparece en la parte superior de la tarjeta de Mozart.
- Si el navegador permite el autoplay (por ejemplo, al llegar con una flecha), la música entra sola con un fundido.
- Si se abre directamente el enlace de Mozart y el navegador bloquea el audio, aparece un botón de reproducir.
- El deslizador regula el volumen y lo guarda en `localStorage` para la próxima visita.
- No hay botón de mute: para silenciarla se baja el volumen o se cambia de personaje.
- Al salir de Mozart, la música se desvanece y se reinicia para la próxima entrada.

## Editar los datos

El arreglo `CAST` al inicio de `js/carrusel.js` contiene nombre, rol, color de acento, slug y los nombres de archivo del fondo y del avatar. Los videos se buscan en `../video/` con el mismo nombre del avatar y extensión `.mp4`.

El objeto `CHARACTER_AUDIO` del mismo archivo asigna una pista a cada personaje. Actualmente solo tiene una entrada:

```js
const CHARACTER_AUDIO = {
  'wolfgang-mozart': {
    src: 'audio/mozart-medley.mp3',
    title: 'Medley de Mozart'
  }
};
```

Para añadir música a otro personaje, agrega una entrada con su `slug` y la ruta del archivo. El control de volumen y el comportamiento de autoplay se reutilizan automáticamente.

Si mueves la carpeta `carrusel/` a otro lugar, actualiza las rutas de `BASE` y `CHARACTER_AUDIO` en `js/carrusel.js` y los recursos del `index.html`.
