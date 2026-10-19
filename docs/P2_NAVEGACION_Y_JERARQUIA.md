# P2 · Simplificación integral de Yoga Instructor

**Estado:** rama `phase-2-visitor-experience-20261019`, PR #203 abierta en borrador, apilada sobre PR #201. No se fusiona ni publica sin pruebas y revisión visual.

## Principio de producto
Una sola práctica y tres modos reales: **Movimiento (Nila)**, **Respiración (Dragón)** y **Meditación (Uma)**. Nada de mostrar al mismo tiempo un libro, una segunda demo del personaje, un reproductor y una sesión.

## Orden visible
1. **Portada breve:** Presencia. Sin prisa. Un enunciado y dos acciones.
2. **Sala de práctica:** tres modos, un motor por modo y controles existentes. Es la primera experiencia tras el hero.
3. **Música (opcional):** disclosure cerrado de inicio; mantiene el único audio y su estado.
4. **Portfolio:** enfoque, pruebas y formatos; se ocultan la ilustración/metodología redundantes.
5. **Explorar detalles y recursos:** disclosure cerrado de inicio. Casos, cronología, demostración de 60 s, Vortex, ritual, atlas y bloques históricos siguen accesibles sin dominar la portada.
6. **Preguntas y contacto:** enlaces y consulta reales.

## Cambios técnicos
- **Loto:** SVG original pequeño, movido fuera de un contenedor `aria-hidden`. Se ilumina al hover y al foco de teclado. Enter o clic abre el modo Respiración sin iniciar audio.
- **Asanas:** el Libro D24 ahora se inserta dentro de la sala como herramienta optativa. Las 12 posturas y el rig de Nila siguen disponibles. Cerrado por defecto; al abrirlo se oculta el otro escenario de Movement. No se crean personajes o timers extra.
- **Tres caminos V80:** siguen siendo accesibles bajo recursos, no otra portada delante del producto.
- **CSS final:** `p2-wayfinding.css`; orquestación de jerarquía sin duplicación de nodos en `p2-editorial.js`.
- **Acceso directo:** anchors en `#extras` y `#studio-asana-library` abren su disclosure correspondiente; idiomas ES/EN y tema claro/oscuro conservados.
- **Documentos:** cuatro PDF originales sin modificar; `main` sin tocar.

## Deuda a eliminar con seguridad
P2 reduce la **superficie visible** sin borrar módulos históricos, sus contratos, ni romper enlaces existentes. La limpieza de JS/CSS no usados, reducción de descargas, eliminación definitiva de secciones y optimización de interacciones será P6 tras medir dependencias. La revisión anatómica profunda de las 12 posturas sigue siendo P3.

## Criterios de cierre P2
- `npm run quality`, `npm run build` y Chromium/Firefox/WebKit en verde para el HEAD de esta PR.
- Hero, sala, book, audio y extras sin overflow a 320/375/1440 px.
- Foco/Enter en el loto, selector de 3 modos, libro plegable, enlaces profundos, ES/EN y accesibilidad básica.
- Capturas reales de claro/oscuro y escritorio/móvil; aceptación artística independiente de pasar CI.

## Segunda revisión visual (capturas reales)

La inspección de 25 capturas móviles/escritorio detectó un hero sobredimensionado, un dock flotante que tapaba la app y controles didácticos demasiado numerosos antes de ver la figura. Segunda intervención: hero compacto (sin altura mínima cinematográfica), acciones en línea, dock plegado con botón de 44 px y acceso por teclado/Escape, y Nila antes de los filtros en móvil. La batería visual específica debe repetirse sobre el commit que incorpora esta intervención.

## Ajustes a partir de las capturas de aceptación
- Cabecera móvil en una fila de 60 px, con iconos y controles operativos.
- Hero más corto y con dos acciones alineadas, sin una pantalla vacía entre la frase y la sala.
- Libro de asanas: en ≤600 px Nila aparece **antes** de las categorías, los filtros y las instrucciones. Sin segunda pantalla o temporizador.
- Dock de respiración reducido a una píldora discreta; no muestra un botón de música repetido. El reproductor está en el disclosure optativo.
- Test visual `p2-acceptance-visual.spec.js` genera evidencia por cada ancho 320/375/768/1440 × claro/oscuro y comprueba ausencia de overflow.

## Libro sin ruido
El atlas V81, filtros y búsqueda viven dentro del desplegable “Buscar, filtrar y crear rutas”. La referencia de Nila y los 12 selectores son lo primero, sin eliminar material didáctico ni traducciones.
