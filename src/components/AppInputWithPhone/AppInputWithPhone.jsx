import React from "react";
import flag from "../../assets/images/flag.png";
import InputHeader from "../InputHeader/InputHeader";
const AppInputWithPhone = ({
  placeholderTop,
  hasPLaceHolder,
  placeholder,
  className,
  type,
}) => {
  const [pwdfield, setPwdfield] = React.useState(false);

  const togglePassword = (e, val) => {
    e.preventDefault();

    setPwdfield(val);
  };
  return (
    <>
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}

      {/* {hasPLaceHolder && (
        <span className="text[10px] inline-block font-montserrat">
          {placeholderTop}
        </span>
      )} */}

      <div className=" w-full flex items-center justify-center relative mb-5 ">
        <img src={flag} alt="" className="w-[30px] h-[22px] absolute left-11" />
        <span className="absolute  left-20 text-xs">NG(+234)</span>
        <input
          type={type}
          className={
            `w-full placeholder-[#A5A5A5] h-[55px] placeholderText pl-36
          } ` + className
          }
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default AppInputWithPhone;
