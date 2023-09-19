import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputHeader from "../InputHeader/InputHeader";

const AppDropDown = ({
  className,
  title = "Recipient’s Bank Name",
  data = [],
  placeholder = "Choose a bank name",
  dropDownClass,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <InputHeader text={title} />

      <div
        className={
          `bg-[#F5F5F5] cursor-pointer flex items-center justify-between text-[#A5A5A5] text-left pl-5 py-2 h-[52px] w-full rounded-[18px]  focus:outline-none
} ` + className
        }
        onClick={toggleDropdown}
      >
        <span className="text-[13px] text-[#000]">
          {selectedOption ? (
            selectedOption
          ) : (
            <span className="text-[#A5A5A5] text-[10px] ml-5">
              {placeholder}{" "}
            </span>
          )}
        </span>
        <FaChevronDown className="mr-5 ml-3" />
      </div>

      {isOpen && (
        <div
          className={
            `absolute w-full mt-1 z-50 py-2 h-auto max-h-40 overflow-y-auto bg-[#CACACA] border border-gray-200 rounded-md shadow-lg` +
            dropDownClass
          }
        >
          {data?.map((item, index) => {
            return (
              <button
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 text-left focus:outline-none font-montserrat"
                onClick={() => handleOptionSelect(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppDropDown;
