interface IPermission {
  readonly id: number;
  readonly value: string;
}

export interface IJwtPayload {
  readonly id: string;
  readonly email: string;
  readonly permissions: IPermission[];
}
