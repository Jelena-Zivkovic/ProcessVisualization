export class UserDto {
  Id!: number;
  Email: string;
  Name: string;
  ImageBase64?: string;

  constructor() {
    this.Email = "";
    this.Name = "";
    this.ImageBase64 = "";
  }
}
