# Continuar con GPT · entrega de contexto

## Objetivo
Terminar la oferta PRESENCIA y una ficha real para Yogagenda, partiendo de esta base.
No hace falta reconstruir la conversación ni volver a preguntar los datos profesionales ya acordados.

## Primer mensaje sugerido
“Lee docs/presencia/README.md y los documentos enlazados de la rama codex/presencia-foundation en GracianB/yoga-instructor. Continúa el diseño de PRESENCIA y prepara la ficha definitiva de Yogagenda con Gracián. Mantén las hipótesis diferenciadas de las decisiones, conserva la experiencia profesional y no publiques ni envíes nada sin una petición que lo autorice.”

## Próximas decisiones, agrupadas
1. Disponibilidad siempre por consulta: no fijar fecha ni convocatoria.
2. Operación: plataforma disponible, método de cobro y plazo de confirmación.
3. Oferta: confirmar 15 €, aforo 8 y mínimo 4 o ajustar con costes reales.
4. Imagen: seleccionar archivo propio y autorizar uso.
5. Contenido: cerrar secuencia docente y guía de una página.
6. Revisar ficha y respuesta; enviarlas solo cuando el usuario lo solicite.

## Integración web posterior
El usuario ha solicitado rediseñar la interfaz en PR #222. Se mantiene sin fecha fija, con taller de 60 minutos, correo y agenda de conversación.
Aprovechar el recorrido existente y la identidad actual; evitar otra aplicación independiente.

Referencias técnicas verificadas:
- docs/PUBLIC_VISITOR_JOURNEY.md describe los valores individual, sala, online, equipos.
- p2-navigation.js contiene el flujo existente de consulta con data-yoga-service.
- yoga-showcase-v2.js contiene la orientación pública.
- yoga-public-final.css es la hoja pública consolidada.
- Sistema bilingüe existente data-p2-lang.
Revisar el código actual antes de implementar; estos nombres no sustituyen una inspección.

### Modelo de orientación
| Intención | Experiencia | Consulta existente |
| --- | --- | --- |
| Quiero empezar | Taller inaugural | online |
| Quiero moverme mejor | Movilidad y flexibilidad | sala u online según formato confirmado |
| Necesito parar | Respiración y relajación | online |
| Quiero una práctica para mí | Sesión individual | individual |

La intención de actividad y la modalidad son campos distintos. No asignar permanentemente movilidad a sala.
Preparar email editable con experiencia e idioma, sin confirmar reserva ni cobrar.
Mientras no haya evento listo, CTA “Consultar próxima convocatoria”.
No mostrar fechas, plazas disponibles, testimonios o pagos ficticios.

### Estados futuros
planning → scheduled → registration_open → full → completed; cancelled como salida alternativa.
El JSON de planificación utiliza planning para todas las actividades y no debe cargarse automáticamente en producción.
Para pasar a scheduled: horario individualmente acordado, plataforma y precio final decididos.
Para abrir inscripción: pago, condiciones y contacto operativo listos.

### Accesibilidad y calidad cuando se implemente
Navegación por teclado, foco visible, etiquetas explícitas, contraste, movimiento reducido y móvil.
Traducciones completas ES/EN, idioma de impartición claramente separado del idioma de interfaz.
Seguir las comprobaciones del repositorio y su pipeline de construcción actual.
Sin pruebas nuevas para documentos; validar JSON y consistencia editorial.
No modificar certificados, CV ni experiencia profesional como parte de esta entrega.

## Criterio de cierre
Ficha sin marcadores pendientes, guion docente revisado por Gracián, recurso de continuidad definido y condiciones aprobadas.
Implementación web y envío de correo son etapas posteriores, no efectos de editar estos documentos.
