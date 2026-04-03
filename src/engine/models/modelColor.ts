import {ModelType} from "./modelType"
import {Colors} from "../../infrastructure/colors"

export function modelColor(modelType: ModelType) {
  if (modelType == ModelType.Primary) {
    return Colors.primary.middle
  } else if (modelType == ModelType.Secondary) {
    return Colors.secondary.middle
  } else if (modelType == ModelType.Third) {
    return Colors.third.lighter
  } else if (modelType == ModelType.Highlight) {
    return Colors.highlight
  } else if (modelType == ModelType.HighlightMax) {
    return Colors.highlightMax
  } else if (modelType == ModelType.Utility) {
    return Colors.gray.darker
  } else if (modelType == ModelType.UtilityLight) {
    return Colors.gray.lighter
  } else if (modelType == ModelType.Disabled) {
    return Colors.primary.light
  }
  throw new Error("Unknown model type: " + ModelType[modelType])
}
