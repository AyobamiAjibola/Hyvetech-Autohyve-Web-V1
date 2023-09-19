import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputHeader from "../InputHeader/InputHeader";

const dummyData = ["Miles", "Km"];

const DropDownHalf = ({
  title,
  data = dummyData,
  placeholder,
  placeholderInput,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [open, setOpen] = useState(false);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setOpen(false);
  };

  const dateRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", hideClickOutside, true);
  }, []);

  const hideClickOutside = (e) => {
    if (dateRef.current && !dateRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div ref={dateRef}>
      <InputHeader text={title} />

      <div className="flex items-center rounded-2xl h-[52px] bg-[#F5F5F5]">
        <input
          type="text"
          name=""
          id=""
          placeholder={placeholderInput}
          className="w-[90%] special-input"
        />
        <div className="flex  items-center w-full  relative">
          <div className="flex items-center w-[100%] justify-between">
            <div className="divider" />
            <div
              onClick={() => setOpen(!open)}
              className="special-dropdown  ml-2 gap-1 w-[100%] justify-between flex items-center text-[#A5A5A5] font-montserrat"
            >
              <span className="text-[13px] inline-block   text-[#000]">
                {selectedOption ? (
                  selectedOption
                ) : (
                  <span className="text-[#A5A5A5] text-[10px]">
                    {placeholder}
                  </span>
                )}
              </span>
              <FaChevronDown size={15} className="mr-3" />
            </div>
          </div>

          {open && (
            <div
              style={{ height: 23 * data.length, maxHeight: 80 }}
              className="flex flex-col z-50 overflow-auto bg-[#A5A5A5] pl-3 drop-down-special rounded-md  absolute top-11 w-[100%] "
            >
              {data.map((item) => (
                <span
                  onClick={() => handleOptionSelect(item)}
                  className="text-xs py-1"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropDownHalf;
