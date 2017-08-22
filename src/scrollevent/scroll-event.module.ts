import { NgModule } from '@angular/core';
import { ScrollEventDirective } from './scroll-event';
import { EventRegister } from './event-register';
import { ScrollPositionFactory } from './scroll-position';
import { ScrollResolver, ScrollerConfig } from './scroll-resolver';


@NgModule({
  declarations: [
    ScrollEventDirective,
  ],
  imports: [
   ],
  exports: [
     ScrollEventDirective,
  ],
  providers : [
    EventRegister,
    ScrollResolver,
    ScrollPositionFactory
  ]
})
export class ScrollEventModule { }
