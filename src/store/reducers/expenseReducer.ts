import { IThunkAPIStatus } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBeneficiary, IExpense, IExpenseCategory, IExpenseType } from '@app-models';
import {
  createBeneficiaryAction,
  createExpenseAction,
  createExpenseCategoryAction,
  createExpenseTypeAction,
  deleteBeneficiaryAction,
  deleteExpenseAction,
  getBeneficiariesAction,
  getExpenseCategories,
  getExpensesAction,
  getExpenseTypesActions,
  getSingleExpenseAction,
  updateExpenseAction,
  updateExpenseDetailAction,
} from '../actions/expenseAction';

interface IExpenseState {
  createEstimateStatus: IThunkAPIStatus;
  createEstimateSuccess: string;
  createEstimateError?: string;

  createExpenseError: string;
  createExpenseStatus: IThunkAPIStatus;
  createExpenseSuccess: string;

  deleteExpenseError: string;
  deleteExpenseStatus: IThunkAPIStatus;
  deleteExpenseSuccess: string;

  deleteBeneficiaryError: string;
  deleteBeneficiaryStatus: IThunkAPIStatus;
  deleteBeneficiarySuccess: string;

  updateExpenseError: string;
  updateExpenseStatus: IThunkAPIStatus;
  updateExpenseSuccess: string;

  updateExpenseDetailError: string;
  updateExpenseDetailStatus: IThunkAPIStatus;
  updateExpenseDetailSuccess: string;

  createBeneficiaryError: string;
  createBeneficiaryStatus: IThunkAPIStatus;
  createBeneficiarySuccess: string;

  createExpenseTypeError: string;
  createExpenseTypeStatus: IThunkAPIStatus;
  createExpenseTypeSuccess: string;

  createExpenseCategoryError: string;
  createExpenseCategoryStatus: IThunkAPIStatus;
  createExpenseCategorySuccess: string;

  saveEstimateStatus: IThunkAPIStatus;
  saveEstimateSuccess: string;
  saveEstimateError?: string;

  updateEstimateStatus: IThunkAPIStatus;
  updateEstimateSuccess: string;
  updateEstimateError?: string;

  deleteEstimateStatus: IThunkAPIStatus;
  deleteEstimateSuccess: string;
  deleteEstimateError: string;

  sendDraftEstimateStatus: IThunkAPIStatus;
  sendDraftEstimateSuccess: string;
  sendDraftEstimateError?: string;

  getExpensesStatus: IThunkAPIStatus;
  getExpenseSuccess: string;
  getExpenseError?: string;

  expense: IExpense | null;
  expenses: IExpense[];

  beneficiary: IBeneficiary | null;
  beneficiaries: IBeneficiary[];

  expenseTypes: IExpenseType[];
  expenseCategories: IExpenseCategory[];

  invoiceCode: string;
  expenseCategoryId: string;
  expenseData: {
    id: number;
    accountNumber: string;
    bank: {
      bankName: string;
      bankCode: string
    }
    amount: number;
    narration: string;
    openModal: boolean
  } | null;
}

