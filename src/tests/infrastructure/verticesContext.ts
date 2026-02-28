import {VerifyCollectionContext} from "./verifyCollectionContext";
import {Segment} from "../../engine/models";
import {Point} from "../../engine/models";
import {VerifyLogging} from "./verifyLogging";
import {segments} from "../../engine/models/segments";

export class VerticesContext {

  private readonly context: VerifyCollectionContext<Segment>;
  private readonly model: readonly Segment[];
  private readonly logging: VerifyLogging;
  private remaining: Segment[];

  constructor(context: VerifyCollectionContext<Segment>) {
    this.context = context;
    this.remaining = [...context.model];
    this.model = context.model;
    this.logging = context.logging;
  }

  public contains(segmentsNumber: number, beginX: number, beginY: number, beginZ: number, endX: number, endY: number, endZ: number, message: string | null): VerticesContext {
    const begin = new Point(beginX, beginY, beginZ);
    const end = new Point(endX, endY, endZ);
    const vertices = segments(segmentsNumber, begin, end);
    for (const vertex of vertices) {
      const vertice = this.context.model.findIndex(vertice => vertice.begin.equals(vertex.begin) && vertice.end.equals(vertex.end));
      if (vertice) {
        this.remaining = this.remaining.splice(vertice, 1)
      }
      this.logging.logAssert(vertice >= 0, message, `- contains vertice failed '${vertex.begin}'-'${vertex.end}': `);
    }
    return this;
  }

  public logRemaining() {
    for (const vertex of this.remaining) {
      this.logging.appendLine(`- remaining: '${vertex}'`);
    }
    return this;
  }
}
