import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleableContentComponent } from './toggleable-content.component';

describe('ToggleableContentComponent', () => {
  let component: ToggleableContentComponent;
  let fixture: ComponentFixture<ToggleableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleableContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleableContentComponent);
    // fixture.componentRef.setInput('isExpanded', false);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be collapsed initially when isExpanded is false', () => {
    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();

    const contentDiv = fixture.nativeElement.querySelector('div');
    expect(contentDiv.style.height).toBe('0px');
    expect(contentDiv.style.opacity).toBe('0');
    expect(contentDiv.style.visibility).toBe('hidden');
  });

  it('should expand when isExpanded is set to true', () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();

    const contentDiv = fixture.nativeElement.querySelector('div');
    expect(contentDiv.style.height).toBe('');
    expect(contentDiv.style.opacity).toBe('1');
    expect(contentDiv.style.visibility).toBe('visible');
  });

  it('should toggle between expanded and collapsed states', () => {
    // Set to expanded
    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();
    let contentDiv = fixture.nativeElement.querySelector('div');
    expect(contentDiv.style.visibility).toBe('visible');
    expect(contentDiv.style.opacity).toBe('1');

    // Set to collapsed
    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();
    contentDiv = fixture.nativeElement.querySelector('div');
    expect(contentDiv.style.visibility).toBe('hidden');
    expect(contentDiv.style.opacity).toBe('0');
  });
});
