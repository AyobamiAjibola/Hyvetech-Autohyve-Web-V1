import { useCallback, useEffect, useState } from 'react';
import { IItem } from '@app-models';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import {
    createItemAction,
    updateItemAction,
    getItemsAction,
    addStockAction,
    deleteItemAction
} from '../store/actions/itemStockAction';
import { useParams } from 'react-router-dom';
import {
    clearAddStockStatus,
    clearCreateItemStatus,
    clearDeleteItemStatus,
    clearItemActiveStatus,
    // clearGetItemStatus,
    clearUpdateItemStatus
} from '../store/reducers/itemStockReducer';
// import { FormikHelpers } from 'formik';
import jwt_decode from "jwt-decode";
import itemModel, { IItemValues } from '../components/Forms/models/itemModel';
import { CustomHookMessage } from '@app-types';
import { CustomJwtPayload } from '@app-interfaces';
import settings from '../config/settings';
import { formatNumberToIntl } from '../utils/generic';
import { FormikHelpers } from 'formik';
import { showMessage } from '../helpers/notification';

export default function useItemStock() {
  const [initialValues, setInitialValues] = useState<IItemValues>(itemModel.initialValues);
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();
  const [items, setItems] = useState<IItem[]>([]);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [itemId, setItemId] = useState<number>();
  const [partnerId, setPartnerId] = useState<number>();
  const [save, setSave] = useState<boolean>(false);

  const itemReducer = useAppSelector(state => state.itemStockReducer);
  const dispatch = useAppDispatch();

  const params = useParams();

  const handleReset = useCallback(() => {
    dispatch(clearCreateItemStatus());
    dispatch(clearUpdateItemStatus());
    dispatch(clearAddStockStatus());
    dispatch(clearDeleteItemStatus())
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
    if (itemReducer.getItemsStatus === 'idle') {
      dispatch(getItemsAction());
    }
  }, [dispatch, itemReducer.getItemsStatus]);

  useEffect(() => {
    if (itemReducer.getItemsStatus === 'failed') {
      // if (itemReducer.getItemsError) setError({ message: itemReducer.getItemsError });
      showMessage(
        "Item stock",
        itemReducer.getItemsError,
        "error"
      )
    }
  }, [itemReducer.getItemsError, itemReducer.getItemsStatus]);

  useEffect(() => {
    if (itemReducer.getItemsStatus === 'completed') {
      setItems(itemReducer.items);
    }
  }, [itemReducer.items, itemReducer.getItemsStatus]);

  useEffect(() => {
    if (itemReducer.createItemStatus === 'failed') {
      // if (itemReducer.createItemError) setError({ message: itemReducer.createItemError });
      showMessage(
        "Item stock",
        itemReducer.createItemError,
        "error"
      )
      handleReset();
    }
  }, [itemReducer.createItemError, itemReducer.createItemStatus, handleReset]);

  useEffect(() => {
    if (itemReducer.createItemStatus === 'completed') {
      // setSuccess({ message: itemReducer.createItemSuccess });
      showMessage(
        "Item stock",
        itemReducer.createItemSuccess,
        "success"
      )
      dispatch(getItemsAction())
      handleReset();
    }
  }, [itemReducer.createItemStatus, itemReducer.createItemSuccess, handleReset]);

  useEffect(() => {
    if (itemReducer.updateItemStatus === 'failed') {
      // if (itemReducer.updateItemError) setError({ message: itemReducer.updateItemError });
      showMessage(
        "Item stock",
        itemReducer.updateItemError,
        "error"
      )
      handleReset();
    }
  }, [itemReducer.updateItemError, itemReducer.updateItemStatus, handleReset]);

  useEffect(() => {
    if(itemReducer.createItemActiveStatus === 'completed') {
      showMessage(
        "Item",
        "Item enabled/disabled successfully",
        "success"
      )
      dispatch(getItemsAction());
    } else if (itemReducer.createItemActiveStatus === 'failed') {
      showMessage(
        "Item",
        itemReducer.createItemActiveError,
        "error"
      )
    }

    return () => {
      dispatch(clearItemActiveStatus())
    }
  },[itemReducer.createItemActiveStatus])

  useEffect(() => {
    if (itemReducer.updateItemStatus === 'completed') {
      // setSuccess({ message: itemReducer.updateItemSuccess });
      showMessage(
        "Item stock",
        itemReducer.updateItemSuccess,
        "success"
      )
      handleReset();
      dispatch(getItemsAction());
    }
  }, [itemReducer.updateItemStatus]);

  useEffect(() => {
    if (itemReducer.deleteItemStatus === 'failed') {
      // setError({ message: itemReducer.deleteItemError });
      showMessage(
        "Item stock",
        itemReducer.deleteItemError,
        "error"
      )
      handleReset();
    }
  }, [itemReducer.deleteItemError, itemReducer.deleteItemStatus, handleReset]);

  useEffect(() => {
    if (itemReducer.deleteItemStatus === 'completed') {
      // setSuccess({ message: itemReducer.deleteItemSuccess });
      showMessage(
        "Item stock",
        "Item deleted successfully",
        "success"
      )
      handleReset();
      dispatch(getItemsAction());
    }
  }, [dispatch, itemReducer.deleteItemStatus, itemReducer.deleteItemSuccess, handleReset]);

  useEffect(() => {
    if (itemReducer.addStockStatus === 'failed') {
      // setError({ message: itemReducer.addStockError });
      showMessage(
        "Item stock",
        itemReducer.addStockError,
        "error"
      )
      handleReset();
    }
  }, [itemReducer.addStockError, itemReducer.addStockStatus, handleReset]);

  useEffect(() => {
    if (itemReducer.addStockStatus === 'completed') {
      // setSuccess({ message: itemReducer.addStockSuccess });
      showMessage(
        "Item stock",
        itemReducer.addStockSuccess,
        "success"
      )
      handleReset();
      dispatch(getItemsAction());
    }
  }, [dispatch, itemReducer.addStockStatus, itemReducer.addStockSuccess, handleReset]);

  const handleCreateItem = (values: IItemValues, options?: FormikHelpers<IItemValues>) => {
    const sellingPrice = values.sellingPrice !== undefined && values.sellingPrice;

    if(Math.sign(+sellingPrice) === -1)
      return options?.setFieldError('sellingPrice', `Selling Rate/Price must be a positive number greater that 0`);

    const data = {
      id: partnerId,
      name: values.name,
      description: values.description,
      unit: values.unit,
      buyingPrice: values.type === 'service' ? null : values.buyingPrice,
      sellingPrice: values.sellingPrice,
      type: values.type,
      quantity: values.type === 'service' ? null : values.quantity,
      partNumber: values.partNumber
    };

    dispatch(createItemAction(data));
  };

  const handleUpdateItem = (values: IItemValues, options?: FormikHelpers<IItemValues>) => {

    const buyingPrice = values.buyingPrice !== undefined && values.buyingPrice;
    const sellingPrice = values.sellingPrice !== undefined && values.sellingPrice;

    if(Math.sign(+buyingPrice) === -1)
      return options?.setFieldError('buyingPrice', `Buying Rate/Price must be a positive number greater that 0`);

    if(Math.sign(+sellingPrice) === -1)
      return options?.setFieldError('sellingPrice', `Selling Rate/Price must be a positive number greater that 0`);

    const _buyingPrice = buyingPrice && formatNumberToIntl(+buyingPrice);
    const _sellingPrice = sellingPrice && formatNumberToIntl(+sellingPrice)

    if(+_sellingPrice < +_buyingPrice)
      return options?.setFieldError(
        'sellingPrice',
        `Selling Rate/Price must be greater than Buying Rate/Price`
      )

    const data = {
      id: itemId,
      name: values.name,
      description: values.description,
      unit: values.unit,
      buyingPrice: values.buyingPrice,
      sellingPrice: values.sellingPrice,
      type: values.type,
      partNumber: values.partNumber
    };

    dispatch(updateItemAction(data));
  };

  const handleAddStock = (values: {id: number, quantity: number}) => {
    if(Math.sign(values.quantity) === -1) {
      return showMessage(
        "Item",
        "Quantity can not be less than 1",
        "error"
      )
    }

    dispatch(addStockAction(values));
  };

  const onEdit = useCallback(
    (itemId: number) => {
        void dispatch(getItemsAction());

        const item = items.find(item => item.id === itemId);

        if(item) {
            setInitialValues(prevState => ({
                ...prevState,
                name: item.name,
                description: item.description,
                type: item.type,
                sellingPrice: item.sellingPrice,
                buyingPrice: item.buyingPrice,
                unit: item.unit,
                quantity: item.quantity,
                partNumber: item.partNumber
            }));
            setItemId(itemId)
            setShowEdit(true);
        } else setError({ message: 'An Error Occurred. Please try again or contact support' });
    },
    [dispatch, items],
  );

  const onDelete = useCallback((id: number) => {
    setItemId(id);
    setShowDelete(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    if(id) void dispatch(deleteItemAction(id));
  }, [dispatch]);

  const onView = (itemId: number) => {
    setItemId(itemId);
    setShowView(true)
  };

  return {
    success,
    setSuccess,
    error,
    setError,
    items, setItems,
    showCreate,
    setShowCreate,
    showEdit,
    setShowEdit,
    initialValues,
    setInitialValues,
    itemId,
    showView,
    setShowView,
    save,
    setSave,
    onEdit,
    handleCreateItem,
    handleAddStock,
    handleDelete,
    handleUpdateItem,
    onView,
    showDelete,
    setShowDelete,
    onDelete
  };
}
