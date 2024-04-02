import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBrowsingFeatureProductComponent } from './client-web-app-browsing-feature-product.component';

describe('ClientWebAppBrowsingFeatureProductComponent', () => {
  let component: ClientWebAppBrowsingFeatureProductComponent;
  let fixture: ComponentFixture<ClientWebAppBrowsingFeatureProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBrowsingFeatureProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ClientWebAppBrowsingFeatureProductComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
