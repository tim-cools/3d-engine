import {Size} from "./size"
import {Point, Segment} from "./basics"
import {Model} from "./model"
import {SpaceModel} from "./spaceModel"
import {Nothing, nothing} from "../nothing"
import {translateSpaceSegment, translateSpaceTriangle} from "./transformations"
import {Intersection, intersectionTriangleLineSegment} from "../intersection/intersection"
import {Triangle} from "./triangle"
import {equalsTolerancePoint} from "./equals"

export class SubtractModel extends Model{

  protected constructor(vertices: readonly Segment[], triangles: readonly Triangle[], contains: (coordinate: Point) => boolean, onBoundary: (coordinate: Point) => boolean) {
    super(vertices, triangles, contains, onBoundary)
  }

  static create(master: Model, subtract: SpaceModel, newPosition: Point, scale: Size): SpaceModel {

    const segments: Segment[] = []
    const intersections: Point[] = []

    for (const segment of master.segments) {
      const beginInSubtract = subtract.contains(segment.begin)
      const endInSubtract = subtract.contains(segment.end)
      if (beginInSubtract && endInSubtract) {
        continue
      }
      if (!beginInSubtract && !endInSubtract) {
        segments.push(segment)
      }
      if (beginInSubtract || endInSubtract) {
        const partial = SubtractModel.partial(subtract, segment, intersections)
        if (partial != nothing) {
          segments.push(partial)
        }
      }
    }

    for (const segment of subtract.model.segments) {
      const subtractToMaster = translateSpaceSegment(segment, subtract)
      const beginInMaster = master.contains(subtractToMaster.begin)
      const endInMaster = master.contains(subtractToMaster.end)

      if (beginInMaster && endInMaster) {
        if (master.onBoundary(subtractToMaster.begin)) {
          intersections.push(subtractToMaster.begin)
          console.log("begin: " + subtractToMaster.begin)
        }
        if (master.onBoundary(subtractToMaster.end)) {
          intersections.push(subtractToMaster.end)
          console.log("end:  " + subtractToMaster.end)
        }
        //segments.push(subtractToMaster)
      }

      if (beginInMaster || endInMaster) {
        const partial = SubtractModel.partial(subtract, segment, intersections)
        if (partial != nothing) {
          //segments.push(partial)
        }
      }
    }

    this.addIntersectionsPath(intersections, segments)

    const result = new SubtractModel(segments, [], this.notSupported, this.notSupported)
    return new SpaceModel(result, newPosition, scale)
  }

  private static addIntersectionsPath(intersections: Point[], segments: Segment[]) {
    if (intersections.length <= 1) return
    const start = intersections[0]
    let begin = intersections[0]
    intersections.splice(0, 1)
    while (intersections.length > 0) {
      const end = this.closestPoint(intersections, begin)
      segments.push(new Segment(begin, end))
      begin = end
    }
    segments.push(new Segment(start, begin))
  }

  private static notSupported(point: Point): boolean {
    throw new Error("not supported")
  }

  private static partial(subtract: SpaceModel, segment: Segment, intersections: Point[]): Segment | Nothing {
    console.log("partial: " + segment)

    for (let index = 0; index < subtract.model.triangles.length; index++){
      const triangle = subtract.model.triangles[index]
      const translated = translateSpaceTriangle(triangle, subtract)
      // console.log(" >" + index + "> " + translated)

/*      if (index == 147) {
        debugger
      }*/

      if (equalsTolerancePoint(translated.point1, segment.begin) || equalsTolerancePoint(translated.point1, segment.end)
       || equalsTolerancePoint(translated.point2, segment.begin) || equalsTolerancePoint(translated.point2, segment.end)
       || equalsTolerancePoint(translated.point3, segment.begin) || equalsTolerancePoint(translated.point3, segment.end)) {
        console.log("> equalsTolerancePoint: " + index)
      }

      const intersection = intersectionTriangleLineSegment(translated, segment)
      if (intersection.type == Intersection.Point) {
        console.log("> intersection.Point: " + intersection.point)
        intersections.push(intersection.point)
        return SubtractModel.partialSegment(subtract, segment, intersection.point)
      } else {
        //console.log("intersection.type: " + Intersection[intersection.type])
      }
    }
    return nothing
  }

  private static partialSegment(subtract: SpaceModel, segment: Segment, intersectionPoint: Point) {
    if (subtract.contains(segment.begin)) {
      return new Segment(intersectionPoint, segment.end)
    } else {
      return new Segment(segment.begin, intersectionPoint)
    }
  }

  private static closestPoint(intersections: Point[], point: Point) {

    let closest = intersections[0]
    let closestDistance = point.distanceToPoint(intersections[0])
    let closestIndex = 0

    for (let index = 1; index < intersections.length; index++) {
      const intersection = intersections[index]
      const distance = point.distanceToPoint(intersection)

      if (distance < closestDistance) {
        closest = intersection
        closestDistance = distance
        closestIndex = index
      }
    }
    intersections.splice(closestIndex, 1)
    return closest
  }
}
