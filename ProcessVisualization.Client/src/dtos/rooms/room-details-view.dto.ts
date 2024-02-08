import { DocumentDto } from "src/dtos/documents/document.dto";
import { UserDto } from "src/dtos/user/user.dto";
import { RoomViewDto } from "./room-view.dto";

export class RoomDetailsViewDto extends RoomViewDto {
  Users: UserDto[] = [];
  Documents: DocumentDto[] = [];

  constructor() {
    super();
  }
}
