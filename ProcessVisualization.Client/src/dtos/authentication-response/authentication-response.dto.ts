export class AuthenticationResponseDto {
    AccessToken: string;
    RefreshToken: string;
    ExpiresIn: number | null;
    TokenType: string;
    FirstTime: boolean;

    constructor() {
        this.AccessToken = "";
        this.RefreshToken = "";
        this.ExpiresIn = null;
        this.TokenType = "";
        this.FirstTime = false;
    }
}
