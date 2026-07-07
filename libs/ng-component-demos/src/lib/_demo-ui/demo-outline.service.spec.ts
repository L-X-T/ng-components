import { DemoOutlineService } from './demo-outline.service';

describe('DemoOutlineService', () => {
  it('collects registered items in order', () => {
    const service = new DemoOutlineService();
    service.register({ id: 'variants', title: 'Variants' });
    service.register({ id: 'sizes', title: 'Sizes' });

    expect(service.outline()).toEqual([
      { id: 'variants', title: 'Variants' },
      { id: 'sizes', title: 'Sizes' },
    ]);
  });

  it('ignores a duplicate id', () => {
    const service = new DemoOutlineService();
    service.register({ id: 'variants', title: 'Variants' });
    service.register({ id: 'variants', title: 'Variants again' });

    expect(service.outline()).toHaveLength(1);
  });
});
