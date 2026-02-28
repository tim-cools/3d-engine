import {View} from "./view"
import {World} from "./world"

export class Controller {

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
  }

  private keyPress(event: KeyboardEvent) {
    console.log("keyPress: " + event.key)
    if (event.key >= "0" && event.key <= "9") {
      this.world.setScene(parseInt(event.key))
      this.view.reset()
    }
  }

  private keyUp(event: KeyboardEvent) {
    console.log("keyUp: " + event.key)
    if (event.key == "Shift") {
      this.shiftDown = false
    }
  }

  private keyDown(event: KeyboardEvent) {
    console.log("keyDown: " + event.key)
    if (event.key == "Shift") {
      this.shiftDown = true
    } else if (event.key == "ArrowDown") {
      this.view.moveCamera(null, null, -100)
    } else if (event.key == "ArrowUp") {
      this.view.moveCamera(null, null, 100)
    } else if (event.key == "s") {
      this.world.switchObjectStyle()
    }
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
