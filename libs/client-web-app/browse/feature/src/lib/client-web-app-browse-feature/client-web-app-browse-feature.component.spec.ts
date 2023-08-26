import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBrowseFeatureComponent } from './client-web-app-browse-feature.component';

describe('ClientWebAppBrowseFeatureComponent', () => {
  let component: ClientWebAppBrowseFeatureComponent;
  let fixture: ComponentFixture<ClientWebAppBrowseFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBrowseFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAppBrowseFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
