# Guía de estudio — Angular

Para preparar la exposición y el turno de preguntas. Todo lo que hay aquí aparece
en las diapositivas ([`angular-slides.html`](angular-slides.html)), en el guion hablado
([`GUION-HABLADO.md`](GUION-HABLADO.md)) o en la demo ([`../02-demo/`](../02-demo/)).

Regla mental para toda la charla: **Angular es un framework "con todo incluido";
React es una librería de UI y tú integras el resto.**

---

## 1. Resumen en una tabla

| Concepto | Qué es | En la demo |
|---|---|---|
| **Framework vs librería** | Angular trae router, formularios, HTTP y testing de fábrica | Todo el proyecto usa piezas de Angular, sin librerías extra |
| **Componente** | Clase TS + `@Component` + plantilla + estilos | `ProductListComponent`, `ProductDetailComponent`, `ProductCardComponent` |
| **Standalone** | El componente declara sus `imports`, sin `NgModule` | Ningún componente usa `NgModule` |
| **Data binding** | Conectar clase ↔ vista (interpolación, property, event, two-way) | `[(ngModel)]="filterText"` en el buscador |
| **`@for` / `@if`** | Control de flujo en la plantilla (reemplaza `*ngFor` / `*ngIf`) | Lista de productos y estados del detalle |
| **Servicio** | Clase de lógica/datos reutilizable, fuera de un componente | `ProductService` |
| **Inyección de dependencias (DI)** | Angular crea y entrega las instancias; tú no haces `new` | `inject(ProductService)` |
| **Observable / RxJS** | Flujo de datos asíncrono al que te suscribes | `getProducts()` devuelve `Observable<Product[]>` |
| **Signals** | Estado reactivo nativo (`signal`, `computed`, `effect`) | `filterText`, `filteredProducts`, `effect` del detalle |
| **Routing** | Navegación sin recargar; rutas, `router-outlet`, `routerLink` | `''` → lista, `product/:id` → detalle |
| **`input()`** | Entrada de un componente hijo (señal de solo lectura) | `ProductCardComponent` recibe `[product]` |
| **Pipe** | Transforma un valor en la plantilla (`valor | pipe`) | `CurrencyPipe` y `TruncatePipe` propia |
| **Angular CLI** | Herramienta única para crear, generar, servir y compilar | `ng new`, `ng generate`, `ng serve`, `ng build` |

---

## 2. Angular vs React (mapa de equivalencias)

| Necesitas… | React | Angular |
|---|---|---|
| Definir UI | Función que devuelve JSX | Clase con `@Component` + plantilla HTML |
| Estado local | `useState` | `signal()` |
| Estado derivado | recalcular en el render / `useMemo` | `computed()` |
| Efecto secundario | `useEffect` | `effect()` |
| Pasar datos a un hijo | `props` | `input()` |
| Emitir un evento al padre | prop callback (`onX`) | `output()` |
| Compartir lógica/datos | Context + custom hook | Servicio + DI |
| Enrutar | React Router (externo) | Angular Router (incluido) |
| Sincronizar input ↔ estado | `value` + `onChange` (manual) | `[(ngModel)]` (two-way, nativo) |
| Crear el proyecto | Vite / CRA (externo) | Angular CLI (incluido) |

Frase de cierre: **"framework opinionado" vs "librería flexible"**. Ninguno es mejor;
Angular impone estructura, React te deja decidir.

---

## 3. Conceptos, uno por uno

### 3.1 Componentes y standalone
- Un componente = **clase de TypeScript** decorada con `@Component({ selector, imports, template/templateUrl, styles/styleUrl })`.
- **Standalone** (por defecto desde v17): el componente lista sus dependencias en `imports`
  (otros componentes, directivas, pipes) y **no necesita un `NgModule`**.
- El `selector` es cómo se usa en una plantilla: `<app-product-card />`.

### 3.2 Data binding — los 4 tipos
| Sintaxis | Nombre | Dirección | Ejemplo |
|---|---|---|---|
| `{{ valor }}` | Interpolación | clase → vista | `{{ product().name }}` |
| `[prop]="valor"` | Property binding | clase → vista | `[routerLink]="['/product', id]"` |
| `(evento)="fn()"` | Event binding | vista → clase | `(click)="borrar()"` |
| `[(prop)]="valor"` | Two-way | ambos | `[(ngModel)]="filterText"` |

- `[(ngModel)]` = "banana in a box": es azúcar para `[ngModel]` + `(ngModelChange)`.
- Necesita importar `FormsModule`.
- Desde Angular 17.1, `[(ngModel)]` puede escribir **directamente en un `signal`** (`filterText`), sin `.set()` manual en la plantilla.

