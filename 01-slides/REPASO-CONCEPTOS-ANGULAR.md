# Angular — repaso completo de conceptos

Repaso conceptual amplio para preparar la exposición. Es el material de fondo;
para respuestas modelo y autoevaluación ver [`GUIA-DE-ESTUDIO.md`](GUIA-DE-ESTUDIO.md),
y para el guion hablado [`GUION-HABLADO.md`](GUION-HABLADO.md).

---

## 1. ¿Qué es Angular?

Framework **frontend completo**, basado en **TypeScript**, mantenido por **Google**.
Sirve para construir **Single Page Applications (SPA)**: la página se carga una vez
y luego el JavaScript reescribe el DOM y cambia de "pantalla" sin recargar.

La idea clave de toda la charla:

> **Angular es un framework "con todo incluido"; React es una librería de UI y tú
> integras el resto.**

De fábrica trae: sistema de componentes, router, dos sistemas de formularios,
cliente HTTP, sistema de testing, CLI, i18n, animaciones, SSR (Angular Universal /
`@angular/ssr`). Con React eliges y pegas cada pieza por separado.

**Angular moderno (v17+)** se apoya en dos pilares nuevos: **standalone components**
(sin `NgModule`) y **signals** (estado reactivo nativo). La demo del repo usa
Angular 19 con esa arquitectura.

---

## 2. Arquitectura: los bloques de construcción

| Bloque | Rol |
|---|---|
| **Componente** | Une lógica (clase TS) + vista (plantilla HTML) + estilos. Es la unidad de UI. |
| **Plantilla** | HTML enriquecido con bindings, control de flujo y directivas. |
| **Directiva** | Modifica el comportamiento/apariencia de un elemento del DOM. |
| **Pipe** | Transforma un valor para mostrarlo en la plantilla. |
| **Servicio** | Lógica o datos reutilizables, fuera de la vista. |
| **Inyección de dependencias** | El mecanismo que entrega servicios a quien los pide. |
| **Router** | Mapea URLs a componentes. |
| **Módulo (`NgModule`)** | Agrupador clásico. **En Angular moderno ya no se usa** en proyectos nuevos. |

Flujo de arranque: `main.ts` → `bootstrapApplication(App, appConfig)` → `appConfig`
registra *providers* globales (`provideRouter`, `provideHttpClient`, …) → se
renderiza el componente raíz en `<app-root>` de `index.html`.

---

## 3. Componentes y standalone

Un componente es una **clase de TypeScript** decorada con `@Component`:

```ts
@Component({
  selector: 'app-product-card',        // cómo se usa: <app-product-card />
  standalone: true,                    // implícito en v17+
  imports: [CurrencyPipe, RouterLink], // sus dependencias, explícitas
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
}
```

- **Standalone**: el componente declara en `imports` lo que su plantilla necesita
  (otros componentes, directivas, pipes). **No necesita `NgModule`**. Es el
  comportamiento por defecto desde v17.
- Ventajas frente a `NgModule`: menos boilerplate, dependencias locales y
  visibles, *lazy loading* más simple.
- `selector`: nombre del elemento en la plantilla del padre.
- La plantilla puede ser inline (`template: '...'`) o externa (`templateUrl`).
  Igual con estilos.
- **Encapsulación de estilos**: por defecto (`ViewEncapsulation.Emulated`) los
  estilos del componente **no se filtran** a otros componentes.

### Ciclo de vida (hooks principales)

| Hook | Cuándo corre |
|---|---|
| `constructor` | Al crear la clase (aún sin inputs resueltos). |
| `ngOnInit` | Una vez, tras el primer set de inputs. Inicialización. |
| `ngOnChanges` | Cada vez que cambia un `@Input` (no aplica a `input()` signals). |
| `ngAfterViewInit` | Cuando la vista y los `@ViewChild` ya existen. |
| `ngOnDestroy` | Al destruir el componente. Limpieza (desuscripciones). |

Con signals y `effect()` muchos de estos hooks se usan menos.

---

## 4. Data binding — los 4 tipos

| Sintaxis | Nombre | Dirección | Ejemplo |
|---|---|---|---|
| `{{ valor }}` | Interpolación | clase → vista | `{{ product().name }}` |
| `[prop]="valor"` | Property binding | clase → vista | `[routerLink]="['/product', id]"` |
| `(evento)="fn($event)"` | Event binding | vista → clase | `(click)="comprar()"` |
| `[(prop)]="valor"` | Two-way | ambos sentidos | `[(ngModel)]="filterText"` |

