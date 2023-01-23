import { Vec2 } from "../Math";
import { Storage } from "../Storage";

export interface Building {
  readonly position: Vec2;
  readonly storage: Storage;

  startDay?(): void;

  produce?(): void;

  makeOffers?(): void;

  buyFromMarket?(): void;

  finishDay?(removeCompany: (building: Building) => void): void;
}
