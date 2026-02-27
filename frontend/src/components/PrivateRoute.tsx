import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute = ({ children, adminOnly = false }: Props) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/profile" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
