import Dashboard from './pages/Dashboard';
import SignInSide from './pages/SignInSide';

import { RoutePath } from './utils/routes';

const ROUTES: RoutePath[] = [
  {
    path: '/',
    exact: true,
    component: () => <SignInSide/>
  },
  {
    path: '/app',
    component: Dashboard,
    routes: [
      {
        path: '/teams',
        component: () => <h1>Teams Page</h1>
      },
      {
        component: () => <h1>Home Page</h1>
      }
    ]
  },
];

export default ROUTES;
