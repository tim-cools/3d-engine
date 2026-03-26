import {Algorithm} from "./algorithm"
import {StateIdentifier} from "./state"
import {StateHandlerBase} from "./stateHandler"

export const AlgorithmStateIdentifier = new StateIdentifier<AlgorithmState>("algorithm")

export interface AlgorithmState {
  readonly value: Algorithm
  readonly caption: string
  switchAlgorithm(): void
}

export class AlgorithmStateHandler extends StateHandlerBase<AlgorithmState> {

  constructor() {
    super(AlgorithmStateIdentifier)
  }

  protected createState(): AlgorithmState {
    return {
      value: Algorithm.SubtractFaces,
      caption: "SubtractFaces",
      switchAlgorithm: () => this.switchAlgorithm()
    }
  }

  switchAlgorithm() {
    this.state.update(state => {
      const value = (state.value + 1) % (Algorithm.SubtractFaces + 1)
      console.log(`switchSAlgorithm: ${Algorithm[value]}`)
      return {
        ...state,
        value: value,
        caption: Algorithm[value]
      }
    })
  }
}
