import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);

  // input() enlazado al parámetro de ruta ':id' gracias a withComponentInputBinding().
  // transform: numberAttribute convierte el string de la URL en number.
  readonly id = input.required({ transform: numberAttribute });

  readonly product = signal<Product | undefined>(undefined);
  readonly loading = signal(true);

  constructor() {
    // effect(): se re-ejecuta cada vez que cambia el signal id
    // (por ejemplo, al navegar de un producto a otro sin salir del detalle).
    effect(() => {
      const id = this.id();
      this.loading.set(true);
      this.productService.getProductById(id).subscribe(product => {
        this.product.set(product);
        this.loading.set(false);
      });
    });
  }
}
