# P5 · Agrupación segura de JavaScript en producción

El portfolio distribuye su comportamiento en **76 scripts clásicos**: tres de arranque síncrono (`runtime.js`, `boot.js`, `i18n.js`) y **73 diferidos**, en orden de dependencia.

P5 introduce un proceso de compilación optativo **solo en `dist/`**. Mantiene los 73 archivos fuente independientes, pero los agrupa en bloques con un tamaño objetivo de 100 KB y un máximo de 15 módulos por bloque. Cada bloque tiene un nombre fingerprint SHA-256, sin empaquetador externo ni scripts de terceros.

El sistema conserva en su posición los tres scripts de arranque, el orden de los 73 módulos diferidos, los ámbitos clásicos de navegador y la política CSP. No aplica `async`, `type=module` ni modifica el tiempo de ninguna animación.

## Barreras de seguridad

El compilador rechaza enlaces duplicados, atributos no esperados, scripts vacíos o demasiado grandes, dependencias de `document.currentScript`, evaluación dinámica y construcciones de carga no compatibles. Cada bloque debe superar el análisis de sintaxis de Node como script clásico.

La CI verifica equivalencia exacta de concatenación, SHA-256, límites de tamaño, inventario de scripts y el build. Playwright carga `/dist/` en Chromium, Firefox y WebKit, verifica el número de peticiones, compara las API globales con `/` y comprueba el Libro de Asanas, Flow, respiración y meditación.

La publicación seguirá supeditada al **Yoga Quality Gate** completo y a la validación remota SHA-256 de GitHub Pages.

## Interpretación del rendimiento

Reducir peticiones HTTP no equivale automáticamente a mejorar LCP, INP o TBT. Los bloques mayores pueden incrementar su latencia de descarga, parseo o invalidación de caché. P5 mantiene tamaños moderados y reserva la evaluación de Core Web Vitals para una fase de medidas reproducibles. Si la prueba de navegador falla, no se fusiona.
