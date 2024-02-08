export class DocumentDto {
  Id!: number;
  Name!: string;
  CreatedAt!: Date;
  UpdatedAt?: Date;

  constructor() {
  }
}
