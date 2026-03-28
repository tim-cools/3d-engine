import {Text} from "../../infrastructure/nothing"
import {ApplicationContext} from "../applicationContext"
import {Object} from "../objects"

export type SceneFactory = (context: ApplicationContext) => Object[]

export class Scene {

  readonly title: Text
  readonly createObjects: SceneFactory

  constructor(title: Text, createObjects: SceneFactory) {
    this.title = title
    this.createObjects = createObjects
  }
}