### 3.3 Control de flujo: `@for`, `@if`, `@switch`
```html
@for (p of productos(); track p.id) {
  <li>{{ p.name }}</li>
} @empty {
  <li>Lista vacía</li>
}

@if (cargando()) {
  <p>Cargando…</p>
} @else if (error()) {
  <p>Error</p>
} @else {
  <p>Listo</p>
}
```
- Sintaxis moderna (v17+); **reemplaza** `*ngFor` y `*ngIf`.
- **`track` es obligatorio** en `@for`: le dice a Angular cómo identificar cada elemento para
  no volver a dibujar toda la lista cuando cambia (rendimiento). Suele ser `track item.id`.
- `@empty` (lista vacía) y `@else` son bloques opcionales.
- `as` para alias funciona en `@if (expr; as x)`, **no** en `@else if`.

### 3.4 Servicios e inyección de dependencias
- Servicio = clase con lógica de negocio o acceso a datos, **independiente de la vista**.
- `@Injectable({ providedIn: 'root' })` → Angular crea **una sola instancia (singleton)**
  disponible en toda la app.
- **DI**: no haces `new ProductService()`; lo pides y Angular te lo entrega:
  ```ts
  private readonly productService = inject(ProductService);   // forma actual
  // equivalente antiguo: constructor(private productService: ProductService) {}
  ```
- Por qué importa: desacopla (puedes cambiar la implementación), y en tests puedes inyectar un doble.

### 3.5 HttpClient y RxJS / Observables
- `HttpClient` (de `provideHttpClient()`) hace GET/POST/etc.
- Cada petición devuelve un **`Observable`**, no una `Promise`.
- **Observable** = flujo de datos asíncrono. No hace nada hasta que te **suscribes**:
  ```ts
  this.productService.getProducts().subscribe(productos => this.products.set(productos));
  ```
- Diferencias con Promise: un Observable puede emitir **varios valores**, es **cancelable**
  (al desuscribirte) y es **lazy** (no se ejecuta si nadie se suscribe).
- En la demo **no hay backend**: se simula con `of(datos).pipe(delay(300))` — `of()` crea un
  Observable a partir de un valor y `delay()` finge latencia de red.
- Operadores útiles de nombrar (sin profundizar): `map`, `filter`, `switchMap`, `catchError`.

### 3.6 Signals
- Estado reactivo nativo, estable desde v17.
  ```ts
  const count = signal(0);        // crear
  count();                        // leer
  count.set(5);                   // escribir
  count.update(n => n + 1);       // escribir en función del valor anterior

  const doble = computed(() => count() * 2);   // derivado: se recalcula solo

  effect(() => console.log(count()));          // efecto: corre cuando cambian sus dependencias
  ```
- **`computed()`** es *pull* + memorizado: solo recalcula si cambió alguna dependencia y alguien lo lee.
- **`effect()`** es para efectos secundarios (logs, sincronizar con algo externo). Corre después
  de cada cambio de sus dependencias. En la demo se usa para recargar el producto cuando cambia el `id` de la ruta.
- Ventaja frente a la detección de cambios clásica: Angular sabe **exactamente qué señal cambió**
  y actualiza solo esa parte de la vista.
- Comparación React: `signal` ≈ `useState`, `computed` ≈ `useMemo`, `effect` ≈ `useEffect`.

### 3.7 Routing
```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '' },        // comodín: cualquier otra ruta
];

// app.config.ts
provideRouter(routes, withComponentInputBinding())
```
- `<router-outlet />` en la plantilla = hueco donde se dibuja el componente de la ruta activa.
- `routerLink="/product/1"` o `[routerLink]="['/product', id]"` = navegación declarativa (≈ `<Link>`).
- Navegación por código: `inject(Router).navigate(['/product', id])`.
- **Parámetros de ruta** (`:id`): dos formas de leerlos en el componente destino:
  1. **Moderna** — `withComponentInputBinding()` + `id = input.required({ transform: numberAttribute })`.
     El parámetro entra como un `input()` normal.
  2. Clásica — `inject(ActivatedRoute).snapshot.paramMap.get('id')` (o el observable `paramMap`).

