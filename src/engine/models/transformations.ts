import {Point, Point2D, Segment} from "./basics"
import {Size} from "./size"
import {Triangle} from "./triangle"

export function dontTransform(value: Point): Point {
  return value
}

export function transform(value: Point, transformers: readonly Transformer[]): Point {
  for (const transformer of transformers) {
    value = transformer(value)
  }
  return value
}

export interface Transformer {
  (value: Point): Point
}

export interface SpaceObject {
  readonly position: Point
  //rotation: Rotation
  readonly scale?: Size
}

export interface Space2D {
  translate(point: Point2D): Point2D
}

export interface Space {
  translate(point: Point): Point
}

export function translateSpaceSegment(value: Segment, space: SpaceObject): Segment {
  const begin = translateSpace(value.begin, space)
  const end = translateSpace(value.end, space)
  return new Segment(begin, end)
}

export function translateSpace(value: Point, space: SpaceObject): Point {
  if (space.scale) {
    let scaler = multiply(space.scale)
    value = scaler(value)
  }
  let mover = add(space.position)
  value = mover(value)
  return value
}

export function translateSpaceTriangle(value: Triangle, space: SpaceObject): Triangle {
  return new Triangle(
    translateSpace(value.point1, space),
    translateSpace(value.point2, space),
    translateSpace(value.point3, space)
  )
}

export function invertSpace(value: Point, space: SpaceObject): Point {
  let mover = subtract(space.position)
  value = mover(value)
  if (space.scale) {
    let scaler = divide(space.scale)
    value = scaler(value)
  }
  return value
}

export function moveBy(xOffset: number | null = null, yOffset: number | null = null, zOffset: number | null = null): Transformer {
  return (value: Point): Point =>
    new Point(
      xOffset ? value.x + xOffset : value.x,
      yOffset ? value.y + yOffset : value.y,
      zOffset ? value.z + zOffset : value.z)
}

export function rotateX(radiant: number) {
  return (value: Point): Point =>
    new Point(
      value.x,
      value.y * Math.cos(radiant) - value.z * Math.sin(radiant),
      value.y * Math.sin(radiant) + value.z * Math.cos(radiant)
    )
}

export function rotateY(radiant: number) {
  return (value: Point): Point =>
    new Point(
      value.x *  Math.cos(radiant) + value.z * Math.sin(radiant),
      value.y,
      value.x * -Math.sin(radiant) + value.z * Math.cos(radiant)
    )
}

export function rotateZ(angle: number): Transformer {
  return (value: Point): Point =>
    new Point(
      value.x * Math.cos(angle) - value.y * Math.sin(angle),
      value.x * Math.sin(angle) + value.y * Math.cos(angle),
      value.z
    )
}

export function add(position: Point) {
  return (value: Point): Point =>
    new Point(value.x + position.x, value.y + position.y, value.z + position.z)
}

export function subtract(position: Point) {
  return (value: Point): Point =>
    new Point(value.x - position.x, value.y - position.y,value.z - position.z)
}

export function multiply(scale: Size) {
  return (value: Point): Point =>
    new Point(value.x * scale.x, value.y * scale.y, value.z * scale.z)
}

export function multiplyFactor(factor: number) {
  return (value: Point): Point =>
    new Point(value.x * factor, value.y * factor, value.z * factor)
}

export function divide(scale: Size) {
  return (value: Point): Point =>
    new Point(value.x / scale.x, value.y / scale.y, value.z / scale.z)
}
