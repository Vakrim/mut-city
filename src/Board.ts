import { Vec2 } from "./Math";
import FindNearest from "./FindNearest";

export class Board {
  static readonly LG_SIZE = 8;
  static readonly SIZE = Math.pow(2, Board.LG_SIZE);
  static readonly FIELDS = 1 << (2 * Board.LG_SIZE);

  fields: Field[];

  constructor() {
    const fields = new Array(Board.FIELDS);
    for (let n = 0; n < Board.FIELDS; n++) {
      const y = n >> Board.LG_SIZE;
      const x = n - (y << Board.LG_SIZE);
      fields[n] = new Field(new Vec2(x, y));
    }
    this.fields = fields;
  }

  findPath(from: Vec2, to: Vec2) {
    const fromField = this.getField(from);
    const toField = this.getField(to);

    const finder = new FindNearest(this, fromField, toField);
    return finder.solve();
  }

  getField(position: Vec2): Field;
  getField(x: number, y: number): Field;
  getField(posOrX: any, y?: number) {
    if (posOrX instanceof Vec2) {
      return this.fields[posOrX.x + (posOrX.y << Board.LG_SIZE)];
    } else {
      return this.fields[posOrX + (y << Board.LG_SIZE)];
    }
  }

  setFieldContent(x: number, y: number, content: any) {
    this.fields[x + (y << Board.LG_SIZE)].content = content;
  }

  getFieldPosition(field: Field) {
    const index = this.fields.indexOf(field);
    if (index === -1) {
      throw new Error("field not in board");
    }
    const y = index >> Board.LG_SIZE;
    const x = index - (y << Board.LG_SIZE);
    return { x, y };
  }
}

export class Field {
  content: any = null;
  position: Vec2;
  pathCost = 1;

  constructor(position: Vec2) {
    this.position = position;
  }
}

export const isEmptyField = (field: Field) => {
  return field.content === null;
};
