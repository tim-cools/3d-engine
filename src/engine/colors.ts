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

  static gray = {
    dark: "#555",
    darker: "#777",
    middle: "#999",
    lighter: "#CCC",
    light: "#EEE",
  }
}
