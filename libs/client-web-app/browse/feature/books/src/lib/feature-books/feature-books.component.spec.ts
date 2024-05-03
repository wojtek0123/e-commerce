import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureBooksComponent } from './feature-books.component';

describe('ClientWebAppBooksFeatureBooksComponent', () => {
  let component: FeatureBooksComponent;
  let fixture: ComponentFixture<FeatureBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureBooksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
