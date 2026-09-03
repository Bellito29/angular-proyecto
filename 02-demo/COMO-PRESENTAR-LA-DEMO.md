# Cómo presentar la demo — Catálogo de Productos en Angular

Guion para exponer la demo en vivo: preparación previa, secuencia en pantalla y
cómo explicar el código archivo por archivo. Complementa a [`GUIA.md`](GUIA.md)
(que documenta cómo instalar y ejecutar) y a la guía de estudio
([`../01-slides/GUIA-DE-ESTUDIO.md`](../01-slides/GUIA-DE-ESTUDIO.md)).

Regla de oro: **la demo no es para leer código línea por línea.** Es para que la
audiencia **vea funcionando** lo que ya explicaste en las slides. Primero se
muestra el comportamiento; después se abre el archivo que lo produce.

---

## 0. Antes de empezar (5 min antes de tu turno)

```bash
cd "02-demo/product-catalog"
npm install                       # si no lo hiciste ya
npx @angular/cli@19 serve
```

- Deja `http://localhost:4200/` **ya abierto** en el navegador, en una pestaña.
- Ten el editor abierto con estos archivos en pestañas, **en este orden**:
  `app.config.ts`, `app.routes.ts`, `product.service.ts`,
  `product-list.component.ts`, `product-list.component.html`,
  `product-card.component.ts`, `product-detail.component.ts`.
- Sube el tamaño de fuente del editor (`Ctrl` con `+`) a ~18–20 px.
- **Plan B:** si `ng serve` falla en vivo, ten una segunda pestaña con la app
  corriendo desde antes y muestra el código sin recompilar. `ng serve` puede
  romper si la ruta del proyecto contiene un `%`.

---

## 1. Guion en vivo (≈3–4 min)

### Paso 1 — Mostrar la app funcionando (30 s)

Con `localhost:4200` en pantalla:

> "Esto es un catálogo de productos hecho 100 % con piezas de Angular: sin
> librerías extra de routing, estado ni HTTP. Son seis productos, cada tarjeta es
> un componente."

- Pasa el mouse por una tarjeta (se ve el `:hover`).
- Señala que la descripción está **cortada con `…`** → "eso es una *pipe* propia".
- Señala el precio formateado en pesos → "esa es la `CurrencyPipe` integrada".

### Paso 2 — El filtro (30 s)

- Escribe `mouse` en el buscador. Queda solo un producto.
- Borra y escribe `xyz`. Aparece "No se encontraron productos."

> "El input está atado al estado con **two-way binding**, `[(ngModel)]`. La lista
> que se ve no es el arreglo original: es un `computed()` que se recalcula solo
> cada vez que cambia el texto del filtro. No escribí ni una línea de 'cuando
> cambie el input, filtra y repinta'."

### Paso 3 — Navegar al detalle (30 s)

- Clic en una tarjeta. Se ve un parpadeo de "Cargando…" y luego el detalle.

> "La URL cambió a `/product/3`. El `3` es un **parámetro de ruta**. Ese breve
> 'Cargando…' es el `delay(300)` de RxJS simulando latencia de red — el servicio
> devuelve un **Observable**, no los datos directos."

- Clic en "← Volver al catálogo" (es un `routerLink`, no recarga la página).

### Paso 4 — Casos límite (20 s)

- En la barra de direcciones: `localhost:4200/product/999` → "Producto no encontrado."
- Luego: `localhost:4200/cualquier-cosa` → redirige al catálogo.

> "`/product/999` es una ruta válida pero el producto no existe: el servicio
> devuelve `undefined` y la plantilla tiene un estado para eso. `/cualquier-cosa`
> no hace match con ninguna ruta y cae en el comodín `**` que redirige a la lista."

---

## 2. Recorrido del código (sigue el flujo de datos, no el orden alfabético)

Explica **7–9 archivos**. Por cada uno: una frase de qué hace y señalar 1–2
líneas clave.

### 2.1 `main.ts` + `app.config.ts` — el arranque

```ts
// main.ts
bootstrapApplication(AppComponent, appConfig);
```

> "Sin `NgModule`. Se arranca un componente raíz y se le pasa una config con los
> *providers* globales."

```ts
// app.config.ts
providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withComponentInputBinding()),
]
```

> "Aquí se **enciende el router** de forma standalone. `withComponentInputBinding()`
> es la parte importante: hace que los parámetros de la URL entren al componente
> como un `input()` normal, sin tener que inyectar `ActivatedRoute`."

### 2.2 `app.routes.ts` + `app.component.html` — el esqueleto de navegación

