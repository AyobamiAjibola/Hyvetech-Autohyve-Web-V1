import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppInput from "../AppInput/AppInput";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import AddNewQuantityModal from "./AddNewQuantityModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useItemStock from "../../hooks/useItemStock";

const ItemDetailsModal = ({ 
  openItem, setOpenItem,
  item,
  setItem
}) => {
  const [addNewQuantity, setAddNewQuantity] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const data = [
    "Independent Technician",
    "Single workshop",
    "Workshop Chain",
    "Others",
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "60%" : "95%",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "20px" : "10px",
    py: 5,
  };

  const handleClose = () => setOpenItem(false);

  return (
    <>
      <Modal
        open={openItem}
        onClose={() => {handleClose(), setItem(null)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 bg-white px-8">
            <div className="flex justify-between w-full">
              <ModalHeaderTitle title=" Item Detail" />

              <button onClick={() => {setOpenItem(false), setItem(null)}}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="mt-8 flex gap-8 flex-col justify-center">
              <div className="flex flex-col md:flex-row  w-full gap-4">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Name"
                    placeholder="Name"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    value={item?.name}
                    disabled
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Selling Rate/Price"
                    placeholder="Selling Rage/Price"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    value={item?.sellingPrice}
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  w-full gap-4">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Type"
                    placeholder="Type"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    value={item?.type}
                    disabled
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Buy Rate/Price"
                    placeholder="Buy Rate/Price"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    value={item?.buyingPrice}
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  w-full gap-4">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Item Unit"
                    placeholder="Unit"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    value={item?.unit}
                    disabled
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Qty in Stock"
                    placeholder="Quantity"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    value={item?.quantity}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="w-full mt-7">
              <AppInput
                hasPLaceHolder={true}
                placeholderTop="Part Number"
                placeholder="Part number"
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={item?.partNumber}
                disabled
              />
            </div>

            <div className="w-full flex justify-end mt-3">
              <AppTabBtn
                icon={<AiOutlinePlus />}
                title="Quantity"
                className="w-[200px] text-[#000] btn-secondary"
                onClick={() => {
                  setAddNewQuantity(true);
                  // setOpenItem(false);
                }}
              />
            </div>

            <div className="w-full mt-5">
              <CustomTextArea
                topTitle="Note/Remark"
                placeholder="Note/Remark"
                value={item?.description}
                disabled
              />
            </div>
          </div>
        </Box>
      </Modal>

      <AddNewQuantityModal
        item={item}
        addNewQuantity={addNewQuantity}
        setAddNewQuantity={setAddNewQuantity}
        setOpenItem={setOpenItem}
      />
    </>
  );
};

export default ItemDetailsModal;
