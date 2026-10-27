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

El repositorio ya está preparado para importarse desde Vercel:

1. Entra a [vercel.com/new](https://vercel.com/new) e importa el repositorio `danielhenao1-spec/puki`.
2. En **Root Directory**, selecciona `meet-the-masters`.
3. Usa **Framework Preset: Other**.
4. Deja vacío **Build Command** y **Output Directory** (no hay compilación).
5. Pulsa **Deploy**.

Con ese ajuste, la app se publica en la raíz del dominio de Vercel:

```
https://TU-PROYECTO.vercel.app/
```

Cada subida a la rama `main` volverá a desplegar el proyecto automáticamente.

## Vista previa al compartir por WhatsApp

La tarjeta social está creada en `imagenes/compartir-whatsapp.jpg` (1200 × 630 px) e incluye el logo de Puki, el título **PROYECTO: MEET THE MASTERS** y la frase **¡Nuestros niños reciben a los grandes personajes de la historia!**

Para que WhatsApp muestre esa tarjeta, la aplicación debe estar publicada en una **dirección web pública con HTTPS**. Vercel proporciona HTTPS automáticamente; un archivo abierto como `file:///...` o `http://localhost` no puede generar vista previa para otras personas.

Cuando Vercel te asigne la URL de producción, abre `index.html` y sustituye las **dos apariciones** de:

```
https://TU-DOMINIO.com/
```

por esa URL. Debe quedar así en las etiquetas `og:image` y `twitter:image`:

```html
<meta property="og:image" content="https://TU-PROYECTO.vercel.app/imagenes/compartir-whatsapp.jpg">
```

La imagen debe ser accesible abriendo esa misma URL directamente en el navegador.

WhatsApp guarda las vistas previas en caché. Si cambias la imagen o los textos después de haber compartido un enlace, vuelve a compartir con un parámetro de versión para forzar la actualización:

```
https://TU-SITIO.com/meet-the-masters/?v=2
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
