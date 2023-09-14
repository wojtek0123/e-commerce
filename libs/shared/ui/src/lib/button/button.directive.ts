import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[eCommerceButton]',
  standalone: true,
})
export class ButtonDirective {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() brand!: 'primary' | 'basic' | 'outline';
  @HostBinding('class')
  get classes() {
    const defaultClasses = ['rounded-3xl', 'cursor-pointer'];
    const brandClasses = this.getBrand();
    const sizeClasses = this.getSize();

    return [...defaultClasses, ...brandClasses, ...sizeClasses];
  }

  getBrand() {
    console.log(this.brand);
    if (this.brand === 'primary') {
      return [
        'bg-blue-400',
        'text-foreground-0',
        'border',
        'border-blue-400',
        'hover:bg-blue-500',
        'transition-colors',
      ];
    }
    if (this.brand === 'basic') {
      return [
        'text-foreground-0',
        'hover:underline',
        'hover:underline-offset-8',
        'hover:decoration-blue-400',
        'hover:decoration-2',
      ];
    }
    if (this.brand === 'outline') {
      return [
        'border',
        'border-foreground-0',
        'text-foreground-0',
        'bg-transparent',
        'hover:border-blue-400',
        'hover:text-blue-400',
        'transition-colors',
      ];
    }
    return [];
  }

  getSize() {
    if (this.size === 'small') {
      return ['py-1', 'px-4'];
    }
    if (this.size === 'medium') {
      return ['py-2', 'px-7'];
    }
    if (this.size === 'large') {
      return ['py-3', 'px-9', 'text-xl'];
    }

    return [];
  }
}