- **Property binding vs atributo HTML**: `[value]="x"` escribe la *propiedad* del
  DOM, no el atributo. Para atributos puros: `[attr.aria-label]="x"`.
- **Two-way** `[(ngModel)]` = "banana in a box". Es azúcar para `[ngModel]="x"` +
  `(ngModelChange)="x = $event"`. Requiere importar `FormsModule`.
- Desde v17.1, `[(ngModel)]` puede escribir **directamente sobre un `signal`** sin
  `.set()` manual.
- **Class y style binding**: `[class.active]="isActive()"`, `[style.width.px]="w()"`,
  `[ngClass]`, `[ngStyle]`.

React no tiene two-way nativo: se simula con `value` + `onChange`.

---

## 5. Control de flujo en plantillas (`@for`, `@if`, `@switch`)

Sintaxis moderna (v17+). **Reemplaza** `*ngFor`, `*ngIf`, `*ngSwitch`. Es parte
del lenguaje de plantillas, no directivas que haya que importar.

```html
@if (loading()) {
  <p>Cargando…</p>
} @else if (error()) {
  <p>Error al cargar</p>
} @else {
  <ul>
    @for (p of products(); track p.id) {
      <li>{{ p.name }}</li>
    } @empty {
      <li>No hay productos</li>
    }
  </ul>
}

@switch (status()) {
  @case ('ok')      { <p>Listo</p> }
  @case ('loading') { <p>…</p> }
  @default          { <p>Desconocido</p> }
}
```

- **`track` es obligatorio en `@for`**. Le dice a Angular cómo identificar cada
  ítem para reordenar/actualizar el DOM en vez de recrearlo entero. Normalmente
  `track item.id`.
- Variables implícitas en `@for`: `$index`, `$first`, `$last`, `$even`, `$odd`,
  `$count`.
- `@empty` y `@else` son opcionales.
- `@if (getUser() ; as user)` permite aliasar el resultado (no funciona en
  `@else if`).
- `@defer { ... }` — carga diferida de un bloque (y su JS) según un *trigger*:
  `@defer (on viewport)`, `on idle`, `on interaction`, `when cond()`. Bloques
  `@placeholder`, `@loading`, `@error`.

### Directivas (siguen existiendo)

- **De atributo**: cambian apariencia/comportamiento — `ngClass`, `ngStyle`,
  `ngModel`, `routerLink`, y las tuyas (`@Directive`).
- **Estructurales clásicas** (`*ngIf`, `*ngFor`): aún soportadas, pero el control
  de flujo nuevo es lo recomendado.

---

## 6. Pipes

Transforman un valor **en la plantilla**: `{{ valor | pipe:arg1:arg2 }}`. Se
pueden encadenar.

- **Integradas comunes**: `CurrencyPipe`, `DatePipe`, `DecimalPipe` (`number`),
  `PercentPipe`, `UpperCasePipe`, `LowerCasePipe`, `TitleCasePipe`, `SlicePipe`,
  `JsonPipe`, `KeyValuePipe`, `AsyncPipe`.
- **`AsyncPipe`** es especial: se suscribe a un `Observable`/`Promise` y **se
  desuscribe solo** → `{{ data$ | async }}`. Evita fugas de memoria.
