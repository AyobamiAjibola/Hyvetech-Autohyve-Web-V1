// noinspection JSUnfilteredForInLoop
import { useCallback, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import estimateModel, { IEstimateValues, ILabour, IPart } from '../components/Forms/models/estimateModel';
import {
  createEstimateAction,
  deleteEstimateAction,
  getEstimatesAction,
  saveEstimateAction,
  sendDraftEstimateAction,
  updateEstimateAction,
} from '../store/actions/estimateActions';
import useAppSelector from './useAppSelector';
import useAppDispatch from './useAppDispatch';
import { CustomHookMessage } from '@app-types';
import { IEstimate, IRideShareDriver } from '@app-models';
import { useParams } from 'react-router-dom';
import settings from '../config/settings';
import { CustomJwtPayload } from '@app-interfaces';
import {
  clearCreateEstimateStatus,
  clearSaveEstimateStatus,
  clearSendDraftEstimateStatus,
  clearUpdateEstimateStatus,
} from '../store/reducers/estimateReducer';
import { FormikHelpers } from 'formik';
import { getCustomerAction } from '../store/actions/customerActions';
import { showMessage } from '../helpers/notification';

export default function useEstimate() {
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);
  const [initialValues, setInitialValues] = useState<IEstimateValues>(estimateModel.initialValues);
  const [labourTotal, setLabourTotal] = useState<number>(0);
  const [partTotal, setPartTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [estimates, setEstimates] = useState<IEstimate[]>([]);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [estimateId, setEstimateId] = useState<number>();
  const [partnerId, setPartnerId] = useState<number>();
  const [save, setSave] = useState<boolean>(false);
  const [discount, setDiscount] = useState(0);

  const [discountType, setDiscountType] = useState('exact');

  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const dispatch = useAppDispatch();

  const params = useParams();

  const handleReset = useCallback(() => {
    dispatch(clearCreateEstimateStatus());
    dispatch(clearSaveEstimateStatus());
    dispatch(clearUpdateEstimateStatus());
    dispatch(clearSendDraftEstimateStatus());
    setSave(false);
  }, [dispatch]);

  useEffect(() => {
    const auth = jwt_decode(sessionStorage.getItem(settings.auth.admin) as string) as unknown as CustomJwtPayload;

    if (params.id) {
      setPartnerId(+params.id);
    }

    if (auth?.partnerId) {
      setPartnerId(auth.partnerId);
    }
  }, [params]);

  useEffect(() => {
    if (estimateReducer.getEstimatesStatus === 'idle') {
      dispatch(getEstimatesAction());
    }
  }, [dispatch, estimateReducer.getEstimatesStatus]);

  useEffect(() => {
    if (estimateReducer.getEstimatesStatus === 'failed') {
      showMessage(
        "Estimate",
        estimateReducer.getEstimatesError,
        "error"
      )
    }
  }, [estimateReducer.getEstimatesError, estimateReducer.getEstimatesStatus]);

  useEffect(() => {
    if (estimateReducer.getEstimatesStatus === 'completed') {
      setEstimates(estimateReducer.estimates);
      handleReset();
    }
  }, [estimateReducer.estimates, estimateReducer.getEstimatesStatus]);

  useEffect(() => {
    if (estimateReducer.createEstimateStatus === 'failed') {
      showMessage(
        "Estimate",
        estimateReducer.createEstimateError,
        "error"
      )
      handleReset();
    }
  }, [estimateReducer.createEstimateError, estimateReducer.createEstimateStatus, handleReset]);

  useEffect(() => {
    if (estimateReducer.createEstimateStatus === 'completed') {
      showMessage(
        "Estimate",
        estimateReducer.createEstimateSuccess,
        "success"
      )
      handleReset();
    }
  }, [estimateReducer.createEstimateStatus, estimateReducer.createEstimateSuccess, handleReset]);

  useEffect(() => {
    if (estimateReducer.saveEstimateStatus === 'failed') {
      showMessage(
        "Estimate",
        estimateReducer.saveEstimateError,
        "error"
      )
      handleReset();
    }
  }, [estimateReducer.saveEstimateError, estimateReducer.saveEstimateStatus, handleReset]);

  useEffect(() => {
    if (estimateReducer.saveEstimateStatus === 'completed') {
      showMessage(
        "Estimate",
        estimateReducer.saveEstimateSuccess,
        "success"
      )
      handleReset();
      dispatch(getEstimatesAction());
    }
  }, [dispatch, estimateReducer.saveEstimateStatus, estimateReducer.saveEstimateSuccess, handleReset]);

  useEffect(() => {
    if (estimateReducer.updateEstimateStatus === 'failed') {
      showMessage(
        "Estimate",
        estimateReducer.updateEstimateError,
        "error"
      )
      handleReset();
    }
  }, [estimateReducer.updateEstimateError, estimateReducer.updateEstimateStatus, handleReset]);

  useEffect(() => {
    if (estimateReducer.updateEstimateStatus === 'completed') {
      showMessage(
        "Estimate",
        estimateReducer.updateEstimateSuccess,
        "success"
      )
      handleReset();
      dispatch(getEstimatesAction());
    }
  }, [dispatch, estimateReducer.updateEstimateStatus, estimateReducer.updateEstimateSuccess, handleReset]);

  useEffect(() => {
    if (estimateReducer.deleteEstimateStatus === 'failed') {
      showMessage(
        "Estimate",
        estimateReducer.deleteEstimateError,
        "error"
      )
      handleReset();
    }
  }, [estimateReducer.deleteEstimateError, estimateReducer.deleteEstimateStatus, handleReset]);

  useEffect(() => {
    if (estimateReducer.deleteEstimateStatus === 'completed') {
      showMessage(
        "Estimate",
        estimateReducer.deleteEstimateSuccess,
        "success"
      )
      handleReset();
      dispatch(getEstimatesAction());
    }
  }, [dispatch, estimateReducer.deleteEstimateStatus, estimateReducer.deleteEstimateSuccess, handleReset]);

  useEffect(() => {
    if (estimateReducer.sendDraftEstimateStatus === 'failed') {
      showMessage(
        "Estimate",
        estimateReducer.sendDraftEstimateError,
        "error"
      )
      handleReset();
    }
  }, [estimateReducer.sendDraftEstimateError, estimateReducer.sendDraftEstimateStatus, handleReset]);

  useEffect(() => {
    if (estimateReducer.sendDraftEstimateStatus === 'completed') {
      showMessage(
        "Estimate",
        estimateReducer.sendDraftEstimateSuccess,
        "success"
      )
      handleReset();
      dispatch(getEstimatesAction());
    }
  }, [dispatch, estimateReducer.sendDraftEstimateStatus, estimateReducer.sendDraftEstimateSuccess, handleReset]);

  const handleCreateEstimate = (values: IEstimateValues, options?: FormikHelpers<IEstimateValues>) => {
    const depositAmount = values.depositAmount;

    if (depositAmount === 'null' || !depositAmount)
      return options?.setFieldError('depositAmount', `Deposit amount must not be empty.`);

    if (Math.sign(+depositAmount) === -1)
      return options?.setFieldError('depositAmount', `Deposit amount must be a positive number greater than 0`);

    const _depositAmount = Math.round(parseInt(depositAmount));
    const _grandTotal = Math.round(grandTotal);

    if (_depositAmount > _grandTotal)
      return options?.setFieldError(
        'depositAmount',
        `Deposit  must be less than or equal to Grand Total ${Math.round(grandTotal)}`,
      );

    const data = {
      id: partnerId,
      parts: values.parts,
      labours: values.labours,
      tax: values.tax,
      taxPart: values.taxPart,
      addressType: values.addressType,
      address: values.address,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      state: values.state,
      phone: values.phone,
      depositAmount: values.depositAmount,
      jobDurationValue: values.jobDuration.count,
      jobDurationUnit: values.jobDuration.interval,
      vin: values.vin,
      make: values.make,
      model: values.model,
      plateNumber: values.plateNumber,
      modelYear: values.modelYear,
      mileageValue: values.mileage.count,
      mileageUnit: values.mileage.unit,
      partsTotal: partTotal.toFixed(2),
      laboursTotal: labourTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      discount,
      discountType,
      note: values.note,
      internalNote: values.internalNote,
    };

    dispatch(createEstimateAction(data));
  };

  const handleSaveEstimate = (values: IEstimateValues, options?: FormikHelpers<IEstimateValues>) => {
    const depositAmount = values.depositAmount;

    if (Math.sign(+depositAmount) === -1)
      return options?.setFieldError('depositAmount', `Deposit amount must be a positive number greater than 0`);

    const data = {
      id: partnerId,
      parts: values.parts,
      labours: values.labours,
      tax: values.tax,
      taxPart: values.taxPart,
      addressType: values.addressType,
      address: values.address,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      state: values.state,
      phone: values.phone,
      depositAmount: values.depositAmount,
      jobDurationValue: values.jobDuration.count,
      jobDurationUnit: values.jobDuration.interval,
      vin: values.vin,
      make: values.make,
      model: values.model,
      plateNumber: values.plateNumber,
      modelYear: values.modelYear,
      mileageValue: values.mileage.count,
      mileageUnit: values.mileage.unit,
      partsTotal: partTotal.toFixed(2),
      laboursTotal: labourTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      // partsTotal: Math.round(partTotal),
      // laboursTotal: Math.round(labourTotal),
      // grandTotal: Math.round(grandTotal),
      discount,
      discountType,
      note: values.note,
      internalNote: values.internalNote,
    };

    console.log(data);

    console.log(Object.keys(data), 'realsentdata');

    dispatch(saveEstimateAction(data));
  };

  const handleUpdateEstimate = (values: IEstimateValues, options?: FormikHelpers<IEstimateValues>) => {
    const depositAmount = values.depositAmount;

    if (Math.sign(+depositAmount) === -1)
      return options?.setFieldError('depositAmount', `Deposit amount must be a positive number greater than 0`);

    const data = {
      id: estimateId,
      parts: values.parts,
      labours: values.labours,
      tax: values.tax,
      taxPart: values.taxPart,
      addressType: values.addressType,
      address: values.address,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      state: values.state,
      phone: values.phone,
      depositAmount: values.depositAmount,
      jobDurationValue: values.jobDuration.count,
      jobDurationUnit: values.jobDuration.interval,
      vin: values.vin,
      make: values.make,
      model: values.model,
      plateNumber: values.plateNumber,
      modelYear: values.modelYear,
      mileageValue: values.mileage.count,
      mileageUnit: values.mileage.unit,
      partsTotal: partTotal.toFixed(2),
      laboursTotal: labourTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      discount,
      discountType,
      note: values.note,
      internalNote: values.internalNote,
    };

    void dispatch(updateEstimateAction(data));
  };

  const handleSendDraftEstimate = (values: IEstimateValues, options?: FormikHelpers<IEstimateValues>) => {
    const depositAmount = values.depositAmount;

    if (depositAmount === 'null' || !depositAmount)
      return options?.setFieldError('depositAmount', `Deposit amount must not be empty.`);

    if (Math.sign(+depositAmount) === -1)
      return options?.setFieldError('depositAmount', `Deposit amount must be a positive number greater than 0`);

    const _depositAmount = Math.round(parseInt(depositAmount));
    const _grandTotal = Math.round(grandTotal);

    if (_depositAmount > _grandTotal)
      return options?.setFieldError(
        'depositAmount',
        `Deposit  must be less than or equal to Grand Total ${Math.round(grandTotal)}`,
      );

    if (_depositAmount > _grandTotal)
      return options?.setFieldError(
        'depositAmount',
        `Deposit  must be less than or equal to Grand Total ${Math.round(grandTotal)}`,
      );

    const data = {
      id: estimateId,
      parts: values.parts,
      labours: values.labours,
      tax: values.tax,
      taxPart: values.taxPart,
      addressType: values.addressType,
      address: values.address,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      state: values.state,
      phone: values.phone,
      depositAmount: values.depositAmount,
      jobDurationValue: values.jobDuration.count,
      jobDurationUnit: values.jobDuration.interval,
      vin: values.vin,
      make: values.make,
      model: values.model,
      plateNumber: values.plateNumber,
      modelYear: values.modelYear,
      mileageValue: values.mileage.count,
      mileageUnit: values.mileage.unit,
      partsTotal: partTotal.toFixed(2),
      laboursTotal: labourTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      // partsTotal: Math.round(partTotal),
      // laboursTotal: Math.round(labourTotal),
      // grandTotal: Math.round(grandTotal),
      discount,
      discountType,
      note: values.note,
      internalNote: values.internalNote,
    };

    void dispatch(sendDraftEstimateAction(data));
  };

  const onEdit = useCallback(
    (_estimate: any) => {
      void dispatch(getEstimatesAction());
      
      const estimate = estimates.find(estimate => estimate.id === _estimate.id) || _estimate;
      
      if (estimate) {
        const driver = estimate.rideShareDriver;
        const customer = estimate.customer;
        const vehicle = estimate.vehicle;

        dispatch(getCustomerAction(customer?.id));

        const parts = estimate.parts as unknown as IPart[];
        const labours = estimate.labours as unknown as ILabour[];

        setInitialValues(prevState => ({
          ...prevState,
          firstName: driver ? driver.firstName : customer.firstName,
          lastName: driver ? driver.lastName : customer.lastName,
          email: driver ? driver.email : customer.email,
          phone: driver ? driver.phone : customer.phone,
          make: vehicle && vehicle.make ? vehicle.make : '',
          model: vehicle && vehicle.model ? vehicle.model : '',
          plateNumber: vehicle && vehicle.plateNumber ? vehicle.plateNumber : '',
          vin: vehicle && vehicle.vin ? vehicle.vin : '',
          modelYear: vehicle && vehicle.modelYear ? vehicle.modelYear : '',
          address: estimate.address ? estimate.address : '',
          addressType: estimate.addressType ? estimate.addressType : '',
          jobDuration: { count: `${estimate.jobDurationValue}`, interval: estimate.jobDurationUnit },
          depositAmount: `${estimate.depositAmount}`,
          tax: `${estimate.tax}`,
          mileage: {
            count: vehicle && vehicle.mileageValue ? vehicle.mileageValue : '',
            unit: vehicle && vehicle.mileageUnit ? vehicle.mileageUnit : '',
          },
          parts,
          labours,
          status: estimate.status,
          estimate: { ...estimate },
          note: estimate.note,
        }));

        setGrandTotal(estimate.grandTotal);
        setPartTotal(estimate.partsTotal);
        setLabourTotal(estimate.laboursTotal);
        setEstimateId(estimateId);
        setShowEdit(true);
      } else showMessage('Estimate', 'An Error Occurred. Please try again or contact support', 'error');
    },
    [dispatch, estimates],
  );

  const onDelete = useCallback((id: number) => {
    setEstimateId(id);
    setShowDelete(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (estimateId) void dispatch(deleteEstimateAction(estimateId));
    setShowDelete(false);
  }, [dispatch, estimateId]);

  const onView = (estimateId: number) => {
    setEstimateId(estimateId);
    setShowView(true);
  };

  return {
    setLabourTotal,
    setPartTotal,
    setGrandTotal,
    success,
    setSuccess,
    error,
    setError,
    estimates,
    setEstimates,
    showCreate,
    setShowCreate,
    showEdit,
    setShowEdit,
    driver,
    setDriver,
    initialValues,
    setInitialValues,
    estimateId,
    partTotal,
    labourTotal,
    grandTotal,
    showView,
    setShowView,
    save,
    setSave,
    onEdit,
    handleCreateEstimate,
    handleSaveEstimate,
    handleUpdateEstimate,
    handleSendDraftEstimate,
    onView,
    showDelete,
    setShowDelete,
    onDelete,
    handleDelete,
    discount,
    setDiscountType,
    setDiscount,
    discountType,
  };
}
