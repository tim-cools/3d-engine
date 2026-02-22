import {Transformations} from "..";

export interface Shape {
  render(transformations: Transformations, context: CanvasRenderingContext2D): void;

  z(transformations: Transformations): number;
}