- **Pipe propia**:

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, suffix = '…'): string {
    return value.length > limit ? value.slice(0, limit).trimEnd() + suffix : value;
  }
}
```

- **Pura (por defecto) vs impura**: una pipe pura solo se recalcula si cambian sus
  argumentos (referencia). Más eficiente. Una impura (`pure: false`) corre en cada
  ciclo de detección — usar con cuidado.

---

## 7. Servicios e Inyección de dependencias (DI)

**Servicio**: clase con lógica de negocio o acceso a datos, **independiente de la
vista**. Reutilizable y testeable.

```ts
@Injectable({ providedIn: 'root' })   // singleton en toda la app
export class ProductService {
  private readonly http = inject(HttpClient);
  getProducts(): Observable<Product[]> { return this.http.get<Product[]>('/api/products'); }
}
```

**DI**: no haces `new ProductService()`. Lo pides y Angular te entrega la instancia:

```ts
export class ProductListComponent {
  private readonly productService = inject(ProductService);   // forma actual
  // equivalente clásico: constructor(private productService: ProductService) {}
}
```

- **`providedIn: 'root'`** → una sola instancia (singleton) para toda la app, con
  *tree-shaking* (si nadie la usa, no entra al bundle).
- También se puede proveer en `providers:` de un componente → **una instancia por
  componente** (y sus hijos).
- **Jerarquía de inyectores**: Angular busca el token desde el inyector del
  componente hacia arriba hasta el root.
- **Tokens**: normalmente la clase misma. Para valores no-clase se usa
  `InjectionToken`.
- Por qué importa: **desacopla** (puedes cambiar la implementación) y en tests
  puedes inyectar un **doble/mock**.

Equivalente conceptual en React: Context + custom hook.

---

## 8. HttpClient y RxJS / Observables

- Se habilita con `provideHttpClient()` en `appConfig`. `HttpClient` hace
  `get/post/put/delete/patch`.
- **Cada petición devuelve un `Observable`**, no una `Promise`.

**Observable** = flujo de datos asíncrono. Es **lazy**: no hace nada hasta que te
**suscribes**.

```ts
this.productService.getProducts().subscribe(products => this.products.set(products));
```

| | Observable | Promise |
|---|---|---|
| Valores | Muchos (un stream) | Uno |
| Ejecución | Lazy (al suscribir) | Eager (ya) |
| Cancelable | Sí (`unsubscribe`) | No |
| Operadores | Sí (RxJS) | No |

- **Operadores** (en `.pipe(...)`): `map`, `filter`, `tap`, `switchMap`,
  `mergeMap`, `catchError`, `retry`, `debounceTime`, `distinctUntilChanged`,
  `combineLatest`, `forkJoin`.
- **Creación**: `of(valor)`, `from(promesa)`, `interval(ms)`. En la demo **no hay
  backend**: se simula con `of(data).pipe(delay(300))`.
- **Fugas de memoria**: un `subscribe` manual a un stream que no completa hay que
  cerrarlo. Opciones: `AsyncPipe`, `takeUntilDestroyed()`, o convertir a signal
  con `toSignal()`.
- **Interceptores** (`withInterceptors([...])`): middleware para toda petición —
  añadir token de auth, logging, manejo de errores central.

---

## 9. Signals — reactividad nativa

Estable desde v17. Es el modelo de estado recomendado hoy.

```ts
const count = signal(0);          // crear
count();                          // leer (¡con paréntesis!)
count.set(5);                     // escribir
count.update(n => n + 1);         // escribir según el valor previo

const double = computed(() => count() * 2);   // derivado: se recalcula solo, memorizado

effect(() => console.log(count()));           // efecto secundario al cambiar dependencias
```

- **`computed()`**: *pull* + memorizado. Solo recalcula si una dependencia cambió
  **y** alguien lo lee. Produce un **valor**.
- **`effect()`**: para efectos secundarios (logging, sincronizar con algo externo,
  `localStorage`). No devuelve valor. Corre tras cada cambio de sus dependencias.
  Se limpia solo al destruir el contexto.
- Ventaja frente a la detección de cambios clásica: Angular sabe **exactamente qué
  señal cambió** y actualiza solo esa parte de la vista → *fine-grained
  reactivity*.

### Signals en la API de componentes

```ts
readonly product = input.required<Product>();       // entrada obligatoria (reemplaza @Input)
readonly discount = input<number>(0);               // entrada opcional con default
readonly buy = output<Product>();                   // evento al padre (reemplaza @Output/EventEmitter)
readonly name = model<string>('');                  // input + output combinados → two-way

