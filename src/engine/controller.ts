import {View} from "./view"
import {World} from "./world"
import {firstOrDefault} from "../infrastructure"
import {Point2D} from "./models"
import {Context} from "./context"
import {KeyDown} from "./events"

type KeyHandler = { key: string, handler: () => void }

export class Controller {

  private readonly keyHandlers: KeyHandler[]

  private readonly world: World
  private readonly view: View
  private readonly context: Context

  private mouseIsDown: boolean = false
  private mouseX: number = 0
  private mouseY: number = 0
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
  }

  private mouseUp() {
    this.mouseIsDown = false
  }

  private mouseMove(event: MouseEvent): any {

    const point = new Point2D(event.x, event.y)

    this.context.events.mouse.move(point, this.mouseIsDown)

    if (!this.mouseIsDown) return

    this.moveCamera(event)
    this.mouseX = event.x
    this.mouseY = event.y
  }

  private moveCamera(event: MouseEvent) {
    const offsetX = this.mouseX - event.x
    const offsetY = this.mouseY - event.y
    if (this.shiftDown) {
      this.view.moveCamera(offsetX, offsetY, null)
    } else {
      this.view.rotate(-offsetY / 100, offsetX / 100)
    }
  }
}
