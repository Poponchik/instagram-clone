import * as React from "react";
import { getUser } from "./utils";
import { Navigate } from "react-router-dom";

type Props = {
  component: JSX.Element;
};

function AuthorizedComponent({ component }: Props) {
  const user = getUser();

  return user ? <React.Fragment>{component}</React.Fragment> : <Navigate to="/auth/login"/>;
}

export default AuthorizedComponent;
