# Música compartida

Las dos canciones están en `audio/`. El catálogo `tracks` de `yoga-audio-bus.js` permite añadir las próximas con nombre y ruta. Todos los controles usan el mismo elemento de audio; cada botón de reproducción alterna escucha y pausa global. Seleccionar una canción conserva el estado de reproducción y el volumen. Al terminar pasa a la siguiente canción. No empieza al cargar la página.

La web principal incluye el mismo catálogo y archivos. Las pestañas del mismo origen coordinan exclusión por BroadcastChannel (`gracian-music`). Música y voz no se mezclan; entrar en Vortex pausa la música y comenzar música descarga el iframe.
