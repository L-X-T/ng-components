import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, TitleStrategy } from '@angular/router';
import { DemoTitleStrategy } from './demo-title.strategy';

@Component({ template: '' })
class Empty {}

describe('DemoTitleStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TitleStrategy, useClass: DemoTitleStrategy },
        provideRouter([
          { path: 'components/button', title: 'Button', component: Empty },
          { path: 'untitled', component: Empty },
        ]),
      ],
    });
  });

  it('appends the site name to the route title', async () => {
    await TestBed.inject(Router).navigateByUrl('/components/button');

    expect(TestBed.inject(Title).getTitle()).toBe('Button – ng-components');
  });

  it('falls back to the site name without a route title', async () => {
    await TestBed.inject(Router).navigateByUrl('/untitled');

    expect(TestBed.inject(Title).getTitle()).toBe('ng-components');
  });
});
