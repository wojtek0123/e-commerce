import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemComponent } from './cart-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CartItemBase } from '@e-commerce/shared/api-models';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: APP_ROUTE_PATHS_TOKEN, useValue: { BOOK: () => '/' } },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const item: CartItemBase = {
  book: {
    title: '',
    authors: [],
    category: {
      id: '2',
      name: 'action',
    },
    createdAt: '',
    updatedAt: '',
    id: '1',
    categoryId: '',
    coverImage: '',
    price: 10,
    pages: 300,
    publishedDate: '',
    description: '',
    language: 'polish',
  },
  quantity: 1,
};
