import {Object} from ".";
import {Line, Shape} from "../shapes";
import {
  Size,
  View,
  Coordinate,
  CoordinateValue,
  TransformableCoordinate,
  rotateY,
  rotateZ,
  Transformations,
  Colors
} from "..";

export class Sphere implements Object {

  private readonly view: View;
  private readonly shapesValue: Line[];
  private readonly translate: TransformableCoordinate;
  private readonly scale: Size = new Size(1, 1, 1);
  private readonly size: Size;

  public get transformations(): Transformations {
    return {
      move: this.translate,
      scale: this.scale
    }
  }

  constructor(view: View, position: Coordinate, size: Size) {
    this.view = view;
    this.translate = new TransformableCoordinate(position);
    this.size = size;
    this.shapesValue = this.createShapes();
  }

  public shapes(): readonly Shape[] {
    return this.shapesValue;
  }

  public update(timeMilliseconds: number): void {
    const offset = timeMilliseconds / 3600;
    for (const shape of this.shapesValue) {
      shape.update([
        //rotateZ(offset),
        //rotateX(offset),
        //rotateY(offset),
      ]);
    }
  }

  private lines(color: string) {

    const segmentsNumber = 8;

    const size = 1;
    const half = size / 2;
    const pi = 3.14159;
    const startTop = new CoordinateValue(0, -half, 0);

    const result = [];
    const rotateNext = rotateY(pi / segmentsNumber);

    for (let indexHorizontal = 0; indexHorizontal < segmentsNumber * 2; indexHorizontal++) {

      const rotateHorizontal = rotateY(pi / segmentsNumber * indexHorizontal);
      let valueVertical = startTop;
      for (let indexVertical = 0; indexVertical <= segmentsNumber; indexVertical++) {

        const rotateVertical = rotateZ(pi / segmentsNumber * indexVertical);
        const nextVertical = rotateHorizontal(rotateVertical(startTop));

        result.push(
          new Line(
            this.view,
            color,
            this.size.scaleCoordinate(valueVertical),
            this.size.scaleCoordinate(nextVertical)));

        if (indexVertical > 0 && indexVertical <= segmentsNumber) {
          const nextHorizontal = rotateNext(valueVertical);
          result.push(
            new Line(
              this.view,
              color,
              this.size.scaleCoordinate(valueVertical),
              this.size.scaleCoordinate(nextHorizontal)));
        }

        valueVertical = nextVertical;
      }
    }

    return result;
  }

  private createShapes() {
    return [
      ...this.lines(Colors.red),
    ];
  }
}
