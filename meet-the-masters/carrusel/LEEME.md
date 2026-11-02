# Carrusel · Meet The Masters

Versión simplificada del **Crono-Visor**: solo los avatares en video de Yellow y los fondos de cada personaje, con flechas laterales para pasar de uno a otro. Sin sonido, sin línea del tiempo y sin fichas de alumnos.

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
- **Navegación**: flechas laterales, deslizamiento táctil, teclado (`←`, `→`, `Inicio`, `Fin`) y enlaces profundos (`#albert-einstein`).
- **Adaptación**: la tarjeta se dimensiona con la altura y el ancho disponibles, con márgenes de respiro arriba y abajo. Funciona en móvil vertical, móvil apaisado, tablet y escritorio.

## Estructura

```
carrusel/
├── index.html
├── LEEME.md
├── css/
│   └── carrusel.css
└── js/
    └── carrusel.js
```

## Editar los datos

El arreglo `CAST` al inicio de `js/carrusel.js` contiene nombre, rol, color de acento, slug y los nombres de archivo del fondo y del avatar. Los videos se buscan en `../video/` con el mismo nombre del avatar y extensión `.mp4`.

Si mueves la carpeta `carrusel/` a otro lugar, actualiza las rutas de `BASE` en `js/carrusel.js` y los recursos del `index.html`.
