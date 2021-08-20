interface IDBSettings {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
}

interface ILogSettings {
  readonly level: string;
  readonly silence: string[];
}

interface IJwtSettings {
  readonly secretKey: string;
  readonly expiresIn: number;
  readonly algorithms: string[];
}

interface IAppSettings {
  readonly port: number;
  readonly socketPort: number;
  readonly socketPingInterval: number;
  readonly socketPinkTimeout: number;
  readonly socketIoPath: string;
  readonly bodyLimit: string;
  readonly bodyParameterLimit: number;
}

interface ICorsSettings {
  readonly allowedOrigins: string[];
  readonly allowedUrls: string[];
  readonly allowedPaths: string[];
  readonly allowedMethods: string[];
  readonly allowedCredentials: boolean;
}

interface IGraphqlSettings {
  readonly playground: boolean;
  readonly debug: boolean;
  readonly introspection: boolean;
  readonly installSubscriptionHandlers: boolean;
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

interface IRedisSettings {
  readonly use: boolean;
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly key?: string;
}
