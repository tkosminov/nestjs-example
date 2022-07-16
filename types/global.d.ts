interface IAppSettings {
  readonly port: number;
  readonly body_limit: string;
  readonly body_parameter_limit: number;
}

interface ICorsSettings {
  readonly allowed_origins: string[];
  readonly allowed_paths: string[];
  readonly allowed_methods: string[];
  readonly allowed_credentials: boolean;
  readonly allowed_headers: string[];
}

interface ILogSettings {
  readonly level: string;
  readonly silence: string[];
}

interface IJwtSettings {
  readonly secret_key: string;
  readonly algorithm: string;
  readonly access_token_expires_in: number;
  readonly refresh_token_expires_in: number;
}

interface IRedisSettings {
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly key?: string;
}

interface IWssSettings {
  readonly port: number;
  readonly ping_interval: number;
  readonly ping_timeout: number;
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
