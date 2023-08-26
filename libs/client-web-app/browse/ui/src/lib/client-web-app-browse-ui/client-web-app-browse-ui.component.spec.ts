import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBrowseUiComponent } from './client-web-app-browse-ui.component';

describe('ClientWebAppBrowseUiComponent', () => {
  let component: ClientWebAppBrowseUiComponent;
  let fixture: ComponentFixture<ClientWebAppBrowseUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBrowseUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAppBrowseUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
