import React from "react";
import "./CustomTextArea.css";
import InputHeader from "../InputHeader/InputHeader";
const CustomTextArea = ({
  placeholder,
  topTitle,
  onChange,
  value,
  name
}: any) => {
  return (
    <div className="flex flex-col">
      <InputHeader text={topTitle} />
      <textarea
        placeholder={placeholder}
        className="custom-textarea"
        onChange={onChange}
        value={value}
        name={name}
      ></textarea>
    </div>
  );
};

export default CustomTextArea;
