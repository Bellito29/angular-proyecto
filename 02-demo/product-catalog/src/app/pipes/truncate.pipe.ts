import { Pipe, PipeTransform } from '@angular/core';

/**
 * Acorta un texto a `limit` caracteres y le añade un sufijo.
 * Es una pipe "pura" (por defecto): Angular solo la vuelve a evaluar
 * cuando cambian sus argumentos, no en cada ciclo de detección de cambios.
 *
 * Uso en plantilla:  {{ producto.description | truncate:70 }}
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, suffix = '…'): string {
    if (!value || value.length <= limit) {
      return value;
    }
    return value.slice(0, limit).trimEnd() + suffix;
  }
}