### 3.8 Composición: `input()` y `output()`
```ts
// hijo
readonly product = input.required<Product>();          // entrada obligatoria
readonly precio  = input<number>(0);                    // entrada opcional con valor por defecto
readonly comprar = output<Product>();                   // evento hacia el padre

// padre
<app-product-card [product]="p" (comprar)="alCarrito($event)" />
```
- `input()` devuelve una **señal de solo lectura**: en la plantilla del hijo se lee `product()`.
- `output()` reemplaza a `@Output() ... = new EventEmitter()`; se dispara con `this.comprar.emit(valor)`.
- La demo usa solo `input()` (la tarjeta no emite eventos), pero conviene saber la pareja.

### 3.9 Pipes
- Transforman un valor **en la plantilla**: `{{ valor | pipe:arg1:arg2 }}`.
- Integradas comunes: `CurrencyPipe`, `DatePipe`, `DecimalPipe`, `AsyncPipe`, `JsonPipe`, `UpperCasePipe`.
  - `AsyncPipe` es especial: se suscribe a un Observable/Promise y se desuscribe solo → `{{ datos$ | async }}`.
- **Pipe propia** (demo): `TruncatePipe` acorta la descripción.
  ```ts
  @Pipe({ name: 'truncate' })
  export class TruncatePipe implements PipeTransform {
    transform(value: string, limit = 50, suffix = '…'): string {
      return value.length > limit ? value.slice(0, limit).trimEnd() + suffix : value;
    }
  }
  ```
- **Pura vs impura**: por defecto las pipes son *puras* (solo se recalculan si cambian los argumentos) → más eficientes.

### 3.10 Detección de cambios y OnPush
- Angular clásico usa **Zone.js**: tras cualquier evento asíncrono revisa todo el árbol de componentes.
- `ChangeDetectionStrategy.OnPush`: el componente solo se revisa si cambia una `@Input`/`input()`,
  se emite un evento suyo, o cambia un `signal` que usa. Es lo recomendado al usar signals.
- La demo pone `OnPush` en los 4 componentes.
- (Solo mencionar) existe `provideExperimentalZonelessChangeDetection()` para quitar Zone.js.

### 3.11 Angular CLI
| Comando | Para qué |
|---|---|
| `ng new mi-app` | Crear el proyecto (config, git, dependencias) |
| `ng generate component x` / `ng g c x` | Generar componente (clase + plantilla + estilos + spec) |
| `ng generate service x` / `ng g s x` | Generar servicio |
| `ng serve` | Servidor de desarrollo con recarga en caliente (`localhost:4200`) |
| `ng build` | Compilar optimizado para producción (`dist/`) |
| `ng test` | Correr pruebas unitarias (Karma + Jasmine) |

---

## 4. Autoevaluación (las 5 preguntas + respuestas modelo)

**1. Diferencia entre data binding unidireccional y bidireccional. Un ejemplo de cada uno.**
Unidireccional: el dato fluye en un solo sentido. Clase → vista con interpolación `{{ nombre }}`
o property binding `[value]="nombre"`; vista → clase con event binding `(input)="fn($event)"`.
Bidireccional: los dos sentidos a la vez con `[(ngModel)]="nombre"` — si el usuario escribe se
actualiza la variable, y si la variable cambia se actualiza el input. En React no es nativo: se
hace con `value` + `onChange`.

**2. Qué problema resuelve la inyección de dependencias y cómo se hace un servicio disponible para toda la app.**
Resuelve el **acoplamiento** y la creación manual de objetos: los componentes no construyen sus
dependencias (`new`), solo las declaran y Angular las provee, lo que facilita reutilizar lógica y
sustituirla en pruebas. Un servicio se hace global con `@Injectable({ providedIn: 'root' })`, que
crea un **singleton** accesible desde cualquier componente o servicio vía `inject(MiServicio)`.

**3. Una diferencia arquitectónica clave entre Angular y React.**
Vistas: Angular usa **plantillas HTML con directivas** (`@for`, `@if`, bindings) separadas de la
clase; React usa **JSX**, HTML embebido en JavaScript. (Alternativas válidas: Angular es un
framework completo con router/CLI/HTTP incluidos vs React librería; o Angular trae binding
bidireccional y signals nativos vs el modelo unidireccional con hooks de React.)

**4. Qué es un standalone component y qué ventaja ofrece frente a `NgModule`.**
Es un componente que **declara sus propias dependencias en `imports`** y no necesita pertenecer a
un `NgModule`. Ventajas: menos código repetitivo y archivos, dependencias explícitas y locales
(se ve de qué depende cada componente), y árbol de dependencias más simple de entender y de
hacer *lazy loading*. Desde Angular 17 es el comportamiento por defecto.

