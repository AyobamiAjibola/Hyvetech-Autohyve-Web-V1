import React from "react";

const InputHeader = ({ text, className }) => {
  return (
    <span
      className={
        `text-sm inline-block font-montserrat
  ` + className
      }
    >
      {text}
    </span>
  );
};

export default InputHeader;
