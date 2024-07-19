import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import {
  appRouterConfig,
  browseRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'lib-categories',
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
  private categoryStore = inject(CategoryStore);
  clickEvent = output<void>();

  error = this.categoryStore.error;
  loading = this.categoryStore.loading;
  categories = this.categoryStore.categories;

  menuItems = computed(() => {
    if (this.error()) {
      return [
        {
          label: 'Error! Try again.',
          icon: 'pi pi-refresh',
          command: () => {
            this.categoryStore.getCategories();
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
      routerLink: browseRoutePaths.default,
      queryParams: {
        [appRouterConfig.browse.categoriesQueryParams]: category.name
          .toLowerCase()
          .split(' ')
          .join('_'),
      },
      state: { categoryIds: [category.id], clear: true },
    }));
  });
}
