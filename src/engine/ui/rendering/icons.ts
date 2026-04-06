import {firstOrDefault} from "../../../infrastructure"

export enum Icon {
  Empty,
  Close,
  Loop,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
}

export class IconEntry {

  icon: Icon
  path: string

  constructor(icon: Icon, path: string) {
    this.icon = icon
    this.path = path
  }
}

//copied from Material UI
const entries = [
  new IconEntry(Icon.Empty, ""),
  new IconEntry(Icon.Close, "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"),
  new IconEntry(Icon.Loop, "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8m0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4z"),
  new IconEntry(Icon.ArrowDown, "M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"),
  new IconEntry(Icon.ArrowUp, "M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"),
  new IconEntry(Icon.ArrowLeft, "M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z"),
  new IconEntry(Icon.ArrowRight, "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z")
]

export function getIconPath(icon: Icon) {
  const entry = firstOrDefault(entries, entry => entry.icon == icon)
  if (entry == null) {
    throw new Error("Couldn't find icon: " + Icon[icon])
  }
  return entry.path
}
