import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBrowseUtilComponent } from './client-web-app-browse-util.component';

describe('ClientWebAppBrowseUtilComponent', () => {
  let component: ClientWebAppBrowseUtilComponent;
  let fixture: ComponentFixture<ClientWebAppBrowseUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBrowseUtilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAppBrowseUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
