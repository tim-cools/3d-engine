import {SphereModel} from "../../engine/models/sphereModel"
import {Verify} from "../infrastructure"

function numberOfSegments(segments: number): number {
  const segmentsHorizontal = 2 * segments
  const verticalSegmentsPer = segments
  const horizontalSegmentsPer = segments - 1
  return (verticalSegmentsPer + horizontalSegmentsPer) * segmentsHorizontal
}

function numberOfTriangles(segments: number): number {
  const segmentsHorizontal = 2 * segments
  const topBottomRows = 2
  const trianglesPerQuadrant = 2
  const trianglesTopBottomRow = topBottomRows * segmentsHorizontal
  const trianglesPerOtherRow = (segments - topBottomRows) * trianglesPerQuadrant * segmentsHorizontal
  return trianglesTopBottomRow + trianglesPerOtherRow
}

function verifySphere(segments: number) {

  const segmentsTotal = numberOfSegments(segments)
  const trianglesTotal = numberOfTriangles(segments)

  const sphere = SphereModel.create(segments)

  Verify.model(sphere, context => context
    .areEqual(sphere => sphere.segments.length, segmentsTotal)
    .areEqual(sphere => sphere.faces.length, trianglesTotal)
  )
}

it.each([2, 3, 4, 10, 25, 99, 256])("create sphere '%s'", segments => {
  verifySphere(segments)
});
