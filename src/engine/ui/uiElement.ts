import {ElementArea} from "./elementArea"
import {ElementSize} from "./elementSize"
import {ElementSizeValue} from "./elementSizeValue"
import {UIRenderContext} from "./uiRenderContext"
import {UIElementType} from "./uiElementType"
import {Id, Nothing, nothing} from "../../infrastructure/nothing"
import {UIContext} from "./uiContext"
import {AttachmentProperty, AttachmentPropertyValue, TypedAttachmentProperty} from "./attachmentProperty"
import {firstOrDefault} from "../../infrastructure"

export function setProperty<T>(propertyValue: T | undefined, defaultValue: T): T {
  return propertyValue == undefined ? defaultValue : propertyValue
}

export interface UIElementProperties {
  id?: Id,
  attach?: readonly AttachmentProperty[]
}

export abstract class UIElement {

  private readonly attachmentProperties: readonly AttachmentProperty[] | Nothing = nothing
  private lastAreaValue: ElementArea = ElementArea.square(0)
  private contextValue: UIContext | Nothing = nothing
  private idValue: Id | Nothing = nothing

  get id(): Id {
    if (this.idValue == nothing) {
      throw new Error("Id not set.")
    }
    return this.idValue
  }

  get contextOptional(): UIContext | Nothing {
    return this.contextValue
  }

  get context(): UIContext {
    if (this.contextValue == nothing) {
      throw new Error("context is not attached")
    }
    return this.contextValue
  }

  get lastArea(): ElementArea {
    return this.lastAreaValue
  }

  abstract get children(): readonly UIElement[]
  abstract get elementType(): UIElementType

  visible: boolean = true

  protected constructor(properties: UIElementProperties | Nothing = nothing) {
    if (properties == nothing) return
    this.idValue = setProperty(properties.id, nothing)
    this.attachmentProperties = setProperty(properties.attach, nothing)
  }

  render(area: ElementArea, context: UIRenderContext): ElementArea {
    this.lastAreaValue = this.renderElement(area, context)
    return area
  }

  calculateSize(): ElementSize {
    return this.visible ? new ElementSize(ElementSizeValue.full, ElementSizeValue.full) : ElementSize.zero
  }

  attachContext(context: UIContext) {
    if (this.contextValue != nothing) {
      return
    }
    this.contextValue = context
    context.attachElements(this.children)
    this.contextAttached(context)
  }

  detachContext() {
    if (this.contextValue == nothing) {
      return
    }
    this.contextDetaching()
    this.contextValue = nothing
  }

  ensureId(id: string) {
    if (this.idValue == nothing) {
      this.idValue = id
    }
  }

  public attachmentPropertyValue<T>(property: TypedAttachmentProperty<T>): T | undefined {
    if (!this.attachmentProperties) return undefined
    const value = firstOrDefault(this.attachmentProperties, where => where.type == property.type)
    return value != nothing ? (value as AttachmentPropertyValue<T>).value : undefined
  }

  protected contextAttached(context: UIContext) {
  }

  protected contextDetaching() {
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    return area
  }
}
