import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductFormComponent } from './add-product-form.component';

describe('ClientWebAppBrowseFeatureComponent', () => {
  let component: AddProductFormComponent;
  let fixture: ComponentFixture<AddProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
