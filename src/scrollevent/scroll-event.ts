import {
  Directive, Input , OnInit, OnDestroy, Output,
  SimpleChange, ElementRef, EventEmitter, NgZone,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';

import { EventOptions, EventRegister } from './event-register'
import { ScrollPosition,PositionState,PositionElement,ScrollPositionFactory } from './scroll-position';
import { ScrollResolver, ScrollerConfig } from './scroll-resolver';



@Directive({ selector: '[scroll-event]' })
export class ScrollEventDirective implements OnInit, OnDestroy {
  @Output() scrolledUp = new EventEmitter<ScrollResult>();
  @Output() scrolledDown = new EventEmitter<ScrollResult>();

  private _handleType : string = 'debounce';
  @Input('duration') _durations : number = 100;
  @Input('targetContainer') _targetContainer : any = null;
  @Input('isDisabled') _disabled : boolean = false;
  @Input('isWindow') _isWindow : boolean = true;
  @Input('triggerDown') _triggerDown : number = 1;
  @Input('triggerUp') _triggerup : number = 1;
  @Input('always') _always : boolean = false;
  @Input('resultValue') _result : 'all' | 'totalHeight' |'currentScrollPosition' = 'currentScrollPosition'
  @Input()
  set debounce(value: string | boolean) {
    this._handleType = value === '' || !!value ? 'debounce' : 'throttle';
  }


  destroyScroll : Subscription;
  lastScrollPosition : number = 0;

  constructor(
    private zone : NgZone,
    private element : ElementRef,
    private eventRegister : EventRegister,
    private scrollResolver : ScrollResolver,
    private scrollPositionFactory : ScrollPositionFactory,
  ){}

  //angular life cycle hook start
  ngOnInit(){
    if( window ){
      const containerElement = this.getContainerElement();
      const scrollPosition = this.scrollPositionFactory.create({
        containerElement
      })
      const eventOptions : EventOptions ={
        container : containerElement,
        durations : this._durations,
        handleType : this._handleType,
        filter : () => !this._disabled,
        mergeMap : () => scrollPosition.getPosition(this.element),
        eventHandler : (container:PositionState) => {this.eventHandler(container)}
      }
      console.log(eventOptions,'handleType')

      this.destroyScroll = this.eventRegister.addScrollEvent(eventOptions);

    }
  }

  ngOnDestroy(){
    if(this.destroyScroll){
      this.destroyScroll.unsubscribe();
    }
  }
  //angular life cycle hook end

  //Scroll Event Function
  eventHandler(container : PositionState){
    const config : ScrollerConfig ={
      up:this._triggerup,
      down : this._triggerDown
    }
    const stats : ScrollState = this.scrollResolver.getScrollState(container,config);
    console.log(stats)
    if(this.isTriggerEvents(stats.isScrolling)){
      const result : ScrollResult = this.getScrollResult(container);

      if(stats.isScrollingDown){
        this.scrollDown(result)
      }else{
        this.scrollUp(result)
      }
    }
  }

  getScrollResult(container:PositionState) : ScrollResult{
    switch (this._result){
      case "all" :
        return {totalHeight : this.lastScrollPosition, scrollNow:container.scrolledUntilNow};
      case "currentScrollPosition" :
      return {totalHeight : 0, scrollNow:container.scrolledUntilNow};
      case "totalHeight" :
      return {totalHeight : container.scrollHeight, scrollNow:0};
    }
  }

  isTriggerEvents(shouldScroll: boolean) {
    return (this._always || shouldScroll) && !this._disabled;
  }

  scrollUp(data : ScrollResult ) : void {
    // this.zone.run( () => this.scrolledUp.emit(data));
    this.scrolledUp.emit(data);
  }

  scrollDown (data : ScrollResult) : void {
    // this.zone.run( () => this.scrolledDown.emit(data));
    this.scrolledDown.emit(data);
  }
  //scroll event function end

  // if target is not null, return target element. but if target is null, return window object or ElementRef Object.
  getContainerElement():any{
    if(this._targetContainer){
      return typeof(this._targetContainer) === 'string' ? document.querySelector(this._targetContainer) : this._targetContainer
    }else {
      return this._isWindow ? window : this.element;
    }
  }




}


// data interface
export interface ScrollResult {
  totalHeight : number;
  scrollNow : number;
}

export interface ScrollState {
  isScrollingDown: boolean;
  isScrolling: boolean
}
