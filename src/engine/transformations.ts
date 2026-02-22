import {Coordinate, CoordinateValue} from "./coordinate";
import {Size} from "./size";

export function transform(value: Coordinate, transformers: readonly Transformer[]): Coordinate {
  for (const transformer of transformers) {
    value = transformer(value);
  }
  return value;
}

export interface Transformer {
  (value: Coordinate): Coordinate;
}

export type Transformations = {
  move?: Coordinate,
  scale?: Size,
}

export function transformMove(value: Coordinate, transformations: Transformations): Coordinate {
  if (!transformations.move) return value;
  let mover = move(transformations.move);
  return mover(value);
}

export function transformMoveAndScale(value: Coordinate, transformations: Transformations): Coordinate {
  if (transformations.move) {
    let mover = move(transformations.move);
    value = mover(value);
  }
  if (transformations.scale) {
    let scaler = scale(transformations.scale);
    value = scaler(value);
  }
  return value;
}

export function moveBy(xOffset: number | null = null, yOffset: number | null = null, zOffset: number | null = null): Transformer {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      xOffset ? value.x + xOffset : value.x,
      yOffset ? value.y + yOffset : value.y,
      zOffset ? value.z + zOffset : value.z);
}

export function subtract(position: Coordinate) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x - position.x,
      value.y - position.y,
      value.z - position.z
    );
}

export function rotateX(radiant: number) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x,
      value.y * Math.cos(radiant) - value.z * Math.sin(radiant),
      value.y * Math.sin(radiant) + value.z * Math.cos(radiant)
    );
}

export function rotateY(radiant: number) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x *  Math.cos(radiant) + value.z * Math.sin(radiant),
      value.y,
      value.x * -Math.sin(radiant) + value.z * Math.cos(radiant)
    );
}

export function rotateZ(angle: number) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x * Math.cos(angle) - value.y * Math.sin(angle),
      value.x * Math.sin(angle) + value.y * Math.cos(angle),
      value.z
    );
}

export function move(translate: Coordinate) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(value.x + translate.x, value.y + translate.y, value.z + translate.z);
}

export function scale(scale: Size) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(value.x * scale.x, value.y * scale.y, value.z * scale.z);
}
