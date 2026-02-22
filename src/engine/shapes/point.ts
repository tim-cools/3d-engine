import {TransformableCoordinate, Transformations, transformMove, View} from "..";
import {Shape} from ".";

export class Point implements Shape {

  public readonly view: View;
  public readonly color: string;
  public readonly size: number;
  public readonly coordinate: TransformableCoordinate;

  constructor(view: View, color: string, x: number, y: number, z: number, size: number) {
    this.view = view;
    this.color = color;
    this.size = size;
    this.coordinate = TransformableCoordinate.new(x, y, z);
  }

  public z(transformations: Transformations) {
    return transformMove(this.coordinate, transformations).z;
  }

  public render(transformations: Transformations, context: CanvasRenderingContext2D) {
    //console.log(`point: 3D (${this.coordinate.x}, ${this.coordinate.y}, ${this.coordinate.z})`)
    const coordinate = transformMove(this.coordinate, transformations);
    const coordinate2D = this.view.translate(coordinate);
    const radius = this.size;
    const halfSize = radius / 2;
    //console.log(`     > 2D ${coordinate2D.x}, ${coordinate2D.y}`)
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(coordinate2D.x - halfSize, coordinate2D.y - halfSize, radius, radius, 0, 0, 360);
    context.stroke();
  }
}
