# Yoga Instructor · Tres guardianes (V37–V46)

## Decisión de producto
Tres prácticas, tres personajes independientes: **Nila** en Movimiento (dragón-zorro acrobático sin cuerno central), **el dragón sereno V31** en Respiración y **Uma** en Meditación (polilla lunar, ojos cerrados y alas-manto). No son recolores ni clones del mismo SVG. Se conservan los motores de práctica y sus controles de audio y sesión de V36.

## Las diez versiones

| Versión | Cambio | Criterio de cierre |
| --- | --- | --- |
| V37 | Nila: nueva silueta SVG, anatomía conectada y diez variaciones a partir de los puntos de control ya existentes | La secuencia sigue siendo la canónica de Flow |
| V38 | Materiales y color para Nila, dos energías, base tonal nueva | Una identidad distinta de Breathing en Yin y Yang |
| V39 | Una sola silueta visible en los cambios de pose, sin duplicaciones de patas | Solo el personaje entrante aparece en la transición |
| V40 | Gato/Vaca y respiración del torso sincronizados con el reloj existente | Las patas quedan ancladas y pausa/reset conservan su semántica |
| V41 | Encuentro entre anatomía, sombra y suelo de la escena | No hay ovoides pegados ni movimiento vertical artificial |
| V42 | Uma: polilla lunar con cuerpo y rostro completamente nuevos | No se clona el dragón D17 para representar Meditación |
| V43 | Escena propia de Meditación, foco guiado/silencioso, móvil y oscuro | La figura cambia con el modo sin duplicarse con Breathing |
| V44 | Movimiento como una sola escena continua de personaje, nombre y controles inferiores | Se suprime el doble enmarcado visual |
| V45 | Tests de estados, 10 asanas, cambios de modo, movimiento reducido y anchos 320/390/768/1440 | Sin errores funcionales ni desbordamiento horizontal |
| V46 | Auditoría de recursos y validación SHA-256 de GitHub Pages | No fusionar sin Node + Chromium/Firefox/WebKit + Quality Gate |

## Reglas de mantenimiento

El SVG antiguo de Movimiento permanece cargado para no romper herramientas, eventos ni contratos históricos, pero sus componentes dejan de pintarse. Esto es compatibilidad de transición, **no una segunda criatura visible**. Nila utiliza los mismos diez puntos de control que ya verificaba Flow y no abre un reloj nuevo. La figura de Meditación no tiene temporizador de animación. El dragón sereno de Breathing permanece intacto. No se mezclan personajes mediante `cloneNode` para representar un modo distinto.

Mover personajes de forma independiente exige respetar los puntos de apoyo. En Gato/Vaca cambia la zona central del torso y se alimenta del mismo ciclo que la espalda antigua; los pies no se desplazan. En pausa, el fotograma se conserva. En movimiento reducido, las transformaciones quedan desactivadas.

## QA y entrega

`npm run quality` y `npm run build`; Chromium 2/2, Firefox 2/2, WebKit 2/2 y Gate. Si el Gate es verde, fusionar con SHA de cabeza fijado y esperar el deploy de Pages que valida todos los activos locales y el MP3 por SHA-256. La aprobación de tests **no sustituye** una revisión estética manual en dispositivos físicos.
