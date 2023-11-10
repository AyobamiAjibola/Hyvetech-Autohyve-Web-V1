import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TabBtn from "../TabBtn/TabBtn";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { useFormik } from "formik";
import { Autocomplete, Button, CircularProgress, Divider, InputAdornment, TextField, createFilterOptions } from "@mui/material";
import useItemStock from "../../hooks/useItemStock";
import capitalize from "capitalize";
import useAppSelector from "../../hooks/useAppSelector";
import { HiOutlineTrash } from "react-icons/hi";
import DropDownHalfParts from "../DropDownHalf/DropDownHalfParts";
import { showMessage } from "../../helpers/notification";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";
import { IDriversFilterData } from "@app-interfaces";
import { getCustomerAction } from "../../store/actions/customerActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getOwnersFilterDataAction, getPartnerAction, getPartnerFilterDataAction } from "../../store/actions/partnerActions";
import useAdmin from "../../hooks/useAdmin";
import { Search } from "@mui/icons-material";
import { getpaymentRecievedAction } from "../../store/actions/transactionActions";
import AddInvoicePayment from "./AddInvoicePayment";
import { setInvoiceCode } from "../../store/reducers/expenseReducer";
import Select from "react-select";
import { customStyles } from "../../contsants/customStyles";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface IProps {
  openAddPayment: boolean,
  setOpenAddPayment: any,
  fromInvoice?: boolean,
  setFromInvoice?: any,
  // partnerId?: number
  invoiceId?: any
}

const paymentMode = ["Cash", "Transfer", "Check", "Payment link", "POS"];

const API_ROOT = settings.api.rest;

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

