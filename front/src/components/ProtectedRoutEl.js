import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";


const ProtectedRouteElement = ({ element: Component, ...props }) => {
  const [authVal, setAuthVal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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