// padre:
// <app-product-card [product]="p" (buy)="addToCart($event)" />
```

- `input()` devuelve una **señal de solo lectura**: en la plantilla del hijo se
  lee `product()`.
- `output().emit(valor)` dispara el evento.
- `model()` habilita `[(prop)]` en componentes propios.
- **Consultas**: `viewChild()`, `viewChildren()`, `contentChild()` como signals.
- **Puente con RxJS**: `toSignal(obs$)` y `toObservable(sig)`.

Mapa mental React: `signal` ≈ `useState`, `computed` ≈ `useMemo`, `effect` ≈
`useEffect`, `input()` ≈ `props`, `output()` ≈ prop callback.

---

## 10. Detección de cambios

- **Clásico (Zone.js)**: Zone.js parchea APIs async (eventos, `setTimeout`, XHR).
  Tras cualquier evento async, Angular revisa **todo el árbol** de componentes
  buscando cambios.
- **`ChangeDetectionStrategy.OnPush`**: el componente solo se revisa si (a) cambia
  una referencia de `@Input`/`input()`, (b) se emite un evento desde su plantilla,
  (c) cambia un `signal` que lee, o (d) se marca manualmente. Recomendado con
  signals. La demo lo usa en los 4 componentes.
- **Zoneless** (`provideZonelessChangeDetection()`, ya estable en versiones
  recientes): sin Zone.js; los signals y eventos disparan la actualización. Menos
  overhead, bundle más chico.

---

## 11. Routing

```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), // lazy
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },   // comodín: cualquier otra ruta
];

// app.config.ts
provideRouter(routes, withComponentInputBinding())
```

- `<router-outlet />` = hueco donde se dibuja el componente de la ruta activa.
  Puede haber rutas hijas con outlets anidados.
- **Navegación declarativa**: `routerLink="/product/1"` o
  `[routerLink]="['/product', id]"` (≈ `<Link>`). `routerLinkActive="clase-activa"`
  para resaltar el enlace actual.
- **Navegación por código**: `inject(Router).navigate(['/product', id])`.
- **Parámetros de ruta `:id`** — dos formas de leerlos:
  1. **Moderna**: `withComponentInputBinding()` + `id = input.required({ transform:
     numberAttribute })`. El parámetro llega como un `input()` normal.
  2. **Clásica**: `inject(ActivatedRoute).snapshot.paramMap.get('id')`, o el
     observable `route.paramMap` si la ruta puede cambiar sin recrear el componente.
- **Query params**: `?q=texto` → `route.snapshot.queryParamMap` o
  `[queryParams]="{ q: 'x' }"`.
- **Guards** (funciones): `canActivate`, `canDeactivate` (evitar salir con cambios
  sin guardar), `canMatch`.
- **Resolvers**: precargar datos antes de activar la ruta.
- **Lazy loading**: `loadComponent` / `loadChildren` → el código de esa sección se
  descarga solo al visitarla.

---

## 12. Formularios (dos sistemas)

Angular trae **dos** módulos de formularios. No se mezclan en el mismo control.

### Template-driven (`FormsModule`)
- Lógica en la plantilla con `[(ngModel)]`, `#form="ngForm"`, `required`,
  `minlength`.
- Simple, bueno para formularios chicos. Es el que usa la demo (solo el input de
  filtro).

### Reactive forms (`ReactiveFormsModule`)
- El modelo del formulario vive en la clase, tipado y explícito.

```ts
form = inject(FormBuilder).group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
});
// this.form.value, this.form.valid, this.form.get('email')?.errors
```

- Preferido en apps grandes: testeable, validadores compuestos, `valueChanges`
  como Observable, validación async.
- Estados de un control: `pristine/dirty`, `touched/untouched`, `valid/invalid`,
  `pending`.

---

## 13. Angular CLI y estructura del proyecto

| Comando | Para qué |
|---|---|
| `ng new mi-app` | Crea el proyecto (config, git, deps, testing). |
| `ng generate component x` / `ng g c x` | Genera componente (clase + plantilla + estilos + spec). |
| `ng g s x` / `ng g service x` | Genera servicio. |
| `ng g pipe`, `ng g directive`, `ng g guard`, `ng g interceptor` | Otros artefactos. |
| `ng serve` | Servidor de desarrollo con *hot reload* (`localhost:4200`). |
| `ng build` | Build optimizado para producción (`dist/`): minificado, tree-shaking, hashing. |
| `ng test` | Pruebas unitarias (Karma + Jasmine por defecto). |
| `ng e2e` | Pruebas end-to-end (según el runner elegido). |
| `ng update` | Migraciones asistidas entre versiones. |
| `ng add <paquete>` | Instala y configura una librería (p. ej. `ng add @angular/material`). |

Estructura típica (`ng new`):

