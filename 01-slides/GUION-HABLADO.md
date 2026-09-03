# Guion hablado — Exposición Angular

Lo que dice cada persona, diapositiva por diapositiva. Las diapositivas **no llevan nombres**:
cada integrante elige el bloque o las diapositivas que quiera. Sugerencia de reparto por tiempo:

| Parte | Diapositivas | Tiempo |
|---|---|---|
| Apertura | 1–2 | ~1 min |
| Bloque 1 · Introducción y contexto | 3–4 | ~4 min |
| Bloque 2 · Arquitectura y binding | 5–7 | ~4 min |
| Bloque 3 · Servicios, HTTP y routing | 8–10 | ~4 min |
| Bloque 4 · Signals, CLI y demo | 11–16 | ~6 min |
| Preguntas del público | — | ~2 min |

> Cada `>` es una nota de acción, no se dice en voz alta. El resto es lo que se dice.
> Dentro de la presentación, pulsando **`N`** salen estas mismas notas resumidas.

---

## Apertura — diapositivas 1–2

### Diapositiva 1 · Portada
Buenas. Vamos a presentar **Angular**, un framework para construir aplicaciones web.
No vamos a ver un tema puntual, sino entender qué es Angular en general. Como ustedes ya
conocen React, lo vamos a ir **comparando con React** durante toda la charla.

### Diapositiva 2 · Cómo va la sesión
La charla tiene **cuatro bloques**: primero qué es Angular y cómo se compara con React;
después la arquitectura —componentes y binding—; luego servicios, HTTP y navegación; y al
final signals, la herramienta de línea de comandos y una demo en vivo. Son unos 20 minutos
y dejamos los últimos para preguntas.

---

## Bloque 1 · Introducción y contexto — diapositivas 3–4  (~4 min)

### Diapositiva 3 · ¿Qué es Angular?
Angular es un **framework de frontend**, hecho por Google y escrito en **TypeScript**. Sirve
para construir **SPAs**, aplicaciones de una sola página donde la navegación ocurre sin
recargar el navegador.

La diferencia grande con React es la filosofía: Angular viene con **todo incluido** —enrutador,
formularios, cliente HTTP, testing— de fábrica. React es una **librería de UI**: te da los
componentes y tú eliges e integras el resto.

Además, el Angular de hoy usa *standalone components* y *signals*, así que ya **no depende de
los NgModules** que quizá hayan visto en tutoriales antiguos.

### Diapositiva 4 · Angular vs React
Esta tabla resume las diferencias. Angular es un **framework completo**; React, una **librería**.
Angular usa **plantillas HTML con directivas**; React usa **JSX**, HTML dentro de JavaScript.
Angular trae **binding bidireccional**; React solo unidireccional. Y el **enrutador y la CLI
vienen incluidos** en Angular, mientras que en React son piezas externas como React Router y Vite.

En una frase: Angular es un **framework opinionado** y React una **librería flexible**. Ninguno
es mejor; resuelven el mismo problema con enfoques distintos.

---

## Bloque 2 · Arquitectura y binding — diapositivas 5–7  (~4 min)

### Diapositiva 5 · Componentes y standalone
Un **componente** en Angular es una **clase de TypeScript** con el decorador `@Component`, más
una plantilla y unos estilos. Conceptualmente es lo mismo que un componente de React, solo que
con clase y decorador en vez de una función.

**Standalone** quiere decir que el componente declara sus propias dependencias en la lista de
`imports` y **no necesita un NgModule** que lo envuelva. Desde la versión 17 es el
comportamiento por defecto y simplifica mucho la estructura del proyecto.

Para pasar datos de un componente a un **hijo** se usa `input()`, que es una **señal de solo
lectura**. En la demo, la lista no dibuja cada tarjeta: se la delega a un `ProductCardComponent`
y le pasa el producto con `[product]="producto"`.

### Diapositiva 6 · Data binding
Angular tiene **cuatro formas** de conectar la clase con la vista:

- **Interpolación** con dobles llaves, para mostrar un valor.
- **Property binding** con corchetes, para pasar un valor al DOM.
- **Event binding** con paréntesis, para escuchar eventos como el `click`.
- **Two-way binding**, corchetes y paréntesis juntos, que mantiene sincronizados un input y una
  variable en **ambos sentidos**.

Ese último **no existe nativo en React**: allá lo simulas con `value` y `onChange` a mano. En la
demo lo usamos en el buscador.

### Diapositiva 7 · Control de flujo `@for` / `@if`
Para repetir y condicionar en la plantilla se usa esta sintaxis, que desde la versión 17
**reemplaza a `*ngFor` y `*ngIf`**.

`@for` recorre una lista y **obliga a poner `track`**, que le dice a Angular cómo identificar
cada elemento para actualizar solo lo que cambió. `@empty` es el bloque que se muestra si la
lista está vacía. `@if`, con su `@else`, hace el renderizado condicional.

El equivalente mental en React es el `.map()` para listas y el operador ternario para condiciones.

---

## Bloque 3 · Servicios, HTTP y routing — diapositivas 8–10  (~4 min)

