import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IBeneficiary, IExpense, IExpenseCategory, IExpenseType } from '@app-models';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import {
  IBeneficiaryValue,
  IExpenseUpdateDetailValue,
  IExpenseUpdateValue,
  IExpenseValues,
} from '../../components/Forms/models/expenseModel';

const GET_EXPENSES = 'expense:GET_EXPENSES';
const GET_SINGLE_EXPENSE = 'expense:GET_SINGLE_EXPENSE';
const GET_BENEFICIARIES = 'expense:GET_BENEFICIARIES';
const GET_EXPENSE_TYPES = 'expense:GET_EXPENSE_TYPES';
const GET_EXPENSE_CATEGORIES = 'expense:GET_EXPENSE_CATEGORIES';
const CREATE_EXPENSE = 'expense:CREATE_EXPENSE';
const CREATE_BENEFICIARY = 'expense:CREATE_BENEFICIARY';
const CREATE_EXPENSE_TYPE = 'expense:CREATE_EXPENSE_TYPE';
const CREATE_EXPENSE_CATEGORY = 'expense:CREATE_EXPENSE_CATEGORY';
const DELETE_EXPENSE = 'expense:DELETE_EXPENSE';
const UPDATE_EXPENSE_CATEGORY = 'expense:UPDATE_EXPENSE_CATEGORY';
const UPDATE_EXPENSE_DETAILS = 'expense:UPDATE_EXPENSE_DETAILS';
const DELETE_BENEFICIARY = 'expense:DELETE_BENEFICIARY';

const API_ROOT = settings.api.rest;

export const getExpensesAction = asyncThunkWrapper<ApiResponseSuccess<IExpense>, void>(GET_EXPENSES, async () => {
  const response = await axiosClient.get(`${API_ROOT}/expenses`);
  return response.data;
});

export const getBeneficiariesAction = asyncThunkWrapper<ApiResponseSuccess<IBeneficiary>, void>(
  GET_BENEFICIARIES,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/beneficiaries`);
    return response.data;
  },
);

export const getExpenseTypesActions = asyncThunkWrapper<ApiResponseSuccess<IExpenseType>, void>(
  GET_EXPENSE_TYPES,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/expense-types`);
    return response.data;
  },
);

export const getExpenseCategories = asyncThunkWrapper<ApiResponseSuccess<IExpenseCategory>, void>(
  GET_EXPENSE_CATEGORIES,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/expense-categories`);
    return response.data;
  },
);
// Partial<Pick<User, 'name' | 'email'>>
export const createExpenseAction = asyncThunkWrapper<ApiResponseSuccess<Partial<IExpense>>, Partial<IExpenseValues>>(
  CREATE_EXPENSE,
  async data => {
    const response = await axiosClient.post(
      `${API_ROOT}/expense/create`,
      data.reference
        ? {
            amount: data.amount,
            expenseCategoryId: data.category?.id,
            expenseTypeId: data.type?.id,
            beneficiaryId: data.beneficiary?.id,
            invoiceId: data.invoice?.id,
            reference: data.reference,
            note: data.note,
            dateModified: data.dateModified,
          }
        : {
            amount: data.amount,
            expenseCategoryId: data.category?.id,
            expenseTypeId: data.type?.id,
            beneficiaryId: data.beneficiary?.id,
            invoiceId: data.invoice?.id,
            note: data.note,
            dateModified: data.dateModified,
          },
    );
    return response.data;
  },
);

export const createBeneficiaryAction = asyncThunkWrapper<ApiResponseSuccess<IExpense>, Partial<IBeneficiaryValue>>(
  CREATE_BENEFICIARY,
  async data => {
    const response = await axiosClient.post(`${API_ROOT}/beneficiary/create`, data);
    return response.data;
  },
);

export const createExpenseCategoryAction = asyncThunkWrapper<ApiResponseSuccess<IExpenseCategory>, { name: string }>(
  CREATE_EXPENSE_CATEGORY,
  async data => {
    const response = await axiosClient.post(`${API_ROOT}/expense-category/create`, data);
    return response.data;
  },
);

export const createExpenseTypeAction = asyncThunkWrapper<ApiResponseSuccess<IExpenseType>, { name: string }>(
  CREATE_EXPENSE_TYPE,
  async data => {
    const response = await axiosClient.post(`${API_ROOT}/expense-type/create`, data);
    return response.data;
  },
);

export const deleteExpenseAction = asyncThunkWrapper<ApiResponseSuccess<IExpenseType>, { id: number }>(
  DELETE_EXPENSE,
  async data => {
    const response = await axiosClient.delete(`${API_ROOT}/expense/${data.id}`);
    return response.data;
  },
);

export const deleteBeneficiaryAction = asyncThunkWrapper<ApiResponseSuccess<any>, { id: number }>(
  DELETE_BENEFICIARY,
  async data => {

    const response = await axiosClient.delete(`${API_ROOT}/beneficiary/${data}`);
    return response.data;
  },
);

export const updateExpenseAction = asyncThunkWrapper<ApiResponseSuccess<IExpenseType>, IExpenseUpdateValue>(
  UPDATE_EXPENSE_CATEGORY,
  async data => {
    const response = await axiosClient.patch(`${API_ROOT}/expense`, data);
    return response.data;
  },
);

export const updateExpenseDetailAction = asyncThunkWrapper<
  ApiResponseSuccess<IExpenseType>,
  Partial<IExpenseUpdateDetailValue>
>(UPDATE_EXPENSE_DETAILS, async data => {
  const response = await axiosClient.patch(
    `${API_ROOT}/expense/${data.id}`,
    // data.status === 'UNPAID' && {
    {
      amount: data.amount,
      expenseCategoryId: data.category?.id,
      expenseTypeId: data.type?.id,
      invoiceId: data.invoice?.id,
      note: data.note,
      dateModified: data.dateModified
    },
  );
  return response.data;
});

export const getSingleExpenseAction = asyncThunkWrapper<ApiResponseSuccess<IExpense>, number>(
  GET_SINGLE_EXPENSE,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/expense/${id}`);

    return response.data;
  },
);
