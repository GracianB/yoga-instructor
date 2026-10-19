# Yoga Apps · aisladas del portfolio

**Estado: desarrollo independiente.** Estas apps están en una rama propia para no intervenir en el portfolio de Yoga Instructor mientras otro agente trabaja allí.

## 1. Yoga Practice
`apps/yoga-practice/`
- Movimiento: **tres acciones estructuradas** (Montaña 75 s, Flexión suave 75 s y Niño 90 s). No hay personalización de posturas, editor ni configuraciones acumuladas.
- Respiración: ritmos **4·6, 4·4·4, 4·7·8, 3·6·9 y 4·4·4·4**, elegibles sin interrumpir otros módulos. La figura comparte el reloj de la fase y nunca obliga a retener el aire.
- Meditación: **silencio 5/10/15 min**, con una figura discreta, o **guiada**, que ofrece tres vídeos de YouTube concretos y se abre solo al pulsar. Nada se reproduce solo.
- Un solo controlador de tiempo, con Inicio, Pausa/Continuar, Reiniciar, pausa al ocultar la pestaña y respeto de movimiento reducido.

## 2. Yoga Asana Book
`apps/yoga-asana-book/`
- Atlas inicial de diez posturas revisables, clasificado por categoría, con propósito, alternativa y apoyos.
- La misma figura SVG, paleta y proporciones que Practice.
- Español/inglés, teclado, responsive, sin scripts externos.

## Compartido
`apps/shared/{core.mjs,figure.mjs,figure.css,theme.css}`: datos de asanas, biblioteca visual, temporización y estilos. Las apps importan los mismos módulos sin duplicar el motor.

## Pruebas locales
Desde la raíz del repositorio:
```bash
npm test
npm run test:browser -- --grep "V1"
```

`npm start` sirve ambas rutas desde el mismo servidor. No tienen anuncios ni requieren backend.

## Publicación y alcance
La rama no modifica el `index.html` público, ni el `README.md`, ni los workflows. El sitio del instructor seguirá mostrando ambas apps como **En construcción** hasta que sean validadas y se planifique su despliegue independiente. No cambiar enlaces de portfolio ni fusionar los experimentos originales en la web del instructor.

Fuentes de las tres guías de YouTube: canal Meditación3, vídeos `0sjVoX5ASwg`, `Q3zncqKCiEQ`, `rFLXCWOjb_Y`. Enlaces externos verificados; contenido ajeno, no almacenado ni reutilizado.

## Continuidad entre las dos apps
Movimiento muestra «Explorar esta postura en el libro» con un enlace directo de tipo `?pose=mountain`, `?pose=fold` o `?pose=child`. El libro valida el identificador antes de utilizarlo y permite compartir la postura mediante su URL. Las figuras nuevas se añaden al mismo renderer sin duplicar estilos.

El reloj de práctica renderiza los cambios a **10 Hz** con interpolación visual y continúa usando un único reloj monotónico; pausar cancela la animación.
