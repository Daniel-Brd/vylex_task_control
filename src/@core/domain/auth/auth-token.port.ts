export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export interface IAuthTokenGenerator {
  generate(payload: AuthTokenPayload): Promise<string>;
}
