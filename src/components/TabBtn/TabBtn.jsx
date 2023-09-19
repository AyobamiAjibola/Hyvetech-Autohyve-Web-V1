import React from "react";

const TabBtn = ({ onClick, title, className }) => {
  return (
    <button
      className={
        ` text-[#000] w-[100px]  bg-[#FAA21B] f py-[14px] rounded-[20px]  font-medium text-sm text-[16px] font-montserrat
      ` + className
      }
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default TabBtn;
