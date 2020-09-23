import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

import { installRouter } from 'pwa-helpers/router';
import { updateRoute } from './router';

import { client } from './client';

import './components/app';
import './components/latest-launch';
import './components/next-launch';
import './components/launches';

window.__APOLLO_CLIENT__ =
  client;

installRouter(updateRoute);

customElements.whenDefined('spacex-app')
  .then(() => document.querySelector('h1').classList.remove('loading'));

declare global {
  interface Window {
    __APOLLO_CLIENT__?: ApolloClient<NormalizedCacheObject>;
  }
}
