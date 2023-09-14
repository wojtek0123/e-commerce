import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../nav/navbar.component';

@Component({
  selector: 'e-commerce-layout',
  templateUrl: './layout.component.html',
  imports: [RouterModule, NavComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
