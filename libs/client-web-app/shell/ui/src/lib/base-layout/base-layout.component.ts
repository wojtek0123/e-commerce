import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'lib-base-layout',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <lib-e-commerce-nav />
    <div class="px-4">
      <router-outlet />
    </div>
  `,
})
export class BaseLayoutComponent {}
