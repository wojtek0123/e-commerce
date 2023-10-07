import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LayoutComponent } from './layout/layout.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    LayoutComponent,
    ButtonModule,
    CommonModule,
  ],
  selector: 'e-commerce-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private primengConfig = inject(PrimeNGConfig);
  title = 'client-web-app';

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
