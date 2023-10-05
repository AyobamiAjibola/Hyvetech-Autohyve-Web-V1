import React, { useState } from "react";
import OptionIcon from "../../assets/svgs/option.svg";
import AddNewBeneficiaryModal from "../modals/AddNewBeneficiaryModal";
import DeleteModal from "../modals/DeleteModal";

const TransactCard = ({ name, accountnum, bankName, phone }) => {
  const [option, setOption] = useState(false);
  const [dModal, setdModal] = useState(false);
  const [beneficiary, setBeneficiary] = useState(false);

  const closeDeleteModal = () => setdModal(!dModal);

  return (
    <>
      <DeleteModal
        title={"Delete Beneficiary"}
        // description={'Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action'}
        deletemodal={dModal}
        closeDeleteModal={closeDeleteModal}
      />

      <AddNewBeneficiaryModal
        newBeneficiary={beneficiary}
        setnewBeneficiary={setBeneficiary}
        title={"Edit Beneficiary"}
      />

      <div className="p-8 py-4 transact-card bg-gray-100">
        <div className="w-full flex justify-end">
          <div style={{ position: "relative" }}>
            <button className="px-4 py-3" onClick={() => setOption(!option)}>
              <img src={OptionIcon} alt="" style={{ width: 20 }} />
            </button>

            {option && (
              <ul className="option-dropdown">
                <li>
                  <button
                    onClick={() => {
                      setOption(false);
                      setBeneficiary(!beneficiary);
                    }}
                  >
                    Edit
                  </button>
                </li>
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
          </div>
        </div>

        <h5 className="font-bold mb-6 uppercase" style={{ width: "70%" }}>
          {/* David <br /> James */}
          {name}
        </h5>

        <p className="text-sm font-montserrat text-[11px]">{accountnum}</p>
        <p className="text-sm font-montserrat text-[11px]">{bankName}</p>
        <p className="text-sm font-montserrat text-[11px]">{phone}</p>
      </div>
    </>
  );
};

export default TransactCard;
