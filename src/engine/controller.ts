import {View} from "./view"
import {World} from "./world"
import {firstOrDefault} from "../infrastructure"

type KeyHandler = { key: string, handler: () => void }

export class Controller {

  private readonly keyHandlers: KeyHandler[]

  private mouseIsDown: boolean = false
  private mouseX: number = 0
  private mouseY: number = 0
  private shiftDown: boolean = false

  private world: World
  private view: View

  constructor(view: View, world: World, canvas: HTMLCanvasElement) {
    this.world = world
    this.view = view
    canvas.addEventListener('mousemove', this.mouseMove.bind(this))
    canvas.addEventListener('mouseup', this.mouseUp.bind(this))
    canvas.addEventListener('mousedown', this.mouseDown.bind(this))
    window.addEventListener('keyup', this.keyUp.bind(this))
    window.addEventListener('keydown', this.keyDown.bind(this))
    window.addEventListener('keypress', this.keyPress.bind(this))
    this.keyHandlers = this.createKeyHandlers()
  }

  private createKeyHandlers() {
    return [
      {key: "Shift", handler: () => this.shiftDown = true},
      {key: "ArrowDown", handler: () => this.view.moveCamera(null, null, -100)},
      {key: "ArrowUp", handler: () => this.view.moveCamera(null, null, 100)},
      {key: "r", handler: () => this.world.switchRenderStyle()},
      {key: "a", handler: () => this.world.switchAlgorithm()},
      {key: "x", handler: () => this.world.toggleAxis()},
      {key: "l", handler: () => this.world.logShapes()},
      {key: "b", handler: () => this.world.toggleShowBoundaries()}
    ]
  }

  private keyPress(event: KeyboardEvent) {
    if (event.key >= "0" && event.key <= "9") {
      this.world.setScene(parseInt(event.key))
      this.view.reset()
    }
  }

  private keyUp(event: KeyboardEvent) {
    if (event.key == "Shift") {
      this.shiftDown = false
    }
  }

  private keyDown(event: KeyboardEvent) {
    const keyHandler = firstOrDefault(this.keyHandlers, where => where.key == event.key)
    keyHandler?.handler.bind(this)()
  }

  private mouseDown(event: MouseEvent) {
    this.mouseIsDown = true
    this.mouseX = event.x
    this.mouseY = event.y
  }

  private mouseUp() {
    this.mouseIsDown = false
  }

  private mouseMove(event: MouseEvent): any {

    if (!this.mouseIsDown) return

    const offsetX = this.mouseX - event.x
    const offsetY = this.mouseY - event.y
    if (this.shiftDown) {
      this.view.moveCamera(offsetX, offsetY, null)
    } else {
      this.view.rotate(-offsetY / 100, offsetX / 100)
    }
    this.mouseX = event.x
    this.mouseY = event.y
  }
}
