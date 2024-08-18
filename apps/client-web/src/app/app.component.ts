import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { Store } from '@ngrx/store';
import {
  categoryActions,
  selectCategories,
  selectError,
  selectLoading,
} from '@e-commerce/client-web/shared/data-access';
import { CategoriesComponent } from './components/categories/categories.component';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastModule,
    CategoriesComponent,
    AsyncPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  public categories$ = this.store.select(selectCategories);
  public loading$ = this.store.select(selectLoading);
  public error$ = this.store.select(selectError);

  ngOnInit(): void {
    this.store.dispatch(categoryActions.getCategories());
  }
}
