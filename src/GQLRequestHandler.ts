import { Observable } from 'rxjs';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BuildableType, BuilderType, Nullable, Try } from 'javascriptutilities';

import {
  RequestGenerator as Generator,
  ResultProcessor as Processor,
  RequestHandlerType,
} from 'jsrequestframework';

import * as Req from './GQLRequest';
import * as Res from './GQLQueryResult';

export function builder<Cache = InMemoryCache>(): Builder<Cache> {
  return new Builder<Cache>();
}

/**
 * Represents a GraphQL request handler.
 * @extends {RequestHandlerType<Req.Self,Res.Type<any>>} Request handler
 * extension.
 */
export interface Type extends RequestHandlerType<Req.Self,Res.Type<any>> {}

/**
 * Represents a GraphQL request handler.
 * @template Cache Apollo cache type.
 * @implements {BuildableType<Builder<Cache>>} Buildable implementation.
 * @implements {Type} Type implementation.
 */
export class Self<Cache = InMemoryCache> implements BuildableType<Builder<Cache>>, Type {
  client: Nullable<ApolloClient<Cache>>;

  public constructor() {}
  public builder = (): Builder<Cache> => builder<Cache>();
  public cloneBuilder = (): Builder<Cache> => this.builder().withBuildable(this);

  public graphQLClient = (): ApolloClient<Cache> => {
    if (this.client !== undefined && this.client !== null) {
      return this.client;
    } else {
      throw new Error('GraphQL client cannot be null');
    }
  }

  public request<Prev,Res2>(
    _previous: Try<Prev>,
    _generator: Generator<Prev,Req.Self>,
    _processor: Processor<Res.Type<any>,Res2>
  ): Observable<Try<Res2>> {
    return Observable.empty();
  }
}

/**
 * Builder for GraphQL request handler.
 * @template Cache Apollo cache type.
 * @implements {BuilderType<Self<Cache>>} Builder implementation.
 */
export class Builder<Cache = InMemoryCache> implements BuilderType<Self<Cache>> {
  private readonly handler: Self<Cache>;

  public constructor() {
    this.handler = new Self<Cache>();
  }

  /**
   * Set the handler client.
   * @param {Nullable<ApolloClient<Cache>>} client An ApolloClient instance.
   * @returns {this} The current Builder instance.
   */
  public withGraphQLClient = (client: Nullable<ApolloClient<Cache>>): this => {
    this.handler.client = client;
    return this;
  }

  public withBuildable = (buildable: Nullable<Self<Cache>>): this => {
    if (buildable !== undefined && buildable !== null) {
      return this.withGraphQLClient(buildable.client);
    } else {
      return this;
    }
  }

  public build = (): Self<Cache> => this.handler;
}