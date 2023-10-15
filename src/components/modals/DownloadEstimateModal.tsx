import React from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import { MESSAGES } from "../../config/constants";

interface IProps {
  downloadEstimateModal: boolean;
  closeDeleteModal?: any,
  title: string,
  setDownloadEstimateModal?: any;
  generateInvoice: any;
  setSelectedValue: any;
}

const DownloadEstimateModal = ({
  downloadEstimateModal,
  closeDeleteModal,
  title, generateInvoice,
  setSelectedValue
}: IProps ) => {

  return (
    <>
      {downloadEstimateModal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className=" rounded-md bg-white py-8 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full">
                <button onClick={(event) => {closeDeleteModal(event)}}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="flex flex-col justify-center mt-5">
                <h5 className="text-center font-semibold font-montserrat">
                  {title}
                </h5>
                <h5 className="text-center text-[10px] md:text-sm gray-color font-montserrat">
                  {MESSAGES.invoiceCount}
                </h5>
                {/* </div> */}
              </div>
            </div>
            <div className="body">
              {/* view */}

              <div className=" flex gap-4 mt-6 justify-center items-center px-4 md:px-10">
                <AppBtn 
                  title={"NO"}
                  type="button"
                  onClick={(event:any) => {
                    setSelectedValue("")
                    closeDeleteModal(event)
                  }}
                  className={`btn btn-secondary uppercase md:w-[100px] w-[100%]`}
                />
                <AppBtn 
                  title={"YES"}
                  type="button"
                  onClick={generateInvoice}
                  className={`font-semibold md:w-[100px] w-[100%]`}
                  // spinner={estimateReducer.deleteEstimateStatus === 'loading'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadEstimateModal;
