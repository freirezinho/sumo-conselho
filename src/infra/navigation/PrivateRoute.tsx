import { Navigate, Outlet } from "react-router";
import { useUserId } from "../../hooks/use_user_id";

export const PrivateRoute = () => {
  const { userId } = useUserId();
  return userId ? < Outlet /> : <Navigate to="/auth" />;
}