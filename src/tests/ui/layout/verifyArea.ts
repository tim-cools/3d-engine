import {ElementArea} from "../../../engine/ui/elementArea"
import {Verify} from "../../infrastructure"

export function verifyArea(value: ElementArea, left: number, top: number, width: number, height: number) {
  Verify.model(value, context => context
    .areEqual(area => area.left, left)
    .areEqual(area => area.top, top)
    .areEqual(area => area.width, width)
    .areEqual(area => area.height, height))
}
