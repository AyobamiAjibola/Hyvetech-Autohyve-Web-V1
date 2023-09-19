import React from "react";

const AuthenticationHeader = ({ title, subTitle, classNameTitle }) => {
  return (
    <div className="text-center md:mt-0 mt-0">
      <h2
        className={
          `md:text-3xl text-lg font-montserrat font-semibold text-center
      ` + classNameTitle
        }
      >
        {title}
      </h2>
      <h5 className="text-xs gray-color">{subTitle}</h5>
    </div>
  );
};

export default AuthenticationHeader;
