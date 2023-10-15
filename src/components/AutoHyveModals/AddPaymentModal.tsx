import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TabBtn from "../TabBtn/TabBtn";
import DropDownHalf from "../DropDownHalf/DropDownHalf";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CustomDate from "../CustomDate/CustomDate";
import DeleteBox from "../DeleteBox/DeleteBox";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Autocomplete, Divider } from "@mui/material";
import useItemStock from "../../hooks/useItemStock";
import capitalize from "capitalize";
import useAppSelector from "../../hooks/useAppSelector";

interface IProps {
  openAddPayment: boolean,
  setOpenAddPayment: any,
  fromInvoice?: boolean,
  setFromInvoice?: any
}

const AddPaymentModal = ({ 
  openAddPayment, 
  setOpenAddPayment,  
  fromInvoice,
  setFromInvoice
}: IProps) => {
  const node = useRef();
  const [openStart, setOpenStart] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [calender, setCalender] = useState("");
  const { items } = useItemStock();
  const itemReducer = useAppSelector((state) => state.itemStockReducer);

  const tabsItems = ["Item Sold", "Invoice"];
  const paymentMode = ["Cash", "Transfer", "Check", "Payment link", "POS"];
  const types = ["label 1", "label 2"];

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "80%" : "95%",
    height: isSmallScreen ? 550 : 700,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => {
    // setFromInvoice(false)
    setOpenAddPayment(false)
  };
    
  useEffect(() => {
    if(fromInvoice) {
      setActiveTab(1)
    }
  },[fromInvoice, activeTab])

  const filterOptionsParts = (partsOnly: any, state: any) => {
    if (state.inputValue === "") {
      return [];
    } else {
      return partsOnly.filter((option: any) =>
        option.name.toLowerCase().includes(state.inputValue?.toLowerCase())
      );
    }
  };

  const partsOnly = items.filter((partsItem: any) => {
    return partsItem.type === "part" && partsItem.active === true;
  });

  const getOptionLabel = (option: any) => {
    if (typeof option === "string") {
      return option;
    }
    if (option && option.name) {
      return `${capitalize.words(option.name)} | ${option.slug} $^%&*(Stock: ${
        option.quantity ? option.quantity : 0
      })`;
    }
    return "";
  };

  const renderOption = (props: any, option: any) => {
    const label = getOptionLabel(option);
    const labelParts = label.split("$^%&*");
    return (
      <li {...props} style={{ display: "block" }}>
        <span
          style={{
            fontSize: "16px",
            textAlign: "left",
            fontWeight: 400,
            display: "block",
          }}
        >
          {labelParts[0]}
        </span>
        {labelParts[1] && (
          <>
            <span
              style={{
                fontSize: "12px",
                textAlign: "right",
                marginBottom: "1px",
                display: "block",
              }}
            >
              {/* {'(Stock'} */}
              {labelParts[1]}
            </span>
            <Divider orientation="horizontal" />
          </>
        )}
      </li>
    );
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option === value || option.name === value;
  };

  // const _handleChangePart = useCallback(
  //   (e: any, index: number) => {
  //     const partName = e.target.value;

  //     const tempItem = itemReducer.items;
  //     const newDetail = tempItem.find(
  //       (item: any) => item.slug === partName?.slug
  //     );

  //     setFieldValue(`parts.${index}.quantity.unit`, newDetail?.unit || "");
  //     setFieldValue(`parts.${index}.price`, newDetail?.sellingPrice || 0);
  //     setFieldValue(`parts.${index}.quantity.quantity`, 1);
  //     setFieldValue(`parts.${index}.amount`, newDetail?.sellingPrice || 0);
  //     //@ts-ignore
  //     setFieldValue(`parts.${index}.partNumber`, newDetail?.slug || "");
  //     //@ts-ignore
  //     setFieldValue(
  //       `parts.${index}.name`,
  //       `${partName?.name && capitalize.words(partName?.name)} [${
  //         newDetail?.slug
  //       }]` || ""
  //     );
  //     formik.setFieldTouched(`parts.${index}.name`, false);
  //     formik.setFieldTouched(`parts.${index}.quantity.quantity`, false);
  //   },
  //   [setFieldValue, formik.setFieldTouched, itemReducer.items]
  // );


  return (
    <>
      <Modal
        open={openAddPayment}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title=" Generate Payment" />

            <button onClick={() => {
              // setFromInvoice(false)
              setOpenAddPayment(false)
              }}
            >
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="flex gap-3 mt-5 border-[1px] w-[100%] md:w-[40%] rounded-[21px] p-1 border-[#CACACA]">
            {tabsItems.map((item, index) => {
              return (
                <TabBtn
                  title={item}
                  onClick={() => setActiveTab(index)}
                  key={index}
                  className={
                    activeTab === index
                      ? "btn-primary  w-[80%]"
                      : "btn-secondary w-[80%]"
                  }
                />
              );
            })}
          </div>

          {(activeTab === 0 && !fromInvoice) && (

            // <Formik
            //   enableReinitialize
            //   initialValues={{
            //     itemDescription: "",
            //     price: "",
            //     quantity: 0,
            //     quantityUnit: "",
            //     amountPaid: 0
            //   }}
            //   onSubmit={(values) => {
            //     console.log(values)
            //   }}
            //   validationSchema={
            //     Yup.object({
            //       itemDescription: Yup.string().required().label("Item description"),
            //       price: Yup.string().required().label("Item price"),
            //       quantity: Yup.string().label("Quantity"),
            //       quantityUnit: Yup.string().required().label("Quantity unit"),
            //       amountPaid: Yup.string().required().label("Amount paid")
            //     })
            //   }
            // >
            //   {({ setFieldValue, values, handleChange, handleBlur }) => (
            //     <Form>
                  <>
                    <div className=" w-[100%] md:border-[1px] rounded-3xl  flex mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                      <h5 className="font-semibold font-montserrat">
                        Items Information
                      </h5>
                      <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                        <div className="w-full flex-col">
                          <AppInput
                            hasPLaceHolder={true}
                            placeholderTop="Item Description"
                            placeholder="Brake Pads (Front) [EBC124YG]"
                            className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                          />

                          {/* <InputHeader text={"Name"} />
                          <Autocomplete
                            filterOptions={filterOptionsParts}
                            options={partsOnly}
                            openOnFocus
                            getOptionLabel={getOptionLabel} 
                            renderOption={renderOption}
                            noOptionsText="..."
                            isOptionEqualToValue={
                              isOptionEqualToValue
                            }
                            // @ts-ignore
                            onChange={(_, newValue) => {
                              _handleChangePart(
                                { target: { value: newValue } },
                                index
                              );
                            }}
                            //@ts-ignore
                            value={part.name}
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent", // Remove border color
                                fontSize: "14px"
                              },
                              "& label": {
                                fontSize: "12px",
                                fontFamily: "montserrat",
                                color: "#A5A5A5",
                                paddingTop: '4px'
                              },
                              "& input": {
                                fontSize: "12px",
                                fontFamily: "montserrat",
                                marginRight: '-50px'
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent", // Remove border color on focus
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent", // Remove border color on hover
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                                placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                                font-montserrat`}
                                label={''}
                                onChange={formik.handleChange}
                                name={`parts.${index}.name`}
                                InputLabelProps={{
                                  shrink: false
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  classes: {
                                    root: "custome-input-root",
                                    input: "custome-input-root",
                                  },
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      sx={{
                                        position: "absolute",
                                        left: {
                                          lg: "90%",
                                          xs: "70%",
                                        },
                                      }}
                                    >
                                      { itemReducer.getItemsStatus === "loading" && (
                                        <CircularProgress
                                          size={20}
                                          sx={{color: '#FAA21B'}}
                                        />
                                      )}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          /> */}

                          <InputHeader
                            text=" Add New Item"
                            className="text-[#FAA21B] mt-3 hidden md:block"
                          />
                        </div>

                        <div className="w-full">
                          <AppInput
                            hasPLaceHolder={true}
                            placeholderTop="Price (₦)"
                            placeholder="43,000.00"
                            className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                          />
                        </div>
                        <div className="w-full">
                          <DropDownHalf
                            title="Quantity"
                            placeholder="Pcs"
                            placeholderInput="5"
                          />
                        </div>

                        <div className="w-full">
                          <AppInput
                            hasPLaceHolder={true}
                            placeholderTop="Amount Paid (₦)"
                            placeholder="215,000.00"
                            className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                          />
                        </div>

                        <div className="mt-3 md:mt-7 flex justify-between">
                          <InputHeader
                            text=" Add New Item"
                            className="text-[#FAA21B] mt-3 block md:hidden"
                          />
                          <DeleteBox />
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-row justify-between flex-col">
                      <div className="flex w-[100%] justify-start md:justify-end mt-8 order-2 md:order-2">
                        <AppBtn
                          title="Generate"
                          className="font-medium w-full md:w-[30%] h-12"
                        />
                      </div>

                      <div className="flex w-full relative mt-5 order-1 md:order-1">
                        <div className="mt-2 w-[100%] md:w-[80%]">
                          <CustomTextArea
                            topTitle="Notes/Remarks"
                            placeholder="Note"
                          />
                        </div>
                      </div>
                    </div>
                  </>
            //   </Form>
            //   )}
            // </Formik>
          )}

          {activeTab === 1 && (
            <>
              <div className="w-[100%] md:w-[30%] mt-5">
                <AppDropDown
                  title="Select Invoice"
                  data={types}
                  placeholder="Labels"
                />
              </div>
              <div className=" w-[100%] md:border-[1px] rounded-3xl  flex mt-3 md:mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                  Customer Information
                </h5>
                <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="First Name"
                      placeholder="David"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Last Name"
                      placeholder="James"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="flex md:flex-row flex-col gap-5 mt-8">
                  <div className="flex-1">
                    <InputHeader text="Date of Invoice" />
                    <CustomDate />
                  </div>

                  <div className="flex-1">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Receipt #"
                      placeholder="DRC-64845206"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                  <div className="flex-1">
                    <AppDropDown
                      title="Mode of payment"
                      data={paymentMode}
                      placeholder="Labels"
                    />
                  </div>
                  <div className="flex-1">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Amount Paid (₦)"
                      placeholder="140,184.00"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start  md:justify-end mt-8">
                <AppBtn
                  title="Generate"
                  className="font-medium md:w-[15%] w-[100%]"
                  onClick={() => {
                    handleClose()
                  }}
                />
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddPaymentModal;
