import { DropdownItemDo } from './dropdown-item.do';

export interface DropdownDo<T extends DropdownItemDo> {
  payload: DropdownPayload<T>;
}
export type DropdownPayload<T> = { [id: number]: T };
