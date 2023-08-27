import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvvxjwoqcsvhrocqgmje.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnhqd29xY3N2aHJvY3FnbWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NzE5OTgsImV4cCI6MjAwNTQ0Nzk5OH0.MvKn3BbnST-gFv_nEIo3o4Pp90KeibSKiTjCHeDhhTk'
);

@Injectable({ providedIn: 'root' })
export class BrowseDataAccessService {
  private http = inject(HttpClient);

  async uploadImage(image: File, name: string) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`${name}/${image.name}`, image);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  createProduct(
    name: string,
    description: string,
    price: number,
    image: string
  ) {
    const body = {
      name,
      description,
      price,
      image,
    };

    return this.http.post('http://localhost:3000/products', body);
  }
}