**5. Cómo se configura una ruta con parámetros y cómo se recupera el parámetro en el componente destino.**
Se define la ruta con un segmento dinámico: `{ path: 'product/:id', component: ProductDetailComponent }`
dentro del array pasado a `provideRouter(routes)`. Para recuperarlo: la forma moderna es activar
`withComponentInputBinding()` y declarar `id = input.required({ transform: numberAttribute })` en
el componente, y el router enlaza el `:id` a ese `input()`. La forma clásica es inyectar
`ActivatedRoute` y leer `route.snapshot.paramMap.get('id')` (o suscribirse a `route.paramMap` si
la ruta puede cambiar sin destruir el componente).

---

## 5. Preguntas extra que podrían caer (con respuesta corta)

- **¿Observable vs Promise?** Observable: múltiples valores, lazy, cancelable, con operadores. Promise: un valor, se ejecuta ya, no cancelable.
- **¿`computed` vs `effect`?** `computed` produce un **valor** derivado (y se memoriza). `effect` no devuelve nada: hace un **efecto secundario** cuando cambian sus dependencias.
- **¿`signal` reemplaza a RxJS?** No. `signal` es para estado en memoria. RxJS sigue siendo la base de `HttpClient` y de flujos de eventos complejos.
- **¿Sigo necesitando `NgModule`?** En proyectos nuevos, no. Todo puede ser standalone.
- **¿Qué hace `track` en `@for`?** Da identidad a cada elemento para que Angular reordene/actualice en vez de recrear toda la lista.
- **¿Qué es `@Injectable`?** El decorador que marca una clase como inyectable (puede recibir dependencias y ser provista por DI).
- **¿Para qué `AsyncPipe`?** Suscribirse a un Observable en la plantilla y desuscribirse automáticamente (evita fugas).
- **¿`ng serve` vs `ng build`?** `serve` = servidor de desarrollo en memoria con recarga. `build` = artefactos optimizados en disco para desplegar.
- **¿Qué es `router-outlet`?** El marcador en la plantilla donde el router dibuja el componente de la ruta activa.
- **¿Two-way binding es mala práctica?** No; es azúcar sobre property + event binding. Para inputs de formulario es cómodo.

---

## 6. Errores y confusiones frecuentes

- Olvidar **llamar la señal**: en la plantilla es `product()`, no `product`. Si ves `[object Object]` o el filtro no reacciona, es esto.
- Olvidar `track` en `@for` → error de compilación.
- Usar `*ngFor` / `*ngIf` (sintaxis vieja) mezclado con la nueva sin necesidad.
- Esperar que `[(ngModel)]` funcione sin importar `FormsModule`.
- Creer que suscribirse a un Observable "lo ejecuta una vez y ya": si es HTTP real, sin desuscribir puede haber fugas (usar `AsyncPipe`, `takeUntilDestroyed()` o `toSignal()`).
- Confundir **DI global** (`providedIn: 'root'`) con proveerlo en un componente (instancia por componente).
- Pensar que Angular = NgModules: eso es Angular "antiguo"; hoy es standalone + signals.
- Decir que Signals es "lo mismo que RxJS": son para cosas distintas (estado vs flujos).

---

## 7. Checklist de repaso rápido (la noche antes)

- [ ] Sé explicar en 20 s **qué es Angular** y en qué se diferencia de React.
- [ ] Puedo nombrar los **4 tipos de binding** con su sintaxis.
- [ ] Sé qué hace `@for` + `track` y `@if` / `@else`.
- [ ] Puedo explicar **DI** y `providedIn: 'root'` sin mirar notas.
- [ ] Sé qué es un **Observable** y por qué no es una Promise.
- [ ] Distingo `signal`, `computed` y `effect`.
- [ ] Sé montar una **ruta con `:id`** y recuperar el parámetro (moderna y clásica).
- [ ] Sé qué es un **standalone component** y su ventaja sobre `NgModule`.
- [ ] Tengo claras las **respuestas a las 5 preguntas evaluativas**.
- [ ] Probé la **demo** al menos una vez de principio a fin (filtro + detalle + `/product/999`).
- [ ] Sé lanzar la demo: `cd 02-demo/product-catalog` → `npm install` → `npx @angular/cli@19 serve`.

---

## 8. Fuentes para profundizar

- [angular.dev](https://angular.dev/) — documentación oficial (guías "Essentials").
- [angular.dev/guide/signals](https://angular.dev/guide/signals)
- [angular.dev/guide/routing](https://angular.dev/guide/routing)
- [angular.dev/guide/di](https://angular.dev/guide/di) — inyección de dependencias.
- [rxjs.dev](https://rxjs.dev/) — Observables y operadores.
