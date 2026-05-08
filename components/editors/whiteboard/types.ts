export type WBObjectType = "sticky" | "text" | "rect" | "ellipse" | "ink" | "frame";

export interface WBBaseObject {
  id: string;
  type: WBObjectType;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  rotation?: number;
}

export interface WBSticky extends WBBaseObject {
  type: "sticky";
  text: string;
  color: string;
}

export interface WBText extends WBBaseObject {
  type: "text";
  text: string;
  fontSize: number;
  weight: number;
}

export interface WBRect extends WBBaseObject {
  type: "rect";
  fill: string;
  stroke: string;
  text?: string;
}

export interface WBEllipse extends WBBaseObject {
  type: "ellipse";
  fill: string;
  stroke: string;
  text?: string;
}

export interface WBInk extends WBBaseObject {
  type: "ink";
  /** SVG path data, with coordinates relative to (x, y). */
  path: string;
  stroke: string;
  strokeWidth: number;
}

export interface WBFrame extends WBBaseObject {
  type: "frame";
  label: string;
}

export type WBObject = WBSticky | WBText | WBRect | WBEllipse | WBInk | WBFrame;

export interface WBState {
  objects: WBObject[];
  /** Highest z-index used so far (monotonically increases as objects are added/raised). */
  topZ: number;
}

export const STICKY_COLORS = [
  "#FFE082", // amber
  "#FFAB91", // coral
  "#A5D6A7", // green
  "#90CAF9", // blue
  "#CE93D8", // purple
  "#F48FB1", // pink
  "#B0BEC5", // grey
];

export function emptyState(): WBState {
  return { objects: [], topZ: 0 };
}
