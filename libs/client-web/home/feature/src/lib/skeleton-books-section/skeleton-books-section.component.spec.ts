import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonBooksSectionComponent } from './skeleton-books-section.component';

describe('SkeletonBooksSectionComponent', () => {
  let component: SkeletonBooksSectionComponent;
  let fixture: ComponentFixture<SkeletonBooksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonBooksSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonBooksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
