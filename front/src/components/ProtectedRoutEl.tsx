import { /* ReactElement, */ useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

/* interface ProtectedRouteProps {
  element: React.Component;
  auth: () => Promise<{ success: boolean }>;
  loggedIn: boolean;
} */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRouteElement = ({ element: Component, ...props }: any) => {
  const [authVal, setAuthVal] = useState<null | boolean>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const auth = async () => {
    try {
      const authStatus = await props.auth();
      setAuthVal(authStatus.success)
      setIsLoading(false)
      return authStatus.success ? <Component {...props} /> : <Navigate to='/sign-in' replace />

    } catch (e) {
      console.log(e);
      setIsLoading(false)
      return <Navigate to='/sign-in' replace />
    }
  };

  useEffect(() => {
    auth();
  }, []);



  if (!isLoading) {

    return props.loggedIn || authVal ? <Component {...props} /> : <Navigate to='/sign-in' replace />;

  }
}

export default ProtectedRouteElement;