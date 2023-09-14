import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IconButtonComponent,
  ButtonDirective,
  DividerComponent,
} from '@e-commerce/shared/ui';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'e-commerce-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    CommonModule,
    IconButtonComponent,
    ButtonDirective,
    DividerComponent,
    RouterModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {}
