import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { initialState } from 'store/initialStateSlice';
import { ROUTE_PATHS } from 'routes';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const accessToken = useSelector((state) => state.carto.credentials.accessToken);

  if (!initialState.oauth) {
    return children;
  }

  const noAuthenticated = !isLoading && !isAuthenticated && !accessToken;

  if (noAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} />;
  }

  return !!accessToken && children;
}