```
src/
  main.ts              ← bootstrapApplication(App, appConfig)
  index.html           ← <app-root></app-root>
  styles.css           ← estilos globales
  app/
    app.component.ts    ← componente raíz
    app.config.ts       ← providers globales (router, http, …)
    app.routes.ts       ← definición de rutas
angular.json           ← configuración de build/serve/test
tsconfig.json          ← configuración de TypeScript
```

El CLI usa **esbuild/Vite** internamente en versiones recientes (builds mucho más
rápidos que el viejo Webpack).

---

## 14. Angular vs React — mapa de equivalencias

| Necesitas… | React | Angular |
|---|---|---|
| Definir UI | Función que devuelve JSX | Clase `@Component` + plantilla HTML |
| Estado local | `useState` | `signal()` |
| Estado derivado | `useMemo` / recalcular en render | `computed()` |
| Efecto secundario | `useEffect` | `effect()` |
| Pasar datos a un hijo | `props` | `input()` |
| Emitir evento al padre | prop callback (`onX`) | `output()` |
| Two-way en un input propio | `value` + `onChange` (manual) | `model()` / `[(ngModel)]` |
| Compartir lógica/datos | Context + custom hook | Servicio + DI |
| Enrutar | React Router (externo) | Angular Router (incluido) |
| HTTP | `fetch` / axios (externo) | `HttpClient` (incluido) |
| Crear el proyecto | Vite / CRA (externo) | Angular CLI (incluido) |
| Lenguaje | JS/TS opcional | TypeScript nativo |
| Vistas | JSX (HTML en JS) | Plantillas HTML + directivas (separadas de la clase) |

Frase de cierre: **"framework opinionado" vs "librería flexible"**. Ninguno es
mejor; Angular impone estructura, React te deja decidir.

---

## 15. Errores y confusiones frecuentes

- **Olvidar llamar la señal**: en la plantilla es `product()`, no `product`. Si
  ves `[object Object]` o el filtro no reacciona, es esto.
- **Olvidar `track` en `@for`** → error de compilación.
- Esperar que `[(ngModel)]` funcione **sin importar `FormsModule`**.
- Mezclar `*ngIf`/`*ngFor` viejos con `@if`/`@for` nuevos sin necesidad.
- Creer que suscribirse a un Observable "lo ejecuta una vez y ya": con HTTP real,
  sin desuscribir puede haber fugas → usar `AsyncPipe`, `takeUntilDestroyed()` o
  `toSignal()`.
- Confundir **DI global** (`providedIn: 'root'`, singleton) con proveer en un
  componente (instancia por componente).
- Pensar que "Angular = NgModules": eso es Angular antiguo; hoy es **standalone +
  signals**.
- Decir que "Signals reemplaza a RxJS": son para cosas distintas — **estado en
  memoria** vs **flujos de eventos/async**.
- `computed` vs `effect`: `computed` produce un **valor** (memorizado); `effect`
  hace un **efecto secundario** y no devuelve nada.
- Mezclar `FormsModule` y `ReactiveFormsModule` en el mismo control.

---

## 16. Checklist de repaso (la noche antes)

- [ ] Explicar en 20 s **qué es Angular** y su diferencia con React.
- [ ] Nombrar los **4 tipos de binding** con su sintaxis.
- [ ] `@for` + `track`, `@if` / `@else`, `@switch`.
- [ ] **DI** y `providedIn: 'root'` sin notas.
- [ ] **Observable** y por qué no es una Promise.
- [ ] Distinguir `signal`, `computed`, `effect`.
- [ ] Ruta con `:id` y recuperar el parámetro (moderna y clásica).
- [ ] **Standalone component** y su ventaja sobre `NgModule`.
- [ ] Las **5 preguntas evaluativas** ([../03-preguntas-evaluativas.md](../03-preguntas-evaluativas.md)) respondidas.
- [ ] Correr la **demo** de principio a fin: filtro + detalle + `/product/999`.

---

## 17. Fuentes para profundizar

- [angular.dev](https://angular.dev/) — documentación oficial (guías "Essentials").
- [angular.dev/guide/signals](https://angular.dev/guide/signals)
- [angular.dev/guide/routing](https://angular.dev/guide/routing)
- [angular.dev/guide/di](https://angular.dev/guide/di) — inyección de dependencias.
- [rxjs.dev](https://rxjs.dev/) — Observables y operadores.
