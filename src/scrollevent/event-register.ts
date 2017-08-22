import { Subscription } from 'rxjs/Rx'
import { Observable } from 'rxjs/Observable';
import { Injectable, ElementRef } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

export interface EventOptions {
  container : Window | ElementRef | any;
  handleType : string;
  durations : number;
  filter : Function;
  mergeMap : Function;
  eventHandler : Function;
}


@Injectable()
export class EventRegister{
  addScrollEvent(options:EventOptions){
    const scroll : Subscription = Observable.fromEvent(options.container,'scroll')
      [options.handleType]( () => Observable.timer(options.durations) )
      .filter(options.filter)
      .mergeMap((e:any) => Observable.of(options.mergeMap(e)) )
      .subscribe(options.eventHandler);

    return scroll;
  }


}
