import React from "react";

const TableCountTitile = ({
  title = "Showing 12 results out of 56",
  className,
}) => {
  return (
    <div
      className={
        ` flex items-center md:mt-0 mt-5 text-[11px] font-montserrat gap-4 text-gray-500
  ` + className
      }
    >
      {title}
    </div>
  );
};

export default TableCountTitile;