const initialState: IExpenseState = {
  createEstimateError: '',
  createEstimateStatus: 'idle',
  createEstimateSuccess: '',

  createExpenseError: '',
  createExpenseStatus: 'idle',
  createExpenseSuccess: '',

  deleteExpenseError: '',
  deleteExpenseStatus: 'idle',
  deleteExpenseSuccess: '',

  deleteBeneficiaryError: '',
  deleteBeneficiaryStatus: 'idle',
  deleteBeneficiarySuccess: '',

  updateExpenseError: '',
  updateExpenseStatus: 'idle',
  updateExpenseSuccess: '',

  updateExpenseDetailError: '',
  updateExpenseDetailStatus: 'idle',
  updateExpenseDetailSuccess: '',

  createBeneficiaryError: '',
  createBeneficiaryStatus: 'idle',
  createBeneficiarySuccess: '',

  createExpenseTypeError: '',
  createExpenseTypeStatus: 'idle',
  createExpenseTypeSuccess: '',

  createExpenseCategoryError: '',
  createExpenseCategoryStatus: 'idle',
  createExpenseCategorySuccess: '',

  saveEstimateError: '',
  saveEstimateStatus: 'idle',
  saveEstimateSuccess: '',

  updateEstimateError: '',
  updateEstimateStatus: 'idle',
  updateEstimateSuccess: '',

  deleteEstimateError: '',
  deleteEstimateStatus: 'idle',
  deleteEstimateSuccess: '',

  sendDraftEstimateError: '',
  sendDraftEstimateStatus: 'idle',
  sendDraftEstimateSuccess: '',

  getExpenseError: '',
  getExpensesStatus: 'idle',
  getExpenseSuccess: '',

  expenses: [],
  expense: null,

  beneficiary: null,
  beneficiaries: [],

  expenseTypes: [],
  expenseCategories: [],

  invoiceCode: '',
  expenseCategoryId: '',
  expenseData: {
    id: -1,
    accountNumber: '',
    bank: {
      bankName: '',
      bankCode: ''
    },
    amount: 0,
    narration: '',
    openModal: false
  }
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearCreateEspenseStatus(state: IExpenseState) {
      state.createExpenseStatus = 'idle';
      state.createExpenseSuccess = '';
      state.createExpenseError = '';
    },

    clearCreateBeneficiaryStatus(state: IExpenseState) {
      state.createBeneficiaryStatus = 'idle';
      state.createBeneficiarySuccess = '';
      state.createBeneficiaryError = '';
    },

    clearCreateExpenseTypeStatus(state: IExpenseState) {
      state.createExpenseTypeStatus = 'idle';
      state.createExpenseTypeSuccess = '';
      state.createExpenseTypeError = '';
    },
    clearCreateExpenseCategoryStatus(state: IExpenseState) {
      state.createExpenseCategoryStatus = 'idle';
      state.createExpenseCategorySuccess = '';
      state.createExpenseCategoryError = '';
    },
    clearDeleteExpenseStatus(state: IExpenseState) {
      state.deleteExpenseStatus = 'idle';
      state.deleteExpenseSuccess = '';
      state.deleteExpenseError = '';
    },
    clearDeleteBeneficiaryStatus(state: IExpenseState) {
      state.deleteBeneficiaryStatus = 'idle';
      state.deleteBeneficiarySuccess = '';
      state.deleteBeneficiaryError = '';
    },
    clearUpdateExpenseStatus(state: IExpenseState) {
      state.updateExpenseStatus = 'idle';
      state.updateExpenseSuccess = '';
      state.updateExpenseError = '';
    },
    clearUpdateExpenseDetailStatus(state: IExpenseState) {
      state.updateExpenseDetailStatus = 'idle';
      state.updateExpenseDetailSuccess = '';
      state.updateExpenseDetailError = '';
    },
    clearGetExpenseStatus(state: IExpenseState) {
      state.getExpensesStatus = 'idle';
      state.getExpenseSuccess = '';
      state.getExpenseError = '';
    },

    setInvoiceCode(state: IExpenseState, action: PayloadAction<any>) {
      state.invoiceCode = action.payload;
    },

    setExpenseCategoryId(state: IExpenseState, action: PayloadAction<string>) {
      state.expenseCategoryId = action.payload;
    },
    setExpenseData(state: IExpenseState, action: PayloadAction<any>) {
      state.expenseData = action.payload;
    }
  },

  extraReducers: builder => {
    builder
      .addCase(getExpensesAction.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getExpensesAction.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.expenses = action.payload.results as IExpense[];
      })
      .addCase(getExpensesAction.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getSingleExpenseAction.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getSingleExpenseAction.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.expense = action.payload.result as IExpense;
      })
      .addCase(getSingleExpenseAction.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getBeneficiariesAction.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getBeneficiariesAction.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.beneficiaries = action.payload.results as IBeneficiary[];
      })
      .addCase(getBeneficiariesAction.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getExpenseCategories.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getExpenseCategories.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.expenseCategories = action.payload.results as IExpenseCategory[];
      })
      .addCase(getExpenseCategories.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getExpenseTypesActions.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getExpenseTypesActions.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.expenseTypes = action.payload.results as IExpenseType[];
      })
      .addCase(getExpenseTypesActions.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(deleteExpenseAction.pending, state => {
        state.deleteExpenseStatus = 'loading';
      })
      .addCase(deleteExpenseAction.fulfilled, (state, action) => {
        state.deleteExpenseStatus = 'completed';
        state.deleteExpenseSuccess = action.payload.message;
      })
      .addCase(deleteExpenseAction.rejected, (state, action) => {
        state.deleteExpenseStatus = 'failed';

        if (action.payload) {
          state.deleteExpenseError = action.payload.message;
          state.deleteExpenseError = action.payload.message;
        } else {
          state.deleteExpenseError = action.error.message as string;
          state.deleteExpenseError = action.error.message as string;
        }
      });

    builder
      .addCase(deleteBeneficiaryAction.pending, state => {
        state.deleteBeneficiaryStatus = 'loading';
      })
      .addCase(deleteBeneficiaryAction.fulfilled, (state, action) => {
        state.deleteBeneficiaryStatus = 'completed';
        state.deleteBeneficiarySuccess = action.payload.message;
      })
      .addCase(deleteBeneficiaryAction.rejected, (state, action) => {
        state.deleteBeneficiaryStatus = 'failed';

        if (action.payload) {
          state.deleteBeneficiaryError = action.payload.message;
          state.deleteBeneficiaryError = action.payload.message;
        } else {
          state.deleteBeneficiaryError = action.error.message as string;
          state.deleteBeneficiaryError = action.error.message as string;
        }
      });

    builder
      .addCase(updateExpenseAction.pending, state => {
        state.updateExpenseStatus = 'loading';
      })
      .addCase(updateExpenseAction.fulfilled, (state, action) => {
        state.updateExpenseStatus = 'completed';
        state.updateExpenseSuccess = action.payload.message;
      })
      .addCase(updateExpenseAction.rejected, (state, action) => {
        state.updateExpenseStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
          state.updateExpenseError = action.payload.message;
        } else {
          state.getExpenseError = action.error.message;
          state.updateExpenseError = action.error.message as string;
        }
      });

    builder
      .addCase(updateExpenseDetailAction.pending, state => {
        state.updateExpenseDetailStatus = 'loading';
      })
      .addCase(updateExpenseDetailAction.fulfilled, (state, action) => {
        state.updateExpenseDetailStatus = 'completed';
        state.updateExpenseDetailSuccess = action.payload.message;
      })
      .addCase(updateExpenseDetailAction.rejected, (state, action) => {
        state.updateExpenseDetailStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
          state.updateExpenseDetailError = action.payload.message;
        } else {
          state.getExpenseError = action.error.message;
          state.updateExpenseDetailError = action.error.message as string;
        }
      });

    builder
      .addCase(createExpenseAction.pending, state => {
        state.createExpenseStatus = 'loading';
      })
      .addCase(createExpenseAction.fulfilled, (state, action) => {
        state.createExpenseStatus = 'completed';
        state.createExpenseSuccess = action.payload.message;
        state.expense = action.payload.result as IExpense;
      })
      .addCase(createExpenseAction.rejected, (state, action) => {
        state.createExpenseStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
          state.createExpenseError = action.payload.message;
        } else {
          state.getExpenseError = action.error.message;
          state.createExpenseError = action.error.message as string;
        }
      });

    builder
      .addCase(createBeneficiaryAction.pending, state => {
        state.createBeneficiaryStatus = 'loading';
      })
      .addCase(createBeneficiaryAction.fulfilled, (state, action) => {
        state.createBeneficiaryStatus = 'completed';
        state.createBeneficiarySuccess = action.payload.message;
        state.expense = action.payload.result as IExpense;
      })
      .addCase(createBeneficiaryAction.rejected, (state, action) => {
        state.createBeneficiaryStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
          state.createBeneficiaryError = action.payload.message;
        } else {
          state.getExpenseError = action.error.message;
          state.createBeneficiaryError = action.error?.message as string;
        }
      });

    builder
      .addCase(createExpenseTypeAction.pending, state => {
        state.createExpenseTypeStatus = 'loading';
      })
      .addCase(createExpenseTypeAction.fulfilled, (state, action) => {
        state.createExpenseTypeStatus = 'completed';
        state.createExpenseTypeSuccess = action.payload.message;
      })
      .addCase(createExpenseTypeAction.rejected, (state, action) => {
        state.createExpenseTypeStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
          state.createExpenseTypeError = action.payload.message;
        } else {
          state.getExpenseError = action.error.message;
          state.createExpenseTypeError = action.error?.message as string;
        }
      });

    builder
      .addCase(createExpenseCategoryAction.pending, state => {
        state.createExpenseCategoryStatus = 'loading';
      })
      .addCase(createExpenseCategoryAction.fulfilled, (state, action) => {
        state.createExpenseCategoryStatus = 'completed';
        state.createExpenseCategorySuccess = action.payload.message;
      })
      .addCase(createExpenseCategoryAction.rejected, (state, action) => {
        state.createExpenseCategoryStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
          state.createExpenseCategoryError = action.payload.message;
        } else {
          state.getExpenseError = action.error.message;
          state.createExpenseCategoryError = action.error?.message as string;
        }
      });
  },
});

export const {
  clearCreateEspenseStatus,
  clearDeleteExpenseStatus,
  clearCreateBeneficiaryStatus,
  clearGetExpenseStatus,
  clearUpdateExpenseStatus,
  clearUpdateExpenseDetailStatus,
  clearCreateExpenseCategoryStatus,
  clearCreateExpenseTypeStatus,
  setInvoiceCode,
  setExpenseCategoryId,
  setExpenseData,
  clearDeleteBeneficiaryStatus
} = expenseSlice.actions;

export default expenseSlice.reducer;
