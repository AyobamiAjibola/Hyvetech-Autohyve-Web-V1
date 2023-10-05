import React, { useEffect, useState } from "react";
import ShareIcon from "../../assets/svgs/share.svg";
import { FaChevronLeft } from "react-icons/fa";
import BulkAccountModal from "../../components/modals/BulkAccountModal";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import useAppDispatch from "../../hooks/useAppDispatch";
import { clearPerformBulkAccountTransferRequestStatus, clearTransferStatus } from "../../store/reducers/autoHyveReducer";
import FundAccountModal from "../../components/modals/FundAccountModal";

const NewTransaction = () => {
  // const [modal, setModal] = React.useState(false);
  // const closeModal = () => setModal(!modal); //close modal
  // const [_, setModalType] = React.useState(0);
  const [openSingleModal, setOpenSingleModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const state = useAppSelector((state) => state.autoHyveReducer);
  const dispatch = useAppDispatch();

  const [currentModal, setCurretntModal] = useState<any>(null);

  useEffect(() => {
    if (state.requestAccountTransferStatus === "completed" || state.performBulkAccountTransferRequestStatus === "completed") {
      showMessage("Transfer successful", "", "success");
      setOpenBulkModal(false);
      dispatch(clearTransferStatus());
      dispatch(clearPerformBulkAccountTransferRequestStatus());
    }
  },[
    state.requestAccountTransferStatus,
    state.performBulkAccountTransferRequestStatus
  ])

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
            // setOpenSingleModal(true);
            // setCurretntModal(true);
            setOpenBulkModal(true)
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

      <BulkAccountModal
        openBulkModal={openBulkModal}
        setOpenBulkModal={setOpenBulkModal}
      />

      {/* <BulkTransactionModal
        openBulkModal={openBulkModal}
        setOpenBulkModal={setOpenBulkModal}
      /> */}

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
