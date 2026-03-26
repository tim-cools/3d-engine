import {Point2D} from "../models"
import {ElementArea} from "./elementArea"
import {Nothing} from "../../infrastructure/nothing"

export interface TextStyle {
  underline: boolean
}

export interface UIRenderContext {
  fillPath(background: string, points: Point2D[]): void
  fillPathStroke(border: string, background: string, lineWidth: number, points: Point2D[]): void
  text(color: string, area: ElementArea, text: string, style: TextStyle | Nothing): void
  line(color: string, lineWidth: number, left: number, top: number, right: number, bottom: number): void
  icon(color: string, left: number, top: number): void
}

