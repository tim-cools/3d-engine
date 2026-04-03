import {Primitive} from "./primitiveType"

export class PrimitiveSource {

  primitive: Primitive
  source: string

  get id() {
    return this.primitive.id
  }

  constructor(primitive: Primitive, source: string = "model") {
    this.primitive = primitive
    this.source = source
  }
}
