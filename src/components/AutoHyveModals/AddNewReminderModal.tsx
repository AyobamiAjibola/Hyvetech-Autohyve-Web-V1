import React, { useCallback, useEffect, useMemo, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
// import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import Box from "@mui/material/Box";

import DropDownHalf from "../DropDownHalf/DropDownHalf";
// import SingleAppCalender from "../AppCalender/SingleAppCalender";
import InputHeader from "../InputHeader/InputHeader";
// import { FaCalendarAlt } from "react-icons/fa";
import AddReminderTypeModal from "./AddReminderTypeModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import reminderModel from "../Forms/models/reminderModel";
import { Autocomplete, Button, CircularProgress, InputAdornment, TextField, createFilterOptions } from "@mui/material";
import { IDriversFilterData, IVINDecoderSchema } from "@app-interfaces";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getCustomerAction } from "../../store/actions/customerActions";
import { getPartnerAction, getPartnerFilterDataAction } from "../../store/actions/partnerActions";
import useAdmin from "../../hooks/useAdmin";
import { useParams } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { useFormik } from "formik";
import { getVehicleVINAction } from "../../store/actions/vehicleActions";
import { clearGetVehicleVINStatus } from "../../store/reducers/vehicleReducer";
import { showMessage } from "../../helpers/notification";
import Select from "react-select";
import { customStyles } from "../../contsants/customStyles";
import useReminder from "../../hooks/useReminder";
import { nextServiceDate, reminderStatus } from "../../utils/generic";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getSingleInvoice } from "../../store/actions/invoiceActions";
import moment from "moment";
import { clearGetSingleInvoiceStatus } from "../../store/reducers/invoiceReducer";
import { clearGetCustomerStatus } from "../../store/reducers/customerReducer";

const { schema, fields, initialValues: _initialValues } = reminderModel;
const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: IDriversFilterData) => `${option.query}`,
});

const dropdownData = [
  { value: 'day', label: 'Day(s)' },
  { value: 'week', label: 'Weeks(s)' },
  { value: 'month', label: 'Month(s)' }
]

const dropdownData2 = [
  { value: 'km', label: 'km' },
  { value: 'miles', label: 'miles' }
]

interface IProps {
  openNewReminder: any;
  setOpenNewReminder: any;
  editMode: any;
  showEdit?: any;
  setEditMode?: any;
  setReminderId?: any;
  reminderId?: any;
  generatePayment?: boolean;
  invoiceId?: any;
  setOpenInvoiceDetails?: any;
}

