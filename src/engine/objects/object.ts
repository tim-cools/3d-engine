import {Transformations} from "..";
import {Shape} from "../shapes";

export interface Object {
  readonly transformations: Transformations;

  shapes(): readonly Shape[];

  update(timeMilliseconds: number): void;
}
