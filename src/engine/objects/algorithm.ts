
export interface HasAlgorithm {
  setAlgorithm(algorithm: Algorithm): void
}

export enum Algorithm {
  SubtractSegments,
  SubtractFaces
}
