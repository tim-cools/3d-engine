import {Shape2D} from "."
import {
  Transformer,
  Space2D, Point2D
} from "../models"
import {Colors, View2D} from ".."

export type Info = {
  scene: string,
  renderStyle: string,
  algorithm: string
}

export class InfoShape2D implements Shape2D {

  readonly color: string
  readonly colorBackground : string
  readonly id: string
  readonly info: Info

  constructor(id: string, color: string, colorBackground: string, info: Info) {
    this.id = id
    this.color = color
    this.colorBackground = colorBackground
    this.info = info
  }

  render(space: Space2D, view: View2D, context: CanvasRenderingContext2D) {

    const start = new Point2D(view.width - 350, 50)

    const height = 90
    const width = 300

    this.border(start, height, width, context)
    this.infoText(start, context)
  }

  update(transformers: readonly Transformer[]) {
  }

  private border(start: Point2D, height: number, width: number, context: CanvasRenderingContext2D) {
    const points = [
      start,
      start.add(0, height),
      start.add(width, height),
      start.add(width, 0),
    ]

    context.strokeStyle = this.color
    context.fillStyle = this.colorBackground
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(points[points.length - 1].x, points[points.length - 1].y)
    for (let index = 0; index < points.length; index++) {
      context.lineTo(points[index].x, points[index].y)
    }
    context.fill()
    context.stroke()
  }

  private infoText(start: Point2D, context: CanvasRenderingContext2D) {
    context.fillStyle = Colors.gray.dark
    context.font = "15px sans-serif"

    const lineHeight = 25
    const paddingX = 15
    const paddingY = 25
    this.addText(context, `Scene (0-9): ${this.info.scene}`, start.add(paddingX, paddingY))
    this.addText(context, `Render (r): ${this.info.renderStyle}`, start.add(paddingX, paddingY + lineHeight))
    this.addText(context, `Algorithm (a): ${this.info.algorithm}`, start.add(paddingX, paddingY + lineHeight * 2))
  }

  private addText(context: CanvasRenderingContext2D, text: string, position: Point2D) {
    context.fillText(text, position.x, position.y)
  }
}
