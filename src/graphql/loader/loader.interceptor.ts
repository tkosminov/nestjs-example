import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { UserLoaderById } from '../../oauth/user/loader/by_id.loader';

import { BookLoaderById } from '../../core/book/loader/by_id.loader';
import { BookLoaderByUserId } from '../../core/book/loader/by_user_id.loader';

const generateDataLoaders = () => {
  return {
    UserLoaderById: new UserLoaderById().generateDataLoader(),
    BookLoaderById: new BookLoaderById().generateDataLoader(),
    BookLoaderByUserId: new BookLoaderByUserId().generateDataLoader(),
  };
};

@Injectable()
export class LoaderInterceptor implements NestInterceptor {
  // tslint:disable-next-line: no-any
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const gqlExecutionContext = GqlExecutionContext.create(context);
    const ctx = gqlExecutionContext.getContext();

    const loaders = generateDataLoaders();

    Object.keys(loaders).forEach(key => {
      ctx[key] = loaders[key];
    });

    return next.handle();
  }
}
