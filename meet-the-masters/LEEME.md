# Crono-Visor · Meet The Masters

Aplicación web interactiva del proyecto **Meet The Masters** del **Preescolar Puki**. Presenta a 18 grandes personajes de la historia junto a la mascota Yellow y el alumno o alumna asignado a cada fecha.

## Cómo abrirla

No necesita instalación ni compilación.

1. Abre `index.html` con doble clic en un navegador moderno (Chrome, Edge, Safari o Firefox).
2. O sírvela localmente desde esta carpeta:

   ```bash
   python -m http.server 8000
   ```

   Después visita `http://localhost:8000`.

Para una presentación en proyector o pizarra digital, se recomienda abrir en pantalla completa con `F11`.

## Formato de pantalla

La experiencia está diseñada **exclusivamente para orientación horizontal**. Si el dispositivo está en vertical, se muestra una pantalla que invita a girarlo. Esto mantiene la legibilidad del Crono-Visor y aprovecha todo el ancho disponible.

- Escritorio y tablet grande: marco 3D original con la interfaz dentro de su ventana.
- Ventanas estrechas o celulares en horizontal: modo compacto a pantalla completa, conservando la identidad visual del Crono-Visor.

## Interacción

- Haz clic o toca cualquier fecha de la **Línea del tiempo** para viajar al personaje.
- Usa las flechas inferiores para avanzar o retroceder.
- En pantallas táctiles, desliza la zona del personaje hacia la izquierda o derecha.
- Con teclado: `←` y `→` cambian de personaje; dentro de la línea del tiempo también funcionan `↑`, `↓`, `Inicio` y `Fin`.
- La URL guarda el personaje activo, por ejemplo `index.html#albert-einstein`, para poder abrirlo directamente.

## Publicar en Vercel

La aplicación está publicada en:

```
https://puki-blue.vercel.app/meet-the-masters/
```

El repositorio está conectado a Vercel y cada subida a la rama `main` vuelve a desplegar el proyecto automáticamente. Para futuras importaciones, se recomienda configurar **Root Directory** como `meet-the-masters` para publicar en la raíz del dominio.

## Vista previa al compartir por WhatsApp

La tarjeta social está creada en `imagenes/compartir-whatsapp.jpg` (1200 × 630 px) e incluye el logo de Puki, el título **PROYECTO: MEET THE MASTERS** y la frase **¡Nuestros niños reciben a los grandes personajes de la historia!**

Las etiquetas sociales de `index.html` ya apuntan a la URL pública de producción:

```html
<meta property="og:image" content="https://puki-blue.vercel.app/meet-the-masters/imagenes/compartir-whatsapp.jpg">
```

Si más adelante se conecta un dominio propio, deben actualizarse `og:url`, `og:image`, `twitter:image` y la etiqueta `canonical`.

WhatsApp guarda las vistas previas en caché. Si cambias la imagen o los textos después de haber compartido un enlace, vuelve a compartir con un parámetro de versión para forzar la actualización:

```
https://puki-blue.vercel.app/meet-the-masters/?v=2
```

## Estructura

```
.
├── index.html
├── Logo PUKI.png
├── LEEME.md
├── css/
│   └── estilos.css
├── js/
│   └── app.js
├── imagenes/
│   ├── Crono-Visor.png
│   ├── Logo PUKI.png
│   ├── Logo PUKI - marca.png
│   ├── Mascota - Yellow El Leon.png
│   └── compartir-whatsapp.jpg   → tarjeta 1200 × 630 px
├── fondos/          → 18 fondos de los personajes
└── mascota/         → 18 imágenes de Yellow caracterizada
```

## Editar los datos

La base de datos oficial de alumnos, fechas, personajes, títulos y pistas está al inicio de `js/app.js`, en el arreglo `CAST`. Cada entrada incluye también el nombre exacto de sus archivos de fondo y mascota.

Si se reemplaza una fotografía, conserva el nombre de archivo o actualiza el campo correspondiente en `CAST`.

## Notas técnicas

- Sin dependencias de JavaScript ni frameworks.
- Tipografías de Google Fonts con respaldo local (`Comic Sans MS` / `Trebuchet MS`) para seguir funcionando sin conexión.
- Transiciones de fondo, contenido, navegación por teclado, gestos táctiles y enlaces profundos.
- Todos los recursos visuales del proyecto se guardan localmente.
