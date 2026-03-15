
export interface HasRenderStyle {
  setShowBoundaries(showBoundaries: boolean): void
  setStyle(style: RenderStyle): void
}

export enum RenderStyle {
  Wireframe,
  Solid,
  WireframeDebug,
}
