import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAuthShellComponent } from './client-web-auth-shell.component';

describe('ClientWebAuthShellComponent', () => {
  let component: ClientWebAuthShellComponent;
  let fixture: ComponentFixture<ClientWebAuthShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAuthShellComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAuthShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
