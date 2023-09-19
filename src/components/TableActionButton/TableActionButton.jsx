import React, { useState } from "react";

const TableActionButton = ({ icon, title, className }) => {
  const [openOption, setOpenOption] = useState(false);
  return (
    <button
      className={
        `flex gap-1 ml-0 md:ml-2 btn relative md:justify-start justify-center items-center text-center btn-secondary
    ` + className
      }
      onClick={() => setOpenOption(!openOption)}
    >
      <img
        src={icon}
        className="mr-3 w-[20px] h-[20px] font-montserrat"
        alt=""
      />
      <span className="font-montserrat font-medium">{title}</span>
    </button>
  );
};

export default TableActionButton;
