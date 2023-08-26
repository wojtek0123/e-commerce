import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ClientWebAppBrowseFeatureComponent } from '@e-commerce/client-web-app/browse/feature';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    ClientWebAppBrowseFeatureComponent,
  ],
  selector: 'e-commerce-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client-web-app';
}
