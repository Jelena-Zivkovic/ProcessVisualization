import { ConnectionDto } from "./connection.dto";
import { ElementDto } from "./element.dto";

export class LabelDto extends ElementDto {
  X!: number;
  Y!: number;
  Width!: number;
  Height!: number;
  Text!: string;
  Anchor!: string;
  Hidden!: boolean;
  Bounds!: {
    X: number;
    Y: number;
    Width: number;
    Height: number;
  };

  Label?: LabelDto | undefined;
  Labels: LabelDto[] = [];
  //incoming: ConnectionDto[] = [];
  //outgoing: ConnectionDto[] = [];
}
