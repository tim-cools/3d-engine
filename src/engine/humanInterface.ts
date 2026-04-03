import {View} from "./view"
import {World} from "./world"
import {firstOrDefault} from "../infrastructure"
import {Point2D} from "./models"
import {Context} from "./context"
import {KeyDown} from "./events"

type KeyHandler = { key: string, handler: () => void }

export class HumanInterface {

  private readonly keyHandlers: KeyHandler[]

  private readonly world: World
  private readonly view: View
  private readonly context: Context

  private mouseIsDown: boolean = false
  private mouseX: number = 0
  private mouseY: number = 0
  private mouseOriginalX: number = 0
  private mouseOriginalY: number = 0
  private shiftDown: boolean = false

  constructor(view: View, world: World, canvas: HTMLCanvasElement, context: Context) {
    this.world = world
    this.view = view
    this.context = context
    canvas.addEventListener('mousemove', this.mouseMove.bind(this))
    canvas.addEventListener('mouseup', this.mouseUp.bind(this))
    canvas.addEventListener('mousedown', this.mouseDown.bind(this))
    window.addEventListener('keyup', this.keyUp.bind(this))
    window.addEventListener('keydown', this.keyDown.bind(this))
    this.keyHandlers = this.createKeyHandlers()
  }

  private createKeyHandlers() {
    return [
      {key: "Shift", handler: () => this.shiftDown = true},
      {key: "ArrowDown", handler: () => this.view.moveCamera(null, null, -100)},
      {key: "ArrowUp", handler: () => this.view.moveCamera(null, null, 100)},
      {key: "l", handler: () => this.world.logShapes()},
    ]
  }

  private keyUp(event: KeyboardEvent) {
    if (event.key == "Shift") {
      this.shiftDown = false
    }
  }

  private keyDown(event: KeyboardEvent) {
    const keyHandler = firstOrDefault(this.keyHandlers, where => where.key == event.key)
    keyHandler?.handler.bind(this)()
    this.context.events.publish(new KeyDown(event.key))
  }

  private mouseDown(event: MouseEvent) {
    this.context.events.mouse.down(new Point2D(event.x, event.y))
    this.mouseIsDown = true
    this.mouseX = event.x
    this.mouseY = event.y
    this.mouseOriginalX = event.x
    this.mouseOriginalY = event.y
  }

  private mouseUp() {
    this.mouseIsDown = false
  }

  private mouseMove(event: MouseEvent): any {

    const point = new Point2D(event.x, event.y)
    const pointInUI = this.world.pointInUI(point)

    this.context.events.mouse.move(point, this.mouseIsDown, pointInUI)

    if (this.mouseIsDown) {
      this.mouseMoveDown(event, pointInUI, point)
    }
  }

  private mouseMoveDown(event: MouseEvent, pointInUI: boolean, point: Point2D) {

    const offsetX = event.x - this.mouseX
    const offsetY = event.y - this.mouseY

    if (offsetX == 0 && offsetY == 0) return

    if (pointInUI) {
      this.context.events.mouse.drag(point, offsetX, offsetY, new Point2D(this.mouseOriginalX, this.mouseOriginalY))
    } else {
      this.moveCamera(event, offsetX, offsetY)
    }

    this.mouseX = event.x
    this.mouseY = event.y
  }

  private moveCamera(event: MouseEvent, offsetX: number, offsetY: number) {
    if (this.shiftDown) {
      this.view.moveCamera(offsetX, offsetY, null)
    } else {
      this.view.rotate(-offsetY / 100, offsetX / 100)
    }
  }
}
