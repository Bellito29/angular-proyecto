# Guion de Diapositivas — Angular (20 min, 4 integrantes)

> Las diapositivas ya están construidas en **[`angular-slides.html`](angular-slides.html)** (16 slides, se abren en el navegador). Este documento es el guion de contenido con las notas del orador que las sustentan. Para el **texto hablado, diapositiva por diapositiva**, ver [`GUION-HABLADO.md`](GUION-HABLADO.md). Para presentar y exportar a PDF, ver [`README.md`](README.md).

## Reparto sugerido

| Bloque | Integrante | Tiempo | Diapositivas |
|---|---|---|---|
| 1. Introducción y contexto | A | ~4 min | 1–3 |
| 2. Arquitectura y binding | B | ~4 min | 4–6 |
| 3. Servicios, HTTP y routing | C | ~4 min | 7–9 |
| 4. Signals, CLI, demo y cierre | D | ~6 min | 10–14 |
| Preguntas | Todos | ~2 min | — |

---

### 1. Portada
- Título: "Angular: Framework para Aplicaciones Web Modernas"
- Nombres del grupo, curso, fecha.

### 2. ¿Qué es Angular?
- Framework de desarrollo frontend basado en TypeScript, mantenido por Google.
- Usado para construir Single Page Applications (SPA).
- Incluye "todo lo necesario" out-of-the-box: routing, forms, HTTP client, testing — a diferencia de una librería como React que requiere elegir e integrar piezas por separado.
- Nota del orador: mencionar que la versión actual usa una arquitectura basada en *standalone components* y *signals* (ya no depende obligatoriamente de NgModules).

### 3. Angular vs React (tabla comparativa)

| Aspecto | Angular | React |
|---|---|---|
| Tipo | Framework completo | Librería de UI |
| Lenguaje | TypeScript (nativo) | JavaScript/TypeScript |
| Vistas | Templates HTML + directivas | JSX (HTML dentro de JS) |
| Binding | Soporta binding bidireccional `[( )]` | Unidireccional (props/state) |
| Manejo de estado reactivo | Signals (nativo) | useState/useReducer (hooks) |
| Enrutamiento | Angular Router (incluido) | React Router (librería externa) |
| CLI | Angular CLI (incluido) | Create React App / Vite (externo) |

- Nota del orador: enfatizar que ambos resuelven el mismo problema (construir UIs por componentes) con filosofías distintas: "framework opinionado" vs "librería flexible".

### 4. Components y Standalone Components
- Un componente = clase TypeScript + decorador `@Component` + template + estilos.
- Equivalente conceptual a un componente funcional de React, pero con decoradores y clases.
- *Standalone components*: desde Angular 14+ (y por defecto desde v17+), un componente puede declarar sus propios `imports` sin necesitar un `NgModule` contenedor. Simplifica la estructura del proyecto.

### 5. Data Binding
- Interpolación: `{{ nombre }}` → mostrar una variable en el template.
- Property binding: `[value]="variable"` → pasar un valor de la clase al DOM.
- Event binding: `(click)="metodo()"` → escuchar eventos del DOM.
- Two-way binding: `[(ngModel)]="variable"` → combina property + event binding (input y variable siempre sincronizados).
- Nota del orador: comparar con React, donde el two-way binding no existe nativamente y se simula con `value` + `onChange`.

### 6. Directivas de control de flujo: `@for` y `@if`
- Sintaxis moderna (Angular 17+) que reemplaza `*ngFor` y `*ngIf`.
- `@for (item of items; track item.id) { ... } @empty { ... }` → recorre una lista, con bloque opcional si está vacía.
- `@if (condicion) { ... } @else { ... }` → renderizado condicional.
- Nota del orador: mostrar rápidamente un fragmento de código de la demo (`product-list.component.html`).

### 7. Servicios y Dependency Injection (DI)
- Un servicio es una clase reutilizable (lógica de negocio, acceso a datos) que no pertenece a un componente específico.
- `@Injectable({ providedIn: 'root' })` → Angular crea una única instancia (singleton) disponible en toda la app.
- DI: en vez de crear instancias manualmente (`new ProductService()`), Angular las "inyecta" automáticamente en el constructor del componente que las necesita.
- Nota del orador: comparar con el patrón de "Context + custom hook" en React, que resuelve un problema similar (compartir lógica/datos sin pasar props manualmente).

### 8. HttpClient y RxJS
- `HttpClient` es el módulo de Angular para hacer peticiones HTTP (GET, POST, etc.).
- Cada petición retorna un `Observable` (RxJS), no una `Promise` directamente.
- Un Observable representa un flujo de datos asíncrono al que uno se "suscribe" (`.subscribe()`).
- Nota del orador: no profundizar en operadores RxJS avanzados; el objetivo es que entiendan la idea de "flujo de datos al que te suscribes", ya que en la demo se simula con `of()` + `delay()`.

### 9. Routing
- `provideRouter(routes)` configura las rutas de la aplicación (forma standalone, sin `NgModule`).
- `<router-outlet />` → marcador donde Angular renderiza el componente de la ruta activa.
- `routerLink="/product/1"` → navegación declarativa (equivalente a `<Link>` en React Router).
- Rutas con parámetros: `product/:id` → se recupera con `ActivatedRoute` en el componente destino.

### 10. Signals (breve mención)
- Nueva forma de manejar estado reactivo en Angular (desde v16, estable en v17+).
- `signal(valor)` crea un contenedor de estado; `computed()` deriva valores automáticamente cuando cambian los signals de los que depende.
- Ventaja: Angular sabe exactamente qué cambió y actualiza solo esa parte de la vista (más eficiente que el chequeo de cambios tradicional).
- Nota del orador: mencionar que es conceptualmente parecido a `useState` + recalcular derivados, pero con actualización más fina/reactiva.

### 11. Angular CLI
- Herramienta de línea de comandos para todo el ciclo de vida del proyecto.
- `ng new` → crear proyecto. `ng generate component/service` → generar código repetitivo (boilerplate). `ng serve` → servidor de desarrollo. `ng build` → compilar para producción.
- Nota del orador: mencionar que esto reemplaza la necesidad de configurar manualmente bundlers como en proyectos React desde cero.

### 12. Transición a la demo
- "Vamos a ver estos conceptos funcionando juntos en una app real: un catálogo de productos."
- Mencionar brevemente qué se va a mostrar: lista de productos, filtro de búsqueda, navegación a detalle.

### 13. Conclusiones
- Angular es una buena opción cuando se busca una estructura clara y consistente "de fábrica" para proyectos grandes o de equipo.
- Curva de aprendizaje algo mayor que React al inicio (más conceptos propios: DI, decoradores, RxJS), pero con menos decisiones de arquitectura que tomar por tu cuenta.
- Usado por empresas como Google, Microsoft, Deutsche Bank, entre otras, en aplicaciones empresariales grandes.

### 14. Preguntas
- Espacio abierto para preguntas de la audiencia.
