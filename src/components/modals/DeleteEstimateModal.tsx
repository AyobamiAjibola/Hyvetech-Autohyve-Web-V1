import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import useAppSelector from "../../hooks/useAppSelector";
import AppBtn from "../AppBtn/AppBtn";
import useEstimate from "../../hooks/useEstimate";

interface IProps {
  deletemodal: boolean;
  itemId: number,
  setItemId: any,
  setCustomerId?: any,
  closeDeleteModal?: any,
  title: string,
  setDeletemodal?: any;
  onDelete: any
}

const DeleteEstimateModal = ({
  deletemodal,
  itemId,
  setItemId,
  closeDeleteModal,
  title, setDeletemodal
}: IProps ) => {
  const [successModal, setSuccessModal] = useState(false);
  const estimateReducer = useAppSelector(state => state.estimateReducer);

  const { handleDelete } = useEstimate();

  const closeSuccessModal = () => setSuccessModal(!successModal);

  useEffect(() => {
    if(estimateReducer.deleteEstimateStatus === 'completed') {
      setItemId(-1)
      setDeletemodal(false)
    }
  },[estimateReducer.deleteEstimateStatus]);

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
                <button onClick={(event) => {setItemId(-1), closeDeleteModal(event)}}>
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

              <div className=" flex gap-4 mt-6 justify-center items-center px-4 md:px-10">
                <AppBtn 
                  title={"CANCEL"}
                  type="button"
                  onClick={(event:any) => {
                    setItemId(-1)
                    closeDeleteModal(event)
                  }}
                  className={`btn btn-secondary uppercase md:w-[100px] w-[100%]`}
                />
                <AppBtn 
                  title={"DELETE"}
                  type="button"
                  onClick={() => handleDelete(itemId)}
                  className={`font-semibold md:w-[100px] w-[100%]`}
                  spinner={estimateReducer.deleteEstimateStatus === 'loading'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteEstimateModal;
