import {Event} from "./event"
import {EventType} from "./eventType"

export interface EventDispatcher {
  subscribe<TEvent extends Event>(type : new () => TEvent, param: (event: TEvent) => void): void
  publish<TEvent extends Event>(type : new () => TEvent, event: TEvent): void
}


/*
export class MyGeneric<T extends { id: string }> {
  constructor(
    private entity : new () => T,
  ) {
    console.log(`entityName: ${this.entityName}`)
  }

  private get entityName(): string
  {
    return `${this.entity.name}`;
  }
}

const myObject = new MyGeneric(MyObject);
 */
