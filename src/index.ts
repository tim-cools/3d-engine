import './index.css'
import {Engine} from "./engine"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const engine = new Engine(canvas)
engine.start()
