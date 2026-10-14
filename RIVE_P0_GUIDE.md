# Yoga Instructor · Rive P0 (prototipo aislado)

## Objetivo
Experimentar con un rig 2D de verdad sin reemplazar ni dañar el motor SVG de producción. Ruta de laboratorio: `rive-lab.html`. La portada y la consola siguen sin depender de Rive.

## Coste y condiciones (comprobado el 14/10/2026)
- Editor **Free**: utilizable sin coste. Incluye funciones de huesos, mallas y restricciones IK.
- Desde Rive Editor 0.9.46, los archivos `.riv` pueden exportarse desde Free, pero **muestran una breve pantalla de Rive** al reproducirse. No ocultarla ni intentar evitarla.
- Runtime JavaScript: MIT. El laboratorio carga `@rive-app/canvas@2.44.2` solo después de pulsar «Ver demo Rive real» o de seleccionar un `.riv`.
- Planes de pago eliminan la pantalla de marca. El prototipo no necesita comprar ni configurar uno.
- Fuentes: https://www.linkedin.com/posts/rive-app_rive-editor-09-is-live-every-feature-activity-7510399399685017600-mTDk y https://www.npmjs.com/package/@rive-app/canvas

## Entregado
- `rive-nila-rig-template.svg`: plantilla lila independiente con partes separadas nombradas `L_THIGH`, `L_SHIN`, `R_THIGH`, `R_SHIN`, brazos, antebrazos, manos, pies, pelvis, tronco, cuello y cabeza. **No equivale al arte definitivo de Nila ni contiene huesos Rive**.
- `rive-lab.html`, `rive-lab.css`, `rive-lab.js`: laboratorio con la plantilla y visor de archivos `.riv`. Selección local (Blob URL), sin carga a servidor, con limpieza, control de pausa y respeto por movimiento reducido.
- `anatomy-foundation-p0.mjs` y `anatomy-skin-p0.mjs`: cinemática side-view con pelvis, columna lumbar y torácica, dos brazos y dos piernas independientes, contactos y render SVG continuo con control de 0–100 %. Este cálculo **no depende de Rive** y todavía es prototipo anatómico.
- `rive-p0/scene.rml` y `rive-p0/rive.yaml`: **archivo fuente Rive real** con anatomía vectorial estilizada, pivote de torso, brazos contrarrotados y línea temporal Tadasana → Uttanasana → Tadasana. La CLI construye `rive-p0/build/nila-yoga-p0.riv` sin pago ni sesión de cuenta.
- `.github/workflows/rive-p0.yml`: ejecuta la CLI **solo cuando cambia el RML o el propio workflow** en `yoga-p0-anatomy-foundation`, evitando compilarlo en cada PR; verifica, compila y captura fotogramas para revisión. El archivo `.riv` se guarda como artefacto y, si las capturas superan los controles automáticos y la rama no ha cambiado, en `rive-nila-demo-p0.riv` dentro de esta misma rama experimental.
- `tests/rive-lab-p0.test.mjs`, `tests/anatomy-skin-p0.test.mjs` y pruebas Playwright: empaquetado, 505 muestras geométricas, capas, seguridad y carga diferida.
- `tools/build.mjs`: copia los activos del laboratorio al artefacto Pages (incluido el .riv generado, cuando esté presente), sin añadir su runtime a index.

## Flujo CLI (gratuito, ya probado)
```bash
# Rive CLI instalada desde https://rive.app/docs/cli/getting-started
rive rive-p0 --verify
rive rive-p0 --once
rive inspect rive-p0 --summary
rive rive-p0 --screenshot=rive-p0/build/pose.png --advance=60
```
No hay scripts Luau. Este .riv es una **demostración exportable de articulación mediante nodos**, no un sistema con huesos, IK y pesos de malla nativos ya completados. La animación se reproduce en un laboratorio separado y no participa en las clases públicas.

## Flujo de rigging en el editor Rive
1. Abre https://rive.app/editor, importa el SVG del laboratorio y verifica cómo ha tratado la jerarquía de grupos, gradientes y nombres. Reagrupa formas si se han aplanado.
2. Crea **dos cadenas independientes de piernas** (pelvis → muslo → rodilla → tibia → tobillo → pie) y dos de brazos (tronco → hombro → brazo → codo → antebrazo → muñeca → mano), además de columna, cuello y cabeza.
3. Asigna los huesos, pinta los pesos de las mallas y define límites de rodilla/codo/cadera. No uses simplemente escala CSS del torso.
4. Crea animaciones Tadasana y Uttanasana con keyframes de pelvis/cadera, objetivos de pies estables y flexión de rodillas controlada; el torso debe descender desde la pelvis y la cabeza pasar de arriba a abajo.
5. Exporta `.riv` con Free, entra en `rive-lab.html` y selecciónalo con el input. Revisa la pantalla inicial de marca y el resultado. No se envía el archivo a ningún servidor.
6. Comparar visualmente con los SVG actuales y probar en Firefox/Chromium, en móvil y con `prefers-reduced-motion`.

## Límites conocidos
- **Ya hay un `.riv` real creado por la CLI**; lo que falta es un rig profesional con huesos Rive y pesos de malla, no simplemente nodos rotados. La CLI actual sí genera .riv desde el RML del proyecto.
- Esta plantilla es un primer material de importación y no una reconstrucción exacta del personaje actual.
- No está integrado en las secuencias de la app ni sincronizado con el reloj de respiración. Solo debe integrarse tras una prueba visual completa.
- La disponibilidad del CDN afecta únicamente a este laboratorio y nunca a la web pública.
- Las pruebas Node comprueban contratos; la CLI genera capturas para revisión visual, pero falta una auditoría manual de anatomía y las pruebas de reproducción en navegador con el .riv real.

## Criterio de publicación (bloqueante)
- Una compilación limpia **no demuestra anatomía correcta**. En las capturas iniciales, la flexión de Uttanasana presenta un torso y brazos todavía rígidos. La referencia experimental **no sustituye** las asanas originales.
- Antes de fusionar se requiere revisión manual de los fotogramas de Rive, pruebas reales en Chromium/Firefox/WebKit, comprobación del .riv en navegador y adaptación de brazos/caderas/rodillas con malla y huesos.
- El laboratorio de Rive queda desacoplado de la página principal y la PR permanece draft hasta completar la revisión visual.
