import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'e-commerce-shell',
  standalone: true,
  imports: [ButtonModule, TabMenuModule, NgIf],
  templateUrl: './shell.component.html',
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
