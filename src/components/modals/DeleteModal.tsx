import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import useItemStock from "../../hooks/useItemStock";
import useAppSelector from "../../hooks/useAppSelector";

const DeleteModal = ({
  deletemodal,
  itemId,
  setItemId,
  setCustomerId,
  closeDeleteModal,
  title, setDeletemodal
}: any) => {
  const [successModal, setSuccessModal] = useState(false);
  const { handleDelete } = useItemStock();
  const itemReducer = useAppSelector(state => state.itemStockReducer);

  const closeSuccessModal = () => setSuccessModal(!successModal);

  const handleDeleteItem = () => {
    handleDelete(itemId)
  }

  useEffect(() => {
    if(itemReducer.deleteItemStatus === 'completed') {
      setItemId(-1)
      setDeletemodal(false)
    }
  },[itemReducer.deleteItemStatus]);

  return (
    <>
      <SuccessfulPaymentModal
        successModal={successModal}
        closeSuccessModal={closeSuccessModal}
      />
      {deletemodal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className=" rounded-md bg-white py-8 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full">
                <button onClick={(event) => {closeDeleteModal(event), setCustomerId(-1), setItemId(-1)}}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="flex flex-col justify-center mt-5">
                <h5 className="text-center font-semibold font-montserrat">
                  {title}
                </h5>
                <h5 className="text-center text-[10px] md:text-sm gray-color font-montserrat">
                  {/* {description} */}
                  Are you sure you want to carry out this action? <br /> If you
                  proceed, you will not be able to undo this action
                </h5>
                {/* </div> */}
              </div>
            </div>
            <div className="body">
              {/* view */}

              <div className=" flex gap-4 mt-4 justify-center items-center px-4 md:px-10">
                <button
                  onClick={(event) => {closeDeleteModal(event), setItemId(-1)}}
                  className="btn btn-secondary uppercase"
                >
                  Cancel
                </button>
                <button className="btn btn-primary uppercase bg-primary"
                  onClick={handleDeleteItem}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
