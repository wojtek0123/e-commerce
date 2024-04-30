import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'lib-base-layout',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  styles: [
    `
      .container {
        min-height: calc(100svh - var(--header-height));
      }
    `,
  ],
  template: `
    <lib-e-commerce-nav class="sticky top-0" />
    <div class="p-4 container">
      <router-outlet />
    </div>
  `,
})
export class BaseLayoutComponent {}