const AddNewReminderModal = ({
  openNewReminder,
  setOpenNewReminder,
  editMode,
  showEdit,
  setEditMode,
  setReminderId,
  reminderId,
  generatePayment,
  invoiceId, setOpenInvoiceDetails
}: IProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [inputValue, setInputValue] = useState('');
  const [openReminderType, setOpenReminderType] = useState(false);
  const [value, setValue] = useState<IDriversFilterData | null>(null);
  const [noOptionsText, setNoOptionsText] = useState<any>('Click Enter to Initialize Search');
  const [showDrop, setShowDrop] = useState<boolean>(false);
  const [rawOption, setRawOption] = useState<any>([]);
  const admin = useAdmin();
  const params = useParams();
  const [options, setOptions] = useState<IDriversFilterData[]>([]);
  const [userInfo, setUserInfo] = useState({
    accountType: '',
    firstName: '',
    email: '',
    lastName: '',
    companyName: '',
    phone: ''
  });
  const { 
    initialValues, onEdit, 
    setInitialValues,
    reminderTypes, handleCreateReminder,
    handleUpdateReminder
  } = useReminder();
  const [_nextServiceDate, _setNextServiceDate] = useState<string>('');
  const [_reminderStatus, _setReminderStatus] = useState<string>('');
  const [serviceIntervalUnit, setServiceIntervalUnit] = useState<string>("");
  const [lastServiceMileageUnit, setLastServiceMileageUnit] = useState<string>("");
  const [nextServiceMileageUnit, setNextServiceMileageUnit] = useState<string>("");

  const dispatch = useAppDispatch();
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const customerReducer = useAppSelector(state => state.customerReducer);
  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);

  const formik = useFormik({
    // enableReinitialize,
    initialValues: initialValues,
    onSubmit: (values: any) => {
      const data = {
        email: values.email,
        reminderTypes: values.reminderType,
        vin: values.vin,
        lastServiceDate: values.lastServiceDate,
        serviceInterval: values.serviceInterval,
        serviceIntervalUnit,
        note: values.note,
        recurring: values.recurring,
        phone: values.phone,
        model: values.model,
        modelYear: values.modelYear,
        make: values.make,
        firstName: values.firstName,
        lastName: values.lastName,
        nextServiceDate: values.nextServiceDate,
        reminderStatus: values.reminderStatus,
        serviceStatus: values.serviceStatus,
        lastServiceMileage: values.lastServiceMileage,
        nextServiceMileage: values.nextServiceMileage,
        reminderType: values.reminderType,
        lastServiceMileageUnit,
        nextServiceMileageUnit
      }
      if(!editMode) {
        handleCreateReminder(data)
      };
      if(editMode) {
        handleUpdateReminder(data)
      };
    },
    validationSchema: schema
  });
  const setFieldValue = formik.setFieldValue;
  const values = formik.values;

  const [vinOptions, setVinOptions] = useState<any>([]);
  const [timer, setTimer] = useState<NodeJS.Timer>();

  const partnerId = useMemo(() => {
    return +(params.id as unknown as string) || admin.user?.partner?.id;
  }, [admin.user, params.id]);

  const handleGetDriverInfo = (id?: number) => {
    if (id) {
      dispatch(getCustomerAction(id));
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "70%" : "95%",
    outline: "none",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "20px" : "10px",
    py: 5,
  };

  // const handleClose = () => setOpenNewReminder(false);
  function handleSearch() {
    if ((inputValue || '').length == 0) {
      setShowDrop(false);
    } else {
      setNoOptionsText('No result Found');
      setShowDrop(true);
    }
  };

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

  useEffect(() => {
    if (partnerReducer.getPartnerFilterDataStatus === 'completed') {
      setRawOption(partnerReducer.partnerFilterData);
    }
  }, [partnerReducer.getPartnerFilterDataStatus]);

  useEffect(() => {
    if (partnerId) {
      dispatch(getPartnerFilterDataAction(+partnerId));
      dispatch(getPartnerAction(partnerId));
    }
  }, [dispatch, partnerId]);
  console.log(invoiceReducer.getSingleInvoiceStatus, 'status')
  useEffect(() => {
    // @ts-ignore
    if (customerReducer.getCustomerStatus === 'completed' || 
    invoiceReducer.getSingleInvoiceStatus === 'completed') {
      const _customer: any = invoiceReducer.invoice?.estimate
                              ? invoiceReducer.invoice?.estimate.customer
                              : customerReducer.customer;
    
      const inv_vehicle = invoiceReducer.invoice?.estimate.vehicle;

      if (_customer != undefined) {
        // upto-populate info
        setFieldValue(fields.phone.name, _customer.phone);
        setFieldValue(fields.email.name, _customer.email);
        setFieldValue(fields.firstName.name, _customer.firstName);
        setFieldValue(fields.lastName.name, _customer.lastName);

        const vinList = invoiceReducer.invoice
                          ? [inv_vehicle?.vin.toString()]
                          : _customer.vehicles.map((_data: any) => _data?.vin || '');
        setVinOptions(vinList);

        // if(editMode) {
          setUserInfo({
            accountType: _customer.customerType,
            email: _customer.email,
            firstName: _customer.firstName,
            lastName: _customer.lastName,
            companyName: _customer.companyName || '',
            phone: _customer.phone
          });
        // }
      }

      if(invoiceReducer.invoice != undefined){
        setFieldValue('vin', inv_vehicle?.vin);
        setFieldValue('make', inv_vehicle?.make);
        setFieldValue('model', inv_vehicle?.model);
        setFieldValue('modelYear', inv_vehicle?.modelYear);
      }
    }

    return () => {
      dispatch(clearGetSingleInvoiceStatus())
      dispatch(clearGetCustomerStatus())
    }
  }, [value, customerReducer.getCustomerStatus, invoiceReducer.getSingleInvoiceStatus]);

  const handleChangeVIN: any = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vin = e.target.value;

      setTimer(
        setTimeout(() => {
          dispatch(getVehicleVINAction(vin));
        }, 2000),
      );

      setFieldValue('vin', vin);
    },
    [dispatch, setFieldValue],
  );

  useEffect(() => {
    return () => {
      //@ts-ignore
      clearTimeout(timer);
      dispatch(clearGetVehicleVINStatus());
    };
  }, [timer, dispatch]);

  useEffect(() => {
    if(invoiceId) {
      dispatch(getSingleInvoice(invoiceId))
    }
  },[invoiceId]);

  useEffect(() => {
    if (vehicleReducer.getVehicleVINStatus === 'completed') {
      const tempVehicleDetails = vehicleReducer.vehicleVINDetails;

      tempVehicleDetails.forEach((detail: IVINDecoderSchema) => {
        const newDetail: IVINDecoderSchema = { ...detail };

        if (detail.label === 'engineCylinders') newDetail.value = `${detail.value} cylinders`;

        setFieldValue(newDetail.label, newDetail.value);
        formik.setFieldTouched(newDetail.label, false);
      });
    }
  }, [vehicleReducer.getVehicleVINStatus, vehicleReducer.vehicleVINDetails, setFieldValue, formik.setFieldTouched]);

  useEffect(() => {
    if (vehicleReducer.getVehicleVINStatus === 'failed') {
      showMessage(
        "Reminder",
        vehicleReducer.getVehicleVINError,
        "error"
      )
    }
  }, [vehicleReducer.getVehicleVINError, vehicleReducer.getVehicleVINStatus]);

  useEffect(() => {
    if(reminderId) {
      onEdit(reminderId)
    }
  },[reminderId]);

  const handleCloseModal = () => {
    setUserInfo({
      accountType: "",
      email: "",
      firstName: "",
      lastName: "",
      companyName: "",
      phone: ""
    });
    setOpenNewReminder(false)
    !generatePayment && setReminderId(-1)
    !generatePayment && setEditMode(false)
    generatePayment && setOpenInvoiceDetails(false)
    setInputValue('')
    setValue(null)
    setInitialValues(initialValues)
  };

  useEffect(() => {
    if(editMode) {
      setFieldValue('vin', initialValues.vin)
      setFieldValue('make', initialValues.make)
      setFieldValue('model', initialValues.model)
      setFieldValue('modelYear', initialValues.modelYear)
      setFieldValue('recurring', initialValues.recurring)
      setFieldValue('reminderType', initialValues.reminderType)
      setFieldValue('serviceInterval', initialValues.serviceInterval)
      setFieldValue('serviceIntervalUnit', initialValues.serviceIntervalUnit)
      setFieldValue('serviceStatus', initialValues.serviceStatus)
      setFieldValue('lastServiceDate', initialValues.lastServiceDate)
      setFieldValue('nextServiceDate', initialValues.nextServiceDate)
      setServiceIntervalUnit(initialValues.serviceIntervalUnit)
      setLastServiceMileageUnit(initialValues.lastServiceMileageUnit)
      setFieldValue('lastServiceMileage', initialValues.lastServiceMileage)
      setFieldValue('nextServiceMileage', initialValues.nextServiceMileage)
      setNextServiceMileageUnit(initialValues.nextServiceMileageUnit)
      setFieldValue('note', initialValues.note)
    }
  },[editMode, initialValues]);

  useEffect(() => {
    if (!editMode) {
      formik.setValues(_initialValues)
      setInitialValues(_initialValues)
    }
  }, [editMode]);

  useEffect(() => {
    if(serviceIntervalUnit && values.serviceInterval){
      const next = nextServiceDate(values.lastServiceDate, serviceIntervalUnit, values.serviceInterval)

      _setNextServiceDate(next)
      setFieldValue('nextServiceDate', next)
    }
  }, [serviceIntervalUnit, values.serviceInterval])

  useEffect(() => {
    if(_nextServiceDate && values.lastServiceDate && serviceIntervalUnit){
      const status: any = reminderStatus(values.lastServiceDate, _nextServiceDate, serviceIntervalUnit, values.serviceInterval);
      _setReminderStatus(status);
      setFieldValue('reminderStatus', status);
    }
  }, [_nextServiceDate, values.lastServiceDate, serviceIntervalUnit, values.lastServiceDate])

  // useEffect(() => {
  //   if(values.serviceStatus === 'done'){
  //     setFieldValue('lastServiceDate', new Date())
  //   }
  // }, [values.serviceStatus]);

  useEffect(() => {
    if(reminderReducer.createReminderStatus === 'completed' || reminderReducer.updateReminderStatus === 'completed') {
      handleCloseModal()
    }
  },[reminderReducer.createReminderStatus, reminderReducer.updateReminderStatus]);

  return (
    <>
      <Modal
        open={openNewReminder}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 bg-white px-8">
            <div className="flex justify-between w-full">
              <ModalHeaderTitle title={!editMode ? "New Reminder" : "Edit Reminder"} />

              <button onClick={() => {
                  handleCloseModal()
                }}
              >
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="mt-10 w-[100%] md:w-[60%] mb-10">
              {/* <SearchInput /> */}
              <Autocomplete
                filterOptions={filterOptions}
                inputValue={inputValue}
                value={value}
                openOnFocus={false}
                loading={partnerReducer.getDriversFilterDataStatus === 'loading'}
                getOptionLabel={option => option.fullName}
                isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
                onChange={(_: any, newValue: IDriversFilterData | null) => {
                  setValue(newValue);
                  handleGetDriverInfo(newValue?.id);
                }}
                onInputChange={(_, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                noOptionsText={noOptionsText}
                disabled={showEdit}
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
                renderInput={props => (
                  <TextField
                    {...props}
                    className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                          placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                          font-montserrat`}
                    label="Search customer by First name, last name, car plate number."
                    onChange={e => {
                      filterData(e.target.value);
                    }}
                    onClick={() => {
                      handleSearch()
                    }}
                    onKeyDown={(e: any) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSearch()
                        } else {
                          setShowDrop(false);
                        }
                    }}
                    onBlur={() => {
                        setShowDrop(false);
                    }}
                    InputProps={{
                        ...props.InputProps,
                        classes: {
                          root: "custome-input-root",
                          input: "custome-input-root",
                        },
                        endAdornment: (
                        <React.Fragment>
                            {partnerReducer.getPartnerFilterDataStatus === 'loading'
                            ? ( <CircularProgress color="inherit" size={20} /> )
                            : <Button
                                sx={{
                                  zIndex: 1,
                                  cursor: 'pointer',
                                  backgroundColor: '#181818', color: 'white',
                                  '&:hover': {color: '#181818', backgroundColor: 'white', boxShadow: 2}
                                }}
                              >
                                <Search fontSize='medium'/>
                              </Button>
                            }
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

            {userInfo.firstName.length != 0 && (
              <div className="flex md:gap-14 gap-2 mt-15 w-[100%] md:flex-row flex-col">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">First Name</span>
                  <span className="text-sm font-light">{values?.firstName || ''}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Last Name</span>
                  <span className="text-sm font-light">{values?.lastName || ''}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Phone Number</span>
                  <span className="text-sm font-light">{values?.phone || ''}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Email</span>
                  <span className="text-sm font-light">{values?.email || ''}</span>
                </div>
              </div>
            )}

            <hr className="mt-10" />

            <form
              autoComplete="off" autoCorrect="off"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <div className="flex flex-col md:flex-row mt-2 md:mt-10 w-full gap-5">
                  <div className="w-full">
                    <InputHeader text={fields.vin.label} />
                    <Autocomplete
                      options={vinOptions || []}
                      // @ts-ignore
                      onChange={(_, newValue) => {
                        handleChangeVIN({ target: { value: newValue } })
                      }}
                      value={values.vin}
                      fullWidth
                      // disabled={props.disabled}
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
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <InputAdornment position="end" sx={{ position: 'absolute', left: '70%' }}>
                              {vehicleReducer.getVehicleVINStatus === 'loading' && <CircularProgress size={25} />}
                            </InputAdornment>
                            ),
                           
                            classes: {
                              root: "custome-input-root",
                              input: "custome-input-root",
                            },
                            // inputProps: {
                            //   className: "custome-input-props"
                            // },
                          }}
                        />}
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Make"
                      placeholder="Toyota"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                      name={fields.make.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.make}
                    />
                    {formik.touched.make && formik.errors.make && (
                      <div>{formik.errors.make}</div>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.model.label}
                      placeholder={fields.model.label}
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                      name={fields.model.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.model}
                    />
                    {formik.touched.model && formik.errors.model && (
                      <div>{formik.errors.model}</div>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.modelYear.label}
                      placeholder={fields.modelYear.label}
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                      name={fields.modelYear.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.modelYear}
                    />
                    {formik.touched.modelYear && formik.errors.modelYear && (
                      <div>{formik.errors.modelYear}</div>
                    )}
                  </div>
                </div>

                <div className="w-[100%] md:w-[35%] mt-8">
                  <InputHeader text={fields.recurring.label} />
                  <Select
                    options={["yes","no"].map(option => ({ value: option, label: option }))}
                    onChange={(item) => {
                      setFieldValue(fields.recurring.name, String(item?.value));
                    }}
                    styles={customStyles}
                    placeholder={fields.recurring.label}
                    name={fields.recurring.name}
                    onBlur={formik.handleBlur}
                    value={{
                      value: values.recurring,
                      label: values.recurring,
                    }}
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5 mt-5 md:mt-10">
                  <div className="md:w-[23%] w-[100%] flex flex-col relative">
                    <InputHeader text={fields.reminderType.label} />
                    <Select
                      options={reminderTypes.map(option => ({ value: option.name, label: option.name }))}
                      onChange={(item) => {
                        setFieldValue(fields.reminderType.name, String(item?.value));
                      }}
                      styles={customStyles}
                      placeholder={fields.reminderType.label}
                      name={fields.reminderType.name}
                      onBlur={formik.handleBlur}
                      value={{
                        value: values.reminderType,
                        label: values.reminderType,
                      }}
                    />
                    {!editMode && <span
                      onClick={() => setOpenReminderType(true)}
                      className="absolute -bottom-6 text-sm cursor-pointer font-montserrat text-[#FAA21B]"
                    >
                      Add reminder type
                    </span>}
                  </div>

                  <div className="md:w-[23%] w-[100%] md:mt-0 mt-8">
                    <DropDownHalf
                      title="Service Interval"
                      placeholder="Unit"
                      placeholderInput={fields.serviceInterval.label}
                      name={fields.serviceInterval.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.serviceInterval}
                      type="number"
                      data={dropdownData}
                      setUnit={setServiceIntervalUnit}
                      unit={serviceIntervalUnit}
                    />
                  </div>
                </div>

                <div className="flex md:flex-row flex-col mt-8 md:mt-14 gap-5">
                  <div className="w-full">
                    <InputHeader text="Last Service Date" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`}
                        disableFuture
                        minDate={new Date('2023/01/01')}
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={new Date(values.lastServiceDate)}
                        onChange={(date) => setFieldValue('lastServiceDate', date) }
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
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="w-full mt-3 md:mt-0">
                    <DropDownHalf
                      title="Last Service Mileage"
                      placeholder="Miles"
                      placeholderInput={fields.lastServiceMileage.label}
                      name={fields.lastServiceMileage.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.lastServiceMileage}
                      type="number"
                      data={dropdownData2}
                      unit={lastServiceMileageUnit}
                      setUnit={setLastServiceMileageUnit}
                    />
                  </div>

                  <div className="w-full mt-3 md:mt-0">
                    <DropDownHalf
                      title="Next Service Mileage"
                      placeholder="Miles"
                      placeholderInput={fields.nextServiceMileage.label}
                      name={fields.nextServiceMileage.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.nextServiceMileage}
                      type="number"
                      data={dropdownData2}
                      unit={nextServiceMileageUnit}
                      setUnit={setNextServiceMileageUnit}
                    />
                  </div>

                  <div className="w-full relative mt-3 md:mt-0">
                    {/* <InputHeader text="Next Service Date" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`}
                        minDate={new Date('2023/01/01')}
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={new Date(values.nextServiceDate)}
                        onChange={(date) => setFieldValue('nextServiceDate', date) }
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
                      />
                    </LocalizationProvider> */}
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Next Service Date"
                      placeholder="Next Service Date"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                      name={fields.nextServiceDate}
                      // onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={_nextServiceDate && moment(_nextServiceDate).format('DD/MM/YYYY')}
                    />
                    {formik.touched.make && formik.errors.make && (
                      <div>{formik.errors.make}</div>
                    )}
                  </div>
                </div>

                <div className="mt-10">
                  <CustomTextArea
                    topTitle="Note/Comment"
                    placeholder="write your note/comment.."
                    name={fields.note.name}
                    label={fields.note.label}
                    value={values.note}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="mt-10">
                  <AppBtn
                    title={editMode ? "SAVE" : "ADD REMINDER"}
                    className={`font-semibold md:w-[300px] w-[100%]`}
                    spinner={reminderReducer.updateReminderStatus === 'loading' || reminderReducer.createReminderStatus === 'loading'}
                  />
                </div>
              </div>
            </form>

          </div>
        </Box>
      </Modal>

      <AddReminderTypeModal
        openReminderType={openReminderType}
        setOpenReminderType={setOpenReminderType}
      />
    </>
  );
};

export default AddNewReminderModal;
