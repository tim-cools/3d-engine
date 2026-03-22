import {CubeModel, SpaceModel, Subtract} from "../../engine/models"
import {SubtractModels} from "../../engine/intersections"
import {SphereModel} from "../../engine/models/sphereModel"

test('create cube with faces', async () => {

  const model = CubeModel.create(1)
  const models = new SubtractModels(model, SpaceModel.empty)

  const result = Subtract.segments(models)

  expect(result.faces.length).toEqual(12)
})

test('create sphere with faces', async () => {

  const model = SphereModel.create(5)
  const models = new SubtractModels(model, SpaceModel.empty)

  const result = Subtract.segments(models)

  expect(result.faces.length).toEqual(92)
})
