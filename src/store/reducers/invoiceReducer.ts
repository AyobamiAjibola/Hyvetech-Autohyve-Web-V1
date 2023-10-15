import { IThunkAPIStatus } from '@app-types';
import { IInvoice } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import { deleteInvoiceAction, getInvoicesAction, getSingleInvoice, saveInvoiceAction, sendInvoiceAction } from '../actions/invoiceActions';

interface IInvoiceState {
  getInvoicesStatus: IThunkAPIStatus;
  getInvoicesSuccess: string;
  getInvoicesError: string;

  saveInvoiceStatus: IThunkAPIStatus;
  saveInvoiceSuccess: string;
  saveInvoiceError: string;

  deleteInvoiceStatus: IThunkAPIStatus;
  deleteInvoiceSuccess: string;
  deleteInvoiceError: string;

  sendInvoiceStatus: IThunkAPIStatus;
  sendInvoiceSuccess: string;
  sendInvoiceError: string;

  getSingleInvoiceStatus: IThunkAPIStatus;
  getSingleInvoiceSuccess: string;
  getSingleInvoiceError: string;

  invoices: IInvoice[];
  invoice?: IInvoice;
}

const initialState: IInvoiceState = {
  getInvoicesStatus: 'idle',
  getInvoicesSuccess: '',
  getInvoicesError: '',

  saveInvoiceStatus: 'idle',
  saveInvoiceSuccess: '',
  saveInvoiceError: '',

  deleteInvoiceError: '',
  deleteInvoiceStatus: 'idle',
  deleteInvoiceSuccess: '',

  sendInvoiceStatus: 'idle',
  sendInvoiceSuccess: '',
  sendInvoiceError: '',

  getSingleInvoiceStatus: 'idle',
  getSingleInvoiceSuccess: '',
  getSingleInvoiceError: '',

  invoice: undefined,
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    clearGetInvoicesStatus(state: IInvoiceState) {
      state.getInvoicesStatus = 'idle';
      state.getInvoicesSuccess = '';
      state.getInvoicesError = '';
    },

    clearSaveInvoiceStatus(state: IInvoiceState) {
      state.saveInvoiceStatus = 'idle';
      state.saveInvoiceSuccess = '';
      state.saveInvoiceError = '';
    },

    clearDeleteInvoiceStatus(state: IInvoiceState) {
      state.deleteInvoiceStatus = 'idle';
      state.deleteInvoiceSuccess = '';
      state.deleteInvoiceError = '';
    },

    clearSendInvoiceStatus(state: IInvoiceState) {
      state.sendInvoiceStatus = 'idle';
      state.sendInvoiceSuccess = '';
      state.sendInvoiceError = '';
    },

    clearGetSingleInvoiceStatus(state: IInvoiceState) {
      state.getSingleInvoiceStatus = 'idle';
      state.getSingleInvoiceSuccess = '';
      state.getSingleInvoiceError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getInvoicesAction.pending, state => {
        state.getInvoicesStatus = 'loading';
      })
      .addCase(getInvoicesAction.fulfilled, (state, action) => {
        state.getInvoicesStatus = 'completed';
        state.getInvoicesSuccess = action.payload.message;
        state.invoices = action.payload.results as IInvoice[];
      })
      .addCase(getInvoicesAction.rejected, (state, action) => {
        state.getInvoicesStatus = 'failed';

        if (action.payload) {
          state.getInvoicesError = action.payload.message;
        } else state.getInvoicesError = action.error.message as string;
      });

    builder
      .addCase(saveInvoiceAction.pending, state => {
        state.saveInvoiceStatus = 'loading';
      })
      .addCase(saveInvoiceAction.fulfilled, (state, action) => {
        state.saveInvoiceStatus = 'completed';
        state.saveInvoiceSuccess = action.payload.message;
      })
      .addCase(saveInvoiceAction.rejected, (state, action) => {
        state.saveInvoiceStatus = 'failed';

        if (action.payload) {
          state.saveInvoiceError = action.payload.message;
        } else state.saveInvoiceError = action.error.message as string;
      });

    builder
      .addCase(sendInvoiceAction.pending, state => {
        state.sendInvoiceStatus = 'loading';
      })
      .addCase(sendInvoiceAction.fulfilled, (state, action) => {
        state.sendInvoiceStatus = 'completed';
        state.sendInvoiceSuccess = action.payload.message;
      })
      .addCase(sendInvoiceAction.rejected, (state, action) => {
        state.sendInvoiceStatus = 'failed';

        if (action.payload) {
          state.sendInvoiceError = action.payload.message;
        } else state.sendInvoiceError = action.error.message as string;
      });

    builder
      .addCase(getSingleInvoice.pending, state => {
        state.getSingleInvoiceStatus = 'loading';
      })
      .addCase(getSingleInvoice.fulfilled, (state, action) => {
        state.getSingleInvoiceStatus = 'completed';
        state.invoice = action.payload.result as IInvoice;
      })
      .addCase(getSingleInvoice.rejected, (state, action) => {
        state.getSingleInvoiceStatus = 'failed';

        if (action.payload) {
          state.sendInvoiceError = action.payload.message;
        } else state.sendInvoiceError = action.error.message as string;
      });

    builder
      .addCase(deleteInvoiceAction.pending, state => {
        state.deleteInvoiceStatus = 'loading';
      })
      .addCase(deleteInvoiceAction.fulfilled, (state, action) => {
        state.deleteInvoiceStatus = 'completed';
        state.deleteInvoiceSuccess = action.payload.message;
      })
      .addCase(deleteInvoiceAction.rejected, (state, action) => {
        state.deleteInvoiceStatus = 'failed';

        if (action.payload) {
          state.deleteInvoiceError = action.payload.message;
        } else state.deleteInvoiceError = action.error.message as string;
      });
  },
});

export const {
  clearGetInvoicesStatus,
  clearSaveInvoiceStatus,
  clearSendInvoiceStatus,
  clearDeleteInvoiceStatus,
  clearGetSingleInvoiceStatus
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
