# Día de Gracias · El Árbol de la Gratitud

Aplicación web educativa interactiva del **Preescolar Puki**, pensada para pantallas táctiles grandes en el salón de clase. Un árbol otoñal recibe 30 hojas mágicas con tarjetas de reflexión sobre agradecer, la amabilidad y compartir.

## Uso

Abre `index.html` en un navegador moderno. La escena mantiene una proporción 16:9 y se adapta a la pantalla.

- Pulsa uno de los tres botones para hacer nacer una hoja y abrir su tarjeta.
- Toca cualquier hoja del árbol para volver a leerla.
- Toca el letrero **DIA DE GRACIAS** para abrir la explicación de la celebración.
- Usa el reproductor de la esquina superior derecha para la música ambiental y el volumen.
- El botón de reinicio de la esquina superior izquierda comienza una nueva sesión.

## Calibración de hojas

Pulsa el engranaje o `Ctrl + E` para abrir el editor de calibración.

- Arrastra cada hoja para ajustar su posición.
- Gira con la rueda del ratón, el control deslizante o los botones `−5°` / `+5°`.
- **Copiar JSON de Coordenadas** exporta posición, rotación y modelo de las 30 hojas.
- Pega ese arreglo en `LEAF_SLOTS` dentro de `app.js` para que el cambio sea permanente para todos.
- **Guardar en LocalStorage** solo afecta al navegador actual; no modifica el código publicado.

## Estructura

```text
dia-de-gracias/
├── index.html
├── styles.css
├── app.js
├── fondo.webp
├── Acoustic-Guitar-Music.mp3
├── Agradecer-1.webp … Agradecer-3.webp
├── Amabilidad-1.webp … Amabilidad-3.webp
└── Compartir-1.webp … Compartir-3.webp
```

Todo es HTML5, CSS3 y JavaScript vanilla. No requiere compilación ni dependencias externas.

## Despliegue

El repositorio **PUKI** está conectado a Vercel y despliega automáticamente cada cambio en la rama `main`.

La aplicación queda publicada en:

```text
https://puki-blue.vercel.app/dia-de-gracias/
```
