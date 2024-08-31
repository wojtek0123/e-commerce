import { Component, HostBinding, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'lib-shell',
  standalone: true,
  imports: [RouterOutlet, MenuModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  menuItems = signal<MenuItem[]>([
    {
      label: 'Orders',
      icon: 'pi pi-book',
      routerLink: '/account/orders',
      routerLinkActiveOptions: 'text-primary',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/account/settings',
    },
  ]);

  @HostBinding('style.width') width = '100%';
}
