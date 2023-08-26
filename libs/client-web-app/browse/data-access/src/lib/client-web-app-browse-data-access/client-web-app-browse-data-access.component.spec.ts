import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBrowseDataAccessComponent } from './client-web-app-browse-data-access.component';

describe('ClientWebAppBrowseDataAccessComponent', () => {
  let component: ClientWebAppBrowseDataAccessComponent;
  let fixture: ComponentFixture<ClientWebAppBrowseDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBrowseDataAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAppBrowseDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
