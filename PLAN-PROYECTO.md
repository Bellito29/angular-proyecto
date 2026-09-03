# Plan: Exposición Angular (20%)

## Contexto

- Grupo de **4 integrantes**.
- Duración máxima de la exposición: **20 minutos**.
- Tema: introducción general a **Angular** y a sus principales herramientas para construir aplicaciones web modernas.
- La audiencia ya conoce JavaScript, TypeScript y React, por lo que React se utiliza únicamente como referencia puntual y no como eje de la exposición.
- Entregables del repositorio:
  - slides de presentación;
  - demo práctica;
  - guía de reproducción en Markdown;
  - preguntas evaluativas.

## 1. Reparto sugerido de tiempo

La presentación está organizada en **5 bloques temáticos**. El reparto entre los cuatro integrantes puede ajustarse según el grupo, pero todos deben participar.

| Bloque | Tiempo aprox. | Contenido |
|---|---:|---|
| 1 · Introducción y modelo mental | ~3 min | ¿Qué es Angular?, qué problema resuelve y cómo organiza una aplicación |
| 2 · Arquitectura | ~4 min | Componentes, standalone components y estructura del proyecto |
| 3 · Templates y formularios | ~4 min | Data binding, `@if`, `@for`, `@empty`, formularios y validación |
| 4 · Servicios, datos y reactividad | ~5 min | Servicios, Dependency Injection, HttpClient, RxJS, routing y Signals |
| 5 · Herramientas, demo y cierre | ~4 min | Angular CLI, video de demostración, cuándo conviene Angular, demo del catálogo y conclusiones |

La meta es ensayar la presentación para que dure aproximadamente **17–18 minutos**, dejando un pequeño margen para transiciones y preguntas.

## 2. Slides de presentación

Ubicación:

`01-slides/angularr-slidess.html`

La presentación actual contiene **20 diapositivas**:

1. Portada — Angular
2. Cómo va la sesión
3. ¿Qué es Angular?
4. Angular piensa en capas
5. Componentes y standalone
6. Archivos que vas a ver
7. Data binding
8. Control de flujo: `@for` / `@if`
9. Formularios y validación
10. Servicios e inyección de dependencias
11. HttpClient y RxJS
12. Routing
13. Signals
14. Angular CLI
15. Demostración en video de Angular CLI
16. ¿Cuándo conviene Angular?
17. Demo — catálogo de productos
18. Conclusiones
19. Para practicar — preguntas evaluativas
20. Gracias / ¿Preguntas?

La presentación está diseñada para abrirse directamente en el navegador y permite navegación por teclado, pantalla completa, notas del orador, cambio de tema y exportación a PDF.

## 3. Video de demostración de Angular CLI

Dentro de la presentación se incluye una diapositiva con el enlace:

`https://youtu.be/DYKT6YRMkdU`

El video muestra de manera práctica el proceso básico de uso de Angular CLI, incluyendo la creación y ejecución de un proyecto.

Durante la exposición, el video debe utilizarse como **apoyo** y ser explicado por los integrantes del grupo.

## 4. Demo: catálogo de productos

Ubicación:

`02-demo/product-catalog/`

La demo es una aplicación Angular pequeña que integra los principales conceptos presentados.

### Componentes y piezas principales

- `ProductListComponent` — muestra la lista de productos y permite filtrarlos.
- `ProductCardComponent` — representa cada producto de forma reutilizable.
- `ProductDetailComponent` — muestra el detalle de un producto usando una ruta con parámetro.
- `ProductService` — centraliza el acceso a los datos y simula una operación asíncrona mediante RxJS.
- `Product` — modelo utilizado para representar los datos de productos.
- Pipe personalizada — transforma información para mostrarla en la interfaz.
- Routing configurado con la arquitectura standalone de Angular.

### Conceptos demostrados

La aplicación utiliza:

- componentes;
- standalone components;
- templates;
- interpolación;
- property binding;
- event binding;
- two-way binding;
- `@if`;
- `@for`;
- `@empty`;
- servicios;
- Dependency Injection;
- RxJS y Observables;
- Signals;
- `computed()`;
- `effect()`;
- `input()`;
- routing;
- parámetros de ruta;
- pipes.

La intención de la demo es mostrar cómo estos conceptos se conectan dentro de una aplicación pequeña y coherente, no como ejemplos aislados.

## 5. Guía de reproducción

Ubicación:

`02-demo/GUIA.md`

La guía explica:

- requisitos;
- instalación;
- configuración;
- pasos de ejecución;
- estructura de la aplicación;
- conceptos utilizados;
- pruebas básicas para comprobar el funcionamiento de la demo.

### Inicio rápido

```bash
cd 02-demo/product-catalog
npm install
npx @angular/cli@19 serve
```

Luego abrir:

`http://localhost:4200`

## 6. Preguntas evaluativas

Las preguntas evaluativas del proyecto se encuentran en:

`ANGULAR PREGUNTAS.docx`

Además, la presentación incluye una diapositiva de práctica con preguntas relacionadas con los conceptos expuestos.

Las **5 preguntas definitivas** que se entreguen al profesor deben evaluar comprensión y no limitarse únicamente a recordar sintaxis.

Temas recomendados para las preguntas:

1. diferencias entre los tipos de data binding;
2. función de los servicios;
3. problema que resuelve Dependency Injection;
4. función de `track` dentro de `@for`;
5. criterios para decidir cuándo conviene utilizar Angular.

## 7. Estructura actual del repositorio

```text
PresentacionCompu3Angular/
├── README.md
├── PLAN-PROYECTO.md
├── ANGULAR PREGUNTAS.docx
│
├── 01-slides/
│   ├── angularr-slidess.html
│   └── README.md
│
└── 02-demo/
    ├── GUIA.md
    └── product-catalog/
        └── proyecto Angular
```

## 8. Checklist antes de entregar

- Verificar que `01-slides/angularr-slidess.html` abra correctamente.
- Probar el enlace al video de Angular CLI.
- Ejecutar la demo siguiendo únicamente `02-demo/GUIA.md`.
- Confirmar que `npm install` y el servidor de Angular funcionen correctamente.
- Revisar que todos los enlaces de los README apunten a archivos existentes.
- Definir las **5 preguntas evaluativas definitivas** que se entregarán al profesor.
- Ensayar la exposición completa para mantenerse dentro de los **20 minutos**.
- Asegurarse de que los **4 integrantes participen** durante la exposición.
