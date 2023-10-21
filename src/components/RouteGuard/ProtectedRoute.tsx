import React from 'react';
import { Navigate } from 'react-router-dom';
import settings from '../../config/settings';
// import ContextVariables from '../../context/ContextVariables';
// import { AppContext } from '../../context/AppContext';

// const admin = settings.auth.admin;

function PrivateRoute({ children }: any) {
  // const contextVal = ContextVariables()
  const isSignedIn = sessionStorage.getItem(settings.auth.admin);

  // useEffect(() => {
    // axiosClient.get(`${API_ROOT}/api/check-auth`)
    //   .then(() => {
    //     setIsSignedIn(true);
    //   })
    //   .catch(() => {
    //     setIsSignedIn(false);
    //   });

  // },[isSignedIn])

  return isSignedIn 
    ? children
    : <Navigate to="/" replace />;
}

export default PrivateRoute;
