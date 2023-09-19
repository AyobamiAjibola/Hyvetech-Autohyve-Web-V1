import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  outline: "none",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "transparent",
  borderRadius: 5,
  boxShadow: 24,
  py: 3,
  pr: 5,
  pl: 5,
};

const DeleteModal = ({
  deletemodal,
  setDeletemodal,
  closeDeleteModal,
  title,
  description,
}) => {
  const [successModal, setSuccessModal] = useState(false);
  const closeSuccessModal = () => setSuccessModal(!successModal);
  const handleClose = () => setDeletemodal(false);

  return (
    <>
      <Modal
        open={deletemodal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <SuccessfulPaymentModal
              successModal={successModal}
              closeSuccessModal={closeSuccessModal}
            />

            <div className="flex justify-end w-full">
              <button onClick={() => setDeletemodal(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="flex flex-col justify-center">
              <h5 className="font-semibold flex text-center  justify-center mb-3 text-sm font-montserrat items-center">
                {title}
              </h5>
              <h5 className="text-center text-[10px] font-medium font-montserrat">
                {description}
              </h5>

              {/* </div> */}
            </div>

            <div className="body">
              {/* view */}

              <div className=" flex gap-4 mt-5 justify-center items-center px-4 md:px-10">
                <AppBtn
                  title="Cancel"
                  className=" btn-secondary uppercase"
                  onClick={() => closeDeleteModal()}
                />
                <AppBtn
                  title="Delete"
                  className=" uppercase"
                  onClick={() => closeDeleteModal()}
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteModal;
