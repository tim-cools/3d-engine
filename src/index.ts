import './index.css';

class Colors {
  public static readonly red: string = "red";
  public static readonly yellow: string = "yellow";
  public static readonly green: string = "green";
  public static readonly white: string = "white";
  public static readonly lightgray: string = "lightgray";
}

interface Coordinate {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

class TransformableCoordinate implements Coordinate {

  private readonly original: Coordinate;
  private current: Coordinate;

  public get x(): number {
    return this.current.x;
  }

  public get y(): number {
    return this.current.y;
  }

  public get z(): number {
    return this.current.z;
  }

  constructor(coordinate: Coordinate) {
    this.original = coordinate;
    this.current = this.original;
  }

  public static new(x: number, y: number, z: number) {
    const coordinate = new CoordinateValue(x, y, z);
    return new TransformableCoordinate(coordinate);
  }

  transform(transformers: readonly Transformer[]) {
      this.current = transform(this.original, transformers);
  }
}

function transform(value: Coordinate, transformers: readonly Transformer[]): Coordinate {
  for (const transformer of transformers) {
    value = transformer(value);
  }
  return value;
}

class CoordinateValue implements Coordinate {

  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

interface Transformer {
  (value: Coordinate): Coordinate;
}

function move(xOffset: number | null = null, yOffset: number | null = null, zOffset: number | null = null): Transformer {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      xOffset ? value.x + xOffset : value.x,
      yOffset ? value.y + yOffset : value.y,
      zOffset ? value.z + zOffset : value.z);
}

function subtract(position: Coordinate) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x - position.x,
      value.y - position.y,
      value.z - position.z
    );
}

function rotateX(radiant: number) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x,
      value.y * Math.cos(radiant) + value.z * -Math.sin(radiant),
      value.y * Math.sin(radiant) + value.z *  Math.cos(radiant)
    );
}

function rotateY(radiant: number) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x *  Math.cos(radiant) + value.z * Math.sin(radiant),
      value.y,
      value.x * -Math.sin(radiant) + value.z * Math.cos(radiant)
    );
}

function rotateZ(radiant: number) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(
      value.x * Math.cos(radiant) + value.y * -Math.sin(radiant),
      value.x * Math.sin(radiant) + value.y *  Math.cos(radiant),
      value.z
    );
}

function translate(translate: Coordinate) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(value.x + translate.x, value.y + translate.y, value.z + translate.z);
}

function scale(scale: Size) {
  return (value: Coordinate): Coordinate =>
    new CoordinateValue(value.x * scale.x, value.y * scale.y, value.z * scale.z);
}

class Orientation {

  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Size {

  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  transformableCoordinate(x: number, y: number, z: number): TransformableCoordinate {
    const coordinate = new CoordinateValue(this.x * x, this.y * y, this.z * z);
    return new TransformableCoordinate(coordinate);
  }
}

class Rotation {

  private xTransformer: Transformer | null = null;
  private yTransformer: Transformer | null = null;
  private zTransformer: Transformer | null = null;

  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  constructor(x: number, y: number, z: number) {
    this.updateX(x);
    this.updateY(y);
    this.updateZ(z);
  }

  private updateX(x: number) {
    if (this.x == x) return;
    this.x = x;
    this.xTransformer = x != 0 ? rotateX(x) : null;
  }

  private updateY(y: number) {
    if (this.y == y) return;
    this.y = y;
    this.yTransformer = y != 0 ? rotateY(y) : null;
  }

  private updateZ(z: number) {
    if (this.z == z) return;
    this.z = z;
    this.zTransformer = z != 0 ? rotateZ(z) : null;
  }

  transformer(): Transformer {
    return (value: Coordinate): Coordinate => {
      if (this.xTransformer) {
        value = this.xTransformer(value);
      }
      if (this.yTransformer) {
        value = this.yTransformer(value);
      }
      if (this.zTransformer) {
        value = this.zTransformer(value);
      }
      return value;
    };
  }

  rotate(x: number, y: number, z: number) {
    this.updateX(this.x + x);
    this.updateY(this.y + y);
    this.updateZ(this.z + z);
  }
}

class Coordinate2D {

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(coordinate: Coordinate) {
    return new Coordinate2D(this.x + coordinate.x, this.y + coordinate.y);
  }
}

class Line implements Shape {

