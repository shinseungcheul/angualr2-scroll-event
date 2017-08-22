import { ScrollPosition,PositionState } from './scroll-position';
import { Injectable } from '@angular/core';

export interface ScrollerConfig {
  up : number;
  down : number;
}

@Injectable()
export class ScrollResolver {
  public lastScrollPosition: number = 0;

  shouldScroll (container: PositionState, config: ScrollerConfig, scrollingDown: boolean) {
    const distance = config;
    let remaining: number;
    let containerBreakpoint: number;
    if (scrollingDown) {
      remaining = container.scrollHeight - container.scrolledUntilNow;
      containerBreakpoint = container.height * distance.down + 1;
      console.log(container,remaining,containerBreakpoint,'down',scrollingDown,this.lastScrollPosition,'<',container.scrolledUntilNow)
    } else {
      remaining = container.scrolledUntilNow;
      containerBreakpoint = container.height * distance.up + 1;
      console.log(container,remaining,containerBreakpoint,'up',scrollingDown,this.lastScrollPosition,'<',container.scrolledUntilNow)
    }
    const shouldScroll: boolean = remaining <= containerBreakpoint;
    this.lastScrollPosition = container.scrolledUntilNow;
    return shouldScroll;
  }

  isScrollingDown (container: PositionState) {
    return this.lastScrollPosition < container.scrolledUntilNow;
  }

  getScrollState (container: PositionState, config: ScrollerConfig) {
    const isScrollingDown = this.isScrollingDown(container);
    const isScrolling = this.shouldScroll(container, config, isScrollingDown);
    return { isScrollingDown, isScrolling };
  }
}