```ts
export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '' }
];
```

> "Tres rutas: raíz → lista; `product/:id` con segmento dinámico → detalle; `**`
> (comodín) → cualquier otra cosa redirige a la lista."

```html
<!-- app.component.html -->
<main>
  <router-outlet />
</main>
```

> "`<router-outlet />` es el hueco donde el router dibuja el componente de la ruta
> activa. Todo lo demás de la app cuelga de aquí."

### 2.3 `product.model.ts` + `product.service.ts` — los datos

```ts
export interface Product { id: number; name: string; category: string; price: number; description: string; }
```

> "Una interfaz de TypeScript. Angular es TypeScript nativo, así que todo va tipado."

```ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products: Product[] = [ /* 6 productos hardcodeados */ ];

  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(300));
  }
  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id)).pipe(delay(300));
  }
}
```

> - "`@Injectable({ providedIn: 'root' })` → **singleton** para toda la app, y con
>   tree-shaking."
> - "No hay backend. `of(valor)` crea un Observable a partir de un dato y
>   `.pipe(delay(300))` finge 300 ms de red. **Lo importante es la forma**: los
>   métodos devuelven `Observable`, exactamente como lo haría `HttpClient` contra
>   una API real. Cambiar esto por `this.http.get('/api/products')` no tocaría los
>   componentes."

### 2.4 `product-list.component.ts` — signals, computed, DI, suscripción

```ts
export class ProductListComponent {
  private readonly productService = inject(ProductService);          // DI

  private readonly products = signal<Product[]>([]);                 // estado
  readonly filterText = signal('');                                  // estado

  readonly filteredProducts = computed(() => {                       // derivado
    const term = this.filterText().toLowerCase().trim();
    return this.products().filter(p => p.name.toLowerCase().includes(term));
  });

  constructor() {
    this.productService.getProducts().subscribe(products => {        // Observable → signal
      this.products.set(products);
    });
  }
}
```

> - "`inject(ProductService)`: **no hago `new`**. Angular me entrega la instancia.
>   Es la forma actual, en vez de ponerlo en el constructor."
> - "Dos `signal`: la lista cruda y el texto del filtro. Estado reactivo nativo."
> - "`filteredProducts` es un `computed`: **depende** de `filterText()` y de
>   `products()`. Cuando cualquiera cambia, se recalcula solo, y solo si alguien
>   lo está leyendo. No hay 'onChange'."
> - "En el constructor me **suscribo** al Observable del servicio y, cuando llega
>   el valor, lo meto en el signal con `.set()`. Ahí es donde el mundo async de
>   RxJS se conecta con el mundo de signals."

### 2.5 `product-list.component.html` — binding y `@for`

```html
<input type="text" [(ngModel)]="filterText" class="search-input" />

<ul class="product-grid">
  @for (product of filteredProducts(); track product.id) {
    <li><app-product-card [product]="product" /></li>
  } @empty {
    <li class="empty">No se encontraron productos.</li>
  }
</ul>
```

> - "`[(ngModel)]="filterText"` — two-way binding, y como novedad de v17 escribe
>   **directo en el signal**, sin `.set()` en la plantilla. Necesita `FormsModule`
>   en los `imports` del componente."
> - "`@for` con `track product.id`: `track` es **obligatorio**, le dice a Angular
>   cómo identificar cada ítem para no repintar toda la lista al filtrar."
> - "`@empty` es el bloque para lista vacía. Antes había que hacer un `*ngIf` aparte."
> - "`[product]="product"` — property binding: le paso el objeto al componente hijo."

### 2.6 `product-card.component.ts` — `input()`, pipes, plantilla inline

