import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from 'routes';

export default function ProtectedRoute({ children }) {
  const forceLogin = useSelector((state) => state.app.forceOAuthLogin);
  const user = useSelector((state) => state.oauth.userInfo);
  const isLoggedIn = !!user || !forceLogin;

  return isLoggedIn ? children : <Navigate to={ROUTE_PATHS.LOGIN} />;
}
