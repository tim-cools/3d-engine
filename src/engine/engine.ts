import {World} from "./world"
import {Controller} from "./controller"
import {View} from "./view"

export class Engine {

  private readonly view: View
  private readonly controller: Controller
  private readonly world: World
  private context: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D
    this.view = new View(canvas)
    this.world = new World(this.view)
    this.controller = new Controller(this.view, this.world, canvas)
  }

  start() {
    window.addEventListener("resize", this.resize.bind(this))
    window.requestAnimationFrame(this.update.bind(this))
  }

  private update(time: number) {
    this.world.update(time)
    this.world.render(this.canvas, this.context)
    window.requestAnimationFrame(this.update.bind(this))
  }

  private resize(event: any) {
    console.log("resize")

    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.view.canvas = canvas
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
  }
}
