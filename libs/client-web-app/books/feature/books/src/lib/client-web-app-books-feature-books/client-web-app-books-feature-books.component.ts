import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-client-web-app-books-feature-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-web-app-books-feature-books.component.html',
  styleUrl: './client-web-app-books-feature-books.component.css',
})
export class ClientWebAppBooksFeatureBooksComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(console.log);
  }
}
