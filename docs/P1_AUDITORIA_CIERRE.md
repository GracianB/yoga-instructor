# P1 | Auditoría integral y contrato de cierre

**Repositorio:** `GracianB/yoga-instructor`  
**PR:** [#201](https://github.com/GracianB/yoga-instructor/pull/201)  
**Baseline verificable:** commit `8adeeb4678e7f57091fe7befeb30b437d57109ef`, [Actions 39176911282](https://github.com/GracianB/yoga-instructor/actions/runs/39176911282).

## Resultado contrastado

| Área | Evidencia | Estado |
| --- | --- | --- |
| Quality y sintaxis | Workflow completo y tests Node **594/594** | PASS |
| Release | `npm run build`, manifest SHA-256 y artefacto de Pages | PASS |
| Navegadores | Chromium 1/2, Firefox 1/2 y WebKit (particiones 1/2 secuenciales) | PASS |
| Puerta de calidad | `Yoga Quality Gate` | PASS |
| Dependencias | Reporte de entrada, orden CSS/JS, hashes, cobertura de archivos y mapa heurístico de acoplamiento | Operativo |
| Dominios | `asana-domain.js`, `practice-time-core.js`, `flow-event-bridge.js` | Extraídos y probados |
| Prototipo anatómico | 16 articulaciones, solver, IK de rodillas, laboratorio autónomo, error map y controles | Experimental, NO anatomía final |
| Documentos | 4 PDF Yoga desde publicación verificada de `GracianB/GracianB` PR #48, SHA-256 protegidos | PASS |

La PR modifica **86 archivos** en el baseline: 2.006 líneas añadidas y 145 eliminadas, según la metadata de GitHub. Es grande para una fase; su alcance se congela con esta auditoría. No debe seguir creciendo por retoques de Nila.

## Deuda pendiente, no disimulada

1. La página fuente todavía referencia **77 hojas CSS y 80 scripts JS** en el reporte de arquitectura del último build. La compilación unifica CSS, pero no se ha modularizado todo el JavaScript. El presupuesto de rendimiento sigue sin optimizarse a fondo.
2. `tools/build.mjs` conserva una *allowlist* de recursos mantenida a mano. La integridad funciona, pero es frágil para futuros módulos. P6 deberá sustituirla por un grafo comprobable sin cambiar silenciosamente el orden de ejecución.
3. El laboratorio no conduce todavía el arte real de Nila; el Libro conserva su propio motor histórico. P3 decidirá la migración con una capa de compatibilidad.
4. La última revisión visual de Uttanasana mostraba una silueta demasiado horizontal. Tener **594/594 tests** no demuestra calidad anatómica: P3 requiere comparativas y aprobación estética.
5. Las pruebas de navegador son amplias y algunas dependen de la duración de carga; el trabajo de estabilización ya se ha validado, pero P6 debe mejorar su coste de ejecución.

## Decisión de ingeniería

**P1 cumple sus objetivos arquitectónicos y de estabilidad.** Los defectos visuales y deuda de performance quedan registrados y asignados a P2, P3 y P6, en vez de seguir añadiendo microcommits sin cerrar nunca la fase.

La integración en `main` sigue una decisión independiente de publicación. No afirmar que la web pública muestra la rama hasta verificar el workflow de despliegue.

## Siguiente fase

[P2: diseño, navegación y mapa del sitio](ROADMAP_RECONSTRUCCION_6_FASES.md). La primera PR de P2 debe entregar un flujo de navegación simple, una jerarquía visual consistente y una interfaz premium y accesible en ES/EN y escritorio/móvil, sin rehacer el motor anatómico en esa misma fase.
