import {transform, Transformer} from "./transformations";

export interface Coordinate {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export class CoordinateValue implements Coordinate {

  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class TransformableCoordinate implements Coordinate {

  private readonly original: Coordinate;
  private current: Coordinate;

  public get x(): number {
    return this.current.x;
  }

  public get y(): number {
    return this.current.y;
  }

  public get z(): number {
    return this.current.z;
  }

  constructor(coordinate: Coordinate) {
    this.original = coordinate;
    this.current = this.original;
  }

  public static new(x: number, y: number, z: number) {
    const coordinate = new CoordinateValue(x, y, z);
    return new TransformableCoordinate(coordinate);
  }

  transform(transformers: readonly Transformer[]) {
    this.current = transform(this.original, transformers);
  }
}

export class Coordinate2D {

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(coordinate: Coordinate) {
    return new Coordinate2D(this.x + coordinate.x, this.y + coordinate.y);
  }
}
