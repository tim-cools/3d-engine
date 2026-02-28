export type Color = string

export class Colors {

  public static readonly red: string = "red"
  public static readonly yellow: string = "yellow"
  public static readonly green: string = "green"
  public static readonly blue: string = "blue"
  public static readonly white: string = "white"
  public static readonly lightGray: string = "lightgray"
  public static readonly darkGray: string = "darkgray"

  public static primary = {
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
