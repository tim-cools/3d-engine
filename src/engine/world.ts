import {View} from "./view";
import {Size} from "./size";
import {CoordinateValue} from "./coordinate";
import {Transformations} from "./transformations";
import {Shape} from "./shapes";
import {Sphere, Cube, Overlay, Raster, Object} from "./objects";

type ObjectShape = {
  shape: Shape;
  transformations: Transformations;
};

export class World {

  private readonly objects: Object[] = [];

  constructor(view: View) {
    this.objects.push(new Sphere(view, new CoordinateValue(0, 0, 0), new Size(500, 500, 500)));
    this.objects.push(new Cube(view, new CoordinateValue(500, 0, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(view, new CoordinateValue(-500, 0, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(view, new CoordinateValue(0, 500, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(view, new CoordinateValue(0, -500, 0), new Size(200, 200, 200)));
    this.objects.push(new Cube(view, new CoordinateValue(0, 0, 500), new Size(200, 200, 200)));
    this.objects.push(new Cube(view, new CoordinateValue(0, 0, -500), new Size(200, 200, 200)));
    this.objects.push(new Overlay(view));
    this.objects.push(new Raster(view, 1200, 200));
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
        result.push({transformations: object.transformations, shape: shape});
      }
    }
    return result;
  }

  render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

    context.clearRect(0, 0, canvas.width, canvas.height);

    const shapes = this.shapes();
    shapes.sort((first, second) => first.shape.z(first.transformations) < second.shape.z(second.transformations) ? -1 : 1);
    for (const objectShape of shapes) {
      objectShape.shape.render(objectShape.transformations, context);
    }
  }
}

