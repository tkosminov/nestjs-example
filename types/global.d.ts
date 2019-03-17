type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Poss<T, K extends keyof T> = Partial<Pick<T, Exclude<keyof T, K>>>;

interface IDBSettings {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
}

interface ILogSettings {
  readonly level: string;
  readonly timestamps: boolean;
  readonly silence: string[];
}

interface IAppSettings {
  readonly secretKey: string;
}

interface IJwtSettings {
  readonly secretKey: string;
  readonly expiresIn: number;
}