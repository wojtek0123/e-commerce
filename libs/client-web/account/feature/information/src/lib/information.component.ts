import { Component } from '@angular/core';
import { AccountDataComponent } from '@e-commerce/client-web/account/domain/account-data';
import { AddressesComponent } from '@e-commerce/client-web/account/domain/addresses';

@Component({
  selector: 'lib-information',
  standalone: true,
  imports: [AccountDataComponent, AddressesComponent],
  templateUrl: './information.component.html',
})
export class InformationComponent {}
