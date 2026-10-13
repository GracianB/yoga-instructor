# P4 · Optimización verificable de estilos en producción

**Objetivo:** reducir el coste de red del primer render sin modificar la interfaz, los personajes ni el orden de la cascada.

## Qué cambia

- `index.html` de desarrollo: mantiene las **77 hojas CSS** por separado y **76 scripts** en su orden original. Permite seguir trabajando por módulos.
- `dist/index.html` de producción: referencia **una sola hoja CSS local** con nombre `yoga-styles-v105.<hash>.css`, conservando Google Fonts en su propio enlace. Se eliminan 76 peticiones CSS, no el contenido.
- La compilación concatena los archivos CSS **sin reordenar reglas ni minificar**, y rechaza duplicados, enlaces condicionales, fuentes vacías o directivas `@import`/`@charset`.
- El CSS se guarda en la raíz pública, al mismo nivel que los archivos originales, para conservar la base de `url(...)`. El SHA-256 forma parte del nombre, evitando reutilizar accidentalmente una versión vieja.
- Los archivos originales permanecen en el artefacto de Pages por compatibilidad y auditoría. El inventario V100 añade el nuevo bundle y verifica todos los bytes publicados.

## Validación obligatoria

1. `npm run quality`: contratos de orden exacto de las 77 hojas, sintaxis PostCSS, hash, CSS condicional, referencias y recursos.
2. `npm run build`: genera el bundle y recalcula el manifest de publicación.
3. `npm run test:browser`: la nueva prueba P4 visita también `/dist/`, compara estilos calculados con `/` y verifica interacciones de Flow, Dragón y Uma en Chromium, Firefox y WebKit.
4. GitHub Pages: `PUBLIC_RELEASE_OK` verifica la versión servida y todos los recursos SHA-256, incluido el nuevo CSS.

**Límites de lo conseguido:** no se ha reducido aún el peso bruto total del CSS ni el número de scripts. La próxima fase debe medir el efecto real en solicitudes, pintura inicial y Core Web Vitals antes de transformar JavaScript. No se anuncian puntuaciones Lighthouse sin medición.
