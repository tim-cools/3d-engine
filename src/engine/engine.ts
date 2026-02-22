import {World} from "./world";
import {ViewController} from "./viewController";
import {View} from "./view";

export class Engine {

  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly view: View;
  private readonly viewController: ViewController;
  private readonly world: World;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.view = new View(canvas);
    this.viewController = new ViewController(this.view, canvas);
    this.world = new World(this.view);
  }

  public update(time: number) {
    this.world.update(time);
    this.world.render(this.canvas, this.context);
  }
}
