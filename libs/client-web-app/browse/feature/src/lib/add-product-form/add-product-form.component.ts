import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowseDataAccessService } from '@e-commerce/client-web-app/browse/data-access';

@Component({
  selector: 'e-commerce-client-web-app-browse-feature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product-form.component.html',
})
export class AddProductFormComponent {
  fb = inject(FormBuilder);
  browseAccessDataService = inject(BrowseDataAccessService);
  form = this.fb.group({
    name: this.fb.control(''),
    description: this.fb.control(''),
    price: this.fb.control(0),
  });
  fileToUpload: File | null = null;

  handleFileInput(target: EventTarget | null) {
    const file = (target as HTMLInputElement).files?.item(0);
    const imagePattern = `/(jpg|jpeg|png)$/i`;

    if (!file?.type.match(imagePattern)) return;

    this.fileToUpload = file;
  }

  async onSubmit() {
    const name = this.form.value.name;
    const description = this.form.value.description;
    const price = this.form.value.price;

    if (!name) return;
    if (!description) return;
    if (!price) return;
    if (!this.fileToUpload) return;

    const image = await this.browseAccessDataService.uploadImage(
      this.fileToUpload,
      name
    );

    this.browseAccessDataService
      .createProduct(name, description, price, image.path)
      .subscribe((data) => console.log(data));
  }
}
