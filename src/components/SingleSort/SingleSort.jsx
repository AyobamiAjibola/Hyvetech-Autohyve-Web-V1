import React, { useState } from "react";

const SingleSort = ({ openSort, setOpenSort, items, setSelect }) => {
  if (openSort) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div className="absolute top-11 p-4 flex flex-col rounded-lg shadow-xl gap-3 w-[200px] z-50 bg-[#fff]">
      {items?.map((item) => {
        return (
          <span
            className="font-montserrat text-xs cursor-pointer"
            onClick={() => {
              setOpenSort(!openSort);
              setSelect(item);
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
};

export default SingleSort;
