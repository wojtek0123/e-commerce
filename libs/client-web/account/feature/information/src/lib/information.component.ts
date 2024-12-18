import { Component } from '@angular/core';
import { AccountDataComponent } from './components/account-data/account-data.component';
import { AddressesComponent } from './components/addresses/addresses.component';

@Component({
  selector: 'lib-information',
  standalone: true,
  imports: [AccountDataComponent, AddressesComponent],
  templateUrl: './information.component.html',
})
export class InformationComponent {}
