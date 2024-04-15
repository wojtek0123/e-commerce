import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { products } from '../data/dummy-data';
import { of } from 'rxjs';

interface CreateProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

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