```ts
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, TruncatePipe],
  template: `
    <a class="card" [routerLink]="['/product', product().id]">
      <h3>{{ product().name }}</h3>
      <p class="desc">{{ product().description | truncate: 70 }}</p>
      <p class="price">{{ product().price | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
    </a>`,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
}
```

> - "Componente **de presentación**: solo recibe datos y los muestra. Plantilla y
>   estilos inline porque es chico — patrón habitual."
> - "`input.required<Product>()` es su **entrada**. Devuelve una señal de solo
>   lectura → en la plantilla se lee `product()`, con paréntesis. Reemplaza a
>   `@Input()`."
> - "`[routerLink]="['/product', product().id]"` — navegación declarativa,
>   construye `/product/3`."
> - "Dos pipes en cadena: `| truncate: 70` (propia) y `| currency` (integrada, con
>   símbolo y sin decimales)."
> - "Los estilos de `.card` **no se filtran** a otros componentes: encapsulación
>   por defecto."

### 2.7 `truncate.pipe.ts` — pipe propia

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, suffix = '…'): string {
    if (!value || value.length <= limit) return value;
    return value.slice(0, limit).trimEnd() + suffix;
  }
}
```

> "Una pipe es una clase con `transform(valor, ...args)`. `{{ texto | truncate: 70 }}`
> llama a `transform(texto, 70)`. Es **pura** por defecto: solo se recalcula si
> cambian sus argumentos, no en cada ciclo. Por eso es barata."

### 2.8 `product-detail.component.ts` — parámetro de ruta + `effect`

```ts
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);

  readonly id = input.required({ transform: numberAttribute });      // viene de la URL

  readonly product = signal<Product | undefined>(undefined);
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.id();                                          // dependencia
      this.loading.set(true);
      this.productService.getProductById(id).subscribe(p => {
        this.product.set(p);
        this.loading.set(false);
      });
    });
  }
}
```

> - "`id` es un `input()`, pero **nadie se lo pasa desde una plantilla**: lo llena
>   el router porque activamos `withComponentInputBinding()`. `transform:
>   numberAttribute` convierte el `"3"` de la URL en el número `3`."
> - "`effect()` es para **efectos secundarios**. Lee `this.id()`, así que Angular
>   lo re-ejecuta **cada vez que el id cambia**. Si navego de `/product/2` a
>   `/product/3` sin salir del detalle, el componente no se recrea, pero el
>   `effect` vuelve a correr y pide el producto nuevo."
> - "Dos signals de estado de UI: `loading` y `product`."

### 2.9 `product-detail.component.html` — `@if / @else` anidados

```html
@if (loading()) {
  <p>Cargando…</p>
} @else {
  @if (product(); as p) {
    <h1>{{ p.name }}</h1>
    <p class="price">{{ p.price | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
    <p class="description">{{ p.description }}</p>
  } @else {
    <p>Producto no encontrado.</p>
  }
}
```

> "Tres estados con `@if`/`@else`: cargando / encontrado / no encontrado.
> `@if (product(); as p)` aliasa el resultado como `p` para no llamar `product()`
> cuatro veces."

---

## 3. Frase de cierre de la demo

> "En ~150 líneas propias tenemos: routing con parámetros, inyección de
> dependencias, estado reactivo con signals y derivados con computed, consumo
> async con Observables, dos pipes, composición padre-hijo con `input()`, y
> two-way binding — **todo con piezas que ya venían en Angular**. En React, el
> router, el fetch y parte del estado los habrías traído e integrado tú."

---

## 4. Preguntas que pueden salir de la demo (y respuesta corta)

| Pregunta | Respuesta |
|---|---|
| ¿Por qué `product()` con paréntesis? | Es una señal; leerla es llamarla. Sin paréntesis obtienes la función, no el valor. |
| ¿Por qué el detalle usa `effect` y la lista un `subscribe` en el constructor? | La lista carga una vez. El detalle debe **reaccionar** a cambios del `id` de la ruta; `effect` re-corre cuando cambia su dependencia. |
| ¿Ese `subscribe` no genera fuga de memoria? | Aquí el Observable (`of().pipe(delay)`) **completa** solo, así que no. Con HTTP real que no completa se usaría `AsyncPipe`, `takeUntilDestroyed()` o `toSignal()`. |
| ¿`signal` reemplaza a RxJS? | No. `signal` = estado en memoria. RxJS sigue siendo la base de `HttpClient` y flujos de eventos. |
| ¿Qué pasa si quito `track` del `@for`? | Error de compilación: es obligatorio. |
| ¿Por qué `OnPush` en todos? | Con signals es lo recomendado: Angular solo revisa el componente cuando cambia un signal o input suyo. |
| ¿`[(ngModel)]` sobre un signal no necesita `.set()`? | Desde v17.1 no; el two-way escribe directo en el signal. Requiere `FormsModule`. |
| ¿Dónde está el backend? | No hay. `product.service.ts` tiene los datos y los envuelve en Observables para imitar una API. |

---

## 5. Checklist rápido antes de exponer

- [ ] `npm install` hecho y `ng serve` levanta sin errores.
- [ ] `localhost:4200` abierto en una pestaña; segunda pestaña de respaldo corriendo.
- [ ] Editor con los 7 archivos en pestañas y fuente grande.
- [ ] Probé el flujo completo: filtro `mouse` → clic en producto → `/product/999` → ruta inválida.
- [ ] Sé decir la frase de cierre sin leerla.
- [ ] Repasé las 8 preguntas de la sección 4.
