import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private _theme = signal<Theme>('dark');

  public theme = this._theme.asReadonly();

  switchTheme(theme: Theme) {
    const themeLink = this.document.getElementById(
      'app-theme',
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
      this._theme.set(theme);
      localStorage.setItem('theme', theme);
    }
  }
}
