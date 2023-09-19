import React from "react";
import "./CustomTextArea.css";
import InputHeader from "../InputHeader/InputHeader";
const CustomTextArea = ({ placeholder, topTitle }) => {
  return (
    <div className="flex flex-col">
      <InputHeader text={topTitle} />
      <textarea
        placeholder={placeholder}
        className="custom-textarea"
      ></textarea>
    </div>
  );
};

export default CustomTextArea;
