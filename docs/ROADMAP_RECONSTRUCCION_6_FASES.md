# Yoga Instructor | Hoja de ruta de reconstrucción (6 fases)

> Este plan **no reemplaza** las diez etapas históricas de *Living Sanctuary*: aquellas fueron decisiones creativas de la web; estas seis organizan una nueva reconstrucción de arquitectura, portfolio y aplicación. Se mantiene el compromiso de **una fase completa por entrega**, no una sucesión indefinida de microversiones.

| Fase | Entrega | Criterio de cierre |
| --- | --- | --- |
| **P1 · Fundamentos y arquitectura** | Auditar dependencias, separar dominio/cinemática/reloj/eventos/presentación, asegurar compilación, integridad PDF y controles CI | Quality + build + Chromium/Firefox/WebKit verdes; informe de límites y deuda documentado |
| **P2 · Rediseño y mapa del sitio** | Simplificar portada, hero, navegación, jerarquía de secciones y viajes del visitante (conocer al instructor, experiencia, clases, app, contacto); diseño ES/EN y móvil | Sin elementos duplicados; enlaces, teclado y tamaño de pantalla comprobados; revisión visual de todas las secciones |
| **P3 · Asanas y anatomía de Nila** | Reconstruir las posturas reales como figuras articuladas, con rodillas, codos, cadera, manos, pies y desplazamiento; empezar por Tadasana, Uttanasana, Guerrero II y Árbol | Inspección de siluetas y movimiento, coherencia de apoyos, diferencias claras entre flexión sentada y de pie; 12 asanas verificadas |
| **P4 · Aplicación y secuencias** | Sesiones y secuencias personalizadas, transiciones, progreso, estados de inicio/pausa/reanudar/terminar; un reloj | Recorridos reales de 3 a 8 posturas, continuidad de estado y pruebas de usuario en móvil/escritorio |
| **P5 · Respiración, meditación y compañeros** | Mejorar Dragon/Uma, ritmos, audio optativo, controles accesibles, reducción de movimiento y modos de atención | Sin audio involuntario ni movimientos forzosos; experiencia coherente en ambos idiomas y modos |
| **P6 · Rendimiento, accesibilidad y publicación final** | Reducir deuda del entrypoint, auditar la cascada, eliminar módulos obsoletos solo con evidencia; verificar Web Vitals, SEO, README y despliegue | Quality, pruebas E2E y comparación visual completas; release verificable y documentación concisa |

## Reglas de ejecución

- Una PR principal por fase; **no introducir deudas propias de P3 dentro de P2**.
- Conservar versiones de trabajo y no sobrescribir PDFs verificados.
- `main` es producción; cualquier cambio visible necesita revisión antes de publicar.
- No convertir el prototipo de 16 articulaciones en motor principal sin pruebas de geometría, apoyos y skins.
- No reintroducir límites artificiales de número de CSS/JS: medir descargas y corregir deuda con evidencia.
- Cada fase termina con resumen breve de *hecho / pruebas / pendientes / siguiente paso*.

## Estado

- **P1**: base técnica validada en el commit `8adeeb46`, run `39176911282`. Resultado: 594 tests Node, compilación, Chromium, Firefox, WebKit y Quality Gate correctos. Pendiente de cierre documental y decisión de integración.
- **P2**: siguiente fase. Primer trabajo: arquitectura de información y rediseño visual del portfolio sin modificar el motor de anatomía. 
- **P3–P6**: no declaradas terminadas.
