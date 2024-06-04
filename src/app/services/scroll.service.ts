import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scrollPosition(elementId: string, duration: number = 1000): void {
    const element = document.getElementById(elementId);
    if (element) {
      this.smoothScroll(element, duration);
    }
  }

  private smoothScroll(target: HTMLElement, duration: number): void {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const ease = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animateScroll = () => {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const timeElapsed = now - startTime;
      const run = ease(timeElapsed, startPosition, targetPosition, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
}
