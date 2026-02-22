import {Shape} from ".";
import {TransformableCoordinate, Transformer, Transformations, transformMove, transformMoveAndScale, View} from "..";

export class Line implements Shape {

  public readonly color: string;
  public readonly begin: TransformableCoordinate;
  public readonly end: TransformableCoordinate;
  public readonly view: View;

  constructor(view: View, color: string, begin: TransformableCoordinate, end: TransformableCoordinate) {
    this.color = color;
    this.begin = begin;
    this.end = end;
    this.view = view;
  }

  static new(view: View, color: string, xBegin: number, yBegin: number, zBegin: number, xEnd: number, yEnd: number, zEnd: number) {
    const begin = TransformableCoordinate.new(xBegin, yBegin, zBegin);
    const end = TransformableCoordinate.new(xEnd, yEnd, zEnd);
    return new Line(view, color, begin, end);
  }

  public z(transformations: Transformations) {
    const {begin, end} = this.transform(transformations);
    return (begin.z + end.z) / 2;
  }

  public render(transformations: Transformations, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: (${this.begin.x}, ${this.begin.y}, ${this.begin.z}) (${this.end.x}, ${this.end.y}, ${this.end.z})`)
    const {begin, end} = this.transform(transformations);
    const beginView = this.view.translate(begin);
    const endView = this.view.translate(end);
    //console.log(`drawLine: ${begin.x}, ${begin.y}, ${end.x}, ${end.y}`)
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(beginView.x, beginView.y);
    context.lineTo(endView.x, endView.y);
    context.stroke();
  }

  public update(transformers: readonly Transformer[]) {
    this.begin.transform(transformers);
    this.end.transform(transformers);
  }

  private transform(transformations: Transformations) {
    const begin = transformMove(this.begin, transformations);
    const end = transformMoveAndScale(this.end, transformations);
    return {begin, end};
  }
}
