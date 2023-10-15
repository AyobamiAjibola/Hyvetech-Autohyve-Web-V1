import React, { useEffect, useRef, useState } from "react";
import InputHeader from "../InputHeader/InputHeader";

interface IProps {
  title: string;
  data: any;
  placeholder?: string;
  placeholderInput: string;
  name: string;
  onChange: any;
  onBlur?: any;
  value: any;
  type: string;
  valueUnit?: any;
  onChangeUnit?: any;
  nameUnit?: any;
  min?: string;
  max?: string;
}

const DropDownHalfParts = ({
  title,
  data,
  placeholderInput,
  name,
  onChange,
  onBlur,
  value,
  type, min, max,
  valueUnit, onChangeUnit, nameUnit
}: IProps) => {
  const [open, setOpen] = useState(false);

  const dateRef = useRef<any>(null);

  useEffect(() => {
    document.addEventListener("click", hideClickOutside, true);
  }, []);

  const hideClickOutside = (e: any) => {
    if (dateRef.current && !dateRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

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
          min={min}
          max={max}
        />
        <div className="flex items-center w-full relative">
          <div className="flex items-center w-[100%] justify-between">
            <div className="divider" />
            <div
              onClick={() => setOpen(!open)}
              className="special-dropdown ml-2 gap-1 w-[100%] justify-between flex items-center text-[#A5A5A5] font-montserrat"
            >
              <select
                className="text-[13px] inline-block text-[#000] bg-transparent"
                value={valueUnit}
                onChange={onChangeUnit}
                name={nameUnit}
              >
                {data.map((item: any) => (
                  <option value={item.value} key={item.value}
                    className="mt-50"
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownHalfParts;
