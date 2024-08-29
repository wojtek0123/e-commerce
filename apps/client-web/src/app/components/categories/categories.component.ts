import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Category } from '@e-commerce/client-web/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-categories',
  template: `
    <p-button
      (click)="categoriesMenu.toggle($event)"
      iconPos="right"
      severity="secondary"
      [icon]="categoriesMenu.visible ? 'pi pi-angle-up' : 'pi pi-angle-down'"
      label="Categories"
    ></p-button>
    <p-menu
      #categoriesMenu
      class="p-menu-two-columns"
      [popup]="true"
      [model]="menuItems()"
    />
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, MenuModule],
})
export class CategoriesComponent {
  categories = input.required<Category[]>();
  error = input.required<string | string[] | null>();
  loading = input.required<boolean>();

  clickEvent = output<void>();
  refetchCategoriesEvent = output<void>();

  menuItems = computed(() => {
    if (this.error()) {
      return [
        {
          label: 'Error! Try again.',
          icon: 'pi pi-refresh',
          command: () => {
            this.refetchCategoriesEvent.emit();
          },
        },
      ];
    }
    if (this.loading()) {
      return [
        {
          label: 'Wait until categories will be fetched',
          icon: 'pi pi-spin pi-spinner',
        },
      ];
    }
    if (this.categories().length === 0 && !this.loading() && !this.error()) {
      return [
        { label: 'Not found categories.', icon: 'pi pi-exclamation-circle' },
      ];
    }

    return this.categories().map((category) => ({
      label: category.name,
      routerLink: '/browse',
      queryParams: {
        categories: category.name.toLowerCase().split(' ').join('_'),
      },
      state: { category: JSON.stringify(category) },
    }));
  });
}
