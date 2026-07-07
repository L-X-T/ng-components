import { slugify } from './slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Form field')).toBe('form-field');
  });

  it('collapses non-alphanumerics and trims edges', () => {
    expect(slugify('  Variants & Sizes!  ')).toBe('variants-sizes');
  });
});
