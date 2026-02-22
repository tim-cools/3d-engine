import {Object} from ".";
import {Colors, Transformations, View} from "..";
import {Line2D, Shape} from "../shapes";

export class Overlay implements Object {

  private view: View;

  public readonly transformations: Transformations = {};

  constructor(view: View) {
    this.view = view;
  }

  public shapes(): readonly Shape[] {

    const width = this.view.width;
    const height = this.view.height;
    const widthMiddle = width / 2;
    const heightMiddle = height / 2;

    const horizontal = Line2D.new(Colors.white, 0, heightMiddle, width, heightMiddle);
    const vertical = Line2D.new(Colors.white, widthMiddle, 0, widthMiddle, height);

    return [horizontal, vertical];
  }

  public update(timeMilliseconds: number): void {
  }
}
