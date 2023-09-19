import React, { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import SingleSort from "../SingleSort/SingleSort";

const Sorting = ({ items, setSelect, select, className }) => {
  const [openSort, setOpenSort] = useState(false);
  const dropdownRef = useRef(null);
  if (openSort) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={
          `relative
        ` + className
        }
        ref={dropdownRef}
      >
        <div
          className="flex items-center md:mb-0 mb-5 justify-between border-[1px] py-4 w-[100%] md:w-[195px] cursor-pointer border-[#CACACA]  rounded-[20px] px-5"
          onClick={() => setOpenSort(!openSort)}
        >
          <span className="font-montserrat text-xs inline-block mr-2 font-normal ">
            {select}
          </span>
          <HiChevronDown size={20} />
        </div>
        {openSort && (
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
        )}
      </div>
    </>
  );
};

export default Sorting;
