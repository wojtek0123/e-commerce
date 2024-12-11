import { afterNextRender, Injectable, signal } from '@angular/core';

const DARK_THEME_CLASS_NAME = 'dark' as const;
const LOCAL_STORAGE_THEME_NAME = 'isDark' as const;

@Injectable()
export class ThemeService {
  private _isDark = signal(false);
  public isDark = this._isDark.asReadonly();
  private htmlElement: HTMLHtmlElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.htmlElement = document.querySelector('html');

      const userPreference = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;

      const isDark: boolean | null = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_THEME_NAME) ?? 'null',
      );

      this.setMode(isDark === null ? userPreference : isDark);
    });
  }

  public toggleDarkMode() {
    const isDark = this.htmlElement?.classList.toggle(DARK_THEME_CLASS_NAME);

    this._isDark.set(!!isDark);
    localStorage.setItem(LOCAL_STORAGE_THEME_NAME, JSON.stringify(!!isDark));
  }

  public setMode(isDark: boolean) {
    this._isDark.set(isDark);

    if (isDark) {
      this.htmlElement?.classList.add(DARK_THEME_CLASS_NAME);
    } else {
      this.htmlElement?.classList.remove(DARK_THEME_CLASS_NAME);
    }

    localStorage.setItem(LOCAL_STORAGE_THEME_NAME, JSON.stringify(isDark));
  }
}
