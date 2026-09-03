import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  // inject(): forma actual de pedir dependencias, sin parámetros en el constructor.
  private readonly productService = inject(ProductService);

  // Signal: estado reactivo nativo de Angular.
  private readonly products = signal<Product[]>([]);
  readonly filterText = signal('');

  // computed(): se recalcula automáticamente cuando cambian los signals de los que depende.
  readonly filteredProducts = computed(() => {
    const term = this.filterText().toLowerCase().trim();
    return this.products().filter(p => p.name.toLowerCase().includes(term));
  });

  constructor() {
    // Suscripción al Observable del servicio; llega "async" simulando una API real.
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }
}
