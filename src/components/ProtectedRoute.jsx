import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignInLayout from './features/auth/layouts/SignInLayout';
import SignInForm from './features/auth/pages/SignInForm';

// Protected Route Component - wraps routes that require authentication
export function ProtectedRoute({ children, redirectTo = '/signin', requireStaff = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requireStaff && !user?.is_staff) {
    return (
      <SignInLayout>
        <SignInForm />
      </SignInLayout>
    );
  }

  return children;
}

export default ProtectedRoute;
