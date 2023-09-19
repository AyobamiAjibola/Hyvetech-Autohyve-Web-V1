import React from "react";
// import Eye from "../../assets/svgs/eye.svg";
import Eye from "../../assets/images/eye.png";
import { BsEyeSlash } from "react-icons/bs";

const HyvePayHomeCard = ({ name, price, qty, color }) => {
  const [obscure, setObscure] = React.useState(false);
  return (
    <>
      <div
        style={{ backgroundColor: color, borderRadius: 34, color: "#494949" }}
      >
        <div className="flex justify-between items-center px-6 pt-4 ">
          <div>
            <p className="base-text font-montserrat">{name}</p>
            <h2 className="heading-two text font-montserrat">
              ₦ {!obscure ? price : "****"}
            </h2>
          </div>

          <button onClick={() => setObscure(!obscure)}>
            {obscure ? (
              <BsEyeSlash color="black" size={18} />
            ) : (
              <img src={Eye} alt="" className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
        <div className="flex px-6 pb-4 justify-end font-montserrat">
          {qty && (qty > 1 ? qty + " Credit(s)" : qty + " Credit")}
        </div>
      </div>
    </>
  );
};

export default HyvePayHomeCard;
