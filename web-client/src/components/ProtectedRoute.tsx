import { Navigate, Route } from "react-router-dom";

//redux
import { useAppSelector } from "../hooks";

//types
import { FC } from "react";
import { useSelector } from "react-redux";

interface propTypes {
  redirectPath: string;
  isAllowed: boolean;
  children: React.ReactElement;
}
const ProtectedRoute: FC<propTypes> = ({
  isAllowed,
  redirectPath,
  children,
}) => {
  return isAllowed ? children : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
