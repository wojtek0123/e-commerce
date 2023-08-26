import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowseDataAccessService } from '@e-commerce/client-web-app/browse/data-access';

@Component({
  selector: 'e-commerce-client-web-app-browse-feature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-web-app-browse-feature.component.html',
  styleUrls: ['./client-web-app-browse-feature.component.css'],
})
export class ClientWebAppBrowseFeatureComponent {
  fb = inject(FormBuilder);
  browseAccessDataService = inject(BrowseDataAccessService);
  form = this.fb.group({
    name: this.fb.control(''),
    description: this.fb.control(''),
    price: this.fb.control(0),
  });

  onSubmit() {
    console.log('submitted');
    console.log(this.form.value);
    const name = this.form.value.name;
    const description = this.form.value.description;
    const price = this.form.value.price;

    if (!name) return;
    if (!description) return;
    if (!price) return;

    this.browseAccessDataService
      .createProduct(name, description, price)
      .subscribe((data) => console.log(data));
  }
}
