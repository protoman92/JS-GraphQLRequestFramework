import { GraphQLError } from 'graphql';
import { ApolloQueryResult } from 'apollo-client';
import { Try } from 'javascriptutilities';

/**
 * Represents a GraphQL query result. This is essentially the ApolloQueryResult,
 * but simplified to include only necessary parameters.
 * @template T Generics parameter.
 */
export interface Type<T> {
  data: T;
  errors: Try<GraphQLError[]>;
  loading: boolean;
}

/**
 * Create a query result from an ApolloQueryResult by stripping away unnecessary
 * elements.
 * @template T Generics parameter.
 * @param {ApolloQueryResult<T>} result A ApolloQueryResult instance.
 * @returns {Type<T>} A Type instance.
 */
export function fromResult<T>(result: ApolloQueryResult<T>): Type<T> {
  return {
    data: result.data,
    errors: Try.unwrap(result.errors, `No error found for ${result}`),
    loading: result.loading,
  };
}