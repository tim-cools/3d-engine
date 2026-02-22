import {Colors, Coordinate, rotateX, rotateZ, Size, Transformations, View} from "..";
import {Line, Shape} from "../shapes";

export class Cube implements Object {

  private readonly view: View;
  private readonly shapesValue: Line[];
  private readonly size: Size;
  private readonly position: Coordinate;

  public readonly transformations: Transformations;

  constructor(view: View, position: Coordinate, size: Size) {
    this.view = view;
    this.position = position;
    this.size = size;
    this.shapesValue = this.createShapes();
    this.transformations = {
      move: position
    }
  }

  public shapes(): readonly Shape[] {
    return this.shapesValue;
  }

  public update(timeMilliseconds: number): void {
    const offset = timeMilliseconds / 3600;
    for (const shape of this.shapesValue) {
      shape.update([
        rotateZ(offset),
        rotateX(offset),
        //rotateY(offset),
      ]);
    }
  }

  private segments(color: string, beginX: number, beginY: number, beginZ: number, endX: number, endY: number, endZ: number) {

    const segmentsNumber = 25;
    const animateX = beginX != endX;
    const animateY = beginY != endY;
    const animateZ = beginZ != endZ;

    let startX = beginX;
    let startY = beginY;
    let startZ = beginZ;
    const xSize = Math.abs(beginX) + Math.abs(endX);
    const ySize = Math.abs(beginY) + Math.abs(endY);
    const zSize = Math.abs(beginZ) + Math.abs(endZ);

    const result = [];
    for (let index = 1; index <= segmentsNumber; index++) {
      const x = animateX ? (xSize * (1 / segmentsNumber) * index) + beginX : beginX;
      const y = animateY ? (ySize * (1 / segmentsNumber) * index) + beginY : beginY;
      const z = animateZ ? (zSize * (1 / segmentsNumber) * index) + beginZ : beginZ;

      result.push(
        new Line(
          this.view,
          color,
          this.size.scale(startX, startY, startZ),
          this.size.scale(x, y, z)));

      startX = x;
      startY = y;
      startZ = z;
    }
    return result;
  }

  private createShapes() {

    return [
      //back
      ...this.segments(Colors.red, -.5, -.5, -.5, .5, -.5, -.5),
      ...this.segments(Colors.red, -.5, -.5, -.5, -.5, .5, -.5),
      ...this.segments(Colors.red, .5, -.5, -.5, .5, .5, -.5),
      ...this.segments(Colors.red, -.5, .5, -.5, .5, .5, -.5),

      //z
      ...this.segments(Colors.green, -.5, -.5, -.5, -.5, -.5, .5),
      ...this.segments(Colors.green, .5, -.5, -.5, .5, -.5, .5),
      ...this.segments(Colors.green, -.5, .5, -.5, -.5, .5, .5),
      ...this.segments(Colors.green, .5, .5, -.5, .5, .5, .5),

      //front
      ...this.segments(Colors.yellow, -.5, -.5, .5, .5, -.5, .5),
      ...this.segments(Colors.yellow, -.5, -.5, .5, -.5, .5, .5),
      ...this.segments(Colors.yellow, .5, -.5, .5, .5, .5, .5),
      ...this.segments(Colors.yellow, -.5, .5, .5, .5, .5, .5)
    ];
  }
}
