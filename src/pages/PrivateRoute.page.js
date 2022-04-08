import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/user.context";

const PrivateRoute = (props) => {

  // Fetching the user from the user context.
  const { user } = useContext(UserContext);
  const location = useLocation();

  // If the user is not logged in we are redirecting them
  // to the login page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return user ? <Outlet /> : <Navigate to={`/login?redirectTo=${encodeURI(location.pathname)}`} />;
}

export default PrivateRoute;