### Diapositiva 8 · Servicios e inyección de dependencias
Un **servicio** es una clase con lógica o acceso a datos que **no pertenece a ningún
componente** en concreto. Se marca con `@Injectable({ providedIn: 'root' })`, y eso hace que
Angular cree **una sola instancia** (singleton) compartida por toda la app.

La **inyección de dependencias** es que tú **no haces `new ProductService()`**: lo pides con la
función **`inject()`** y Angular te entrega la instancia. (Antes se hacía como parámetro del
constructor; hoy se prefiere `inject()`.) En React, el patrón parecido sería un *Context* con un
*hook* propio.

### Diapositiva 9 · HttpClient y RxJS
Para hablar con un backend, Angular trae **`HttpClient`**. Lo particular es que cada petición
**no devuelve una `Promise`, sino un `Observable`** de la librería **RxJS**.

Un Observable es un **flujo de datos asíncrono**: te **suscribes** con `.subscribe()` y recibes
el valor cuando llega. No hace falta saber RxJS a fondo; basta la idea de "flujo al que te
suscribes". En la demo no tenemos servidor, así que **simulamos** la respuesta con `of()` y un
`delay()`.

### Diapositiva 10 · Routing
El enrutador se configura con **`provideRouter`** y una lista de rutas, sin NgModule. En la
plantilla pones **`<router-outlet />`**, que es el hueco donde se dibuja la ruta activa, y
navegas con **`routerLink`**, el equivalente al `<Link>` de React Router.

Para **rutas con parámetros** defines algo como `product/:id`. Activando
**`withComponentInputBinding()`**, ese parámetro llega al componente de destino como un
**`input()`** normal —lo llamamos `id`— y `numberAttribute` lo convierte de texto a número. En la
demo, un `effect()` reacciona a cada cambio de `id` y pide el producto al servicio.

---

## Bloque 4 · Signals, CLI y demo — diapositivas 11–16  (~6 min)

### Diapositiva 11 · Signals
**Signals** es la forma moderna de manejar **estado reactivo**, estable desde la versión 17.
`signal()` crea un contenedor de estado y `computed()` **deriva** un valor a partir de otros
signals y **se recalcula solo** cuando esos cambian.

La ventaja es que Angular sabe **exactamente qué signal cambió** y actualiza solo esa parte de
la pantalla. Si vienen de React, piénsenlo como `useState` más los valores derivados, pero con
una reactividad más precisa.

### Diapositiva 12 · Angular CLI
Angular trae una **herramienta de línea de comandos** para todo el ciclo del proyecto:
`ng new` para crear, `ng generate` para producir componentes y servicios sin escribir el
esqueleto a mano, `ng serve` para el servidor de desarrollo y `ng build` para compilar a
producción. Te **ahorra configurar el bundler** tú mismo.

### Diapositiva 13 · Demo — catálogo de productos
Vamos a la demo. Es un **catálogo de productos** con dos vistas: una **lista con un buscador**
que filtra en vivo, y el **detalle** de cada producto, al que se llega por una **ruta con
parámetro**. En esta app pequeña están **todos los conceptos**: componentes standalone con
`input()`, binding, `@for` / `@if`, un servicio con inyección, RxJS, signals, una pipe propia
(`truncate`, que acorta la descripción en la tarjeta) y routing.

> Cambiar al navegador en `http://localhost:4200`.
> 1. Escribir **"mouse"** en el buscador → la lista se filtra sola (two-way binding + `computed`).
> 2. Clic en un producto → breve "Cargando…", aparece el detalle y la **URL cambia con el `id`**.
> 3. "Volver al catálogo". Opcional: en la URL, `/product/999` → "Producto no encontrado".
> 4. Opcional: escribir en la URL una ruta que no existe → redirige al catálogo.

### Diapositiva 14 · Conclusiones
Para cerrar: Angular te da una **estructura clara y consistente de fábrica**, lo cual ayuda en
proyectos grandes o de equipo. Tiene una **curva inicial más alta** que React porque trae
conceptos propios —inyección de dependencias, decoradores, RxJS— pero a cambio **tomas menos
decisiones de arquitectura** por tu cuenta. Lo usan **Google, Microsoft y Deutsche Bank**, entre
otros, en aplicaciones empresariales.

### Diapositiva 15 · Para practicar
Estas son las **cinco preguntas de evaluación** que van al foro; las dejamos en pantalla por si
quieren tomarlas.

> Leer una o dos en voz alta, no las cinco.

### Diapositiva 16 · Gracias / ¿Preguntas?
Eso es todo, gracias. ¿Preguntas?

---

## Respuestas rápidas para el turno de preguntas

- **"¿Angular o React para un proyecto nuevo?"** — Depende del contexto: equipo grande y ganas de
  estructura impuesta → Angular; proyecto pequeño o necesidad de flexibilidad y ecosistema → React.
- **"¿Signals reemplaza a RxJS?"** — No. Signals cubre el estado dentro de la app; RxJS sigue
  siendo la base de `HttpClient` y de flujos de eventos complejos.
- **"¿Sigo necesitando NgModules?"** — En proyectos nuevos, no. Todo puede ser standalone; los
  NgModules quedan para código antiguo.
- **"¿Two-way binding no es mala práctica?"** — Es azúcar sobre property + event binding; para un
  input de formulario es cómodo y explícito, no hay problema.
