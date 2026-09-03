# Guía de la Demo — Catálogo de Productos en Angular

Esta guía permite a cualquier estudiante reproducir, ejecutar y entender la demo usada en la exposición sobre Angular.

## Objetivo de la demo

Mostrar, en una sola aplicación pequeña, los conceptos fundamentales de Angular explicados en la exposición: **components, standalone components, data binding, directivas de control de flujo (`@for`/`@if`), servicios + inyección de dependencias, RxJS/Observables, forms básicos (two-way binding) y routing con parámetros**. No requiere backend: los datos se simulan dentro del propio servicio.

La app es un catálogo de productos con dos vistas:
- **Lista** (`/`): productos filtrables por nombre.
- **Detalle** (`/product/:id`): información de un producto específico.

## Requisitos

- [Node.js](https://nodejs.org/) v20.11+ o v22.0+ (recomendado v22 LTS).
- npm (incluido con Node).
- Angular CLI — no es necesario instalarlo global, se usa vía `npx` en los comandos de esta guía.
- Editor recomendado: Visual Studio Code.

> **Nota sobre la ruta del proyecto:** evita clonar o mover este repositorio a una ruta que contenga el carácter `%` en el nombre de alguna carpeta (por ejemplo `Mi Carpeta 20% Final`). El servidor de desarrollo de Angular (basado en Vite) intenta decodificar la ruta como una URL, y un `%` sin una secuencia de escape válida detrás produce el error `URI malformed` al ejecutar `ng serve`. `ng build` no se ve afectado, solo `ng serve`.

## Instalación

1. Clona el repositorio y entra a la carpeta de la demo:
   ```bash
   git clone https://github.com/Bellito29/angular-proyecto.git
   cd 02-demo/product-catalog
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Pasos de ejecución

1. Levanta el servidor de desarrollo:
   ```bash
   npx @angular/cli@19 serve
   ```
2. Abre el navegador en `http://localhost:4200/`.
3. Deberías ver el catálogo de productos. Escribe en el buscador para filtrar por nombre, y haz clic en un producto para ver su detalle.

Para compilar la app de producción (opcional):
```bash
npx @angular/cli@19 build
```

## Estructura del proyecto

```
product-catalog/
└── src/app/
    ├── models/
    │   └── product.model.ts        # Interfaz Product
    ├── services/
    │   └── product.service.ts      # Datos + lógica (simula llamadas async con RxJS)
    ├── pipes/
    │   └── truncate.pipe.ts        # Pipe propia: acorta un texto
    ├── components/
    │   ├── product-list/           # Vista de catálogo (lista + filtro)
    │   ├── product-card/           # Tarjeta de un producto (componente hijo con input())
    │   └── product-detail/         # Vista de detalle de un producto
    ├── app.routes.ts               # Definición de rutas
    ├── app.component.ts/html       # Componente raíz (contiene el <router-outlet>)
    └── app.config.ts               # Configuración de la app (providers globales)
```

## Explicación de los conceptos utilizados

### 1. Standalone Components
Ningún componente de esta demo usa `NgModule`. Cada uno declara sus propias dependencias en `imports`. Además todos usan `ChangeDetectionStrategy.OnPush`, que es lo recomendado al trabajar con signals: Angular solo revisa el componente cuando cambia uno de sus signals o entradas.

```ts
// product-list.component.ts
@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent { ... }
```

### 2. Servicios y Dependency Injection
`ProductService` centraliza los datos y se marca como singleton de toda la app con `providedIn: 'root'`. Angular lo inyecta donde se necesite — no se instancia manualmente con `new`. La forma actual de pedirlo es la función `inject()`, en vez de un parámetro de constructor:

```ts
// product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService { ... }

// product-list.component.ts
private readonly productService = inject(ProductService);
```

### 3. RxJS / Observables
En vez de depender de una API real, el servicio simula una respuesta asíncrona usando `of()` (crea un Observable a partir de un valor) y `delay()` (simula latencia de red):

```ts
getProducts(): Observable<Product[]> {
  return of(this.products).pipe(delay(300));
}
```
El componente se suscribe para recibir el valor cuando esté disponible:
```ts
this.productService.getProducts().subscribe(products => {
  this.products.set(products);
});
```

### 4. Signals
El estado de la lista y del filtro se maneja con `signal()`, y la lista filtrada se deriva automáticamente con `computed()` — se recalcula sola cada vez que cambia `filterText` o `products`:

```ts
private readonly products = signal<Product[]>([]);
readonly filterText = signal('');

readonly filteredProducts = computed(() =>
  this.products().filter(p => p.name.toLowerCase().includes(this.filterText().toLowerCase()))
);
```

### 5. Data binding (interpolación, two-way, event)
En `product-list.component.html`, el input de búsqueda usa **two-way binding** para mantener sincronizados el valor del input y el signal `filterText`:

```html
<input type="text" [(ngModel)]="filterText" />
```

### 6. Directivas de control de flujo (`@for` / `@if`)
```html
@for (product of filteredProducts(); track product.id) {
  <li><app-product-card [product]="product" /></li>
} @empty {
  <li>No se encontraron productos.</li>
}
```
El detalle usa `@if` / `@else` anidados para tres estados: cargando, encontrado y no encontrado.
```html
@if (loading()) {
  <p>Cargando…</p>
} @else {
  @if (product(); as p) {
    <h1>{{ p.name }}</h1>
  } @else {
    <p>Producto no encontrado.</p>
  }
}
```

### 7. Composición de componentes con `input()`
`ProductListComponent` no dibuja cada tarjeta: delega en un componente hijo, `ProductCardComponent`, y le pasa el producto por su **entrada**. La entrada se declara con `input()` (una señal de solo lectura) y se lee en la plantilla del hijo como `product()`:

```ts
// product-card.component.ts
readonly product = input.required<Product>();
```
```html
<!-- en la lista -->
<app-product-card [product]="product" />
```

### 8. Pipe personalizada
`TruncatePipe` acorta la descripción en la tarjeta. Es una pipe *pura* (por defecto): Angular solo la reevalúa si cambian sus argumentos.

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, suffix = '…'): string {
    return value.length > limit ? value.slice(0, limit).trimEnd() + suffix : value;
  }
}
```
```html
{{ product().description | truncate: 70 }}
```

### 9. Routing con parámetros
Las rutas se definen sin `NgModule`, con `provideRouter`, y se activa `withComponentInputBinding()` para enlazar los parámetros de ruta a los `input()` del componente:
```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '' }
];