  public readonly color: string;
  public readonly begin: TransformableCoordinate;
  public readonly end: TransformableCoordinate;

  public get z() {
    return (this.begin.z + this.end.z) / 2;
  }

  constructor(color: string, begin: TransformableCoordinate, end: TransformableCoordinate) {
    this.color = color;
    this.begin = begin;
    this.end = end;
  }

  static new(color: string, xBegin: number, yBegin: number, zBegin: number, xEnd: number, yEnd: number, zEnd: number) {
    const begin = TransformableCoordinate.new(xBegin, yBegin, zBegin);
    const end = TransformableCoordinate.new(xEnd, yEnd, zEnd);
    return new Line(color, begin, end);
  }

  public render(translate: Coordinate, scale: Size, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: (${this.begin.x}, ${this.begin.y}, ${this.begin.z}) (${this.end.x}, ${this.end.y}, ${this.end.z})`)
    const begin = view.translate(this.begin, translate);
    const end = view.translate(this.end, translate, scale);
    //console.log(`drawLine: ${begin.x}, ${begin.y}, ${end.x}, ${end.y}`)
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(begin.x, begin.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  transform(transformers: readonly Transformer[]) {
    this.begin.transform(transformers);
    this.end.transform(transformers);
  }
}

class Point implements Shape {

  public readonly color: string;
  public readonly size: number;
  public readonly coordinate: TransformableCoordinate;

  public get z() {
    return this.coordinate.z;
  }

  constructor(color: string, x: number, y: number, z: number, size: number) {
    this.color = color;
    this.size = size;
    this.coordinate = TransformableCoordinate.new(x, y, z);
  }

  public render(translate: Coordinate, scale: Size, context: CanvasRenderingContext2D) {
    //console.log(`point: 3D (${this.coordinate.x}, ${this.coordinate.y}, ${this.coordinate.z})`)
    const coordinate2D = view.translate(this.coordinate, translate);
    const radius = this.size;
    const halfSize = radius / 2;
    //console.log(`     > 2D ${coordinate2D.x}, ${coordinate2D.y}`)
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(coordinate2D.x - halfSize, coordinate2D.y - halfSize, radius, radius, 0, 0, 360);
    context.stroke();
  }
}

class Line2D implements Shape {

  public readonly color: string;
  public readonly begin: Coordinate2D;
  public readonly end: Coordinate2D;

  public get z() {
    return 0;
  }

  constructor(color: string, begin: Coordinate2D, end: Coordinate2D) {
    this.color = color;
    this.begin = begin;
    this.end = end;
  }

  static new(color: string, xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    const begin = new Coordinate2D(xBegin, yBegin);
    const end = new Coordinate2D(xEnd, yEnd);
    return new Line2D(color, begin, end);
  }

  public render(translate: Coordinate, scale: Size, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: ${this.begin.x}, ${this.begin.y}, ${this.end.x}, ${this.end.y}`)

    const begin = this.begin.translate(translate);
    const end = this.end.translate(translate);
    context.strokeStyle = this.color;
    context.lineWidth = 20;
    context.beginPath();
    context.moveTo(begin.x, begin.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}

interface Shape {
  z: number;
  render(translate: Coordinate, scale: Size, context: CanvasRenderingContext2D): void;
}

interface Object {
  translate: Coordinate;
  scale: Size;
  shapes(): readonly Shape[] ;
  update(timeMilliseconds: number): void;
}

class Cube implements Object {

  private readonly shapesValue: Line[];
  private size: Size;

  public readonly translate: TransformableCoordinate;
  public readonly scale: Size = new Size(1, 1, 1);

  constructor(position: Coordinate, size: Size) {
    this.translate = new TransformableCoordinate(position);
    this.size = size;
    this.shapesValue = this.createShapes();
  }

  public shapes(): readonly Shape[] {
    return this.shapesValue;
  }

  public update(timeMilliseconds: number): void {
    const offset = timeMilliseconds / 3600;
    for (const shape of this.shapesValue) {
      /* shape.begin.rotateX(offset);
      shape.end.rotateX(offset);
      shape.begin.rotateY(offset);
      shape.end.rotateY(offset); */
      shape.transform([
        //rotateZ(offset),
        rotateX(offset),
        //rotateY(offset),
      ]);
    }
  }

