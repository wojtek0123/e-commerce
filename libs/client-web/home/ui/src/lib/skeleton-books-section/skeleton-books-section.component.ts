import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-skeleton-books-section',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './skeleton-books-section.component.html',
  styleUrl: './skeleton-books-section.component.scss',
})
export class SkeletonBooksSectionComponent {}
