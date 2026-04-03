import {Point, Point2D} from "../models"
import {Nothing} from "../../infrastructure/nothing"
import {Icon} from "./rendering/icons"
import {ElementArea} from "./elementArea"

export enum AlignVertical {
  Top,
  Middle,
  Bottom
}

export enum AlignHorizontal {
  Left,
  Centre,
  Right
}

export interface TextStyle {
  underline?: boolean
  maxWidth?: number
  fontSize?: number
  alignVertical?: AlignVertical
  alignHorizontal?: AlignHorizontal
  backgroundColor?: string
}

export interface RenderUIContext {

  readonly offset: Point2D

  fillPath(points: Point2D[], background: string): void
  fillPathStroke(points: Point2D[], lineWidth: number, borderColor: string, backgroundColor: string): void
  fillRectangle(backgroundColor: string, area: ElementArea): void
  fillRoundRectangle(backgroundColor: string, area: ElementArea, radius: number): void

  line(begin: Point2D, end: Point2D, lineWidth: number, color: string): void
  rectangle(color: string, area: ElementArea): void

  text(text: string, color: string, position: Point2D, style: TextStyle | Nothing): void
  icon(icon: Icon, color: string, position: Point2D, size: number): void
  createImage(width: number, height: number, offset: Point2D): RenderUIContext
  drawImage(context: RenderUIContext, source: ElementArea, target: ElementArea): void
}
