import React from "react";
import OptionIcon from "../../assets/svgs/option.svg";

const SingleVhicle = ({ make, year, plateNumber, vehicleName }) => {
  return (
    <div className="p-8 py-4 w-[100%] md:w-[25%] relative rounded-lg bg-gray-100">
      <button className="px-4 py-3 absolute right-3">
        <img src={OptionIcon} alt="" style={{ width: 20 }} />
      </button>

      <h5 className="font-bold mb-6 mt-10 uppercase" style={{ width: "70%" }}>
        {vehicleName}
      </h5>

      <p className="text-sm font-montserrat text-[10px]">Make: {make}</p>
      <p className="text-sm font-montserrat text-[10px]"> Year: {year}</p>
      <p className="text-sm font-montserrat text-[10px]">
        Plate Number: {plateNumber}
      </p>
    </div>
  );
};

export default SingleVhicle;
