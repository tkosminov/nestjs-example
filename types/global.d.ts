interface IAppSettings {
  readonly port: number;
  readonly bodyLimit: string;
  readonly bodyParameterLimit: number;
}

interface ICorsSettings {
  readonly allowedOrigins: string[];
  readonly allowedUrls: string[];
  readonly allowedMethods: string[];
  readonly allowedCredentials: boolean;
  readonly allowedHeaders: string[];
}

interface ILogSettings {
  readonly level: string;
  readonly silence: string[];
}

interface IJwtSettings {
  readonly secretKey: string;
  readonly algorithm: string;
  readonly tokenExpiresIn: number;
  readonly refreshTokenExpiresIn: number;
}

interface IRedisSettings {
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly key?: string;
}

interface IWssSettings {
  readonly port: number;
  readonly pingInterval: number;
  readonly pingTimeout: number;
  readonly path: string;
}

interface IRabbitMQSettings {
  readonly exchange: string;
  readonly name: string;
  readonly host: string;
  readonly vhost: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
}

interface IGraphqlSettings {
  readonly playground: boolean;
  readonly debug: boolean;
  readonly introspection: boolean;
  readonly installSubscriptionHandlers: boolean;
}

interface IGraphqlApis {
  [service: string]: string;
}

interface IGuard {
  readonly username: string;
  readonly password: string;
}
