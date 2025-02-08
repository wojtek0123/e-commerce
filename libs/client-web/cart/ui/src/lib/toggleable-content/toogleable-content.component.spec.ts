import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleableContentComponent } from './toggleable-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ToggleableContentComponent', () => {
  let component: ToggleableContentComponent;
  let fixture: ComponentFixture<ToggleableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleableContentComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleableContentComponent);
    fixture.componentRef.setInput('isExpanded', false);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be collapsed initially when isExpanded is false', () => {
    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();

    const contentDiv = fixture.nativeElement.querySelector(
      'div',
    ) as HTMLDivElement;
    const computedStyle = window.getComputedStyle(contentDiv);

    expect(computedStyle.height).toBe('0px');
    expect(computedStyle.opacity).toBe('0');
    expect(computedStyle.visibility).toBe('hidden');
  });

  it('should expand when isExpanded is set to true', async () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();

    const contentDiv = fixture.nativeElement.querySelector(
      'div',
    ) as HTMLDivElement;

    await fixture.whenStable();

    expect(contentDiv.style.height).toBe('');
    expect(contentDiv.style.opacity).toBe('1');
    expect(contentDiv.style.visibility).toBe('visible');
  });

  it('should toggle between expanded and collapsed states', async () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();

    await fixture.whenStable();

    let contentDiv = fixture.nativeElement.querySelector(
      'div',
    ) as HTMLDivElement;
    let style = getComputedStyle(contentDiv);
    expect(style.visibility).toBe('visible');
    expect(style.opacity).toBe('1');

    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();

    await fixture.whenStable();

    contentDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    style = getComputedStyle(contentDiv);
    expect(style.visibility).toBe('hidden');
    expect(style.opacity).toBe('0');
  });
});
