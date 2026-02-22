import {Transformer, rotateX, rotateY, rotateZ} from "./transformations";
import {Coordinate} from "./coordinate";

export class Rotation {

  private xTransformer: Transformer | null = null;
  private yTransformer: Transformer | null = null;
  private zTransformer: Transformer | null = null;

  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  constructor(x: number, y: number, z: number) {
    this.updateX(x);
    this.updateY(y);
    this.updateZ(z);
  }

  private updateX(x: number) {
    if (this.x == x) return;
    this.x = x;
    this.xTransformer = x != 0 ? rotateX(x) : null;
  }

  private updateY(y: number) {
    if (this.y == y) return;
    this.y = y;
    this.yTransformer = y != 0 ? rotateY(y) : null;
  }

  private updateZ(z: number) {
    if (this.z == z) return;
    this.z = z;
    this.zTransformer = z != 0 ? rotateZ(z) : null;
  }

  transformer(): Transformer {
    return (value: Coordinate): Coordinate => {
      if (this.xTransformer) {
        value = this.xTransformer(value);
      }
      if (this.yTransformer) {
        value = this.yTransformer(value);
      }
      if (this.zTransformer) {
        value = this.zTransformer(value);
      }
      return value;
    };
  }

  rotate(x: number, y: number, z: number) {
    this.updateX(this.x + x);
    this.updateY(this.y + y);
    this.updateZ(this.z + z);
  }
}
