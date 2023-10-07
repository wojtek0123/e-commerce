import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'e-commerce-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterModule, ButtonModule, DividerModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {}
