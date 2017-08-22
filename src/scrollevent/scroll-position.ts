import { ElementRef, Injectable } from '@angular/core';

export type ContainerElement = Window | ElementRef | any


export interface PositionState {
  height : number;
  scrolledUntilNow : number;
  scrollHeight : number;

}

export interface PositionElement{
  containerElement : ContainerElement;
}

@Injectable()
export class ScrollPositionFactory{

  create(options:PositionElement){
    return new ScrollPosition(options);
  }
}



export class ScrollPosition{
  private isWindow : boolean;
  private container : ContainerElement ;

  constructor(private options : PositionElement){
    this.isContainerWindow(this.options.containerElement);
    this.defineScrollPosition(this.options.containerElement);
  }

  // getLastScrollPosition(){
  //   return this.lastScrollPosition;
  // }
  // setLastScrollPosition(v : number){
  //   this.lastScrollPosition = v
  // }

  //container가 window 객체인지 확인
  isContainerWindow(el:ContainerElement){
    const isWindow = el !=null && el === el.window;
    this.isWindow = isWindow;
    return isWindow;
  }

  //element가 window일때와 ElementRef 일경우와 구분
  defineScrollPosition(el:ContainerElement){
    if(this.isWindow || !el.nativeElement){
      this.container = el;
    }else{
      this.container = el.nativeElement
    }
    return this.container;
  }

  //container 객체의 종류에따른 PositionState 계산방식 선택
  getPosition(el:ElementRef){
    return this.isWindow ? this.calcWindow(el) : this.calcElement(el);
  }

  calcWindow(el:ElementRef){
    // const height = this.height(this.container);
    // let now = this.container.
    const height = this.height(this.container);
    // scrolled until now / current y point
    const scrolledUntilNow = height + this.pageYOffset(this.getDocumentElement());
    // total height = containerElement startPosition + container offsetHeight
    //엘리먼트의 내부 여백 및 경계선 포함한 높이 + 전체 높이에서 해당엘리먼트 시작 위치
    // const scrollHeight = this.offsetTop(el.nativeElement) + this.height(el.nativeElement);
    const scrollHeight = this.getDocumentElement()['scrollHeight'];
    console.log(height, scrolledUntilNow, scrollHeight ,"scrollHeight")
    return { height, scrolledUntilNow, scrollHeight };
  }



  calcElement(el:ElementRef){
    const container = this.container;
    const height = this.height(container);
    const scrolledUntilNow = container['scrollTop'];
    const scrollHeight = container['scrollHeight'];
    return { height , scrolledUntilNow, scrollHeight}
  }

  //container의 보여지는 높이(window 객체의 경우 브라우저 innerHeight, ElementRef 객체의 경우 container의 max-height)
  height(el : ContainerElement):number{
    if(isNaN(el["offsetHeight"])){
      return this.getDocumentElement()['clientHeight'];
    } else{
      return el['offsetHeight'];
    }
  }

  //distance between container top and top
  offsetTop(el : ContainerElement){
    //if el === window , offsetTop = window.
    if (!el.getBoundingClientRect) {
      return;
    }
    return el.getBoundingClientRect()['top'] + this.pageYOffset(el);
  }

  // offsetBottom(el : ContainerElement){
  //   if (!el.getBoundingClientRect){
  //     return;
  //   }
  //   return el.getBoundingClientRect()['bottom']+this.pageYOffset(el.parentElement) - el.getBoundingClientRect()['height']
  // }


  //scrolled until now
  private pageYOffset(el : ContainerElement){
    if (isNaN(window['pageYOffset'])) {
      return this.getDocumentElement()['scrollTop'];
    } else if (el.ownerDocument) {
      return el.ownerDocument.defaultView['pageYOffset'];
    } else {
      return el['offsetTop'];
    }
  }

  getDocumentElement(){
    return this.isWindow ? this.options.containerElement.document.documentElement : null;
  }

}
