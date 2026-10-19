# P2 | Arquitectura de información y rediseño editorial

## Diagnóstico del sitio actual

La portada conserva más de treinta secciones/nodos con ID. Un visitante encuentra **tres mapas de navegación simultáneos**: cabecera `#nav`, orientador `#orientacion` y atlas `#atlas`. Además, `#ritual` y `#instructor-flow` compiten por la entrada a la práctica; `#portfolio`, `#experiencia`, `#trayectoria`, `#formacion` y `#sobre` fragmentan el perfil. La web tiene contenido valioso, pero pide demasiadas decisiones antes de empezar.

**No borrar IDs existentes en P2 sin auditar scripts, enlaces y regresiones.** El primer paso es rediseñar la lectura, no destruir funcionalidades.

## Nuevo mapa de visitante (ES/EN)

| Intención | Ruta visible | ID permanente | Elementos internos |
| --- | --- | --- | --- |
| Entender quién enseña | **Sobre mí / About** | `#sobre` | enfoque, experiencia, formación, credenciales |
| Saber qué ofrece | **Clases / Classes** | `#oferta` | sala, 1:1, corporativo; casos y formatos |
| Probar la experiencia | **Estudio / Studio** | `#instructor-flow` | asanas, respiración, meditación, secuencias |
| Ver trayectoria | **Experiencia / Experience** | `#experiencia` | evidencia, CV y ejemplos |
| Hablar | **Contacto / Contact** | `#contacto` | contacto y formulario de consulta |

**Portada:** `#inicio` como presentación singular, con una frase humana y una CTA al estudio. No debe repetir otro portal de selección.

**Contexto opcional:** `#orientacion`, `#atlas`, `#ritual`, `#campo`, `#camino`, `#filosofia`, `#cv`, `#preguntas`, `#casos` se reagrupan o subordinan dentro de las cinco rutas, sin perder datos/IDs hasta que sus dependencias estén revisadas.

## Dirección visual

- Una jerarquía clara: encabezado contenido, tipografía serena, fondos minerales/jade/carbón, buen contraste y bordes discretos.
- Una sola CTA principal por pantalla; el CV no necesita competir con el inicio de una práctica.
- Evitar tarjetas repetidas que dicen lo mismo con títulos distintos. La trayectoria es real; dejar que las evidencias hablen.
- La sala de práctica debe sentirse como una aplicación independiente, pero siempre contar con salida clara al portfolio.
- En móvil, navegación accesible y breve; en desktop, lectura editorial sin una jungla de botones.
- ES/EN, modo claro/oscuro, keyboard/focus, `prefers-reduced-motion` y enlaces compartibles son contratos.

## Alcance P2

1. Revisar y simplificar el header y el hero.
2. Reordenar las secciones visibles según cinco rutas, manteniendo compatibilidad de anclas.
3. Resolver duplicaciones entre `#orientacion`, `#atlas` y `#ritual`.
4. Refinar espacios, tipografías, contraste, hover, focus y diseño responsive.
5. Revisar las rutas en ES/EN y con JavaScript desactivado cuando proceda.
6. Entregar comparativas visuales y pruebas en Chromium/Firefox/WebKit.

## Fuera de P2

- No reconstruir anatomía (P3).
- No sustituir el reloj ni las secuencias (P4).
- No rediseñar audio y respiración (P5).
- No rehacer el build ni ajustar presupuestos de performance a ciegas (P6).
- No tocar los cuatro PDF verificados.

## Criterio de cierre

Un visitante debe identificar en menos de una pantalla **quién eres, qué ofreces y dónde practicar o contactar**. La navegación no requiere memorizar diez nombres poéticos. Completar la batería de calidad, verificar visualmente ambos temas, idiomas, móvil y escritorio y comprobar que las anclas anteriores siguen resolviendo.

**Estado:** especificación de P2 iniciada sobre la base técnica de P1, sin merge ni despliegue.


## Primera implementación en la PR #202

- Se ha reemplazado la navegación superior de términos abstractos por cinco accesos: Sobre mí, Clases, Estudio, Experiencia y Contacto.
- El hero tiene únicamente dos acciones relevantes. Se ocultan las tarjetas de métricas y manifiestos duplicados en lectura breve; siguen disponibles en lectura completa.
- Un mapa interactivo de cinco tarjetas aparece inmediatamente después del hero. No hay diapositivas automáticas ni elección obligatoria.
- El modo **breve** es la entrada normal con JavaScript; «Ver todo el contenido» restaura todas las secciones de origen. Sin JavaScript, todo el contenido queda disponible.
- Los enlaces existentes a secciones secundarias expanden el modo completo antes de navegar; los enlaces directos URL con hash hacen lo mismo.
- La sala interactiva se ha reubicado después de experiencia y la música inmediatamente después de la sala, sin pistas duplicadas ni autoplay.
- La animación introductoria de dos segundos ya no se presenta de forma obligatoria. Solo se activa expresamente con `?intro=1`.
- Las fases creativas y el archivo histórico no se eliminan del proyecto; se dejan de imponer como pantallas sucesivas a quien llega a la web.


## P2 | Recorrido por destino seleccionado

Al pulsar uno de los cinco destinos del mapa, la portada pasa de un índice de secciones a **una sola sección protagonista**. La navegación superior cambia entre destinos; la música solo se muestra acompañando al estudio. El botón de contenido completo y los enlaces históricos conservan toda la información, y los enlaces directos abren la sección solicitada. La experiencia original sin JavaScript no oculta contenido.
