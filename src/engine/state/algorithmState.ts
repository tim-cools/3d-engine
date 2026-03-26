import {Algorithm} from "./algorithm"
import {State, StateIdentifier, UpdatableState} from "./state"

export const AlgorithmStateIdentifier = new StateIdentifier<AlgorithmState>("algorithm")

export interface AlgorithmState extends UpdatableState<AlgorithmState> {
  readonly value: Algorithm
  readonly caption: string
  switchAlgorithm(): void
}

export class AlgorithmStateHandler extends State<AlgorithmState> implements AlgorithmState {

  value: Algorithm = Algorithm.SubtractFaces
  caption: string = Algorithm[Algorithm.SubtractFaces]

  constructor() {
    super(AlgorithmStateIdentifier)
  }

  switchAlgorithm() {

    const value = (this.value + 1) % (Algorithm.SubtractFaces + 1)
    console.log(`switchSAlgorithm: ${Algorithm[value]}`)
    this.value = value
    this.caption = Algorithm[value]

    this.updated()
  }
}
