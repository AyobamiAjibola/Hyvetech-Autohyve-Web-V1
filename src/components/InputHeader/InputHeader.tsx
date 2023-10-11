// import React from "react";

// const InputHeader = ({ text, className }) => {
//   return (
//     <span
//       className={
//         `text-sm inline-block font-montserrat
//   ` + className
//       }
//     >
//       {text}
//     </span>
//   );
// };

// export default InputHeader;
import React, { FC } from "react";
interface IProps {
  text: string;
  className?: string;
  onClick?: any
}
const InputHeader: FC<IProps> = ({ text, className, onClick }) => {
  return (
    <span
      onClick={onClick}
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

