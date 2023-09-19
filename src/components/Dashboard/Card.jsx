import React from "react";
// import Eye from "../../assets/svgs/eye.svg";
import Eye from "../../assets/images/eye.png";
import { BsEyeSlash } from "react-icons/bs";

const Card = ({
  name,
  price,
  qty,
  color,
  showEye = true,
  showCredit = true,
}) => {
  const [obscure, setObscure] = React.useState(false);
  return (
    <>
      <div
        style={{
          backgroundColor: color,
          height: "140px",
          borderRadius: 34,
          color: "#494949",
          display: "flex",
          paddingLeft: 30,
          // justifyContent: "center",
        }}
      >
        <div className="flex justify-between items-center px-0 pt-4 ">
          <div>
            <p className="base-text font-montserrat mb-1">{name}</p>
            <h2 className=" text-2xl font-semibold  font-montserrat">
              {!obscure ? price : "****"}
            </h2>
          </div>
          {showEye && (
            <button onClick={() => setObscure(!obscure)}>
              {obscure ? (
                <BsEyeSlash color="black" size={18} />
              ) : (
                <img src={Eye} alt="" className="w-[18px] h-[18px]" />
              )}
            </button>
          )}
        </div>
        {showCredit && (
          <div className="flex px-6 pb-4 justify-end font-montserrat">
            {qty && (qty > 1 ? qty + " Credit(s)" : qty + " Credit")}
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
