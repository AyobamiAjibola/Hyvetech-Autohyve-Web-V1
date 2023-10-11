import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputHeader from "../InputHeader/InputHeader";

interface IProps {
  title: string;
  data: any;
  placeholder: string;
  placeholderInput: string;
  name: string;
  onChange: any;
  onBlur?: any;
  value: any;
  type: string;
  setUnit?: any
  unit?: any
}

const DropDownHalf = ({
  title,
  data,
  placeholder,
  placeholderInput, name, onChange,
  onBlur, value, type,
  setUnit, unit
}: IProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [open, setOpen] = useState(false);

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setUnit(option)
    setOpen(false);
  };

  const dateRef = useRef<any>(null);

  useEffect(() => {
    document.addEventListener("click", hideClickOutside, true);
  }, []);

  const hideClickOutside = (e: any) => {
    if (dateRef.current && !dateRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if(unit) {
      setSelectedOption(unit)
    }
  },[unit])

  return (
    <div ref={dateRef}>
      <InputHeader text={title} />

      <div className="flex items-center rounded-2xl h-[52px] bg-[#F5F5F5]">
        <input
          type={type}
          name={name}
          id=""
          placeholder={placeholderInput}
          className="w-[90%] special-input font-montserrat"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
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
              <FaChevronDown size={15} className="mr-3 cursor-pointer" />
            </div>
          </div>

          {open && (
            <div
              style={{ height: 23 * data.length, maxHeight: 80 }}
              className="cursor-pointer flex flex-col z-50 overflow-auto bg-[#A5A5A5] pl-3 drop-down-special rounded-md  absolute top-11 w-[100%] "
            >
              {data.map((item: any) => (
                <span
                  onClick={() => handleOptionSelect(item.value)}
                  className="text-xs py-1"
                >
                  {item.label}
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
