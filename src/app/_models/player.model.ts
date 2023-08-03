import { Frame } from "./frame.model";

export interface Player {
  id: number;
  name: string;
  frames: Frame[];
}
