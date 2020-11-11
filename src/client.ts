import type { Route } from './schema';
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client/core';
import { routeVar } from './router';
import { hasAllVariables } from '@apollo-elements/lib/has-all-variables';

const uri =
  'https://api.spacex.land/graphql';

export const link = ApolloLink.from([
  new ApolloLink((operation, forward) =>
    hasAllVariables(operation) && forward(operation)),
  new HttpLink({ uri }),
]);

const cache =
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          route(): Route {
            return routeVar();
          },
        },
      },
      Route: {
        fields: {
          previousPathname(next: string): string {
            return next ?? '/';
          },
        },
      },
    },
  });

export const client =
  new ApolloClient({ cache, link });
