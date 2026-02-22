import {CoordinateValue, TransformableCoordinate} from "./coordinate";
import {transform, scale} from "./transformations";

export class Size {

  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  scale(x: number, y: number, z: number): TransformableCoordinate {
    const coordinate = new CoordinateValue(this.x * x, this.y * y, this.z * z);
    return new TransformableCoordinate(coordinate);
  }

  scaleCoordinate(value: CoordinateValue): TransformableCoordinate {
    const coordinate = transform(value, [scale(this)]);
    return new TransformableCoordinate(coordinate);
  }
}
