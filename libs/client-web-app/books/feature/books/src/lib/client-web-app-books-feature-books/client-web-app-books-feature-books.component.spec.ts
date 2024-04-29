import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWebAppBooksFeatureBooksComponent } from './client-web-app-books-feature-books.component';

describe('ClientWebAppBooksFeatureBooksComponent', () => {
  let component: ClientWebAppBooksFeatureBooksComponent;
  let fixture: ComponentFixture<ClientWebAppBooksFeatureBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWebAppBooksFeatureBooksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWebAppBooksFeatureBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
