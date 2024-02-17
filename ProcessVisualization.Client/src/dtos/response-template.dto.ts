export class ResponseTemplateDto<T> {
  Message: string | null;
  IsSuccess: boolean | null;
  Data?: T;

  constructor() {
    this.Message = null;
    this.IsSuccess = null;
  }
}
