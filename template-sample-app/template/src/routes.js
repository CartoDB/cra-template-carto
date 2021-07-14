import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { OAuthCallback } from '@carto/react-auth';
import ProtectedRoute from 'components/common/ProtectedRoutes';
import DefaultView from 'components/common/DefaultView';

const Main = lazy(() => import('components/views/main/Main'));
const NotFound = lazy(() => import('components/views/NotFound'));
const Login = lazy(() => import('components/views/Login'));
const Stores = lazy(() => import('components/views/stores/Stores'));
const StoresList = lazy(() => import('components/views/stores/StoresList'));
const StoresDetail = lazy(() => import('components/views/stores/StoresDetail'));
const Kpi = lazy(() => import('components/views/Kpi'));
const Tileset = lazy(() => import('components/views/Tileset'));
// [hygen] Import views

export const ROUTE_PATHS = {
  LOGIN: '/login',
  DEFAULT: '/',
  OAUTH: '/oauthCallback',
  NOT_FOUND: '404',
  STORES: '/stores',
  STORES_LIST: '',
  STORES_DETAIL: ':id',
  KPI: '/kpi',
  TILESET: '/tileset',
  // [hygen] Add path routes
};

const routes = [
  {
    path: ROUTE_PATHS.DEFAULT,
    element: (
      <ProtectedRoute>
        <DefaultView>
          <Main />
        </DefaultView>
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to={ROUTE_PATHS.STORES} /> },
      {
        path: ROUTE_PATHS.STORES,
        element: <Stores />,
        children: [
          { path: ROUTE_PATHS.STORES_LIST, element: <StoresList /> },
          { path: ROUTE_PATHS.STORES_DETAIL, element: <StoresDetail /> },
        ],
      },
      { path: ROUTE_PATHS.KPI, element: <Kpi /> },
      { path: ROUTE_PATHS.TILESET, element: <Tileset /> },
      // [hygen] Add routes
    ],
  },
  { path: ROUTE_PATHS.OAUTH, element: <OAuthCallback /> },
  { path: ROUTE_PATHS.LOGIN, element: <Login /> },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: (
      <DefaultView>
        <NotFound />
      </DefaultView>
    ),
  },
  { path: '*', element: <Navigate to={ROUTE_PATHS.NOT_FOUND} /> },
];

export default routes;
