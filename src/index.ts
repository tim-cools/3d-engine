import './index.css';
import {Engine} from "./engine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, context);

function update(time: number) {
  engine.update(time)
  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
