import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";

import { IThunkAPIStatus } from '@app-types';
import { changePasswordAction, garageSignUpAction, preSignUpAction, resetPasswordWithTokenAction, sendPasswordResetTokenAction, signInAction, signOutAction, veryfyTokenAction } from '../actions/authenicationActions';
import { IPermission } from '@app-models';
import { LOCAL_STORAGE } from '../../config/constants';
import { CustomJwtPayload } from '@app-interfaces';
import settings from '../../config/settings';

interface IAuthenticationState {
  signingInStatus: IThunkAPIStatus;
  signingInSuccess: string;
  signingInError?: string;

  garageSignUpStatus: IThunkAPIStatus;
  garageSignUpSuccess: string;
  garageSignUpError: string;

  signOutStatus: IThunkAPIStatus;
  signOutSuccess: string;
  signOutError?: string;

  changePasswordStatus: IThunkAPIStatus;
  changePasswordSuccess: string;
  changePasswordError?: string;

  sendPasswordResetTokenStatus: IThunkAPIStatus;
  sendPasswordResetTokenSuccess: string;
  sendPasswordResetTokenError?: string;

  resetPasswordWithTokenStatus: IThunkAPIStatus;
  resetPasswordWithTokenSuccess: string;
  resetPasswordWithTokenError?: string;

  preSignUpStatus: IThunkAPIStatus;
  preSignUpSuccess: string;
  preSignUpError?: string;

  verifyTokenStatus: IThunkAPIStatus;
  verifyTokenSuccess: string;
  verifyTokenError?: string;

  authToken: string;
  permissions: IPermission[];
}