// app.config.ts
provideRouter(routes, withComponentInputBinding())
```
La navegación se hace de forma declarativa con `routerLink`, pasando el id como parámetro dinámico:
```html
<a [routerLink]="['/product', product().id]">{{ product().name }}</a>
```
En el componente de destino, el parámetro `:id` llega como un `input()` (convertido a número con `numberAttribute`). Un `effect()` reacciona a cada cambio de `id` y pide el producto al servicio:
```ts
readonly id = input.required({ transform: numberAttribute });

constructor() {
  effect(() => {
    const id = this.id();
    this.productService.getProductById(id).subscribe(p => this.product.set(p));
  });
}
```

## Cómo probar la app

| Acción | Ruta / Interacción | Qué deberías ver |
|---|---|---|
| Ver catálogo completo | `http://localhost:4200/` | 6 productos en tarjetas (con descripción acortada) |
| Filtrar productos | Escribir "mouse" en el buscador | Solo el producto que coincide |
| Ver detalle | Clic en cualquier producto | Breve "Cargando…" y luego el detalle con precio y descripción |
| Producto inexistente | `http://localhost:4200/product/999` | "Producto no encontrado." |
| Ruta inválida | `http://localhost:4200/algo-que-no-existe` | Redirige al catálogo |

## Referencias

- [Documentación oficial de Angular](https://angular.dev/)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Router](https://angular.dev/guide/routing)
- [RxJS](https://rxjs.dev/)
