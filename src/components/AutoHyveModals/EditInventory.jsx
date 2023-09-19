import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const EditInventory = ({
  openEditInventory,
  setOpenInventory,
  title,
  btnTitle,
  // description = 'Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action',
}) => {
  const [successModal, setSuccessModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();
  const types = ["Part", "Service"];
  const itemUnits = ["Pcs", "Litre", "Pair", "Set", "Gallon", "g", "cm"];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "60%" : "95%",
    outline: "none",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "10px",
    py: 5,
  };

  const handleClose = () => setModal(false);

  return (
    <>
      <Modal
        open={openEditInventory}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title={title} />

            <button onClick={() => setOpenInventory(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="mt-8 flex gap-8 flex-col justify-center">
            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Name"
                  placeholder="Labels"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>

              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Selling Rate/Price"
                  placeholder="Labels"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppDropDown title="Type" data={types} placeholder="Labels" />
              </div>

              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Buy Rate/Price"
                  placeholder="Labels"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppDropDown
                  title="Item Unit"
                  data={itemUnits}
                  placeholder="labels"
                />
              </div>

              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Qty in Stock"
                  placeholder="I’ve been typed"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-7">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Part Number"
              placeholder="Labels"
              className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
            />
          </div>

          <div className="w-full mt-7">
            <CustomTextArea topTitle="Note/Remark" placeholder="Labels" />
          </div>

          {/* view */}
          <div className=" flex gap-4 mt-8 justify-center md:justify-start items-center">
            <AppBtn
              title={btnTitle}
              className="font-medium w-[90%] md:w-[100px]"
              onClick={() => setOpenInventory(false)}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default EditInventory;
