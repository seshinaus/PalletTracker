import Dashboard from './pages/Dashboard';
import SignInSide from './pages/SignInSide';

import { RoutePath } from './utils/routes';

const ROUTES: RoutePath[] = [
  {
    path: '/',
    key: 'root',
    exact: true,
    component: <SignInSide/>
  },
  {
    path: '/app',
    key: 'app',
    exact: true,
    component: <Dashboard/>,
  },
  {
    path: '/app/page',
    key: 'app-page',
    exact: true,
    component: <h1>App Page</h1>,
  },
];

export default ROUTES;
