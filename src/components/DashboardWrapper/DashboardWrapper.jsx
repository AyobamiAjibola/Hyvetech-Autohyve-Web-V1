import React, { useEffect, useMemo, useState } from "react";
import jwt_decode from "jwt-decode";
import settings from "../../config/settings";
import { Link } from "react-router-dom";

const token = sessionStorage.getItem(settings.auth.admin);
const decoded = token && (jwt_decode(token));

const DashboardWrapper = ({ children }) => {
  const token = useMemo(() => sessionStorage.getItem(settings.auth.admin), []);
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    if(token) {
      const payload = jwt_decode(token);
      setAccountType(payload.accountType)
    }
  },[]);

  return <div className="mb-20 mt-5 md:mt-32 w-full">
    {accountType === "cooperate" || accountType === null
      ? children
      : <div className="flex justify-center item-center h-screen flex-row">
          <span
            className="font-montserrat text-xl"
          > You are not authorized for this.</span>
          <span className="font-montserrat text-xl">Go 
            <Link to='/vin-decoder' className="font-montserrat text-[red]">back</Link></span>
        </div>
    }
  
  </div>;
};

export default DashboardWrapper;
