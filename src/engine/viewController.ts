import {View} from "./view";

export class ViewController {

  private mouseIsDown: boolean = false;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private shiftDown: boolean = false;
  private view: View;

  constructor(view: View, canvas: HTMLCanvasElement) {
    this.view = view;
    canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('keydown', this.keyDown.bind(this));
  }

  private keyUp(event: KeyboardEvent) {
    console.log("keyUp: " + event.key);
    if (event.key == "Shift") {
      this.shiftDown = false;
    }
  }

  private keyDown(event: KeyboardEvent) {
    console.log("keyDown: " + event.key);
    if (event.key == "Shift") {
      this.shiftDown = true;
    }
  }

  private mouseDown(event: MouseEvent) {
    this.mouseIsDown = true;
    this.mouseX = event.x;
    this.mouseY = event.y;
  }

  private mouseUp() {
    this.mouseIsDown = false;
  }

  private mouseMove(event: MouseEvent): any {

    if (!this.mouseIsDown) return;

    const offsetX = this.mouseX - event.x;
    const offsetY = this.mouseY - event.y;
    if (this.shiftDown) {
      this.view.moveCamera(offsetX, offsetY);
    } else {
      this.view.rotate(-offsetY / 100, offsetX / 100, 0);
    }
    this.mouseX = event.x;
    this.mouseY = event.y;
  }
}
