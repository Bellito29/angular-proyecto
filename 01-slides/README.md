# Diapositivas — Angular

- **`angular-slides.html`** — la presentación (20 diapositivas). Es un único archivo HTML; se abre con doble clic en cualquier navegador, sin instalar nada ni conexión (solo las fuentes se descargan de Google Fonts; si no hay internet usa fuentes del sistema).
- **`OUTLINE.md`** — guion y notas del orador, bloque por bloque. Es la base de contenido de las diapositivas.
- **`GUION-HABLADO.md`** — el texto hablado, diapositiva por diapositiva.
- **`GUIA-DE-ESTUDIO.md`** — para estudiar el tema y preparar el turno de preguntas: conceptos, tabla de equivalencias con React, respuestas a las 5 preguntas evaluativas, errores comunes y checklist.

## Cómo presentar

1. Abre `angular-slides.html` en el navegador (Chrome o Edge recomendado).
2. Pulsa **F** para pantalla completa.
3. Navega:

| Tecla | Acción |
|---|---|
| `→` · `Espacio` · `Page Down` · clic | Siguiente diapositiva |
| `←` · `Page Up` | Diapositiva anterior |
| `Inicio` / `Fin` | Primera / última |
| `N` | Mostrar u ocultar las **notas del orador** de la diapositiva actual |
| `F` | Pantalla completa |
| `P` | Imprimir / exportar a PDF |
| botón `◐` (abajo izq.) | Cambiar entre tema oscuro y claro |

La barra superior marca el avance y abajo a la derecha se ve el número de diapositiva (`03 / 16`). La URL guarda la diapositiva actual (`...#3`), así que si recargas no pierdes el sitio.

## Exportar a PDF

1. Abre el archivo en el navegador y pulsa **P** (o `Ctrl/Cmd + P`).
2. Destino: **Guardar como PDF**.
3. Diseño: **Horizontal**. Márgenes: **Ninguno**. Activa **Gráficos de fondo**.
4. Guardar. Cada diapositiva sale en una página.

## Contenido (16 diapositivas)

Las diapositivas no llevan nombres: cada integrante toma el bloque o las diapositivas que prefiera. Los bloques son solo una agrupación temática.

| # | Diapositiva | Bloque |
|---|---|---|
| 1 | Portada | — |
| 2 | Cómo va la sesión (agenda) | — |
| 3 | ¿Qué es Angular? | 1 · Introducción y contexto |
| 4 | Angular vs React (tabla) | 1 · Introducción y contexto |
| 5 | Componentes y standalone | 2 · Arquitectura y binding |
| 6 | Data binding | 2 · Arquitectura y binding |
| 7 | Control de flujo `@for` / `@if` | 2 · Arquitectura y binding |
| 8 | Servicios e inyección de dependencias | 3 · Servicios, HTTP y routing |
| 9 | HttpClient y RxJS | 3 · Servicios, HTTP y routing |
| 10 | Routing | 3 · Servicios, HTTP y routing |
| 11 | Signals | 4 · Signals, CLI y demo |
| 12 | Angular CLI | 4 · Signals, CLI y demo |
| 13 | Demo — catálogo de productos | 4 · Signals, CLI y demo |
| 14 | Conclusiones | 4 · Signals, CLI y demo |
| 15 | Para practicar (5 preguntas evaluativas) | — |
| 16 | Gracias / ¿Preguntas? | — |

## Antes de entregar

- Ajusta la fecha de la portada (diapositiva 1) si cambia.
- El guion hablado, párrafo por párrafo, está en [`GUION-HABLADO.md`](GUION-HABLADO.md).
