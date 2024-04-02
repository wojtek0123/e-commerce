import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureHomeComponent } from './feature-home.component';

describe('ClientWebAppBrowsingFeatureHomeComponent', () => {
  let component: FeatureHomeComponent;
  let fixture: ComponentFixture<FeatureHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
