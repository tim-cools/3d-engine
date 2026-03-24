import {Scene} from "./scenes"
import {Point2D} from "../models"
import {Title} from "../objects"
import {Colors} from "../colors"
import {SceneContext} from "./sceneContext"

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
    text("x: toggle axis"),
    text("b: toggle boundaries"),
    text("r: change render style (wireframe, faces, debug, faces wires, ...)"),
    text("a: change value (subtract segment (not complete), subtract triangles)"),
    text(""),
    text("0: intro"),
  ]

  for (let index = 0; index < scenes.length; index++) {
    const scene = scenes[index]
    texts.push(text(`${(index + 1).toString()}: ${scene.title}`))
  }

  return new Scene("Intro", (context: SceneContext) => texts)
}
