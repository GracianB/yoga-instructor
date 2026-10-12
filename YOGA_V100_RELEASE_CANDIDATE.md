# Yoga Instructor V100 · Edición definitiva · Candidato de lanzamiento

Este documento describe criterios de aceptación. **La existencia de la PR V100 no equivale a publicación.**

## Producto bajo revisión

- **V72–V80**: Libro de Asanas independiente, Breath/Meditation, portfolio bilingüe con casos, demostración, preguntas y rutas de contacto.
- **V81–V85**: 12 posturas con búsqueda, variantes y apoyos, anatomía corregida de Nila y recorridos manuales.
- **V86–V90**: dragón sincronizado con PracticeClock, guía opcional, ambientes, ritual de Uma y audio/voz voluntarios.
- **V91–V95**: expresiones de Uma, identidad de tres guardianes, preferencias locales explícitas, secuencias propias y lectura cómoda.
- **V96**: elimina mutaciones de controles redundantes en cada actualización de 200 ms del reloj.
- **V97**: salto al estudio, etiquetas accesibles, preservación de foco al reordenar posturas.
- **V98**: resumen vivo del modo, foco o recorrido, y estado de práctica, en ES/EN.
- **V99**: auditoría offline obligatoria de recursos, privacidad, audio y CSP; pruebas Playwright y Axe.
- **V100**: inventario completo SHA-256 de archivos publicados, verificable antes y después del despliegue.

## Puerta de integración

1. Revisar cada PR **en orden** y en su SHA exacta. No omitir PRs con conflictos ni dar por superadas ejecuciones abortadas.
2. Ejecutar npm ci, npm run quality y npm run build. Quality incluye las suites Node y auditorías V80/V99.
3. Completar Chromium, Firefox y WebKit. WebKit incluye dos particiones en un único ejecutor, ninguna omitida.
4. Fusionar a main solo después de comprobar las pruebas de PR. El commit fusionado ejecuta CI otra vez.
5. Pages solo se despliega cuando Yoga Quality termina SUCCESS en main; el workflow compara la SHA exacta.
6. La construcción genera dist/release-manifest-v100.json con rutas relativas, tamaño y SHA-256 de cada archivo. Sin secretos, fechas, datos personales ni rutas locales. El manifest no se incluye a sí mismo.
7. Después de publicar, reconstruir el mismo artefacto y ejecutar la comprobación de Pages sobre dist, comparando el SHA-256 del manifest remoto, HTML, scripts, estilos y audio con los bytes validos localmente.
8. Declarar PUBLIC_RELEASE_OK solo cuando despliegue y verificación postpublicación terminen correctamente. Antes de eso, el estado es candidato.

## Criterios de uso

- Escritorio, móvil de 320/375 px y tablet, con contenido principal sin desbordamiento horizontal.
- Movimiento, Respiración y Meditación se alternan sin contaminar relojes ni producir audio por sorpresa.
- Pausa y reanudación correctas, respiración libre sin segundos impuestos y meditación silenciosa sin voz.
- Guardado de preferencias exclusivamente voluntario, con borrado y normalización de valores.
- Ordenar tres posturas dentro del Libro original, sin duplicar a Nila ni arrancar automáticamente el Flow principal.
- Teclado y lector de pantalla: salto a la sala, etiquetas precisas y foco persistente tras reordenación.
- ES/EN, tema claro/oscuro, quiet mode y prefers-reduced-motion mantienen la información.

## Declaraciones prohibidas antes de validar

- V100 publicada antes del resultado positivo del despliegue y SHA-256.
- Accesibilidad perfecta sin pruebas manuales y de tecnología asistiva.
- Rendimiento mejorado en porcentajes no medidos; V96 corrige una fuente concreta de mutaciones innecesarias.
- Voz siempre privada y offline; eso depende del navegador y proveedor de voces.
- Beneficios médicos garantizados, credenciales no verificadas y testimonios simulados.

## Fallos

Ante una prueba roja: consultar log y captura, reproducir, corregir causa, volver a ejecutar Node y los tres navegadores en la SHA nueva. No desactivar Axe, quitar pruebas ni saltarse PRs para poder anunciar la versión 100.
