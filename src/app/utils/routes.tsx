import React from 'react';
import { Route, Switch } from 'react-router-dom';

export type RoutePath = {
  path: string;
  exact?: boolean;
  component?: any;
  key: string;
  routes?: RoutePath[];
};

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
export function RouteWithSubRoutes(route: RoutePath) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) =>
        route.component ?? <route.component key={route.key} {...props} routes={route.routes} />
      }
    />
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes({ routes }: { routes: RoutePath[] }) {
  return (
    <Switch>
      {routes.map((route: any, i: number) => {
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
}
