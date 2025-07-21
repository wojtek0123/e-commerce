import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebCoreFeatureFooterComponent } from './client-web-core-feature-footer.component';

describe('ClientWebCoreFeatureFooterComponent', () => {
  let component: ClientWebCoreFeatureFooterComponent;
  let fixture: ComponentFixture<ClientWebCoreFeatureFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebCoreFeatureFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebCoreFeatureFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
