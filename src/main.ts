import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

import { installRouter } from 'pwa-helpers/router';
import { updateRoute } from './router';

import { client } from './client';

import './components/app';
import './components/latest-launch';
import './components/next-launch';
import './components/upcoming-launches';

window.__APOLLO_CLIENT__ =
  client;

installRouter(updateRoute);

declare global {
  interface Window {
    __APOLLO_CLIENT__?: ApolloClient<NormalizedCacheObject>;
  }
}
