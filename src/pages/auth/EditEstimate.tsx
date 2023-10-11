import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import AppInput, { MyTextInput } from "../../components/AppInput/AppInput";
import AppInputWithPhone, { AppInputPhone } from "../../components/AppInputWithPhone/AppInputWithPhone";
import InputHeader from "../../components/InputHeader/InputHeader";

import DropDownHalf from "../../components/DropDownHalf/DropDownHalf";
import DeleteBox from "../../components/DeleteBox/DeleteBox";
import CustomTextArea from "../../components/CustomTextArea/CustomTextArea";
import AppBtn from "../../components/AppBtn/AppBtn";
import ReminderModal from "../../components/AutoHyveModals/ReminderModal";
import AppDropDown from "../../components/AppDropDown/AppDropDown";
import CustomDate from "../../components/CustomDate/CustomDate";
import { FieldArray, Form, Formik, useFormik } from "formik";
import { useLocation, useParams } from "react-router-dom";
import estimateModel, { IEstimateValues, IPart } from "../../components/Forms/models/estimateModel";
import { Autocomplete, Box, Button, Checkbox, CircularProgress, Divider, Grid, IconButton, InputAdornment, TextField, Typography, createFilterOptions } from "@mui/material";
import { getVehicleVINAction } from "../../store/actions/vehicleActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { IDriversFilterData } from "@app-interfaces";
import { getReminderAction } from "../../store/actions/serviceReminderActions";
import useEstimate from "../../hooks/useEstimate";
import { getCustomerAction } from "../../store/actions/customerActions";
import { Remove, Search, ToggleOff, ToggleOn } from "@mui/icons-material";
import capitalize from "capitalize";
import { getOwnersFilterDataAction, getPartnerAction, getPartnerFilterDataAction } from "../../store/actions/partnerActions";
import useAdmin from "../../hooks/useAdmin";
import useItemStock from "../../hooks/useItemStock";
import WarrantyFields from "./Estimate/WarrantyFields";
import QuantityFields from "./Estimate/QuantityFields";
import { formatNumberToIntl } from "../../utils/generic";

const { fields, schema, initialValues: _initialValues } = estimateModel;

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

export type PartArgs = IPart & {
  handleChange: (e: any) => void;
  index: number;
  values: IEstimateValues;
};

