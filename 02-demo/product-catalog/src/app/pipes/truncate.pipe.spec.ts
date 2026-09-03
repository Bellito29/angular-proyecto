import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('deja el texto corto sin cambios', () => {
    expect(pipe.transform('hola', 10)).toBe('hola');
  });

  it('acorta el texto largo y añade el sufijo', () => {
    expect(pipe.transform('abcdefghij', 5)).toBe('abcde…');
  });
});
