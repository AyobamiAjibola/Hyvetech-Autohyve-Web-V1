import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import AppInput from "../../components/AppInput/AppInput";
import { AppInputPhone } from "../../components/AppInputWithPhone/AppInputWithPhone";
import InputHeader from "../../components/InputHeader/InputHeader";
import DropDownHalfParts from "../../components/DropDownHalf/DropDownHalfParts";
import DropDownHalf from "../../components/DropDownHalf/DropDownHalf";
import DeleteBox from "../../components/DeleteBox/DeleteBox";
import CustomTextArea from "../../components/CustomTextArea/CustomTextArea";
import AppBtn from "../../components/AppBtn/AppBtn";
import ReminderModal from "../../components/AutoHyveModals/ReminderModal";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import estimateModel, { IEstimateValues, IPart } from "../../components/Forms/models/estimateModel";
import { Autocomplete, Box, Button, CircularProgress, Divider, InputAdornment, TextField, createFilterOptions } from "@mui/material";
import { getVehicleVINAction } from "../../store/actions/vehicleActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { IDriversFilterData } from "@app-interfaces";
import { getReminderAction } from "../../store/actions/serviceReminderActions";
import useEstimate from "../../hooks/useEstimate";
import { getCustomerAction } from "../../store/actions/customerActions";
import { Search, ToggleOff, ToggleOn } from "@mui/icons-material";
import capitalize from "capitalize";
import { getOwnersFilterDataAction, getPartnerAction, getPartnerFilterDataAction } from "../../store/actions/partnerActions";
import useAdmin from "../../hooks/useAdmin";
import useItemStock from "../../hooks/useItemStock";
import { Util } from "../../helpers/Util";
import { ESTIMATE_STATUS } from "../../config/constants";
import { clearCreateEstimateStatus, clearSaveEstimateStatus } from "../../store/reducers/estimateReducer";

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
  const location = useLocation();
  const [openReminder, setOpenReminder] = useState<boolean>(false);
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
  const [subTotal, setSubTotal] = useState<number>(0);
  const [vatTotal, setVatTotal] = useState(0);
  const [save, setSave] = useState<boolean>(false)
  const navigate = useNavigate();

  const partsOnly = items.filter((partsItem: any) => {
    return partsItem.type === "part" && partsItem.active === true;
  });
  const serviceOnly = items.filter((serviceItem: any) => {
    return serviceItem.type === "service" && serviceItem.active === true;
  });

  const { 
    initialValues, 
    setGrandTotal, setPartTotal,
    setLabourTotal, grandTotal, handleSaveEstimate,
    handleCreateEstimate, discount, discountType, 
    setDiscount, setDiscountType
  } = useEstimate();

  const params = useParams();
  const admin = useAdmin();
  
  const formik = useFormik({
    validationSchema: schema,
    initialValues: initialValues,
    onSubmit: (values) => {
      save 
        ? handleSaveEstimate(values)
        : handleCreateEstimate(values)
    },
    validateOnBlur: true,
  });
  const values = formik.values;
  const setFieldValue = formik.setFieldValue;

  const _partTotal = useMemo(() => {
    let total = 0;
    values.parts.forEach((value) => {
      total += +value.amount;
    });
    setPartTotal(total)
    return total;
  }, [values.parts]);

  const _labourTotal = useMemo(() => {
    let total = 0;
    values.labours.forEach((value) => {
      total += +value.cost;
    });
    setLabourTotal(total)
    return total;
  }, [values.labours]);

  const calculateTaxLabour = useCallback(() => {
    if (!enableTaxLabor) {
      setVat(0);
      return;
    }
    const vat = 7.5 * 0.01;
    const tax = _labourTotal * vat;

    setFieldValue("tax", tax);
    setVat(tax);
  }, [enableTaxLabor, _labourTotal, setFieldValue]);

  const dispatch = useAppDispatch();
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const customerReducer = useAppSelector(state => state.customerReducer);
  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const itemReducer = useAppSelector((state) => state.itemStockReducer);
  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const [fetchCustomerData, setFetchCustomerData] = useState(false);
  const [removeSessionStorage, setRemoveSessionStorage] = useState<boolean>(false);

  const [vehicleReminder, setVehicleReminder] = useState<any>(reminderReducer.reminders)

  const years = [
    {label: "Year(s)", value: "year"}, 
    {label: "Month(s)", value: "month"},
    {label: "Week(s)", value: "week"},
    {label: "Day(s)", value: "day"}
  ];
  const quantityData = [
    {label: "Pcs", value: "pcs"},
    {label: "Kg", value: "kg"},
    {label: "Set", value: "set"},
    {label: "Pair", value: "pair"} ,
    {label: "Litres", value: "litres"},
    {label: "Kit", value: "kit"}];
  const milesData = [
    {label: "Miles", value: "miles"}, 
    {label: "Km", value: "km"}
  ];
  const discountData = [
    {label: "Percentage", value: "percent"}, 
    {label: "Amount", value: "exact"}
  ]; 
  const daysData = [
    {label: "Hour(s)", value: 'hour'}, 
    {label: "Day(s)", value: 'day'}, 
    {label: "Week(s)", value: 'week'}, 
    {label: "Month(s)", value: 'month'}, 
    {label: "Year(s)", value: 'year'}
  ];

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

  const partnerId = useMemo(() => {
    return +(params.id as unknown as string) || admin.user?.partner?.id;
  }, [admin.user, params.id]);

  const _handleChangeVIN = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vin = e.target.value;

      setTimer(
        setTimeout(() => {
          dispatch(getVehicleVINAction(vin.toUpperCase()));
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

  const _handleChangeService = useCallback(
    (e: any, index: number) => {
      const partName = e.target.value;

      setFieldValue(
        `labours.${index}.title`,
        `${partName?.name && capitalize.words(partName?.name)}` || ""
      );
      const tempItem = itemReducer.items;
      const newDetail = tempItem.find(
        (item: any) => item.name === partName?.name
      );
      setFieldValue(`labours.${index}.cost`, newDetail?.sellingPrice || 0);

      formik.setFieldTouched(`labours.${index}.cost`, false);
    },
    [setFieldValue, formik.setFieldTouched, itemReducer.items]
  );

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
      setFetchCustomerData(true)
      dispatch(getCustomerAction(id));
    }
  };

  const calculateDiscount = useCallback(
    (total: number) => {
      if (discountType === "exact") {
        return discount;
      } else {
        return Math.ceil(total * (discount / 100));
      }
    },
    [discount, discountType]
  );

  useEffect(() => {
    if (reminderReducer.getRemindersStatus === "completed") {
      const condition = (obj: any) =>
        obj.vehicle.vin === values.vin &&
        obj.partnerId === admin.user?.partner?.id;
      setVehicleReminder(reminderReducer.reminders.filter(condition));
    }
  }, [reminderReducer.getRemindersStatus, values.vin]);

  const _reminderId = sessionStorage.getItem("reminderId");
  const customerId = sessionStorage.getItem('customerId')
  useEffect(() => {
    if (
      customerReducer.getCustomerStatus === "completed" || 
      reminderReducer.getRemindersStatus === "completed" &&
      fetchCustomerData
    ) {
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
    customerReducer.getCustomerStatus,
    reminderReducer.getRemindersStatus,
    fetchCustomerData
  ]);

  useEffect(() => {
    if(customerId) {
      const cusId = parseInt(customerId) || -1;
      dispatch(getCustomerAction(cusId))
    }

    return () => {
      sessionStorage.removeItem("customerId")
    }
  },[customerId])

  useEffect(() => {
    if(vehicleReducer.getVehicleVINStatus === 'completed') {
      setFieldValue('make', vehicleReducer.vehicleVINDetails[2]?.value)
      setFieldValue('plateNumber', vehicleReducer.vehicleVINDetails[10]?.value)
      setFieldValue('model', vehicleReducer.vehicleVINDetails[1].value === null ? null : vehicleReducer.vehicleVINDetails[1].value)
      setFieldValue('modelYear', vehicleReducer.vehicleVINDetails[4]?.value)
    }
  },[vehicleReducer.getVehicleVINStatus, setFieldValue])

  useEffect(() => {
    if(_reminderId !== null) {
      dispatch(getReminderAction());
    }
  }, [_reminderId]);

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
    setSubTotal(_partTotal + _labourTotal);
  }, [_partTotal, _labourTotal]);

  useEffect(() => {
    if (!enableTaxPart) {
      setVatPart(0);
      return;
    }
    const vat = 7.5 * 0.01;
    const tax = _partTotal * vat;

    setFieldValue("taxPart", tax);
    setVatPart(tax);
  }, [_partTotal, setFieldValue, enableTaxPart]);

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

  const addPart = () => {
    const newPart = {
      name: "",
      warranty: { warranty: "", interval: "" },
      quantity: { quantity: "0", unit: "" },
      price: "0",
      amount: "0"
    };
  
    const newParts = [...values.parts, newPart];
    setFieldValue('parts', newParts)
  };

  const addService = () => {
    const newService = {
      title: "",
      cost: "0"
    };
  
    const newServices = [...values.labours, newService];
    setFieldValue('labours', newServices)
  };
  
  const removePart = (index: number) => {
    const newParts = [...values.parts];
    newParts.splice(index, 1);
  
    setFieldValue('parts', newParts);
  };

  const removeService = (index: number) => {
    const newService = [...values.labours];
    newService.splice(index, 1);
  
    setFieldValue('labours', newService);
  };

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

  useLayoutEffect(() => {
    calculateTaxLabour();
  }, [calculateTaxLabour]);

  useEffect(() => {
    setGrandTotal(subTotal - calculateDiscount(subTotal));
  }, [subTotal]);

  useEffect(() => {
    const totalVat = vat + vatPart;

    setVatTotal(totalVat);
  }, [vat, vatPart]);

  useEffect(() => {
    setGrandTotal(subTotal + vatTotal - calculateDiscount(subTotal));
  }, [vatTotal]);

  useEffect(() => {
    // if (isNaN(discount)) return setGrandTotal(subTotal + vatTotal);
    // if (discount < 0 || discount > grandTotal) return setGrandTotal(subTotal + vatTotal);

    setGrandTotal(subTotal + vatTotal - calculateDiscount(subTotal));
  }, [discount, discountType]);

  useEffect(() => {
    setDiscount(initialValues?.estimate?.discount || 0);
    setDiscountType(initialValues?.estimate?.discountType || "exact");
  }, [initialValues]);

  const sendStatus = useMemo(() => {
    return (
      estimateReducer.sendDraftEstimateStatus === "loading" ||
      estimateReducer.createEstimateStatus === "loading" ||
      estimateReducer.estimateSendingLoading
    );
  }, [
    estimateReducer.createEstimateStatus,
    estimateReducer.sendDraftEstimateStatus,
    estimateReducer.estimateSendingLoading
  ]);

  const saveStatus = useMemo(() => {
    return (
      estimateReducer.updateEstimateStatus === "loading" ||
      estimateReducer.saveEstimateStatus === "loading" ||
      estimateReducer.estimateSavingLoading 
    );
  }, [
    estimateReducer.saveEstimateStatus,
    estimateReducer.updateEstimateStatus,
    estimateReducer.estimateSavingLoading 
  ]);

  useEffect(() => {
    if(estimateReducer.saveEstimateStatus === 'completed' 
    || estimateReducer.createEstimateStatus === 'completed') {
      navigate('/estimates')
    }

    return () => {
      dispatch(clearCreateEstimateStatus());
      dispatch(clearSaveEstimateStatus())
    }
  },[estimateReducer.saveEstimateStatus, estimateReducer.createEstimateStatus]);

  /**** removing the reminder id from storage */
  const data: any = {
    reminderId: undefined,
  };

  useEffect(() => {
    if (removeSessionStorage) {
      Object.keys(data).forEach((key) => {
        sessionStorage.removeItem(key);
      });
    }
  }, [removeSessionStorage]);

  const handleBeforeUnload = () => {
    sessionStorage.removeItem('reminderId');
  };

  const handlePopstate = () => {
    sessionStorage.removeItem('key');
  };

  const handleEnterKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('popstate', handlePopstate);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/edit-estimate') {
      sessionStorage.removeItem('key');
    }
  }, [location]);

  useEffect(() => {
    const handlePopstate = () => {
      sessionStorage.removeItem('key');
    };
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);
  /**** removing the reminder id from storage */

  return (
    <>
      <form
        autoComplete="off" autoCorrect="off"
        onSubmit={formik.handleSubmit}
      >   
        <div>
          <div className="rounded-2xl mt-10  bg-white py-8 px-3">
            <div className="mt-10">
              <div className="md:w-[70%] w-[100%]">
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
                  onKeyDown={handleEnterKeyPress}
                />
              </div>

              <div className=" w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                  Customer Informations
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
                      disabled={true}
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
                      disabled={true}
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
                      disabled={true}
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
                      disabled={true}
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
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent", // Remove border color
                          fontSize: "12px"
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
                              <InputAdornment position="end" sx={{ position: 'absolute', left: '80%' }}>
                                {vehicleReducer.getVehicleVINStatus === 'loading' && 
                                <CircularProgress size={20} sx={{color: '#FAA21B'}}/>}
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
                    <DropDownHalfParts
                      title="Mileage Value"
                      placeholderInput={fields.mileageValue.label}
                      type="number"
                      data={milesData}
                      valueUnit={values.mileage.unit}
                      nameUnit={"mileage.unit"}
                      onChangeUnit={formik.handleChange}
                      name={'mileage.count'}
                      value={values.mileage.count}
                      onChange={formik.handleChange}
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
                {values.parts.length > 0 &&
                values.parts.map((part: any, index: number) => (
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
                      />
                    </div>
                    <div className="md:flex-1 w-full">
                      <DropDownHalfParts
                        title="Warranty"
                        placeholder="Years"
                        placeholderInput="warranty"
                        type="number"
                        data={years}
                        valueUnit={values.parts[index].warranty.interval}
                        nameUnit={`parts.${index}.warranty.interval`}
                        onChangeUnit={formik.handleChange}
                        name={`parts.${index}.warranty.warranty`}
                        value={values.parts[index].warranty.warranty}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="md:flex-1 w-full">
                      <DropDownHalfParts
                        title="Quantity"
                        placeholder="Years"
                        placeholderInput="quantity"
                        type="number"
                        data={quantityData}
                        valueUnit={values.parts[index].quantity.unit}
                        nameUnit={`parts.${index}.quantity.unit`}
                        onChangeUnit={(e: any) => handleChangeQtyAndPrice(e, index)}
                        name={`parts.${index}.quantity.quantity`}
                        value={values.parts[index].quantity.quantity}
                        onChange={(e: any) => handleChangeQtyAndPrice(e, index)}
                      />
                    </div>

                    <div className="md:flex-1 w-full">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop='Price'
                        placeholder="price"
                        name={`parts.${index}.price`}
                        value={part.price}
                        onChange={(e: any) =>
                          handleChangeQtyAndPrice(e, index)
                        }
                        min="0"
                      />
                    </div>

                    <div className="md:flex-1 w-full">
                      <AppInput
                        disabled
                        hasPLaceHolder={true}
                        placeholderTop='Amount (₦)'
                        placeholder="Enter amount"
                        name={`parts.${index}.amount`}
                        value={part.amount}
                        onChange={formik.handleChange}
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
                    Total Part (s): {Util.formAmount(+_partTotal)}
                  </span>
                </div>

                <hr className="mt-10" />

                <div className="flex justify-between items-start md:items-center flex-col md:flex-row w-[100% mt-10">
                  <div className="flex items-center gap-3">
                    <div onClick={() => setEnableTaxPart(!enableTaxPart)} className="flex-1">
                      {enableTaxPart ? (
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
                      disabled
                      value={values.taxPart === '0' ? '' : values.taxPart}
                      hasPLaceHolder={true}
                      name={fields.taxPart.name}
                      placeholderTop="VAT 7.5% (₦)"
                      placeholder="VAT value"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                    
                  </div>
                </div>
              </div>

               <div className="w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">Service Items</h5>
                {values.labours.length > 0 &&
                  values.labours.map((labour: any, index: number) => (
                    <div key={index} className="flex flex-col md:flex-row w-[100%] items-end md:items-center gap-10 mt-5">
                      <div className="md:w-[35%] w-[100%] -mb-5 md:mb-0">
                        <InputHeader text={"Title"} />
                        <Autocomplete
                          filterOptions={filterOptionsLabour}
                          options={serviceOnly}
                          openOnFocus
                          getOptionLabel={getOptionLabelLabour} 
                          // renderOption={renderOption}
                          noOptionsText="..."
                          isOptionEqualToValue={
                            isOptionEqualToValue
                          }
                          // @ts-ignore
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
                          onChange={(_, newValue) => {
                            _handleChangeService(
                              { target: { value: newValue } },
                              index
                            );
                          }}
                          //@ts-ignore
                          value={labour.title}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                              placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                              font-montserrat`}
                              label={''}
                              onChange={formik.handleChange}
                              name={`labours.${index}.title`}
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
                                        xs: "80%",
                                      },
                                    }}
                                  >
                                    {itemReducer.getItemsStatus ===
                                      "loading" && (
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
                      <div className="md:w-[35%] w-[100%]">
                        <AppInput
                          hasPLaceHolder={true}
                          placeholderTop="Cost (₦)"
                          placeholder="Enter cost"
                          name={`labours.${index}.cost`}
                          value={labour.cost}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="md:mt-5 -mt-5">
                        <DeleteBox 
                          onClick={() => removeService(index)}
                        />
                      </div>
                    </div>
                  ))
                }

                <div className="flex justify-between mt-5 md:mt-10">
                  <InputHeader
                    text=" Add new service"
                    className="text-[#FAA21B] cursor-pointer"
                    onClick={(e: any) => { e.preventDefault(), addService()}}
                  />
                  <span className="font-montserrat font-semibold">
                    Total Services (s): {Util.formAmount(+_labourTotal)}
                  </span>
                </div>
                <hr className="mt-10 hidden md:block" />

                <div className="flex justify-between items-start md:items-center flex-col md:flex-row w-[100% mt-10">
                  <div className="flex items-center gap-3">
                    <div onClick={() => setEnableTaxLabor(!enableTaxLabor)}>
                      {enableTaxLabor ? (
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

                  <div className="md:mt-0 mt-8 w-full md:w-[30%]">
                    <AppInput
                      disabled
                      value={values.tax === '0' ? '' : values.tax}
                      hasPLaceHolder={true}
                      name={fields.tax.name}
                      placeholderTop="VAT 7.5% (₦)"
                      placeholder="VAT value"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                    
                  </div>
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
                        value={values.note}
                        onChange={formik.handleChange}
                        name={fields.note.name}
                      />
                    </div>

                    <div className="md:mt-2 mt-0">
                      <CustomTextArea
                        topTitle="Internal Note"
                        placeholder="Internal Note"
                        value={values.internalNote}
                        onChange={formik.handleChange}
                        name={"internalNote"}
                      />
                    </div>

                    <div className="mt-8">
                      <DropDownHalfParts
                        title="Job Duration"
                        placeholderInput="job-duration"
                        type="number"
                        data={daysData}
                        valueUnit={values.jobDuration.interval}
                        nameUnit={"jobDuration.interval"}
                        onChangeUnit={formik.handleChange}
                        name={'jobDuration.count'}
                        value={values.jobDuration.count}
                        onChange={formik.handleChange}
                        min="0"
                      />
                    </div>

                    <div className="mt-8">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop="Deposit Amount"
                        placeholder="Enter deposit amount"
                        name={fields.depositAmount.name}
                        value={values.depositAmount}
                        onChange={formik.handleChange}
                        type="string"
                      />
                    </div>
                  </div>

                  <div className="side-divider md:block hidden" />

                  <div className="mt-5 md:w-[40%] w-[100%] rounded-3xl md:py-0 py-5 border-[#CACACA] md:px-0 px-3 border-[1px] md:border-[0px] md:border-[#fff]">
                    <div className="md:mt-7 mt-0">
                      <DropDownHalfParts
                        title="Discount"
                        placeholderInput="Enter discount"
                        type="number"
                        data={discountData}
                        valueUnit={discountType}
                        nameUnit={""}
                        onChangeUnit={(e: any) => setDiscountType(e.target.value)}
                        name={''}
                        value={discount}
                        onChange={(e: any) => setDiscount(parseInt(e.target.value))}
                        min="0"
                        max={discountType === "percent" ? "99" : ""}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Sub-Total" />
                        <InputHeader text={Util.formAmount(subTotal)} />
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="VAT" />
                        <InputHeader text={Util.formAmount(+vatTotal)}/>
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Discount" />
                        <InputHeader text={Util.formAmount(calculateDiscount(subTotal))}/>
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Due Balance" />
                        <InputHeader text={Util.formAmount(grandTotal - +values.paidAmount)} />
                      </div>
                      <div className="flex justify-between my-5">
                        <InputHeader text="Refundable" />
                        <InputHeader text="₦0.00" />
                      </div>

                      <hr />
                      <div className="flex justify-between my-5">
                        <InputHeader text="Grand-Total" className="font-bold" />
                        <InputHeader text={Util.formAmount(+grandTotal)} className="font-bold" />
                      </div>

                      {/* <div className="flex items-center gap-3 mt-10">
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
                      </div> */}

                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end flex-col md:flex-row mt-10 gap-5">
                <AppBtn
                  title={ initialValues.status === ESTIMATE_STATUS.sent
                    ? "SAVE & SEND"
                    : "SEND"
                  }
                  className={`font-semibold 
                    ${ initialValues.status === ESTIMATE_STATUS.invoiced 
                        ? `disabled:pointer-events-none disabled:bg-[#E5E5E5] 
                              disabled:cursor-not-allowed text-[#717073]`
                        : 'text-[#000] bg-[#FAA21B]'}`
                  }
                  onClick={() => {
                    setSave(false)
                    setFetchCustomerData(false)
                    setRemoveSessionStorage(true);
                  }}
                  spinner={sendStatus}
                  disabled={initialValues.status === ESTIMATE_STATUS.invoiced}
                />
                <AppBtn
                  title="SAVE" 
                  className={`font-semibold 
                    ${initialValues.status === ESTIMATE_STATUS.sent || 
                      initialValues.status === ESTIMATE_STATUS.invoiced 
                        ? `disabled:pointer-events-none disabled:bg-[#E5E5E5] 
                            disabled:cursor-not-allowed text-[#717073]` 
                        : 'text-[#000] bg-[#FAA21B]'}`
                  }
                  onClick={() => {
                    setSave(true)
                    setFetchCustomerData(false)
                    setRemoveSessionStorage(true);
                  }}
                  spinner={saveStatus}
                  disabled={
                    initialValues.status === ESTIMATE_STATUS.sent ||
                    initialValues.status === ESTIMATE_STATUS.invoiced
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <ReminderModal
        openReminder={openReminder}
        setOpenReminder={setOpenReminder}
        vehicleReminder={vehicleReminder}
      />
    </>
  );
};

export default GenerateEstimate;
