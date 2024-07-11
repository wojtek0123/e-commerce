import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'lib-shell',
  standalone: true,
  imports: [RouterOutlet, MenuModule],
  template: `
    <div class="content flex gap-4 mx-auto">
      <div class="hidden lg:block">
        <p-menu [model]="menuItems" />
      </div>
      <div class="w-full">
        <router-outlet />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .content {
        max-width: 1200px;
        width: 100%;
      }
    `,
  ],
})
export class ShellComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Orders',
      icon: 'pi pi-book',
      routerLink: '/user/orders',
      routerLinkActiveOptions: 'text-primary',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/user/settings',
    },
  ];
}
