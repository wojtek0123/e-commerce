import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureRegisterComponent } from './feature-register.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '@e-commerce/client-web-app/auth/data-access-auth';
import { ActivatedRoute } from '@angular/router';

describe('ClientWebAppAuthFeatureRegisterComponent', () => {
  let component: FeatureRegisterComponent;
  let fixture: ComponentFixture<FeatureRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureRegisterComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: '',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
