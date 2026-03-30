export interface AttachmentPropertyValue<T> {
  value: T
  type: string
}

export interface TypedAttachmentProperty<T> {
  (value: T): AttachmentPropertyValue<T>
  type: string
}

export interface AttachmentProperty {
  type: string
}

export function createAttachmentProperty<T>(type: string): TypedAttachmentProperty<T> {
  const result = function (value: T) {
    return {
      value: value,
      type: type
    }
  }
  result.type = type
  return result
}
