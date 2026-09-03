import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';

/**
 * Componente hijo "de presentación": solo recibe datos y los muestra.
 * Se escribe con plantilla y estilos en línea porque es pequeño (patrón habitual).
 */
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, TruncatePipe],
  template: `
    <a class="card" [routerLink]="['/product', product().id]">
      <h3>{{ product().name }}</h3>
      <p class="category">{{ product().category }}</p>
      <p class="desc">{{ product().description | truncate: 70 }}</p>
      <p class="price">{{ product().price | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
    </a>
  `,
  styles: `
    .card {
      display: block;
      background: #fff;
      border: 1px solid #e4e7eb;
      border-radius: 8px;
      padding: 1rem;
      color: inherit;
      transition: box-shadow 0.15s ease;
    }
    .card:hover { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); }
    h3 { margin: 0 0 0.3rem; }
    .category { color: #616e7c; font-size: 0.85rem; margin: 0 0 0.5rem; }
    .desc { color: #3e4c59; font-size: 0.9rem; margin: 0 0 0.5rem; line-height: 1.4; }
    .price { font-weight: 600; color: #d6001c; margin: 0; }
  `,
})
export class ProductCardComponent {
  // input() de señal: la entrada del componente. En la plantilla se lee como product().
  readonly product = input.required<Product>();
}