const GenerateEstimate = () => {
  const location = useLocation()
  const data = ["Individual", "Co-operate"];
  const [openStart, setOpenStart] = useState(false);
  const [calender, setCalender] = useState("");
  const [openReminder, setOpenReminder] = useState<boolean>(false);
  const [check, setCheck] = useState(false);
  const [estimate, setEstimate] = useState<any>();
  const [vinOptions, setvinOptions] = useState<any>([]);
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [activeId, setactiveId] = useState<number>(0);
  const [userInfo, setUserInfo] = useState({
    accountType: "",
    firstName: "",
    email: "",
    lastName: "",
    companyName: "",
    phone: "",
    creditRating: "N/A",
    state: "Abuja (FCT)",
    district: "",
    address: "",
  });
  const [value, setValue] = useState<IDriversFilterData | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [mileageUnit, setMileageUnit] = useState<string>("");
  const { initialValues, onEdit, partTotal, setInitialValues } = useEstimate();
  const [noOptionsText, setNoOptionsText] = useState<any>(
    "Click Enter to Initialize Search"
  );
  const [rawOption, setRawOption] = useState<any>([]);
  const [fetch, setFetch] = useState<boolean>(false);
  const [showDrop, setShowDrop] = useState<boolean>(false)
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const { items } = useItemStock();
  const [enableTaxPart, setEnableTaxPart] = useState<boolean>(false);
  const [enableTaxLabor, setEnableTaxLabor] = useState<boolean>(false);
  const [vatPart, setVatPart] = useState<number>(0);
  const [vat, setVat] = useState<number>(0);
  
  const partsOnly = items.filter((partsItem) => {
    return partsItem.type === "part" && partsItem.active === true;
  });

  const params = useParams();
  const admin = useAdmin();
  
  const formik = useFormik({
    validationSchema: schema,
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values, 'val')
    },
    validateOnBlur: true,
  });
  const values = formik.values;
  const setFieldValue = formik.setFieldValue;

  const dispatch = useAppDispatch();
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const customerReducer = useAppSelector(state => state.customerReducer);
  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const itemReducer = useAppSelector((state) => state.itemStockReducer);

  const years = ["Year(s)", "Month(s)", "Week(s)", "Day(s)"];
  const quantityData = ["Pcs", "Kg", "Set", "Pair", "Litres", "Kit"];
  const milesData = ["Miles", "Km"];
  const discountData = ["%", "₦"];
  const daysData = ["Hour(s)", "Day(s)", "Week(s)", "Month(s)", "Year(s)"];

  const toggleFetch = () => {
    setFetch(!fetch);
  };

  function handleSearch() {
    if ((inputValue || "").length == 0) {
      setShowDrop(false);
    } else {
      setNoOptionsText("No result Found");
      setShowDrop(true);
    }
  }

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      onEdit(state.item)
      setEstimate(state.item);
    }
  }, [location.state]);

  const filterData = (_text: string) => {
    const text = _text.toLowerCase();
    //
    // console.log(text)
    setNoOptionsText("Click Enter to Initialize Search");

    const _temp: any = [];
    rawOption.map((_item: any) => {
      // filter logic

      if ((_item?.raw?.email || "").toLowerCase() == text) {
        // check if it's an exact match to email
        _temp.push(_item);
      } else if ((_item?.raw?.phone || "").toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      } else if ((_item?.raw?.companyName || "").toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      } else if ((_item?.raw?.firstName || "").toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      } else if ((_item?.raw?.lastName || "").toLowerCase() == text) {
        // check if it's an exact match to phone
        _temp.push(_item);
      }
    });

    setOptions(_temp);
  };

  const partnerId = useMemo(() => {
    return +(params.id as unknown as string) || admin.user?.partner?.id;
  }, [admin.user, params.id]);

  // const estimateId = sessionStorage.getItem('id')
  // useEffect(() => {
  //   if(estimateId) {
  //     onEdit(+estimateId)
  //   }
  // },[estimateId]);

  const _handleChangeVIN = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vin = e.target.value;

      setTimer(
        setTimeout(() => {
          dispatch(getVehicleVINAction(vin));
        }, 2000)
      );

      setFieldValue("vin", vin);
    },
    [dispatch, setFieldValue]
  );

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

  const getOptionLabelLabour = (option: any) => {
    if (typeof option === "string") {
      return option;
    }
    if (option && option.name) {
      return capitalize.words(option.name);
    }
    return "";
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option === value || option.name === value;
  };

  const filterOptionsParts = (partsOnly: any, state: any) => {
    if (state.inputValue === "") {
      return [];
    } else {
      return partsOnly.filter((option: any) =>
        option.name.toLowerCase().includes(state.inputValue?.toLowerCase())
      );
    }
  };

  const _handleChangePart = useCallback(
    (e: any, index: number) => {
      const partName = e.target.value;

      const tempItem = itemReducer.items;
      const newDetail = tempItem.find(
        (item: any) => item.slug === partName?.slug
      );

      setFieldValue(`parts.${index}.quantity.unit`, newDetail?.unit || "");
      setFieldValue(`parts.${index}.price`, newDetail?.sellingPrice || 0);
      setFieldValue(`parts.${index}.quantity.quantity`, 1);
      setFieldValue(`parts.${index}.amount`, newDetail?.sellingPrice || 0);
      //@ts-ignore
      setFieldValue(`parts.${index}.partNumber`, newDetail?.slug || "");
      //@ts-ignore
      setFieldValue(
        `parts.${index}.name`,
        `${partName?.name && capitalize.words(partName?.name)} [${
          newDetail?.slug
        }]` || ""
      );
      formik.setFieldTouched(`parts.${index}.name`, false);
      formik.setFieldTouched(`parts.${index}.quantity.quantity`, false);
    },
    [setFieldValue, formik.setFieldTouched, itemReducer.items]
  );

  const filterOptionsLabour = (serviceOnly: any, state: any) => {
    if (state.inputValue === "") {
      return [];
    } else {
      return serviceOnly.filter((option: any) =>
        option.name.toLowerCase().includes(state.inputValue?.toLowerCase())
      );
    }
  };

  const handleChangeQtyAndPrice = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
      index: number
    ) => {
      const quantityValue = `parts.${index}.quantity.quantity`;
      const quantityUnit = `parts.${index}.quantity.unit`;
      const priceName = `parts.${index}.price`;
      const amountName = `parts.${index}.amount`;

      const isQuantityValue = quantityValue === e.target.name;
      const isPrice = priceName === e.target.name;
      const isQuantityUnit = quantityUnit === e.target.name;

      if (isQuantityValue) {
        const part = values.parts[index];

        const amount = +part.price * +e.target.value;

        setFieldValue(quantityValue, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isPrice) {
        const part = values.parts[index];
        const amount = +part.quantity.quantity * +e.target.value;

        setFieldValue(priceName, e.target.value);
        setFieldValue(amountName, `${amount}`);
      }

      if (isQuantityUnit) setFieldValue(quantityUnit, e.target.value);
    },
    [setFieldValue, values.parts]
  );

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
    }
  };

  useEffect(() => {
    if (
      customerReducer.getCustomerStatus === "completed" ||
      reminderReducer.getRemindersStatus === "completed"
    ) {
      const _reminderId = sessionStorage.getItem("id");
      const reminderId = (_reminderId && parseInt(_reminderId)) || -1;
      const __customer: any = reminderReducer.reminders.find((reminder: any) => {
        if (reminder.id === reminderId) return reminder;
      });

      const _customer: any = __customer
        ? __customer?.customer
        : customerReducer.customer;

      if (_customer != undefined) {
        // upto-populate info
        setFieldValue(fields.firstName.name, _customer.firstName);
        setFieldValue(fields.lastName.name, _customer.lastName);
        setFieldValue(fields.phone.name, _customer.phone);
        setFieldValue(fields.email.name, _customer.email);
        setFieldValue(
          fields.state.name,
          _customer.contacts[0]?.state || "Abuja (FCT)"
        );
        setFieldValue(
          fields.address.name,
          _customer.contacts[0]?.address || " ."
        );
        setFieldValue(fields.addressType.name, "Home");

        setactiveId(_customer.id);
        const vinList = __customer
          ? [__customer.vehicle.vin.toString()]
          : _customer.vehicles.map((_data: any) => _data?.vin || "");

        setvinOptions(vinList);

        setUserInfo({
          accountType:
            (_customer?.companyName || "").length === 0
              ? "individual"
              : "corporate",
          email: _customer.email,
          firstName: _customer.firstName,
          lastName: _customer.lastName,
          companyName: _customer.companyName,
          phone: _customer.phone,
          creditRating: _customer.creditRating,
          state: _customer.contacts[0]?.state || "Abuja (FCT)",
          district: _customer.contacts[0]?.district || "Abuja (FCT)",
          address: _customer.contacts[0]?.address || "Abuja (FCT)",
        });
      }

      if (__customer != undefined) {
        setFieldValue("vin", __customer.vehicle.vin);
        setFieldValue("make", __customer.vehicle.make);
        setFieldValue("model", __customer.vehicle.model);
        setFieldValue("modelYear", __customer.vehicle.modelYear);
        setFieldValue("plateNumber", __customer.vehicle.plateNumber);
      }
    }
  }, [
    // value,

    customerReducer.getCustomerStatus,
    reminderReducer.getRemindersStatus,
  ]);

  useEffect(() => {
    dispatch(getReminderAction());
  }, []);

  useEffect(() => {
    if (
      partnerReducer.getOwnersFilterDataStatus === "completed" ||
      partnerReducer.getPartnerFilterDataStatus === "completed"
    ) {
      // setOptions(partnerReducer.ownersFilterData);
      setRawOption(
        !fetch
          ? partnerReducer.partnerFilterData
          : partnerReducer.ownersFilterData
      );
    }
  }, [
    partnerReducer.ownersFilterData,
    partnerReducer.getOwnersFilterDataStatus,
    fetch,
  ]);

  useEffect(() => {
    if (partnerId) {
      dispatch(getOwnersFilterDataAction(+partnerId));
      dispatch(getPartnerFilterDataAction(+partnerId));
      dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId]);

  useEffect(() => {
    setFieldValue('vin', initialValues.vin)
    setFieldValue('make', initialValues.make)
    setFieldValue('model', initialValues.model)
    setFieldValue('modelYear', initialValues.modelYear)
    setFieldValue('plateNumber', initialValues.plateNumber)
    setFieldValue('mileage.count', initialValues.mileage.count)
    setMileageUnit(initialValues.mileage.unit)
    setFieldValue('parts', initialValues.parts)
  },[initialValues]);

  // useEffect(() => {
  //   setSubTotal(partTotal + labourTotal);
  // }, [partTotal, labourTotal]);

  useEffect(() => {
    if (!enableTaxPart) {
      setVatPart(0);
      return;
    }
    const vat = 7.5 * 0.01;
    const tax = partTotal * vat;

    setFieldValue("taxPart", formatNumberToIntl(tax));
    setVatPart(tax);
  }, [partTotal, setFieldValue, enableTaxPart]);

  useEffect(() => {
    // check for labor
    if (!enableTaxLabor) {
      // setFieldValue(fields.tax.name, 0);
      setVat(0);
      values.tax = "0";
    }

    // check for part
    if (!enableTaxPart) {
      //setFieldValue(fields.taxPart.name, 0);
      setVatPart(0);

      values.taxPart = "0";
    }
  }, [enableTaxLabor, enableTaxPart]);

  useEffect(() => {
    if (
      values?.estimate?.taxPart !== undefined &&
      parseInt(values?.estimate?.taxPart) !== 0
    ) {
      setEnableTaxPart(true);
    } else {
      setEnableTaxPart(false);
    }
  }, [values.estimate]);

  const addPart = () => {
    setInitialValues((prevValues) => {
      const newValues = { ...prevValues };
  
      const newPart = {
        name: "",
        warranty: { warranty: "", interval: "" },
        quantity: { quantity: "0", unit: "" },
        price: "0",
        amount: "0",
      };
  
      newValues.parts = [...newValues.parts, newPart];
  
      return newValues;
    });
  };
  
  const removePart = (index : number) => {

    setInitialValues((prevValues) => {
      const newValues = { ...prevValues };
      const newParts = [...newValues.parts];
    
      if (index >= 0 && index < newParts.length) {
        newParts.splice(index, 1);
      } else {
        console.log("Invalid index:", index);
      }
    
      newValues.parts = newParts;
    
      return newValues;
    });
    
  };

  console.log(initialValues.parts, 'init')
  return (
    <>
      <form>   
        <div>
          <div className="rounded-2xl mt-10  bg-white py-8 px-3">
            <div className="mt-10">
              <div className="md:w-[70%] w-[100%] flex gap-2 justify-center items-center">
                {/* <InputHeader text="Date" /> */}
                {/* <CustomDate /> */}
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
                  className="w-[70%]"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      label="Search customer by First name, last name, car plate number."
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
                      InputProps={{
                        ...props.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {partnerReducer.getOwnersFilterDataStatus ===
                              "loading" ||
                            partnerReducer.getPartnerFilterDataStatus ===
                              "loading" ? (
                              <CircularProgress color="inherit" size={20} />
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
                <Box onClick={toggleFetch} className="w-[30%]">
                  {fetch ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#FBA91A",
                      }}
                    >
                      <ToggleOn color="inherit" fontSize="large" />
                      &nbsp;
                      <span
                        style={{
                          fontSize: "14px",
                          fontStyle: "italic",
                          color: "#797979",
                        }}
                      >
                        AutoHyve Users
                      </span>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#797979",
                      }}
                    >
                      <ToggleOff color="inherit" fontSize="large" />
                      &nbsp;
                      <span style={{ fontSize: "14px", fontStyle: "italic" }}>
                        Customers
                      </span>
                    </Box>
                  )}
                </Box>
              </div>

              <div className=" w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                  Customer Informationsss
                </h5>
                <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.firstName.label}
                      placeholder={fields.firstName.label}
                      name={fields.firstName.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.firstName}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div>{formik.errors.firstName}</div>
                    )}
                  </div>

                  <div className="w-full flex flex-col">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.lastName.label}
                      placeholder={fields.lastName.label}
                      name={fields.lastName.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.lastName}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div>{formik.errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row w-full mt-2 gap-5">
                  <div className=" mt-5 flex-1">
                    <AppInputPhone
                      hasPLaceHolder={true}
                      placeholder="whatsapp Number"
                      placeholderTop="Phone Number"
                      type="text"
                      name={fields.phone.name}
                      onChange={(event: any) => {
                        setFieldValue(fields.phone.name, event?.target?.value);
                      }}
                      onBlur={formik.handleBlur}
                      value={values.phone}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div>{formik.errors.phone}</div>
                    )}
                  </div>

                  <div className="flex-1 md:mt-5 mt-0 flex-col">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.address.label}
                      placeholder={fields.address.label}
                      name={fields.address.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.address}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div>{formik.errors.address}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-5">
                  <div className="w-full">
                    <InputHeader text={fields.vin.label} />
                    <Autocomplete
                      options={vinOptions || []}
                      // @ts-ignore
                      onChange={(_, newValue) => {
                        //@ts-ignore
                        _handleChangeVIN({ target: { value: newValue } })
                      }}
                      value={values.vin}
                      fullWidth
                      renderInput={params =>
                        <TextField
                          className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                            placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                            font-montserrat`}
                          {...params}
                          label=""
                          name={fields.vin.name}
                          onChange={(e: any) => {
                            // console.log(e.target.value)
                            _handleChangeVIN(e)
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end" sx={{ position: 'absolute', left: '90%' }}>
                                {vehicleReducer.getVehicleVINStatus === 'loading' && <CircularProgress size={25} />}
                              </InputAdornment>
                            ),
                            classes: {
                              root: "custome-input-root",
                              input: "custome-input-root",
                            },
                          }}
                        />}
                    />
                  </div>

                  <div className="w-full">
                     <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.modelYear.label}
                      placeholder={fields.modelYear.label}
                      name={fields.modelYear.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.modelYear}
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.make.label}
                      placeholder={fields.make.label}
                      name={fields.make.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.make}
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.model.label}
                      placeholder={fields.model.label}
                      name={fields.model.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.model}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row  mt-5  gap-5 md:w-[50%] w-[100%]">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.plateNumber.label}
                      placeholder={fields.plateNumber.label}
                      name={fields.plateNumber.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.plateNumber}
                    />
                  </div>{" "}
                  <div className="w-full">
                    <DropDownHalf
                      title="Service Interval"
                      placeholder="Unit"
                      placeholderInput={fields.mileageValue.label}
                      name="mileage.count"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.mileage.count}
                      type="number"
                      data={milesData}
                      setUnit={setMileageUnit}
                      unit={mileageUnit}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row  mt-5  gap-5 md:w-[75%] w-[100%]">
                  <div className="w-full">
                    {/* <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.plateNumber.label}
                      placeholder={fields.plateNumber.label}
                      name={fields.plateNumber.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.plateNumber}
                    /> */}
                    <div
                      onClick={() => setOpenReminder(true)}
                      className="flex items-center gap-4 font-montserrat cursor-pointer text-[#FAA21B]"
                    >
                      <span>View Reminder</span>
                      <FaCalendarAlt />
                    </div>
                  </div>
                  {/* <div className="w-full">
                    <DropDownHalf
                      title="Mileage Value"
                      placeholder="Miles"
                      placeholderInput="N/A"
                    />
                    {/* <p className="flex items-center mt-3 gap-4 cursor-pointer font-montserrat text-[#FAA21B]">
                      View Vehicle History
                    </p> 
                  </div> */}

                  {/* <div className="w-full">
                    <AppDropDown
                      title="View Vehicle History"
                      data={["CarFax Report", "VHve Report"]}
                      placeholder="Select Vehicle History"
                    />
                  </div> */}
                </div>
              </div>

              <div className=" w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">Parts</h5>

                {initialValues.parts.map((part: any, index: number) => (
                  <div key={index} className="flex flex-col items-start md:items-center md:flex-row  mt-5  gap-3 w-[100%]">
                    <div className="md:flex-1 w-full">
                      <InputHeader text={"Name"} />
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={''}
                            // onChange={formik.handleChange}
                            onChange={(e: any) => {
                              const updatedParts = [...initialValues.parts];
                              updatedParts[index].name = e.target.value;
                              setInitialValues({...initialValues, parts: updatedParts});
                            }}
                            name={`parts.${index}.name`}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{
                                    position: "absolute",
                                    left: {
                                      lg: "90%",
                                      xs: "80%",
                                    },
                                  }}
                                >
                                  {itemReducer.getItemsStatus ===
                                    "loading" && (
                                    <CircularProgress
                                      size={25}
                                    />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="md:flex-1 w-full">
                      <DropDownHalf
                        title="Warranty"
                        placeholder="Years"
                        placeholderInput="warranty"
                        // name="mileage.count"
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // value={values.mileage.count}
                        type="number"
                        data={years}
                        setUnit={setMileageUnit}
                        unit={mileageUnit}
                        name={`parts.${index}.warranty.warranty`}
                        value={part.warranty.warranty}
                        onChange={(e: any) => {
                          const updatedParts = [...initialValues.parts];
                          updatedParts[index].warranty.warranty = e.target.value;
                          setInitialValues({...initialValues, parts: updatedParts});
                        }}
                      />
                    </div>
                    <div className="md:flex-1 w-full">
                      <DropDownHalf
                        title="Quantity"
                        placeholder="Years"
                        placeholderInput="quantity"
                        // name="mileage.count"
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // value={values.mileage.count}
                        type="number"
                        data={quantityData}
                        setUnit={setMileageUnit}
                        unit={mileageUnit}
                        name={`parts.${index}.quantity.quantity`}
                        value={part.quantity.quantity}
                        onChange={(e: any) => {
                          const updatedParts = [...initialValues.parts];
                          updatedParts[index].warranty.interval = e.target.value;
                          setInitialValues({...initialValues, parts: updatedParts});
                        }}
                      />
                    </div>

                    <div className="md:flex-1 w-full">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop='Price'
                        placeholder="price"
                        // name={fields.firstName.name}
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // value={values.firstName}
                        name={`parts.${index}.price`}
                        value={part.price}
                        onChange={(e: any) => {
                          const updatedParts = [...initialValues.parts];
                          updatedParts[index].price = e.target.value;
                          setInitialValues({...initialValues, parts: updatedParts});
                        }}
                      />
                    </div>

                    <div className="md:flex-1 w-full">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop='Amount (₦)'
                        placeholder="Enter amount"
                        // name={fields.firstName.name}
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // value={values.firstName}
                        name={`parts.${index}.amount`}
                        value={part.amount}
                        onChange={(e: any) => {
                          const updatedParts = [...initialValues.parts];
                          updatedParts[index].amount = e.target.value;
                          setInitialValues({...initialValues, parts: updatedParts});
                        }}
                      />
                    </div>
                    <div className="mt-5 w-full flex justify-between items-center  md:hidden">
                      <DeleteBox onClick={() => removePart(index)} />
                    </div>
                    <div className="mt-5  md:block hidden">
                      <DeleteBox 
                        onClick={() => removePart(index)}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between mt-5 md:mt-10">
                  <InputHeader
                    text=" Add new part"
                    className="text-[#FAA21B] cursor-pointer"
                    onClick={(e: any) => { e.preventDefault(), addPart()}}
                  />
                  <span className="font-montserrat font-semibold">
                    Total Part (s): ₦0.00
                  </span>
                </div>

                <hr className="mt-10" />

                <div className="flex justify-between items-start md:items-center flex-col md:flex-row w-[100% mt-10">
                  <div className="flex items-center gap-3">
                    <div onClick={() => setCheck(!check)} className="flex-1">
                      {check ? (
                        <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                          <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                        </div>
                      ) : (
                        <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                      )}
                    </div>
                    <div className="font-montserrat font-medium text-xs">
                      Apply VAT
                    </div>
                  </div>

                  <div className="md:mt-0 mt-8 w-full md:w-[30%]">
                    <AppInput
                      value={""}
                      hasPLaceHolder={true}
                      placeholderTop="VAT 7.5% (₦)"
                      placeholder="Enter a value to apply VAT"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                    
                  </div>
                </div>
              </div>

               {/*<div className="w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">Service Items</h5>

                <div className="flex flex-col md:flex-row w-[100%] items-end md:items-center gap-10 mt-5">
                  <div className="md:w-[35%] w-[100%] -mb-5 md:mb-0">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Title"
                      placeholder="Enter Title"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                  </div>
                  <div className="md:w-[35%] w-[100%]">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Cost (₦)"
                      placeholder="Enter cost"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                  </div>
                  <div className="md:mt-5 -mt-5">
                    <DeleteBox />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row w-[100%] items-end md:items-center gap-10 mt-5">
                  <div className="md:w-[35%] w-[100%] -mb-5 md:mb-0">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Title"
                      placeholder="Enter Title"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                  </div>
                  <div className="md:w-[35%] w-[100%]">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Cost (₦)"
                      placeholder="Enter cost"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                  </div>

                  <div className="md:mt-5 -mt-5">
                    <DeleteBox />
                  </div>
                </div>

                <span className="font-montserrat inline-block mt-5 text-[#FAA21B]">
                  Add new part
                </span>
                <hr className="mt-10 hidden md:block" />

                <div className="flex items-center gap-3 mt-5">
                  <div onClick={() => setCheck(!check)}>
                    {check ? (
                      <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                        <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                      </div>
                    ) : (
                      <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                    )}
                  </div>
                  <span className="font-montserrat font-medium text-xs">
                    Apply VAT
                  </span>
                </div>
              </div>

              <div className="w-[100%] md:border-[1px] rounded-3xl  flex mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">Job Information</h5>

                <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                  <div className=" mt-5 md:w-[40%] w-[100%] rounded-3xl md:py-0 py-5 border-[#CACACA] md:px-0 px-3 border-[1px] md:border-[0px] md:border-[#fff]">
                    <div className="md:mt-2 mt-0">
                      <CustomTextArea
                        topTitle="Notes/Remarks"
                        placeholder="Note"
                      />
                    </div>

                    <div className="mt-8">
                      <DropDownHalf
                        title="Job Duration"
                        placeholder="Day"
                        placeholderInput="Enter Duration"
                        data={daysData}
                      />
                    </div>

                    <div className="mt-8">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop="Deposit Amount"
                        placeholder="Enter deposit amount"
                        className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                      />
                    </div>
                  </div>

                  <div className="side-divider md:block hidden" />

                  <div className="mt-5 md:w-[40%] w-[100%] rounded-3xl md:py-0 py-5 border-[#CACACA] md:px-0 px-3 border-[1px] md:border-[0px] md:border-[#fff]">
                    <div className="md:mt-7 mt-0">
                      <DropDownHalf
                        title="Discount"
                        placeholder="Day(s)"
                        placeholderInput="Enter discount"
                        data={discountData}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Sub-Total" />
                        <InputHeader text="₦0.00" />
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="VAT" />
                        <InputHeader text="₦0.00" />
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Discount" />
                        <InputHeader text="₦0.00" />
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Due Balance" />
                        <InputHeader text="₦0.00" />
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Refundable" />
                        <InputHeader text="₦0.00" />
                      </div>

                      <hr />
                      <div className="flex justify-between my-5">
                        <InputHeader text="Grand-Total" className="font-bold" />
                        <InputHeader text="₦0.00" className="font-bold" />
                      </div>

                      <div className="flex items-center gap-3 mt-10">
                        <div onClick={() => setCheck(!check)}>
                          {check ? (
                            <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                              <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                            </div>
                          ) : (
                            <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                          )}
                        </div>
                        <span className="font-montserrat font-medium text-xs">
                          customername@gmail.com
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="flex justify-end flex-col md:flex-row mt-10 gap-5">
                <AppBtn title="SEND" className="btn-secondary font-semibold" />
                <AppBtn title="SAVE" className="font-semibold" />
              </div>
            </div>
          </div>
        </div>
      </form>
      <ReminderModal
        openReminder={openReminder}
        setOpenReminder={setOpenReminder}
      />
    </>
  );
};

export default GenerateEstimate;
