import { makeVar } from '@apollo/client/core';
import type { Route, RouteParams } from './schema';

function makeRoute(location: Location): Route {
  const { pathname, hash } = location;

  const parts =
    pathname
      .split('/')
      .filter(Boolean)
      .map(x =>
        x
          .toLowerCase());

  const [parent, child] = parts;

  const params: RouteParams =
      parent === 'launches' ? { launchId: child }
    : {};

  return {
    hash,
    params,
    parts,
    pathname,
  };
}

const initialRoute: Route = makeRoute(window.location);

export const routeVar = makeVar<Route>(initialRoute);

export function updateRoute(location: Location): void {
  const route = makeRoute(location);
  routeVar(route);
  window.dispatchEvent(new RouteEvent(route));
}

declare global {
  interface GlobalEventHandlersEventMap {
    'route-changed': RouteEvent;
  }
}

export class RouteEvent extends CustomEvent<Route> {
  static readonly type = 'route-changed';

  constructor(detail: Route) {
    super(RouteEvent.type, { detail });
  }
}

window.addEventListener(RouteEvent.type, function onRouteChanged({ detail: route }) {
  const [parent] = route.parts;
  switch (parent) {
    case 'launches': return void import('./components/launch');
    case 'launchpads': return void import('./components/launchpads');
  }
});
