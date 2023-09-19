import React from "react";
import tick from "../../assets/images/tick.png";

const NotifcationMessage = () => {
  return (
    <div className="bg-notification flex items-center px-5 py-5">
      <img src={tick} alt="" className="w-[22px] h-[22px] mr-5" />
      <span className="font-montserrat">Invoice Generated successfully</span>
    </div>
  );
};

export default NotifcationMessage;
