import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppHomeUiComponent } from './client-web-app-home-ui.component';

describe('ClientWebAppHomeUiComponent', () => {
  let component: ClientWebAppHomeUiComponent;
  let fixture: ComponentFixture<ClientWebAppHomeUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppHomeUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAppHomeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
