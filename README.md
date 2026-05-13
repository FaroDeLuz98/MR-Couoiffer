# MR Coiffeur - Website

Este es el código fuente para el sitio web estático de MR Coiffeur.

## Estructura de Archivos

- `index.html`: La estructura principal de la página.
- `styles.css`: Todos los estilos, escritos en CSS vanilla con un enfoque mobile-first.
- `script.js`: Lógica para la interactividad, como el carrusel de la galería y los controles de accesibilidad.
- `/assets`: Carpeta que debe contener todas las imágenes (`LogoMR.png`, `Publi (1).png`, etc.).

## Cómo Editar el Contenido

La edición del contenido se realiza directamente en el archivo `index.html`.

### Textos

Busca el texto que deseas cambiar y reemplázalo. Por ejemplo, para cambiar los testimonios, busca la sección con `id="testimonios"` y edita el texto dentro de las etiquetas `<p>`.

### Precios

Los precios se encuentran en una tabla dentro de la sección con `id="precios"`. Modifica los valores en las celdas (`<td>`) correspondientes.

```html
<tr>
    <td>Corte Dama</td>
    <td>$600 - $900</td> <!-- <- Cambiar aquí -->
</tr>
```

### Imágenes de la Galería

El carrusel de la galería carga automáticamente las imágenes nombradas `Publi (1).png` hasta `Publi (33).png` desde la carpeta `/assets`.

- **Para cambiar las imágenes**: Simplemente reemplaza los archivos en la carpeta `/assets` manteniendo los mismos nombres.
- **Para cambiar la cantidad de imágenes**: Abre `script.js` y modifica la constante `TOTAL_GALLERY_IMAGES` al número total de imágenes que tienes.

```javascript
// script.js
const TOTAL_GALLERY_IMAGES = 33; // <- Cambia este número
```

### Contacto

Para agregar un número de teléfono u horarios, descomenta las líneas correspondientes en la sección con `id="contacto"` en `index.html` y añade la información.

### Favicon

Actualmente, se utiliza `LogoMR.png` como favicon. Para una mejor compatibilidad entre navegadores, se recomienda generar un archivo `favicon.ico` (puedes usar un generador online) y colocarlo en la raíz del proyecto. Luego, actualiza el `<link>` en el `<head>` del `index.html`.
