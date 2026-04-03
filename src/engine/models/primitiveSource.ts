import {Primitive} from "./primitiveType"

export class PrimitiveSource {

  primitive: Primitive
  source: string

  get id() {
    return this.primitive.id
  }

  constructor(primitive: Primitive, source: string) {
    this.primitive = primitive
    this.source = source
  }
}
