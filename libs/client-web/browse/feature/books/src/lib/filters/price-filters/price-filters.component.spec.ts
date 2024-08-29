import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceFiltersComponent } from './price-filters.component';

describe('PriceFiltersComponent', () => {
  let component: PriceFiltersComponent;
  let fixture: ComponentFixture<PriceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
