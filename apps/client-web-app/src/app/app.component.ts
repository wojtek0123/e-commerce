import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LayoutComponent } from './layout/layout.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, LayoutComponent],
  selector: 'e-commerce-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client-web-app';
}
