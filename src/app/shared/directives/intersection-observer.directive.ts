import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[intersectionObserver]',
  standalone: true
})
export class IntersectionObserverDirective {
  @Output() intersectionObserver = new EventEmitter<IntersectionObserverEntry[]>();

  constructor(private elementRef: ElementRef) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      this.intersectionObserver.emit(entries);
    }, options);

    observer.observe(this.elementRef.nativeElement);
  }
}