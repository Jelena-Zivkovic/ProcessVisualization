export class ResponseTemplateDto<T> {
    ErrorMessage: string | null;
    IsSuccess: boolean | null;
    Data?: T;

    constructor() {
        this.ErrorMessage = null;
        this.IsSuccess = null;
    }
}
