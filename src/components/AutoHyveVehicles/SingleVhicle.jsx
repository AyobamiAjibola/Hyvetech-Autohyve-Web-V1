import React, { useEffect, useRef, useState } from "react";
import OptionIcon from "../../assets/svgs/option.svg";
import DeleteModal from "../modals/DeleteModal";

const SingleVhicle = ({ make, year, plateNumber, vehicleName }) => {
  const [option, setOption] = useState(false);
  const [dModal, setdModal] = useState(false);
  const refOne = useRef(null);
  const closeDeleteModal = () => setdModal(!dModal);
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOption(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  return (
    <>
      <DeleteModal
        title={"Delete Vehicle"}
        // description={'Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action'}
        deletemodal={dModal}
        closeDeleteModal={closeDeleteModal}
      />
   
    <div className="p-8 py-4 w-[100%] relative rounded-lg bg-gray-100">
      <button className="px-4 py-3 absolute right-3" onClick={() => setOption(!option)}>
        <img src={OptionIcon} alt="" style={{ width: 20 }} />
      </button>

      {option && (
        <ul className="option-dropdown mt-8 mr-6"
          ref={refOne}
        >
          <li>
            <button
              onClick={() => {
                setdModal(!dModal);
                setOption(false);
              }}
            >
              Delete
            </button>
          </li>
        </ul>
      )}

      <h5 className="font-bold mb-6 mt-10 uppercase" style={{ width: "70%" }}>
        {vehicleName}
      </h5>

      <p className="text-sm font-montserrat text-[10px]">Make: {make}</p>
      <p className="text-sm font-montserrat text-[10px]"> Year: {year}</p>
      <p className="text-sm font-montserrat text-[10px]">
        Plate Number: {plateNumber}
      </p>
    </div>
    </>
  );
};

export default SingleVhicle;
