import {Point2D} from "../models"
import {ElementArea} from "./elementArea"
import {Nothing} from "../../infrastructure/nothing"
import {Icon} from "./rendering/icons"

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
  alignVertical?: AlignVertical
  alignHorizontal?: AlignHorizontal
}

export interface UIRenderContext {
  fillPath(background: string, points: Point2D[]): void
  fillPathStroke(border: string, background: string, lineWidth: number, points: Point2D[]): void
  fillRectangle(background: string, left: number, top: number, width: number, height: number): void
  text(color: string, left: number, top: number, text: string, style: TextStyle | Nothing): void
  line(color: string, lineWidth: number, left: number, top: number, right: number, bottom: number): void
  icon(color: string, icon: Icon, left: number, top: number, size: number): void
}

