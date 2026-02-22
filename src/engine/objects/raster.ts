import {View} from "../view";
import {Point, Shape} from "../shapes";
import {Transformations} from "../transformations";
import {Colors} from "../colors";

export class Raster implements Object {

  private readonly view: View;
  private readonly size: number;
  private readonly step: number;
  private readonly shapesValue: readonly Shape[];

  public readonly transformations: Transformations = {};

  constructor(view: View, size: number, step: number) {
    this.view = view
    this.size = size;
    this.step = step;
    this.shapesValue = this.createShapes();
  }

  public createShapes(): readonly Shape[] {
    const half = this.size / 2;
    const result: Shape[] = [];
    for (let x = -half; x <= half; x += this.step) {
      for (let y = -half; y <= half; y += this.step) {
        for (let z = -half; z <= half; z += this.step) {
          result.push(new Point(this.view, Colors.darkGray, x, y, z, 2))
        }
      }
    }
    return result;
  }

  public shapes(): readonly Shape[] {
    return this.shapesValue;
  }

  public update(timeMilliseconds: number): void {
  }
}
