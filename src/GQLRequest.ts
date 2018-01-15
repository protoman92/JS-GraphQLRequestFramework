import { BuildableType, BuilderType, JSObject, Nullable } from 'javascriptutilities';

import {
  MiddlewareFilter, 
  RequestType, 
  RequestBuilderType 
} from 'jsrequestframework';

export let builder = (): Builder => new Builder();

/**
 * Represents a GraphQL request.
 * @implements {BuildableType<Builder>} Buildable implementation.
 * @implements {RequestType} Request implementation.
 */
export class Self implements BuildableType<Builder>, RequestType {
  gqlQuery: Nullable<string>;
  gqlVariables: Nullable<JSObject<any>>;

  inclFilters: MiddlewareFilter[];
  exclFilters: MiddlewareFilter[];
  retryCount: number;
  rqDescription: Nullable<string>;

  public builder = (): Builder => builder();
  public cloneBuilder = (): Builder => this.builder().withBuildable(this);

  public query = (): string => {
    if (this.gqlQuery !== undefined && this.gqlQuery !== null) {
      return this.gqlQuery;
    } else {
      throw new Error(`Query cannot be nil for ${JSON.stringify(this)}`);
    }
  }

  public variables = (): Nullable<JSObject<any>> => this.gqlVariables;
  public exclusiveFilters = (): MiddlewareFilter[] => this.exclFilters;
  public requestDescription = (): string => this.rqDescription || '';
  public requestRetries = (): number => this.retryCount;

  public inclusiveFilters = (): Nullable<MiddlewareFilter[]> => {
    return this.inclFilters.length == 0 ? undefined : this.inclFilters;
  }
}

/**
 * Builder for GraphQL request.
 * @implements {BuilderType<Self>} Builder implementation.
 * @implements {RequestBuilderType} Request builder implementation.
 */
export class Builder implements BuilderType<Self>, RequestBuilderType {
  private readonly request: Self;

  public constructor() {
    this.request = new Self();
  }

  /**
   * Set the GraphQL query.
   * @param {Nullable<string>} query A string value.
   * @returns this The current Builder isntance.
   */
  public withQuery = (query: Nullable<string>): this => {
    this.request.gqlQuery = query;
    return this;
  }

  /**
   * Set inclusive filters.
   * @param {MiddlewareFilter[]} filters An Array of filters.
   * @returns this The current Builder instance.
   */
  public withInclusiveFilters = (filters: MiddlewareFilter[]): this => {
    this.request.inclFilters = filters;
    return this;
  }
  
  /**
   * Set exclusive filters.
   * @param {MiddlewareFilter[]} filters An Array of filters.
   * @returns this The current Builder instance.
   */
  public withExclusiveFilters = (filters: MiddlewareFilter[]): this => {
    this.request.exclFilters = filters;
    return this;
  }

  /**
   * Set request description.
   * @param {Nullable<string>} description A string value.
   * @returns this The current Builder instance.
   */
  public withRequestDescription = (description: Nullable<string>): this => {
    this.request.rqDescription = description;
    return this;
  }

  /**
   * Set retry count.
   * @param {number} retries A number value.
   * @returns this The current Builder instance.
   */
  public withRequestRetries = (retries: number): this => {
    this.request.retryCount = retries;
    return this;
  }

  public withBuildable = (buildable: Nullable<Self>): this => {
    if (buildable !== undefined && buildable !== null) {
      return this
        .withQuery(buildable.gqlQuery)
        .withInclusiveFilters(buildable.inclFilters)
        .withExclusiveFilters(buildable.exclFilters)
        .withRequestDescription(buildable.rqDescription)
        .withRequestRetries(buildable.retryCount);
    } else {
      return this;
    }
  }

  public build = (): Self => this.request;
}