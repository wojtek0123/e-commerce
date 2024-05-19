import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent {}
