import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { IGarageSignupModel } from '../../components/Forms/models/garageSignUpModel';
import { ApiResponseSuccess } from '@app-interfaces';

const SIGN_IN = 'authentication:SIGN_IN';
const GARAGE_SIGN_UP = 'authentication:GARAGE_SIGN_UP';
const SIGN_OUT = 'authentication:SIGN_OUT';
const CHANGE_PASSWORD = 'authentication:CHANGE_PASSWORD';
const SEND_PASS_RESET_TOKEN = 'authentication:SEND_PASS_RESET_TOKEN';
const RESET_PASS_WITH_TOKEN = 'authentication:RESET_PASS_WITH_TOKEN';
const PRE_SIGN_UP = 'authentication:PRE_SIGN_UP';
const VERIFY_TOKEN = 'authentication:VERIFY_TOKEN';
const API_ROOT = settings.api.rest;

export const signInAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SIGN_IN, async (args: any) => {
  const response = await axiosClient.post(`${API_ROOT}/sign-in`, args);

  return response.data;
});

export const garageSignUpAction = asyncThunkWrapper<ApiResponseSuccess<string>, IGarageSignupModel>(
  GARAGE_SIGN_UP,
  async args => {
    const response = await axiosClient.post(`${API_ROOT}/garage-sign-up`, args);

    return response.data;
  },
);

export const signOutAction = asyncThunkWrapper<ApiResponseSuccess<null>, void>(SIGN_OUT, async () => {
  const response = await axiosClient.get(`${API_ROOT}/sign-out`);

  return response.data;
});

export const changePasswordAction = asyncThunkWrapper<ApiResponseSuccess<string>, any>(
  CHANGE_PASSWORD,
  async args => {
  const response = await axiosClient.put(`${API_ROOT}/change/password`, args);

  return response.data;
});

export const sendPasswordResetTokenAction = asyncThunkWrapper<ApiResponseSuccess<string>, any>(
  SEND_PASS_RESET_TOKEN,
  async args => {
  const response = await axiosClient.post(`${API_ROOT}/send-password-reset-token`, args);

  return response.data;
});

export const resetPasswordWithTokenAction = asyncThunkWrapper<ApiResponseSuccess<string>, any>(
  RESET_PASS_WITH_TOKEN,
  async args => {
  const response = await axiosClient.post(`${API_ROOT}/reset-password-with-token`, args);

  return response.data;
});

export const preSignUpAction = asyncThunkWrapper<ApiResponseSuccess<string>, {email: string, phone: string}>(
  PRE_SIGN_UP,
  async args => {
  const response = await axiosClient.post(`${API_ROOT}/pre-sign-up`, args);

  return response.data;
});

export const veryfyTokenAction = asyncThunkWrapper<ApiResponseSuccess<string>, { token: string }>(
  VERIFY_TOKEN,
  async args => {
  const response = await axiosClient.post(`${API_ROOT}/verify-token`, args);

  return response.data;
});