  private segments(color: string, beginX: number, beginY: number, beginZ: number, endX: number, endY: number, endZ: number) {

    const segmentsNumber = 25;
    const animateX = beginX != endX;
    const animateY = beginY != endY;
    const animateZ = beginZ != endZ;

    let startX = beginX;
    let startY = beginY;
    let startZ = beginZ;
    const xSize = Math.abs(beginX) + Math.abs(endX);
    const ySize = Math.abs(beginY) + Math.abs(endY);
    const zSize = Math.abs(beginZ) + Math.abs(endZ);

    const result = [];
    for (let index = 1; index <= segmentsNumber; index++) {
      const x = animateX ? (xSize * (1 / segmentsNumber) * index) + beginX : beginX;
      const y = animateY ? (ySize * (1 / segmentsNumber) * index) + beginY : beginY;
      const z = animateZ ? (zSize * (1 / segmentsNumber) * index) + beginZ : beginZ;

      result.push(
        new Line(
          color,
          this.size.transformableCoordinate(startX, startY, startZ),
          this.size.transformableCoordinate(x, y, z)));

      startX = x;
      startY = y;
      startZ = z;
    }
    return result;
  }

  private createShapes() {

    return [
      //back
      ...this.segments(Colors.red, -.5, -.5, -.5, .5, -.5, -.5),
      ...this.segments(Colors.red, -.5, -.5, -.5, -.5, .5, -.5),
      ...this.segments(Colors.red, .5, -.5, -.5, .5, .5, -.5),
      ...this.segments(Colors.red, -.5, .5, -.5, .5, .5, -.5),

      //z
      ...this.segments(Colors.green, -.5, -.5, -.5, -.5, -.5, .5),
      ...this.segments(Colors.green, .5, -.5, -.5, .5, -.5, .5),
      ...this.segments(Colors.green, -.5, .5, -.5, -.5, .5, .5),
      ...this.segments(Colors.green, .5, .5, -.5, .5, .5, .5),

      //front
      ...this.segments(Colors.yellow, -.5, -.5, .5, .5, -.5, .5),
      ...this.segments(Colors.yellow, -.5, -.5, .5, -.5, .5, .5),
      ...this.segments(Colors.yellow, .5, -.5, .5,.5, .5, .5),
      ...this.segments(Colors.yellow, -.5, .5, .5, .5, .5, .5)
    ];
  }
}

class Overlay implements Object {

  public readonly translate: TransformableCoordinate = TransformableCoordinate.new(0, 0, 0);
  public readonly scale: Size = new Size(1, 1, 1);

  public shapes(): readonly Shape[] {

    const width = canvas.width;
    const height = canvas.height;
    const widthMiddle = width / 2;
    const heightMiddle = height / 2;

    const horizontal = Line2D.new(Colors.white, 0, heightMiddle, width, heightMiddle);
    const vertical = Line2D.new(Colors.white, widthMiddle, 0, widthMiddle, height);

    return [horizontal, vertical];
  }

  public update(timeMilliseconds: number): void {
  }
}

class Raster implements Object {

  private readonly size: number;
  private readonly step: number;
  private readonly shapesValue: readonly Shape[];

  public readonly translate: TransformableCoordinate = TransformableCoordinate.new(0, 0, 0);
  public readonly scale: Size = new Size(1, 1, 1);

  constructor(size: number, step: number) {
    this.size = size;
    this.step = step;
    this.shapesValue = this.createShapes();
  }

  public createShapes(): readonly Shape[] {
    const half = this.size / 2;
    const result: Shape[] = [];
    for (let x = -half ; x <= half ; x += this.step) {
      for (let y = -half ; y <= half ; y += this.step) {
        for (let z = -half ; z <= half ; z += this.step) {
          result.push(new Point(Colors.red, x, y, z, 2))
        }
      }
    }
    return result;
  }

  public shapes(): readonly Shape[] {
    return this.shapesValue;
  }

  public update(timeMilliseconds: number): void {
  }
}

type ObjectShape = {
  shape: Shape;
  position: Coordinate,
  scale: Size,
};

class World {

  private readonly objects: Object[] = [];

