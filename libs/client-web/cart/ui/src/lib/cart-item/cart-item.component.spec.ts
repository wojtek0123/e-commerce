import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemComponent, WAIT_TIME } from './cart-item.component';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { CartItemBase } from '@e-commerce/shared/api-models';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  const mockCartItem: CartItemBase = {
    quantity: 2,
    book: {
      title: '',
      authors: [],
      category: {
        id: '2',
        name: 'action',
      },
      createdAt: '',
      updatedAt: '',
      reviews: [],
      id: '1',
      categoryId: '',
      coverImage: '',
      price: 10,
      pages: 300,
      publishedDate: '',
      description: '',
      language: 'polish',
    },
  };

  const mockRoutePaths = {
    books: {
      detail: () => '/books/detail',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [
        { provide: APP_ROUTE_PATHS_TOKEN, useValue: mockRoutePaths },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: '',
        },
        {
          provide: APP_ROUTE_PATHS_TOKEN,
          useValue: { BOOK: (id: string) => '/books' + id },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cartItem', mockCartItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct quantity', () => {
    expect(component.quantity()).toBe(2);
  });

  it('should emit delete event when remove is called', () => {
    const spy = jest.spyOn(component.deleteEvent, 'emit');
    component.remove();
    expect(spy).toHaveBeenCalled();
  });

  describe('quantity updates', () => {
    it('should increase quantity', async () => {
      const spy = jest.spyOn(component.updateQuantityEvent, 'emit');
      component.increase();
      expect(component.quantity()).toBe(3);

      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

      expect(spy).toHaveBeenCalledWith(3);
    });

    it('should decrease quantity', async () => {
      const spy = jest.spyOn(component.updateQuantityEvent, 'emit');
      component.decrease();
      expect(component.quantity()).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should throttle multiple quantity updates', async () => {
      const spy = jest.spyOn(component.updateQuantityEvent, 'emit');

      component.increase(); // 3
      component.increase(); // 4
      component.increase(); // 5

      expect(component.quantity()).toBe(5);
      expect(spy).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(5);
    });
  });
});
