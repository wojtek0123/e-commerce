import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthShellComponent } from './auth-shell.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('AuthShellComponent', () => {
  let component: AuthShellComponent;
  let fixture: ComponentFixture<AuthShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the image with the correct src and alt attributes', () => {
    const imgElement = fixture.debugElement.query(By.css('img'));

    expect(imgElement).toBeTruthy();
    expect(imgElement.attributes['src']).toBe('assets/auth-books.jpg');
    expect(imgElement.attributes['alt']).toBe('book store');
  });

  it('should contain router-outlet for child routes', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
