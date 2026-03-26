import {Text} from "../../infrastructure/nothing"
import {ApplicationContext} from "../applicationContext"
import {Object} from "../objects"

export type SceneFactory = (context: ApplicationContext) => Object[]

export class Scene {

  readonly title: Text
  readonly objects: SceneFactory

  constructor(title: Text, objects: SceneFactory) {
    this.title = title
    this.objects = objects
  }
}
