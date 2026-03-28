import {UIElement} from "../ui/uiElement"
import {nothing, Nothing} from "../../infrastructure/nothing"
import {Object} from "./object"

export type PropertiesChangedHandler = (values: readonly ObjectProperty[]) => void
export type ChangeProperty = () => void
export type ChangePropertyTyped<TValue> = (value: TValue) => TValue

export interface ObjectProperty {
  readonly name: string
  readonly value: string
  readonly update: ChangeProperty | Nothing
}

export class TypedObjectProperty<TValue> implements ObjectProperty {

  private typedValue: TValue
  private updateValue: ChangeProperty | Nothing

  get typed(): TValue {
    return this.typedValue
  }

  set typed(value: TValue) {
    this.typedValue = value
    this.updatable.updated()
  }

  get value(): string {
    return this.typedValue != nothing
         ? this.format ? this.format(this.typedValue) : this.typedValue.toString()
         : "<null>"
  }

  get update(): ChangeProperty | Nothing {
    return this.updateValue
  }

  constructor(public name: string,
              value: TValue,
              private format: ((value: TValue) => string) | Nothing,
              update: ChangePropertyTyped<TValue> | Nothing = nothing,
              private updatable: UpdatableObjectProperties) {
    this.typedValue = value;
    this.updateValue = update != nothing ? () => this.typed = update(this.typedValue) : nothing
  }
}

interface UpdatableObjectProperties {
  updated(): void
}

export class ObjectProperties {

  private readonly subscriptionsObjects = new Map<Object, PropertiesChangedHandler>()
  private readonly subscriptionsElements = new Map<UIElement, PropertiesChangedHandler>()
  private readonly valuesValue: ObjectProperty[] = []

  get values(): readonly ObjectProperty[] {
    return this.valuesValue
  }

  add<TValue>(name: string, value: TValue, format: ((value: TValue) => string) | Nothing = nothing, update: ChangePropertyTyped<TValue> | Nothing = nothing): TypedObjectProperty<TValue> {
    const property = new TypedObjectProperty(name, value, format, update, this)
    this.valuesValue.push(property)
    return property
  }

  subscribeUpdate(target: UIElement, handler: PropertiesChangedHandler) {
    this.subscriptionsElements.set(target, handler)
  }

  subscribeUpdateObject(target: Object, handler: PropertiesChangedHandler) {
    this.subscriptionsObjects.set(target, handler)
  }

  unsubscribeUpdate(target: UIElement) {
    this.subscriptionsElements.delete(target)
  }

  unsubscribeUpdateObject(target: Object) {
    this.subscriptionsObjects.delete(target)
  }

  updated(): void {
    const elementValues = Array.from(this.subscriptionsElements.values())
    for (const subscription of elementValues) {
      subscription(this.valuesValue)
    }
    const objectValues = Array.from(this.subscriptionsObjects.values())
    for (const subscription of objectValues) {
      subscription(this.valuesValue)
    }
  }
}
