# P2 · Navegación directa y primera simplificación visual

Rama: `phase-2-visitor-experience-20261019` (stacked sobre P1, sin publicación).

## Cambio observable
- Portada: una entrada directa al estudio y otra a contacto. CV y Hub permanecen accesibles fuera de la zona principal.
- Cabecera: cuatro destinos explícitos: portfolio, estudio, trayectoria y contacto.
- Orientación V80: conservamos tres caminos interactivos, pero el recorrido de práctica abre primero la sala, con demo y preguntas como recursos.
- Atlas V75: deja de ser otra portada enorme; se convierte en un índice de cinco destinos, con la navegación y su estado activo intactos.
- Música: pasa tras la sección de estudio mediante reubicación DOM (no se duplica ni se reinicia el audio).
- CSS: una capa pequeña, aislada, al final de la cascada. Ajustes móvil y teclado, sin efectos nuevos que necesiten animación.
- Anatomía de Nila, motores, documentos y `main`: sin cambios.

## Aceptación técnica
1. `npm run quality` y `npm run build` sin regresiones.
2. Navegadores Chromium, Firefox y WebKit, con foco en 375 px y 1440 px.
3. Rutas V80 y CV en ES/EN; sin desbordamiento horizontal.
4. Comprobar que Soundtrack aparece después del estudio en orden del DOM y de tabulación.
5. Revisar capturas reales para aprobar el balance visual. **Una CI verde no equivale a aceptación estética.**

## Siguientes ajustes de P2
La compactación resuelve la navegación de primer nivel. La simplificación profunda del contenido repetido entre casos, cronología, formación, filosofía y documentación necesita una revisión editorial y visual comparativa antes de borrar contenido.
