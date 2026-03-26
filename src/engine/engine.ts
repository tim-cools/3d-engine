import {World} from "./world"
import {Controller} from "./controller"
import {View} from "./view"
import {Context} from "./scenes/sceneContext"
import {createScenes} from "./scenes"

export class Engine {

  private readonly view: View
  private readonly controller: Controller
  private readonly world: World
  private readonly canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private stopped: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D
    this.view = new View(canvas)

    const scenes = createScenes()
    const globalContext = new Context(scenes)

    this.world = new World(this.view, scenes, globalContext)
    this.controller = new Controller(this.view, this.world, canvas, globalContext)
  }

  start() {
    window.addEventListener("resize", this.resize.bind(this))
    window.addEventListener("unload", this.stop.bind(this))
    window.requestAnimationFrame(this.update.bind(this))
  }

  private stop() {
    this.stopped = true
  }

  private update(time: number) {
    if (this.stopped) return
    this.world.update(time)
    this.world.render(this.canvas, this.context)
    window.requestAnimationFrame(this.update.bind(this))
  }

  private resize() {
    console.log("resize")

    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.view.canvas = canvas
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
  }
}
