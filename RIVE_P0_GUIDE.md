# Yoga Instructor · Rive P0 (prototipo aislado)

## Objetivo
Experimentar con un rig 2D de verdad sin reemplazar ni dañar el motor SVG de producción. Ruta de laboratorio: `rive-lab.html`. La portada y la consola siguen sin depender de Rive.

## Coste y condiciones (comprobado el 14/10/2026)
- Editor **Free**: utilizable sin coste. Incluye funciones de huesos, mallas y restricciones IK.
- Desde Rive Editor 0.9.46, los archivos `.riv` pueden exportarse desde Free, pero **muestran una breve pantalla de Rive** al reproducirse. No ocultarla ni intentar evitarla.
- Runtime JavaScript: MIT. El laboratorio carga `@rive-app/canvas@2.44.2` solo después de que el visitante seleccione un `.riv`.
- Planes de pago eliminan la pantalla de marca. El prototipo no necesita comprar ni configurar uno.
- Fuentes: https://www.linkedin.com/posts/rive-app_rive-editor-09-is-live-every-feature-activity-7510399399685017600-mTDk y https://www.npmjs.com/package/@rive-app/canvas

## Entregado
- `rive-nila-rig-template.svg`: plantilla lila independiente con partes separadas nombradas `L_THIGH`, `L_SHIN`, `R_THIGH`, `R_SHIN`, brazos, antebrazos, manos, pies, pelvis, tronco, cuello y cabeza. **No equivale al arte definitivo de Nila ni contiene huesos Rive**.
- `rive-lab.html`, `rive-lab.css`, `rive-lab.js`: laboratorio con la plantilla y visor de archivos `.riv`. Selección local (Blob URL), sin carga a servidor, con limpieza, control de pausa y respeto por movimiento reducido.
- `tests/rive-lab-p0.test.mjs`: pruebas estáticas de empaquetado, capas y políticas de carga.
- `tools/build.mjs`: copia los activos del laboratorio al artefacto Pages sin añadir su runtime a index.

## Flujo de rigging en el editor Rive
1. Abre https://rive.app/editor, importa el SVG del laboratorio y verifica cómo ha tratado la jerarquía de grupos, gradientes y nombres. Reagrupa formas si se han aplanado.
2. Crea **dos cadenas independientes de piernas** (pelvis → muslo → rodilla → tibia → tobillo → pie) y dos de brazos (tronco → hombro → brazo → codo → antebrazo → muñeca → mano), además de columna, cuello y cabeza.
3. Asigna los huesos, pinta los pesos de las mallas y define límites de rodilla/codo/cadera. No uses simplemente escala CSS del torso.
4. Crea animaciones Tadasana y Uttanasana con keyframes de pelvis/cadera, objetivos de pies estables y flexión de rodillas controlada; el torso debe descender desde la pelvis y la cabeza pasar de arriba a abajo.
5. Exporta `.riv` con Free, entra en `rive-lab.html` y selecciónalo con el input. Revisa la pantalla inicial de marca y el resultado. No se envía el archivo a ningún servidor.
6. Comparar visualmente con los SVG actuales y probar en Firefox/Chromium, en móvil y con `prefers-reduced-motion`.

## Límites conocidos
- Falta un archivo real `.riv` riggeado y exportado desde el editor. No puede producirse solo cambiando la extensión del SVG.
- Esta plantilla es un primer material de importación y no una reconstrucción exacta del personaje actual.
- No está integrado en las secuencias de la app ni sincronizado con el reloj de respiración. Solo debe integrarse tras una prueba visual completa.
- La disponibilidad del CDN afecta únicamente a este laboratorio y nunca a la web pública.
- Las pruebas Node comprueban contratos estáticos, no validan el editor ni el resultado gráfico.
