import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { Theme } from '../models/theme.model';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitherService {
  private document = inject(DOCUMENT);
  private _theme = signal<Theme>('dark');

  public theme = this._theme.asReadonly();

  switchTheme(theme: Theme) {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
      this._theme.set(theme);
      localStorage.setItem(appRouterConfig.localStorage.theme, theme);
    }
  }
}
