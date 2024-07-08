import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'e-commerce-shell',
  standalone: true,
  imports: [ButtonModule, RouterOutlet, NgIf],
  template: `
    <div
      class="flex flex-column-reverse gap-3 xl:grid xl:flex-row xl:mb-0 xl:gap-0 height-content"
    >
      <div class="xl:col-6 h-full">
        <router-outlet></router-outlet>
      </div>
      <div
        class="border-round overflow-hidden flex align-items-start h-full xl:col-6 xl:justify-content-end"
      >
        <img
          class="border-round overflow-hidden object-fit-cover object-position-center w-full h-full"
          src="../../assets/auth-books.jpg"
          alt="book store"
        />
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep input {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
