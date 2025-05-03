import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../app/store/authSlice';

const RequireAdminAuth = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default RequireAdminAuth;
