import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBrowsingFeatureProductsComponent } from './products.component';

describe('ClientWebAppBrowsingFeatureProductsComponent', () => {
  let component: ClientWebAppBrowsingFeatureProductsComponent;
  let fixture: ComponentFixture<ClientWebAppBrowsingFeatureProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBrowsingFeatureProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ClientWebAppBrowsingFeatureProductsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
