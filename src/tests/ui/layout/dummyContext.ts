import {Point2D} from "../../../engine/models"
import {Nothing} from "../../../infrastructure/nothing"
import {RenderUIContext, TextStyle} from "../../../engine/ui"
import {ElementArea} from "../../../engine/ui/elementArea"
import {Icon} from "../../../engine/ui/rendering/icons"

export const dummyContext = {
  offset: Point2D.default,
  fillPath(points: Point2D[], background: string): void {
  },
  fillPathStroke(points: Point2D[], lineWidth: number, borderColor: string, backgroundColor: string): void {
  },
  fillRectangle(backgroundColor: string, area: ElementArea): void {
  },
  fillRoundRectangle(backgroundColor: string, area: ElementArea, radius: number): void {
  },
  rectangle(color: string, area: ElementArea): void {
  },
  text(text: string, color: string, position: Point2D, style: TextStyle | Nothing): void {
  },
  line(begin: Point2D, end: Point2D, lineWidth: number, color: string): void {
  },
  icon(icon: Icon, color: string, position: Point2D, size: number): void {
  },
  createImage(width: number, height: number): RenderUIContext {
    return this
  },
  drawImage(context: RenderUIContext, source: ElementArea, target: ElementArea): void {
  }
}
