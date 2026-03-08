import {SphereModel} from "../../engine/models/sphereModel"

test('create sphere 2 ', async () => {
  const sphere = SphereModel.create(2)
  expect(sphere.segments.length).toEqual(12)
})

test('create sphere 4 ', async () => {

  const sphere = SphereModel.create(4)
  const verticalSegmentsPer = 4
  const horizontalSegmentsPer = 3
  const interations = 8

  expect(sphere.segments.length).toEqual((verticalSegmentsPer + horizontalSegmentsPer) * interations)
})

test('create sphere 10 ', async () => {

  const sphere = SphereModel.create(10)
  const verticalSegmentsPer = 10
  const horizontalSegmentsPer = 9
  const interations = 20

  expect(sphere.segments.length).toEqual((verticalSegmentsPer + horizontalSegmentsPer) * interations)
})
