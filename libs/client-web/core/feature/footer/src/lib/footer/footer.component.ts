import { Component, inject } from '@angular/core';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  imports: [RouterLink],
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  faqUrl = this.#appRoutePaths.FAQ();
}
