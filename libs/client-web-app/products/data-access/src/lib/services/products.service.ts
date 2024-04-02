import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { supabase } from 'libs/shared/data-access/src/lib/supabase';
import { products } from '../data/dummy-data';
import { of } from 'rxjs';
import { Product } from '@e-commerce/client-web-app/shared/api-types';

interface CreateProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
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

  createProduct$(product: CreateProduct) {
    const body = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    };

    return this.http.post('http://localhost:3000/products', body);
  }

  getProducts$() {
    // return this.http.get<Product[]>('http:localhost:3000/products');
    return of(products);
  }
}
