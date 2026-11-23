import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DemoApi } from './demo-api';
import { DemoApiItem } from './demo-api-item';

@Component({
  imports: [DemoApi, DemoApiItem],
  template: `
    <ngc-demo-api>
      <ngc-demo-api-item name="variant" type="'default' | 'ghost'" default="'default'" description="Visual style" />
    </ngc-demo-api>
  `,
})
class Host {}

describe('DemoApi', () => {
  it('renders the column headers and a projected row', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const headers = Array.from(element.querySelectorAll('.ngc-demo-api__cell--head')).map((cell) =>
      cell.textContent?.trim(),
    );
    expect(headers).toEqual(['Name', 'Type', 'Default', 'Description']);

    expect(element.querySelector('.ngc-demo-api__cell--name code')?.textContent).toBe('variant');
    expect(element.textContent).toContain('Visual style');
  });

  it('exposes a complete ARIA table structure', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const table = element.querySelector('[role="table"]') as HTMLElement;
    const rows = Array.from(table.querySelectorAll('[role="row"]'));
    expect(rows.length).toBe(2);

    // Header row: four columnheaders, nothing loose outside a row.
    expect(rows[0].querySelectorAll('[role="columnheader"]').length).toBe(4);
    expect(table.querySelectorAll(':scope > [role="columnheader"]').length).toBe(0);

    // Data row: four cells.
    expect(rows[1].querySelectorAll('[role="cell"]').length).toBe(4);
  });
});
