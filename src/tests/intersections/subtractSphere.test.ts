import {Subtract} from "../../engine/models"
import {SegmentsContext, Verify} from "../infrastructure"
import {createSegmentsLogger} from "./createSegmentsLogger"
import {subtractSphereTestModelAkaDeathStar} from "./subtractSphereTestModelAkaDeathStar"
import {analyseSubtractFaces} from "../../engine/intersections"

test('analyse sphere from sphere, used for debugging', async () => {
  const models = subtractSphereTestModelAkaDeathStar(10, 7)
  const summary = analyseSubtractFaces(models)
})

test('subtract sphere from sphere', async () => {

  const logger = createSegmentsLogger()
  const models = subtractSphereTestModelAkaDeathStar(10, 7)
  const model = Subtract.segments(models, logger)

  Verify.model(model, context => context
    .collection(model => model.segments, context => new SegmentsContext(context)
      .primarySegments(357)
      .secondarySegments(72)
      .thirdSegments(30)
      .log(logging => logger.dump(logging))
    )
  )
})

test('face sphere from sphere', async () => {

  const logger = createSegmentsLogger()
  const models = subtractSphereTestModelAkaDeathStar(10, 7)
  const model = Subtract.faces(models, logger)

  Verify.model(model, context => context
    .collection(model => model.segments, context => new SegmentsContext(context)
      //todo complete when algo is complete
      .log(logging => logger.dump(logging))
    )
  )
})
