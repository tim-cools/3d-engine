export type Color = string

export class Colors {

  static readonly red: string = "red"
  static readonly yellow: string = "yellow"
  static readonly green: string = "green"
  static readonly blue: string = "blue"
  static readonly white: string = "white"
  static readonly lightGray: string = "lightgray"
  static readonly darkGray: string = "darkgray"

  static primary = {
    dark: "#001333",
    darker: "#193155",
    middle: "#556992",
    lighter: "#90a3cf",
    light: "#cee1ff",
  }

  static secondary = {
    dark: "#4f2f03",
    darker: "#885208",
    middle: "#cc7b0a",
    lighter: "#ffab35",
    light: "#f3d3a7",
  }

  static third = {
    dark: "#0e390f",
    darker: "#1b691d",
    middle: "#269d29",
    lighter: "#8add8c",
    light: "#badfba",
  }

  static gray = {
    dark: "#555",
    darker: "#777",
    middle: "#999",
    lighter: "#CCC",
    light: "#EEE",
  }
}

export function colorLuminance(hex: string, lum: number) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}
