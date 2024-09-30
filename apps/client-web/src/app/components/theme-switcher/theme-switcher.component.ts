import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <button
      class="theme-toggle"
      title="Toggles light & dark"
      aria-label="auto"
      aria-live="polite"
      (click)="changeTheme()"
    >
      <svg
        class="sun-and-moon"
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <mask class="moon" id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle
          class="sun"
          cx="12"
          cy="12"
          r="6"
          mask="url(#moon-mask)"
          fill="currentColor"
        />
        <g class="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </button>
  `,
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent implements OnInit {
  // theme = signal<Theme>('dark');

  ngOnInit() {
    // const preferenceTheme =
    //   (localStorage.getItem('theme') ??
    //   window.matchMedia('(prefers-color-scheme: dark)').matches)
    //     ? 'dark'
    //     : 'light';
    //
    // this.theme.set(preferenceTheme);
  }

  changeTheme() {
    // const themeLink = this.document.getElementById(
    //   'app-theme',
    // ) as HTMLLinkElement;
    //
    // const theme = this.theme() === 'dark' ? 'light' : 'dark';
    //
    // if (themeLink) {
    //   themeLink.href = theme + '.css';
    //   this.theme.set(theme);
    //   localStorage.setItem('theme', theme);
    // }
  }
}