  constructor() {
    //this.objects.push(new Cube(new CoordinateValue(0, 0, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(new CoordinateValue(500, 0, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(new CoordinateValue(-500, 0, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(new CoordinateValue(0, 500, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(new CoordinateValue(0, -500, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(new CoordinateValue(0, 0, 500), new Size(200, 200, 200)));
    this.objects.push(new Cube(new CoordinateValue(0, 0, -500), new Size(200, 200, 200)));
    this.objects.push(new Overlay());
    this.objects.push(new Raster(1200, 200));
  }

  public update(difference: number) {
    for (const object of this.objects) {
      object.update(difference);
    }
  }

  public shapes(): ObjectShape[] {
    const result: ObjectShape[] = [];
    for (const object of this.objects) {
      for (const shape of object.shapes()) {
        result.push({position: object.translate, scale: object.scale, shape: shape});
      }
    }
    return result;
  }

  render(canvas: HTMLCanvasElement) {
    const shapes = world.shapes();
    shapes.sort((first, second) => first.shape.z < second.shape.z ? -1 : 1);
    for (const objectShape of shapes) {
      objectShape.shape.render(objectShape.position, objectShape.scale, context);
    }
  }
}

class ViewController {

  private mouseIsDown: boolean = false;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private shiftDown: boolean = false;
  private view: View;

  constructor(view: View) {
    this.view = view;
    canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('keydown', this.keyDown.bind(this));
  }

  private keyUp(event: KeyboardEvent) {
    console.log("keyUp: " + event.key);
    if (event.key == "Shift") {
      this.shiftDown = false;
    }
  }

  private keyDown(event: KeyboardEvent) {
    console.log("keyDown: " + event.key);
    if (event.key == "Shift") {
      this.shiftDown = true;
    }
  }

  private mouseDown(event: MouseEvent) {
    this.mouseIsDown = true;
    this.mouseX = event.x;
    this.mouseY = event.y;
  }

  private mouseUp(event: MouseEvent) {
    this.mouseIsDown = false;
  }

  private mouseMove(event: MouseEvent): any {

    if (!this.mouseIsDown) return;

    const offsetX = this.mouseX - event.x;
    const offsetY = this.mouseY - event.y;
    if (this.shiftDown) {
      view.moveCamera(offsetX, offsetY);
    } else {
      view.rotate(-offsetY / 100, offsetX / 100, 0);
    }
    this.mouseX = event.x;
    this.mouseY = event.y;
  }
}

class View {

  private readonly viewport_size: number = 1;

  private rotation: Rotation = new Rotation(0, 0, 0);

  private viewPort: Coordinate = new CoordinateValue(0, 0, 750);
  private camera: Coordinate = TransformableCoordinate.new(0, 0, 1500);

  public translate(coordinate: Coordinate, translation: Coordinate | null = null, ratio: Size | null = null): Coordinate2D {

    const width = canvas.width;
    const height = canvas.height;
    const widthMiddle = width / 2;
    const heightMiddle = height / 2;

    /*
    const viewPoint = 0.1;
    const u = coordinate.x + coordinate.z * viewPoint; // (coordinate.x > 0 ? viewPoint : -viewPoint);
    const v = coordinate.y + coordinate.z * viewPoint; // (coordinate.y > 0 ? viewPoint : -viewPoint);
    return new Coordinate2D(widthMiddle + u, heightMiddle + v)
    */

    const transformers = [];
    if (translation) {
      transformers.push(translate(translation));
    }
    if (ratio) {
      transformers.push(scale(ratio));
    }
    transformers.push(this.rotation.transformer())
    transformers.push(subtract(this.camera));
    const d = transform(coordinate, transformers);

    //const u = e.z / d.z * d.x + e.x;
    //const v = e.z / d.z * d.y + e.y;

    const u = this.viewPort.z / d.z * d.x; // + e.x;
    const v = this.viewPort.z / d.z * d.y; // + e.y;

    return new Coordinate2D(widthMiddle + u, heightMiddle + v)
  }

  moveCamera(x: number, y: number) {
    this.camera = transform(this.camera, [move(x, y)]);
  }

  rotate(x: number, y: number, z: number) {
    this.rotation.rotate(x, y, z);
  }
}


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const world = new World();
const view = new View();
const viewController = new ViewController(view);

function updateState(time: number) {
  world.update(time);
  render(world);
  window.requestAnimationFrame((updateState));
}

function render(world: World) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  world.render(canvas)
}

window.requestAnimationFrame(updateState);
