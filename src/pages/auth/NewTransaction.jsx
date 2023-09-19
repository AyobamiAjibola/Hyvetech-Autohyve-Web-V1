import React, { useState } from "react";
import ShareIcon from "../../assets/svgs/share.svg";
import FundModal from "../../components/Dashboard/FundModal";
import FundAccountModal from "../../components/modals/FundAccountModal";
import { FaChevronLeft } from "react-icons/fa";

const NewTransaction = () => {
  const [modal, setModal] = React.useState(false);
  const closeModal = () => setModal(!modal); //close modal
  const [modalType, setModalType] = React.useState(0);
  const [openSingleModal, setOpenSingleModal] = useState(false);
  const [openSecondleModal, setOpenSecondleModal] = useState(false);

  const [currentModal, setCurretntModal] = useState(null);

  const openSingle = () => {
    setModal(!modal);
    setModalType(0);
  };

  const openMultiple = () => {
    setModal(!modal);
    setModalType(1); // if 1, it opens multiple transaction modal
  };

  return (
    <>
      <div
        className="w-full flex h-10  md:hidden items-center mt-20 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <FaChevronLeft />
        <span className="font-montserrat inline-block ml-5">Back</span>
      </div>

      <div className="flex items-center gap-8 mt-10 md:mt-24">
        <div
          onClick={() => {
            setOpenSingleModal(true);
            setCurretntModal(false);
          }}
          className="p-8 transact-card bg-gray-100"
        >
          <img src={ShareIcon} alt="" />

          <h5 className="font-bold mt-6">
            Single <br /> Transaction
          </h5>
        </div>

        <div
          onClick={() => {
            setOpenSingleModal(true);
            setCurretntModal(true);
          }}
          className="p-8 transact-card bg-gray-100"
        >
          <img src={ShareIcon} alt="" />

          <h5 className="font-bold mt-6">
            Bulk <br /> Transaction
          </h5>
        </div>
      </div>

      <FundAccountModal
        openSingleModal={openSingleModal}
        setOpenSingleModal={setOpenSingleModal}
        currentModal={currentModal}
      />

      {/* <FundModal
        modal={modal}
        setModal={setModal}
        closeModal={closeModal}
        modalType={modalType}

      /> */}
    </>
  );
};

export default NewTransaction;
