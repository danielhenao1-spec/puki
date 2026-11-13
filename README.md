# PUKI · Proyectos Educativos

Repositorio de aplicaciones web del **Preescolar Puki**.

## La Cocina Mágica de Yellow

PWA educativa de preescolar con dos modos: exploración de los seis grupos alimenticios y el reto del Plato Mágico. Incluye siete recetas, 28 ingredientes, videos secuenciados de Yellow detrás de la puerta, carruseles educativos, validación de recetas, sonidos, confeti y funcionamiento offline.

![La Cocina Mágica de Yellow](cocina-magica/screenshots/cocina.webp)

- [Aplicación web](cocina-magica/index.html)
- [Instrucciones y estructura](cocina-magica/README.md)
- **URL de producción:** https://puki-blue.vercel.app/cocina-magica/

## Meet The Masters

Aplicación web interactiva del **Preescolar Puki** para el proyecto **Meet The Masters**. Presenta a 18 grandes personajes de la historia junto a la mascota Yellow y el alumno o alumna asignado a cada fecha.

![Vista previa para compartir](meet-the-masters/imagenes/compartir-whatsapp-cuadrada.jpg)

- [Aplicación web](meet-the-masters/index.html)
- [Instrucciones, estructura y edición de datos](meet-the-masters/LEEME.md)
- [Tarjeta para compartir por WhatsApp](meet-the-masters/imagenes/compartir-whatsapp-cuadrada.jpg)
- **URL de producción:** https://puki-blue.vercel.app/meet-the-masters/

## Día Mundial de la Amabilidad

PWA táctil para el aula de preescolar. Los niños encienden cinco orbes de buenas acciones, completan la ventanita del corazón de Yellow y lo acompañan en su transformación en superhéroe. Incluye videos con sonido, animaciones de celebración, instalación como aplicación y funcionamiento offline.

![Día Mundial de la Amabilidad](dia-mundial-amabilidad/capturas/vista-general.jpg)

- [Aplicación web](dia-mundial-amabilidad/index.html)
- [Instrucciones y estructura](dia-mundial-amabilidad/README.md)
- **URL de producción:** https://puki-blue.vercel.app/dia-mundial-amabilidad/

## Despliegue en Vercel

Los tres proyectos son sitios estáticos que no requieren compilación. El repositorio está conectado a Vercel y cada push a la rama `main` actualiza el despliegue automáticamente.

La configuración compartida de Vercel está en [vercel.json](vercel.json). La Cocina Mágica y Día Mundial de la Amabilidad añaden cabeceras específicas para sus service workers y manifests; sus recursos de desarrollo y fuentes originales se excluyen del deploy mediante [.vercelignore](.vercelignore).

## Uso local

- **La Cocina Mágica:** abre `cocina-magica/index.html` o ejecuta `node server.js` dentro de `cocina-magica/`.
- **Meet The Masters:** abre `meet-the-masters/index.html` en un navegador moderno.
- **Día Mundial de la Amabilidad:** dentro de `dia-mundial-amabilidad/`, ejecuta `node servidor.mjs --open` o abre `iniciar.cmd`.

Las tres aplicaciones están pensadas para pantalla horizontal.

## Proyecto

Preescolar Puki · Proyectos escolares **La Cocina Mágica de Yellow**, **Meet The Masters** y **Día Mundial de la Amabilidad**.
