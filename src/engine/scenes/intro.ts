import {Scene} from "./scenes"
import {Point2D} from "../models"
import {Title} from "../objects"
import {Colors} from "../colors"

export function intro(scenes: readonly Scene[]): Scene {

  let line = 1

  function text(text: string) {
    const position = new Point2D(.05, line++ * .05)
    return new Title("title." + line, Colors.gray.dark, position, 35, text)
  }

  const texts = [
    text("Fun with 3D graphics and typescript."),
    text(""),
    text("Mouse: rotate world (+shift: move camera)"),
    text("Keys 0-9: change scene"),
    text("Keys arrows: move world (+shift: move camera))"),
    text("s: change object style"),
    text(""),
    text("0: intro"),
  ]

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i]
    texts.push(text(`${(i + 1).toString()}: ${scene.title}`))
  }

  return new Scene("Intro", texts)
}
