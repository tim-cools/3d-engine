import {Coordinate2D} from "../coordinate";
import {Shape} from "./shape";
import {Transformations} from "../transformations";

export class Line2D implements Shape {

  public readonly color: string;
  public readonly begin: Coordinate2D;
  public readonly end: Coordinate2D;

  constructor(color: string, begin: Coordinate2D, end: Coordinate2D) {
    this.color = color;
    this.begin = begin;
    this.end = end;
  }

  static new(color: string, xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    const begin = new Coordinate2D(xBegin, yBegin);
    const end = new Coordinate2D(xEnd, yEnd);
    return new Line2D(color, begin, end);
  }

  public z(transformations: Transformations) {
    return 0;
  }

  public render(transformations: Transformations, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: ${this.begin.x}, ${this.begin.y}, ${this.end.x}, ${this.end.y}`)

    const begin = this.begin;
    const end = this.end;
    context.strokeStyle = this.color;
    context.lineWidth = 20;
    context.beginPath();
    context.moveTo(begin.x, begin.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}
