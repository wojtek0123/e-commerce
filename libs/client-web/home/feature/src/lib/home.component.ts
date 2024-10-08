import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BookCardComponent } from '@e-commerce/client-web/shared/ui';
import { BooksSectionComponent } from './books-section/books-section.component';
import { BookTag } from '@e-commerce/client-web/shared/data-access';
import { SkeletonBooksSectionComponent } from './skeleton-books-section/skeleton-books-section.component';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    NgOptimizedImage,
    BookCardComponent,
    BooksSectionComponent,
    SkeletonBooksSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected bookTag = BookTag;
}
