export interface IJwtPayload {
  readonly id: string;
  readonly email: string;
  readonly permissions: string[];
}
