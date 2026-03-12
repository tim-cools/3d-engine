import {Point, Size} from "../../engine/models"
import {SegmentsContext, Verify} from "../infrastructure"
import {createSegmentsLogger} from "./createSegmentsLogger"
import {subtractSphereTestModelAkaDeathStar} from "./subtractSphereTestModelAkaDeathStar"

test('subtract sphere from sphere', async () => {

  const logger = createSegmentsLogger()
  const model = subtractSphereTestModelAkaDeathStar(logger)

  Verify.model(model, context => context
    .areEqual(model => model.scale, Size.default)
    .areEqual(model => model.position, Point.null)
    .collection(model => model.segments, context => new SegmentsContext(context)
      .primarySegments(4593)
      .secondarySegments(829)
      .thirdSegments(117)
      .disabledSegments(0)
      .log(logging => logger.dump(logging))
    )
  )
})