const initialState: IAuthenticationState = {
  signOutError: '',
  signOutStatus: 'idle',
  signOutSuccess: '',
  authToken: '',
  signingInError: '',
  signingInSuccess: '',
  signingInStatus: 'idle',

  changePasswordError: '',
  changePasswordSuccess: '',
  changePasswordStatus: 'idle',

  sendPasswordResetTokenError: '',
  sendPasswordResetTokenSuccess: '',
  sendPasswordResetTokenStatus: 'idle',

  resetPasswordWithTokenError: '',
  resetPasswordWithTokenSuccess: '',
  resetPasswordWithTokenStatus: 'idle',

  garageSignUpStatus: 'idle',
  garageSignUpSuccess: '',
  garageSignUpError: '',

  preSignUpStatus: 'idle',
  preSignUpSuccess: '',
  preSignUpError: '',

  verifyTokenStatus: 'idle',
  verifyTokenSuccess: '',
  verifyTokenError: '',

  permissions: [],
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearLoginStatus(state: IAuthenticationState) {
      state.signingInStatus = 'idle';
      state.signingInSuccess = '';
      state.signingInError = '';
    },
    clearGarageSignUpStatus(state: IAuthenticationState) {
      state.garageSignUpStatus = 'idle';
      state.garageSignUpSuccess = '';
      state.garageSignUpError = '';
    },
    clearLogoutStatus(state: IAuthenticationState) {
      state.signOutStatus = 'idle';
      state.signOutSuccess = '';
      state.signOutError = '';
    },
    clearChangePasswordStatus(state: IAuthenticationState) {
      state.changePasswordStatus = 'idle';
      state.changePasswordSuccess = '';
      state.changePasswordError = '';
    },
    clearSendPasswordResetTokenStatus(state: IAuthenticationState) {
      state.sendPasswordResetTokenStatus = 'idle';
      state.sendPasswordResetTokenSuccess = '';
      state.sendPasswordResetTokenError = '';
    },
    clearResetPasswordWithTokenStatus(state: IAuthenticationState) {
      state.resetPasswordWithTokenStatus = 'idle';
      state.resetPasswordWithTokenSuccess = '';
      state.resetPasswordWithTokenError = '';
    },
    clearPreSignUpStatus(state: IAuthenticationState) {
      state.preSignUpStatus = 'idle';
      state.preSignUpSuccess = '';
      state.preSignUpError = '';
    },

    clearVerifyTokenStatus(state: IAuthenticationState) {
      state.verifyTokenStatus = 'idle';
      state.verifyTokenSuccess = '';
      state.verifyTokenError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInAction.pending, state => {
        state.signingInStatus = 'loading';
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.signingInStatus = 'completed';
        state.signingInSuccess = action.payload.message;

        // if (action.payload.tokens) {
        if (action.payload.result) {
          // state.authToken = action.payload.tokens.jwt;
          state.authToken = action.payload.result;
          const { permissions } = jwt_decode(state.authToken) as CustomJwtPayload;

          state.permissions = permissions;
          sessionStorage.setItem(LOCAL_STORAGE.permissions, JSON.stringify(permissions));

          sessionStorage.setItem(settings.auth.admin, state.authToken);

        }
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.signingInStatus = 'failed';

        if (action.payload) {
          state.signingInError = action.payload.message;
        } else state.signingInError = action.error.message;
      });

    builder
      .addCase(signOutAction.pending, state => {
        state.signOutStatus = 'loading';
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.signOutStatus = 'completed';
        state.signOutSuccess = action.payload.message;
      })
      .addCase(signOutAction.rejected, (state, action) => {
        state.signOutStatus = 'failed';

        if (action.payload) {
          state.signOutError = action.payload.message;
        } else state.signOutError = action.error.message;
      });

    builder
      .addCase(garageSignUpAction.pending, state => {
        state.garageSignUpStatus = 'loading';
      })
      .addCase(garageSignUpAction.fulfilled, (state, action) => {
        state.garageSignUpStatus = 'completed';
        state.garageSignUpSuccess = action.payload.message;
      })
      .addCase(garageSignUpAction.rejected, (state, action) => {
        state.garageSignUpStatus = 'failed';

        if (action.payload) {
          state.garageSignUpError = action.payload.message;
        } else state.garageSignUpError = action.error.message as string;
      });

    builder
      .addCase(changePasswordAction.pending, state => {
        state.changePasswordStatus = 'loading';
      })
      .addCase(changePasswordAction.fulfilled, (state, action) => {
        state.changePasswordStatus = 'completed';
        state.changePasswordSuccess = action.payload.message;
      })
      .addCase(changePasswordAction.rejected, (state, action) => {
        state.changePasswordStatus = 'failed';

        if (action.payload) {
          state.changePasswordError = action.payload.message;
        } else state.changePasswordError = action.error.message as string;
      });

    builder
      .addCase(sendPasswordResetTokenAction.pending, state => {
        state.sendPasswordResetTokenStatus = 'loading';
      })
      .addCase(sendPasswordResetTokenAction.fulfilled, (state, action) => {
        state.sendPasswordResetTokenStatus = 'completed';
        state.sendPasswordResetTokenSuccess = action.payload.message;
      })
      .addCase(sendPasswordResetTokenAction.rejected, (state, action) => {
        state.sendPasswordResetTokenStatus = 'failed';

        if (action.payload) {
          state.sendPasswordResetTokenError = action.payload.message;
        } else state.sendPasswordResetTokenError = action.error.message as string;
      });

    builder
      .addCase(resetPasswordWithTokenAction.pending, state => {
        state.resetPasswordWithTokenStatus = 'loading';
      })
      .addCase(resetPasswordWithTokenAction.fulfilled, (state, action) => {
        state.resetPasswordWithTokenStatus = 'completed';
        state.resetPasswordWithTokenSuccess = action.payload.message;
      })
      .addCase(resetPasswordWithTokenAction.rejected, (state, action) => {
        state.resetPasswordWithTokenStatus = 'failed';

        if (action.payload) {
          state.resetPasswordWithTokenError = action.payload.message;
        } else state.resetPasswordWithTokenError = action.error.message as string;
      });

    builder
      .addCase(preSignUpAction.pending, state => {
        state.preSignUpStatus = 'loading';
      })
      .addCase(preSignUpAction.fulfilled, (state, action) => {
        state.preSignUpStatus = 'completed';
        state.preSignUpSuccess = action.payload.message;
      })
      .addCase(preSignUpAction.rejected, (state, action) => {
        state.preSignUpStatus = 'failed';

        if (action.payload) {
          state.preSignUpError = action.payload.message;
        } else state.preSignUpError = action.error.message as string;
      });

    builder
      .addCase(veryfyTokenAction.pending, state => {
        state.verifyTokenStatus = 'loading';
      })
      .addCase(veryfyTokenAction.fulfilled, (state, action) => {
        state.verifyTokenStatus = 'completed';
        state.verifyTokenSuccess = action.payload.message;
      })
      .addCase(veryfyTokenAction.rejected, (state, action) => {
        state.verifyTokenStatus = 'failed';

        if (action.payload) {
          state.verifyTokenError = action.payload.message;
        } else state.verifyTokenError = action.error.message as string;
      });
  },
});

export const {
  clearLoginStatus,
  clearLogoutStatus,
  clearGarageSignUpStatus,
  clearChangePasswordStatus,
  clearResetPasswordWithTokenStatus,
  clearSendPasswordResetTokenStatus,
  clearPreSignUpStatus,
  clearVerifyTokenStatus
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
