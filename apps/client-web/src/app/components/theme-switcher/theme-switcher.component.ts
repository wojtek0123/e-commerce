import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Theme } from '@e-commerce/client-web-app/shell/data-access/theme-switcher';

@Component({
  selector: 'lib-theme-switcher',
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
  styles: [
    `
      @import 'https://unpkg.com/open-props/easings.min.css';
      .sun-and-moon > :is(.moon, .sun, .sun-beams) {
        transform-origin: center;
      }

      .sun-and-moon > :is(.moon, .sun) {
        fill: var(--icon-fill);
      }

      .theme-toggle:is(:hover, :focus-visible)
        > .sun-and-moon
        > :is(.moon, .sun) {
        fill: var(--icon-fill-hover);
      }

      .sun-and-moon > .sun-beams {
        stroke: var(--icon-fill);
        stroke-width: 2px;
      }

      .theme-toggle:is(:hover, :focus-visible) .sun-and-moon > .sun-beams {
        stroke: var(--icon-fill-hover);
      }

      [data-theme='dark'] .sun-and-moon > .sun {
        transform: scale(1.75);
      }

      [data-theme='dark'] .sun-and-moon > .sun-beams {
        opacity: 0;
      }

      [data-theme='dark'] .sun-and-moon > .moon > circle {
        transform: translateX(-7px);
      }

      @supports (cx: 1) {
        [data-theme='dark'] .sun-and-moon > .moon > circle {
          cx: 17;
          transform: translateX(0);
        }
      }

      @media (prefers-reduced-motion: no-preference) {
        .sun-and-moon > .sun {
          transition: transform 0.5s var(--ease-elastic-3);
        }

        .sun-and-moon > .sun-beams {
          transition: transform 0.5s var(--ease-elastic-4),
            opacity 0.5s var(--ease-3);
        }

        .sun-and-moon .moon > circle {
          transition: transform 0.25s var(--ease-out-5);
        }

        @supports (cx: 1) {
          .sun-and-moon .moon > circle {
            transition: cx 0.25s var(--ease-out-5);
          }
        }

        [data-theme='dark'] .sun-and-moon > .sun {
          transition-timing-function: var(--ease-3);
          transition-duration: 0.25s;
          transform: scale(1.75);
        }

        [data-theme='dark'] .sun-and-moon > .sun-beams {
          transition-duration: 0.15s;
          transform: rotateZ(-25deg);
        }

        [data-theme='dark'] .sun-and-moon > .moon > circle {
          transition-duration: 0.5s;
          transition-delay: 0.25s;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent implements OnInit {
  private document = inject(DOCUMENT);

  theme = signal<Theme>('dark');

  ngOnInit() {
    const preferenceTheme =
      localStorage.getItem('theme') ??
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

    this.theme.set(preferenceTheme);
  }

  changeTheme() {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    const theme = this.theme() === 'dark' ? 'light' : 'dark';

    if (themeLink) {
      themeLink.href = theme + '.css';
      this.theme.set(theme);
      localStorage.setItem('theme', theme);
    }
  }
}
