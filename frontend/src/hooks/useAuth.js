import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/authSlice";
import { disconnectSocket } from "../services/socket";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  const logout = () => {
    disconnectSocket();
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    logout,
  };
};
