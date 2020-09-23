import type { Route } from './schema';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { routeVar } from './router';

const uri =
  'https://api.spacex.land/graphql';

export const link = new HttpLink({ uri });

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
