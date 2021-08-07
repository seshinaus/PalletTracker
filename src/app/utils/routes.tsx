import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export type RoutePath = {
  path?: string;
  exact?: boolean;
  component?: any;
  key?: string;
  routes?: RoutePath[];
  redirect?: string;
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
      render={props => <route.component {...props} path={route.path} routes={route.routes} />}
    />
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property. Sorry
 * for the Angulare reference, but they just hit the spot with naming.
 */
export function RouterOutlet({ path, routes, ...rest }: { path: string, routes: RoutePath[] }) {
  return (
    <Router>
      <Switch>
        {routes && routes.map((route: RoutePath, i: number) => {
          const p = path ? path + route.path : route.path;
          if (route.redirect) {
            return <Redirect to={route.redirect} />
          } else {
            return <RouteWithSubRoutes {...route} key={route.key || p || 'default'} path={route.path && p} />;
          }
        })}
        <Route component={() => <div><h1>Not Found!</h1><p>Path: {path}</p></div>} />
      </Switch>
    </Router>
  );
}
