import {Rotation} from "./rotation";
import {Coordinate, Coordinate2D, CoordinateValue, TransformableCoordinate} from "./coordinate";
import {subtract, moveBy, transform} from "./transformations";

export class View {

  private canvas: HTMLCanvasElement;

  private rotation: Rotation = new Rotation(-45, -45, 0);

  private viewPort: Coordinate = new CoordinateValue(0, 0, 750);
  private camera: Coordinate = TransformableCoordinate.new(0, 0, 1500);

  public get width(): number {
    return this.canvas.width;
  }

  public get height(): number {
    return this.canvas.height;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public translate(coordinate: Coordinate): Coordinate2D {

    const widthMiddle = this.width / 2;
    const heightMiddle = this.height / 2;

    const transformers = [
      this.rotation.transformer(),
      subtract(this.camera)
    ];

    const transformed = transform(coordinate, transformers);
    const u = this.viewPort.z / transformed.z * transformed.x; // + e.x;
    const v = this.viewPort.z / transformed.z * transformed.y; // + e.y;

    return new Coordinate2D(widthMiddle - u, heightMiddle + v)
  }

  moveCamera(x: number, y: number) {
    this.camera = transform(this.camera, [moveBy(x, y)]);
  }

  rotate(x: number, y: number, z: number) {
    this.rotation.rotate(x, y, z);
  }
}
