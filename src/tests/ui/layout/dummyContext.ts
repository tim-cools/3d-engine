import {Point2D} from "../../../engine/models"
import {Nothing} from "../../../infrastructure/nothing"
import {TextStyle} from "../../../engine/ui"
import {ElementArea} from "../../../engine/ui/elementArea"
import {Icon} from "../../../engine/ui/rendering/icons"

export const dummyContext = {
  fillPath: function(background: string, points: Point2D[]): void {
  },
  fillPathStroke: function(border: string, background: string, lineWidth: number, points: Point2D[]): void {
  },
  fillRectangle: function(background: string, left: number, top: number, width: number, height: number): void {
  },
  text: function(color: string, left: number, top: number, text: string, style: TextStyle | Nothing): void {
  },
  line: function(color: string, lineWidth: number, left: number, top: number, right: number, bottom: number): void {
  },
  icon: function(color: string, icon: Icon, left: number, top: number, size: number): void {
  }
}
