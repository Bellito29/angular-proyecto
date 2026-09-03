# Plan: Exposición Angular (20%)

## Contexto
- Grupo de 4 integrantes, 20 minutos de exposición.
- Audiencia: compañeros de clase que conocen JavaScript, TypeScript y React, pero no Angular.
- Tema: introducción general a Angular (no un subtema específico).
- Entregables: slides, demo + guía en Markdown, 5 preguntas evaluativas.

## 1. Reparto de tiempo (20 min, 4 integrantes)

| Bloque | Encargado | Tiempo | Contenido |
|---|---|---|---|
| 1 | Integrante A | ~4 min | ¿Qué es Angular? Contexto, historia, Angular vs React (tabla comparativa) |
| 2 | Integrante B | ~4 min | Arquitectura: components, standalone components, data binding, directivas `@for`/`@if` |
| 3 | Integrante C | ~4 min | Servicios, Dependency Injection, HttpClient/RxJS, Routing |
| 4 | Integrante D | ~6 min | Demo en vivo + Signals (mención) + conclusiones |
| — | Todos | ~2 min | Preguntas del público |

Cada bloque teórico se apoya en comparaciones directas con React (que la audiencia ya conoce) para ganar tiempo y claridad.

## 2. Outline de slides (~14 diapositivas)

Ver [01-slides/OUTLINE.md](01-slides/OUTLINE.md) — guion completo para armar en PowerPoint/Google Slides.

1. Portada
2. ¿Qué es Angular?
3. Angular vs React (tabla comparativa)
4. Components y Standalone Components
5. Data binding (interpolación, property, event, two-way)
6. Directivas de control de flujo (`@for`, `@if`)
7. Servicios y Dependency Injection
8. HttpClient + RxJS
9. Routing (RouterOutlet, RouterLink, parámetros)
10. Signals (mención breve)
11. Angular CLI
12. Transición a demo
13. Conclusiones
14. Preguntas

## 3. Demo: catálogo de productos con detalle y routing

Ubicación: `02-demo/product-catalog/` (proyecto Angular standalone).

Componentes/piezas:
- `ProductListComponent` — lista de productos con `@for`, filtro de texto con `[(ngModel)]`.
- `ProductService` — provee los datos simulando una llamada async con RxJS (`of()` + `delay()`), sin necesitar backend real.
- `ProductDetailComponent` — vista de detalle accedida vía ruta `product/:id`.
- Routing configurado con `provideRouter` (sin `NgModule`).

Conceptos cubiertos: components, standalone components, data binding, directivas de control de flujo, servicios/DI, RxJS/Observables, forms básicos (two-way binding) y routing con parámetros — todo el temario en una sola app pequeña.

Guía de reproducción: `02-demo/GUIA.md` (requisitos, instalación, pasos de ejecución, explicación de conceptos con fragmentos de código).

## 4. Preguntas evaluativas

Ver [03-preguntas-evaluativas.md](03-preguntas-evaluativas.md).

1. ¿Cuál es la diferencia entre data binding unidireccional y bidireccional en Angular? Da un ejemplo de sintaxis de cada uno.
2. ¿Qué problema resuelve la Inyección de Dependencias en Angular, y cómo se hace disponible un servicio en toda la aplicación?
3. Menciona una diferencia arquitectónica clave entre Angular y React (por ejemplo, templates vs JSX, o manejo de estado).
4. ¿Qué es un standalone component y qué ventaja ofrece frente al uso tradicional de NgModules?
5. Para navegar a una ruta con parámetros en Angular Router, ¿qué se necesita configurar y cómo se recupera ese parámetro en el componente destino?

## 5. Estructura de carpetas

```
Exposicion-Angular/
├── PLAN-PROYECTO.md
├── 01-slides/
│   └── OUTLINE.md
├── 02-demo/
│   ├── product-catalog/   (proyecto Angular)
│   └── GUIA.md
└── 03-preguntas-evaluativas.md
```