const AddPaymentModal = ({ 
  openAddPayment, 
  setOpenAddPayment,  
  fromInvoice,
  invoiceId
  // partnerId
}: IProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<IDriversFilterData | null>(null);
  const [rawOption, setRawOption] = useState<any>([]);
  const [showDrop, setShowDrop] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState("");
  const [noOptionsText, setNoOptionsText] = useState<any>(
    "Click Enter to Initialize Search"
  );
  const [options, setOptions] = useState<IDriversFilterData[]>([]);

  const { items } = useItemStock();
  const itemReducer = useAppSelector((state) => state.itemStockReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const dispatch = useAppDispatch()
  const admin = useAdmin();
  const _partnerId = useMemo(() => {
    return admin.user?.partner?.id;
  }, [admin.user]);

  const tabsItems = ["Item Sold", "Invoice"];
  const quantityData = [
    {label: "Pcs", value: "pcs"},
    {label: "Kg", value: "kg"},
    {label: "Set", value: "set"},
    {label: "Pair", value: "pair"} ,
    {label: "Litres", value: "litres"},
    {label: "Kit", value: "kit"}];

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

  const formik = useFormik({
    initialValues: {
      items: [{name: "",
      price: "",
      quantity: 0,
      quantityUnit: "",
      amountPaid: 0}],
      note: "",
      type: "",
      date: new Date()
    },
    onSubmit: (values) => {
      handlePaymentRecord(values)
    }
  })
  const values = formik.values;
  const setFieldValue = formik.setFieldValue;

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
    }
  };

  function handleSearch() {
    if ((inputValue || "").length == 0) {
      setShowDrop(false);
    } else {
      setNoOptionsText("No result Found");
      setShowDrop(true);
    }
  }

  const filterData = (_text: string) => {
    const text = _text.toLowerCase();
    setNoOptionsText("Click Enter to Initialize Search");

    const _temp: any = [];
    rawOption.map((_item: any) => {
      if ((_item?.raw?.firstName || "").toLowerCase().includes(text)) {
        _temp.push(_item);
      } else if ((_item?.raw?.lastName || "").toLowerCase().includes(text)) {
        _temp.push(_item);
      } else if ((_item?.raw?.companyName || "").toLowerCase().includes(text)) {
        _temp.push(_item);
      } else if ((_item?.raw?.email || "").toLowerCase().includes(text)) {
        _temp.push(_item);
      }
    });

    setOptions(_temp);
  };

  const handlePaymentRecord = async (values: any) => {
    if(values.date === "") {
      return showMessage('Payment', 'Payment date is required', 'error')
    }
    setLoading(true);
    try {
      const payload = {
        partnerId: _partnerId,
        customerId: value?.id,
        items: values.items,
        type: values.type,
        note: values.note,
        date: values.date
      };

      const response = await axiosClient.post(
        `${API_ROOT}/transactions/update-item-payment-manually`,
        payload
      );
      console.log(response.data);
      // @ts-ignore
      showMessage('Payment', 'Successful!', 'success');
      dispatch(getpaymentRecievedAction())
      setOpenAddPayment(false)
    } catch (e: any) {
      showMessage('Payment',
        e.response?.data?.message || "Unable able to process please try again", 'error'
      );
      console.log(e);
    }
    setLoading(false);
  };

  const handleClose = () => {
    // setFromInvoice(false)
    setValue(null)
    setInputValue("")
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
            fontSize: "14px",
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

  const _handleChangePart = useCallback(
    (e: any, index: number) => {
      const itemName = e.target.value;

      const tempItem = itemReducer.items;
      const newDetail = tempItem.find(
        (item: any) => item.slug === itemName?.slug
      );

      setFieldValue(`items.${index}.quantityUnit`, newDetail?.unit || "");
      setFieldValue(`items.${index}.price`, newDetail?.sellingPrice || 0);
      setFieldValue(`items.${index}.quantity`, 1);
      setFieldValue(`items.${index}.amountPaid`, newDetail?.sellingPrice || 0);
      //@ts-ignore
      setFieldValue(`items.${index}.partNumber`, newDetail?.slug || "");
      //@ts-ignore
      setFieldValue(
        `items.${index}.name`,
        `${itemName?.name && capitalize.words(itemName?.name)} [${
          newDetail?.slug
        }]` || ""
      );
      formik.setFieldTouched(`items.${index}.name`, false);
      formik.setFieldTouched(`items.${index}.quantity`, false);
    },
    [setFieldValue, formik.setFieldTouched, itemReducer.items]
  );

  const removeItem = (index: number) => {
    const newItems = [...values.items];
    newItems.splice(index, 1);
  
    setFieldValue('items', newItems);
  };

  const addItem = () => {
    const newItem = {
      name: "",
      price: "",
      quantity: 0,
      quantityUnit: "",
      amountPaid: 0
    };
  
    const newItems = [...values.items, newItem];
    setFieldValue('items', newItems)
  };

  const handleChangeQtyAndPrice = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
      index: number
    ) => {
      const quantityValue = `items.${index}.quantity`;
      const quantityUnit = `items.${index}.quantityUnit`;
      const priceName = `items.${index}.price`;
      const amountName = `items.${index}.amountPaid`;

      const isQuantityValue = quantityValue === e.target.name;
      const isPrice = priceName === e.target.name;
      const isQuantityUnit = quantityUnit === e.target.name;

      if (isQuantityValue) {
        const part = values.items[index];

        const amount = +part.price * +e.target.value;

        setFieldValue(quantityValue, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isPrice) {
        const part = values.items[index];
        const amount = +part.quantity * +e.target.value;

        setFieldValue(priceName, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isQuantityUnit) setFieldValue(quantityUnit, e.target.value);
    },
    [setFieldValue, values.items]
  );

  useEffect(() => {
    if (
      partnerReducer.getOwnersFilterDataStatus === "completed" ||
      partnerReducer.getPartnerFilterDataStatus === "completed"
    ) {
      setRawOption([
        ...partnerReducer.partnerFilterData,
        ...partnerReducer.ownersFilterData,
      ]);
      
    }
  }, [
    partnerReducer.ownersFilterData,
    partnerReducer.getOwnersFilterDataStatus
  ]);

  useEffect(() => {
    if (_partnerId) {
      dispatch(getOwnersFilterDataAction(+_partnerId));
      dispatch(getPartnerFilterDataAction(+_partnerId));
      dispatch(getPartnerAction(_partnerId));
    }
  }, [dispatch, _partnerId]);

  useEffect(() => {
    setFieldValue('date', '')
  },[])

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
            <ModalHeaderTitle title=" New Payment" />

            <button onClick={() => {
              // setFromInvoice(false)
              setOpenAddPayment(false)
              dispatch(setInvoiceCode(''))
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
            <>
              <div className="md:w-[70%] w-[100%] flex gap-2 justify-left items-left mt-8">
                <Autocomplete
                  filterOptions={filterOptions}
                  inputValue={inputValue}
                  value={value}
                  openOnFocus={false}
                  loading={
                    partnerReducer.getDriversFilterDataStatus === "loading"
                  }
                  getOptionLabel={(option) => option.fullName}
                  isOptionEqualToValue={(option, value) =>
                    option.fullName === value.fullName
                  }
                  onChange={(_: any, newValue: IDriversFilterData | null) => {
                    setValue(newValue);
                    handleGetDriverInfo(newValue?.id);
                  }}
                  onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  noOptionsText={noOptionsText}
                  className="w-[70%] font-sm"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent", // Remove border color
                    },
                    "& label": {
                      fontSize: "15px",
                      fontFamily: "montserrat",
                      color: "#A5A5A5"
                    },
                    "& input": {
                      fontSize: "15px",
                      fontFamily: "montserrat",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent", // Remove border color on focus
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent", // Remove border color on hover
                    },
                  }}
                  renderInput={(props) => (
                    <TextField
                      className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`
                      }
                      {...props}
                      label="Search customer."
                      onChange={(e) => {
                        filterData(e.target.value);
                      }}
                      onClick={() => {
                        handleSearch();
                      }}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        } else {
                          setShowDrop(false);
                        }
                      }}
                      onBlur={() => {
                        setShowDrop(false);
                      }}
                      // InputLabelProps={{
                      //   shrink: false
                      // }}
                      InputProps={{
                        ...props.InputProps,
                        classes: {
                          root: "custome-input-root",
                          input: "custome-input-root",
                        },
                        endAdornment: (
                          <React.Fragment>
                            {partnerReducer.getOwnersFilterDataStatus ===
                              "loading" ||
                            partnerReducer.getPartnerFilterDataStatus ===
                              "loading" ? (
                              <CircularProgress color="inherit" size={20} sx={{color: '#FAA21B'}} />
                            ) : (
                              <Button
                                sx={{
                                  zIndex: 1,
                                  cursor: "pointer",
                                  backgroundColor: "#181818",
                                  color: "white",
                                  "&:hover": {
                                    color: "#181818",
                                    backgroundColor: "white",
                                    boxShadow: 2,
                                  },
                                }}
                              >
                                <Search fontSize="medium" />
                              </Button>
                            )}
                            {props.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  options={showDrop ? options : []}
                  forcePopupIcon={false}
                />
              </div>
              <form
                autoComplete="off" autoCorrect="off"
                onSubmit={formik.handleSubmit}
              >
                <div className=" w-[100%] md:border-[1px] rounded-3xl  flex mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                  <h5 className="font-semibold font-montserrat">
                    Items Information
                  </h5>

                  {values?.items?.length > 0 &&
                  values?.items?.map((item: any, index: number) => (
                    <div className="flex flex-col md:flex-row  mt-3 w-full gap-5" key={index}>
                      <div className="w-full flex-col">
                        <InputHeader text={"Item Description"} />
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
                          value={item.name}
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
                              name={`items.${index}.name`}
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
                        />
                        
                      </div>

                      <div className="w-full">
                        <AppInput
                          hasPLaceHolder={true}
                          placeholderTop="Price (₦)"
                          placeholder="Enter the price"
                          name={`items.${index}.price`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={item.price}
                          type='number'
                          disabled
                        />
                      </div>
                      <div className="w-full">
                        <DropDownHalfParts
                          title="Quantity"
                          placeholder=""
                          placeholderInput="quantity"
                          type="number"
                          data={quantityData}
                          valueUnit={values.items[index].quantityUnit}
                          nameUnit={`items.${index}.quantityUnit`}
                          onChangeUnit={(e: any) => handleChangeQtyAndPrice(e, index)}
                          name={`items.${index}.quantity`}
                          value={values.items[index].quantity}
                          onChange={(e: any) => handleChangeQtyAndPrice(e, index)}
                        />
                      </div>

                      <div className="w-full">
                        <AppInput
                          type='number'
                          hasPLaceHolder={true}
                          placeholderTop="Amount Paid (₦)"
                          placeholder="Enter the amount paid"
                          name={`items.${index}.amountPaid`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={item.amountPaid}
                        />
                      </div> 

                      <button className="bg-red-500 h-[50px] w-32  items-center justify-center mt-6 rounded-lg hidden md:flex"
                        onClick={() => removeItem(index)} type="button"
                      >
                        <HiOutlineTrash size={20} color="#fff" className="text-center" />
                      </button>
                    </div> 
                  ))}

                  <InputHeader
                    text=" Add New Item"
                    onClick={addItem}
                    className="text-[#FAA21B] mt-6 hidden md:block cursor-pointer w-[110px]"
                  />
                </div> 

                <div className="flex md:flex-row justify-between flex-col">
                  <div className="flex w-[50%] justify-start md:justify-end mt-8 order-2 md:order-2">
                    <AppBtn
                      title="Generate"
                      className="font-medium w-full md:w-[80%] h-12"
                      spinner={loading}
                    />
                  </div>

                  <div className="flex gap-4 w-[100%] md:flex-row flex-col">
                    <div className="flex w-[100%] md:w-[60%] relative mt-7 order-1 md:order-1 flex-col">
                      <InputHeader text="Payment Date" />
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                          placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                          font-montserrat`}
                          disableFuture
                          minDate={new Date('2000/01/01')}
                          openTo="day"
                          views={['year', 'month', 'day']}
                          value={new Date(values.date)}
                          onChange={(value) => setFieldValue('date', value)}
                          sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent", // Remove border color
                              },
                              "& label": {
                              fontSize: "10px",
                              fontFamily: "montserrat",
                              color: "#A5A5A5",
                              paddingTop: "5px",
                              paddingLeft: "17px",
                              },
                              "& .MuiOutlinedInput-root": {
                                fontFamily: 'montserrat',
                                fontSize: '12px',
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent", // Remove border color on hover
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent", // Remove border color on focus
                              },
                              borderRadius: "20px",
                              backgroundColor: "#F5F5F5",
                  
                              borderColor: "transparent",
                              height: "53px",
                              border: "none",
                              },
                          }}
                          //@ts-ignore
                          renderInput={(params: any) =>
                            <TextField
                              {...params}
                              fullWidth
                              label="Date"
                              variant="outlined"
                              // value={invoice.code.splice('_')[0]}
                            />
                          }
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="flex w-[100%] md:w-[60%] relative mt-7 order-1 md:order-1 flex-col">
                      <InputHeader text={"Mode of payment"} />
                      <Select
                        options={paymentMode.map(option => ({ value: option, label: option }))}
                        onChange={(item) => {
                        setFieldValue("type", String(item?.value));
                        }}
                        styles={customStyles}
                        placeholder={"Mode of payment"}
                        name={"type"}
                        onBlur={formik.handleBlur}
                        value={{
                        value: values.type,
                        label: values.type,
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="flex w-full relative mt-5 order-1 md:order-1">
                      <div className="mt-2 w-[100%] md:w-[100%]">
                        <CustomTextArea
                          topTitle="Notes/Remarks"
                          placeholder="Note"
                          name="note"
                          value={values.note}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}

          {activeTab === 1 && (
            <>
              <AddInvoicePayment 
                setOpenAddPayment={setOpenAddPayment} 
                activeTab={activeTab}
                invoiceId={invoiceId}
              />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddPaymentModal;
