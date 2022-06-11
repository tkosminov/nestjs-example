import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

import { IRMQHandler, RMQ_PROVIDER_OPTIONS, RMQ_ROUTES_OPTIONS } from './rmq.constants';

@Injectable()
export class RmqExplorer {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScannerService: MetadataScanner,
    private readonly reflector: Reflector
  ) {}

  public get handlers() {
    const providers = this.discoveryService.getProviders().filter((wrapper: InstanceWrapper) => {
      if (!wrapper?.metatype) {
        return false;
      }

      return !!this.reflector.get(RMQ_PROVIDER_OPTIONS, wrapper.metatype);
    });

    const handlers: IRMQHandler[] = [];

    providers.forEach((provider) => {
      const instance = provider.instance;

      if (instance) {
        const prototype = Object.getPrototypeOf(instance);

        if (prototype) {
          this.metadataScannerService.scanFromPrototype(instance, prototype, (name) => {
            const handler = prototype[name];

            const meta = Reflect.getMetadata(RMQ_ROUTES_OPTIONS, handler);

            if (meta) {
              handlers.push({
                meta,
                discoveredMethod: {
                  handler,
                  methodName: name,
                  parentClass: instance,
                },
              });
            }
          });
        }
      }
    });

    return handlers;
  }
}
