import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly products: Product[] = [
    { id: 1, name: 'Laptop Pro 14"', category: 'Computadores', price: 4200000, description: 'Laptop de alto rendimiento para desarrollo y diseño.' },
    { id: 2, name: 'Mouse Inalámbrico', category: 'Accesorios', price: 89000, description: 'Mouse ergonómico con conexión Bluetooth.' },
    { id: 3, name: 'Teclado Mecánico', category: 'Accesorios', price: 250000, description: 'Teclado mecánico con switches rojos y retroiluminación RGB.' },
    { id: 4, name: 'Monitor 27" 4K', category: 'Pantallas', price: 1650000, description: 'Monitor UHD con panel IPS, ideal para diseño y programación.' },
    { id: 5, name: 'Audífonos Noise Cancelling', category: 'Audio', price: 780000, description: 'Audífonos inalámbricos con cancelación activa de ruido.' },
    { id: 6, name: 'Webcam Full HD', category: 'Accesorios', price: 145000, description: 'Cámara web 1080p con micrófono integrado.' }
  ];

  // Se simula una llamada HTTP real usando RxJS (of + delay),
  // así se explica el patrón de Observables sin depender de un backend.
  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(300));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }
}
