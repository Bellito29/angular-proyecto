import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    // Los input() requeridos se fijan con setInput antes de la primera detección de cambios.
    fixture.componentRef.setInput('product', {
      id: 1,
      name: 'Producto de prueba',
      category: 'Categoría',
      price: 1000,
      description: 'x'.repeat(200),
    });
    fixture.detectChanges();
  });

  it('muestra el nombre del producto', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h3')?.textContent).toContain('Producto de prueba');
  });

  it('acorta la descripción larga con la pipe truncate', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.desc')?.textContent).toContain('…');
  });
});
