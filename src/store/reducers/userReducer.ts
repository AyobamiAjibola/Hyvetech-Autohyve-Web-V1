import { IThunkAPIStatus } from '@app-types';
import { IPermission, IRole, IUser } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import {
  createPartnerUserAction,
  createRoleAction,
  createUserAction,
  deleteUserAction,
  getPermissionsActions,
  getRoleActions,
  getUserAction,
  getUsersAction,
  updatePartnerUserAction,
  updateRoleAction,
  updateUserAction,
  updateUserStatusAction,
} from '../actions/userActions';

interface IUserState {
  getUserStatus: IThunkAPIStatus;
  getUserSuccess: string;
  getUserError?: string;

  getUsersStatus: IThunkAPIStatus;
  getUsersSuccess: string;
  getUsersError?: string;

  getPermissionsStatus: IThunkAPIStatus;
  getPermissionsSuccess: string;
  getPermissionsError?: string;

  getRolesStatus: IThunkAPIStatus;
  getRolesSuccess: string;
  getRolesError?: string;

  getRoleStatus: IThunkAPIStatus;
  getRoleSuccess: string;
  getRoleError?: string;

  createUserStatus: IThunkAPIStatus;
  createUserSuccess: string;
  createUserError?: string;

  createRoleStatus: IThunkAPIStatus;
  createRoleSuccess: string;
  createRoleError?: string;

  createPartnerUserStatus: IThunkAPIStatus;
  createPartnerUserSuccess: string;
  createPartnerUserError?: string;

  updatePartnerUserStatus: IThunkAPIStatus;
  updatePartnerUserSuccess: string;
  updatePartnerUserError?: string;

  deleteUserStatus: IThunkAPIStatus;
  deleteUserSuccess: string;
  deleteUserError?: string;

  updateStatusUserStatus: IThunkAPIStatus;
  updateStatusUserSuccess: string;
  updateStatusUserError?: string;

  users: IUser[];
  user: IUser | null;

  permissions: IPermission[];
  roles: IRole[];

  role: IRole | null;
}

const initialState: IUserState = {
  getUserError: '',
  getUserStatus: 'idle',
  getUserSuccess: '',
  getUsersError: '',
  getUsersStatus: 'idle',
  getUsersSuccess: '',

  getPermissionsError: '',
  getPermissionsStatus: 'idle',
  getPermissionsSuccess: '',

  getRolesError: '',
  getRolesStatus: 'idle',
  getRolesSuccess: '',

  createRoleError: '',
  createRoleStatus: 'idle',
  createRoleSuccess: '',

  createUserError: '',
  createUserStatus: 'idle',
  createUserSuccess: '',

  getRoleError: '',
  getRoleStatus: 'idle',
  getRoleSuccess: '',

  createPartnerUserError: '',
  createPartnerUserStatus: 'idle',
  createPartnerUserSuccess: '',

  updatePartnerUserError: '',
  updatePartnerUserStatus: 'idle',
  updatePartnerUserSuccess: '',

  deleteUserError: '',
  deleteUserStatus: 'idle',
  deleteUserSuccess: '',

  updateStatusUserError: '',
  updateStatusUserStatus: 'idle',
  updateStatusUserSuccess: '',

  user: null,
  users: [],

  permissions: [],
  roles: [],

  role: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearGetUsersStatus(state: IUserState) {
      state.getUsersStatus = 'idle';
      state.getUsersSuccess = '';
      state.getUsersError = '';
    },
    clearGetUserStatus(state: IUserState) {
      state.getUserStatus = 'idle';
      state.getUserSuccess = '';
      state.getUserError = '';
    },

    clearCreateRoleStatus(state: IUserState) {
      state.createRoleStatus = 'idle';
      state.createRoleSuccess = '';
      state.createRoleError = '';
    },

    clearCreateUserStatus(state: IUserState) {
      state.createUserStatus = 'idle';
      state.createUserSuccess = '';
      state.createUserError = '';
    },

    clearCreatePartnerUserStatus(state: IUserState) {
      state.createPartnerUserStatus = 'idle';
      state.createPartnerUserSuccess = '';
      state.createPartnerUserError = '';
    },

    clearUpdateUserPartnerStatus(state: IUserState) {
      state.createPartnerUserStatus = 'idle';
      state.createPartnerUserSuccess = '';
      state.createPartnerUserError = '';
    },

    clearDeleteUserStatus(state: IUserState) {
      state.deleteUserStatus = 'idle';
      state.deleteUserSuccess = '';
      state.deleteUserError = '';
    },

    clearUpdateStatusUserStatus(state: IUserState) {
      state.updateStatusUserStatus = 'idle';
      state.updateStatusUserSuccess = '';
      state.updateStatusUserError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUsersAction.pending, state => {
        state.getUsersStatus = 'loading';
      })
      .addCase(getUsersAction.fulfilled, (state, action) => {
        state.getUsersStatus = 'completed';
        state.getUsersSuccess = action.payload.message;
        state.users = action.payload.results as IUser[];
      })
      .addCase(getUsersAction.rejected, (state, action) => {
        state.getUsersStatus = 'failed';

        if (action.payload) {
          state.getUsersError = action.payload.message;
        } else state.getUsersError = action.error.message;
      });

    builder
      .addCase(deleteUserAction.pending, state => {
        state.deleteUserStatus = 'loading';
      })
      .addCase(deleteUserAction.fulfilled, (state, action) => {
        state.deleteUserStatus = 'completed';
        state.deleteUserSuccess = action.payload.message;
      })
      .addCase(deleteUserAction.rejected, (state, action) => {
        state.deleteUserStatus = 'failed';

        if (action.payload) {
          state.deleteUserError = action.payload.message;
        } else state.deleteUserError = action.error.message;
      });

    builder
      .addCase(getUserAction.pending, state => {
        state.getUserStatus = 'loading';
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.getUserStatus = 'completed';
        state.getUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(getUserAction.rejected, (state, action) => {
        state.getUserStatus = 'failed';

        if (action.payload) {
          state.getUserError = action.payload.message;
        } else state.getUserError = action.error.message;
      });

    builder
      .addCase(getPermissionsActions.pending, state => {
        state.getPermissionsStatus = 'loading';
      })
      .addCase(getPermissionsActions.fulfilled, (state, action) => {
        state.getPermissionsStatus = 'completed';
        state.getPermissionsSuccess = action.payload.message;
        state.permissions = action.payload.results as IPermission[];
      })
      .addCase(getPermissionsActions.rejected, (state, action) => {
        state.getPermissionsStatus = 'failed';

        if (action.payload) {
          state.getPermissionsError = action.payload.message;
        } else state.getPermissionsError = action.error.message;
      });

    builder
      .addCase(getRoleActions.pending, state => {
        state.getRolesStatus = 'loading';
      })
      .addCase(getRoleActions.fulfilled, (state, action) => {
        state.getRolesStatus = 'completed';
        state.getRolesSuccess = action.payload.message;
        state.roles = action.payload.results as IRole[];
      })
      .addCase(getRoleActions.rejected, (state, action) => {
        state.getRolesStatus = 'failed';

        if (action.payload) {
          state.getRolesError = action.payload.message;
        } else state.getRolesError = action.error.message;
      });

    builder
      .addCase(createRoleAction.pending, state => {
        state.createRoleStatus = 'loading';
      })
      .addCase(createRoleAction.fulfilled, (state, action) => {
        state.createRoleStatus = 'completed';
        state.createRoleSuccess = action.payload.message;
        state.role = action.payload.result as IRole;
      })
      .addCase(createRoleAction.rejected, (state, action) => {
        state.createRoleStatus = 'failed';

        if (action.payload) {
          state.createRoleError = action.payload.message;
        } else state.createRoleError = action.error.message;
      });

    builder
      .addCase(updateRoleAction.pending, state => {
        state.createRoleStatus = 'loading';
      })
      .addCase(updateRoleAction.fulfilled, (state, action) => {
        state.createRoleStatus = 'completed';
        state.createRoleSuccess = action.payload.message;
        state.role = action.payload.result as IRole;
      })
      .addCase(updateRoleAction.rejected, (state, action) => {
        state.createRoleStatus = 'failed';

        if (action.payload) {
          state.createRoleError = action.payload.message;
        } else state.createRoleError = action.error.message;
      });

    builder
      .addCase(createUserAction.pending, state => {
        state.createUserStatus = 'loading';
      })
      .addCase(createUserAction.fulfilled, (state, action) => {
        state.createUserStatus = 'completed';
        state.createUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(createUserAction.rejected, (state, action) => {
        state.createUserStatus = 'failed';

        if (action.payload) {
          state.createUserError = action.payload.message;
        } else state.createUserError = action.error.message;
      });

    builder
      .addCase(updateUserAction.pending, state => {
        state.createUserStatus = 'loading';
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.createUserStatus = 'completed';
        state.createUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(updateUserAction.rejected, (state, action) => {
        state.createUserStatus = 'failed';

        if (action.payload) {
          state.createUserError = action.payload.message;
        } else state.createUserError = action.error.message;
      });

    builder
      .addCase(updateUserStatusAction.pending, state => {
        state.updateStatusUserStatus = 'loading';
      })
      .addCase(updateUserStatusAction.fulfilled, (state, action) => {
        state.updateStatusUserStatus = 'completed';
        state.updateStatusUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(updateUserStatusAction.rejected, (state, action) => {
        state.updateStatusUserStatus = 'failed';

        if (action.payload) {
          state.updateStatusUserError = action.payload.message;
        } else state.updateStatusUserError = action.error.message;
      });

    builder
      .addCase(createPartnerUserAction.pending, state => {
        state.createPartnerUserStatus = 'loading';
      })
      .addCase(createPartnerUserAction.fulfilled, (state, action) => {
        state.createPartnerUserStatus = 'completed';
        state.createPartnerUserSuccess = action.payload.message;
      })
      .addCase(createPartnerUserAction.rejected, (state, action) => {
        state.createPartnerUserStatus = 'failed';

        if (action.payload) {
          state.createPartnerUserError = action.payload.message;
        } else state.createPartnerUserError = action.error.message;
      });

    builder
      .addCase(updatePartnerUserAction.pending, state => {
        state.updatePartnerUserStatus = 'loading';
      })
      .addCase(updatePartnerUserAction.fulfilled, (state, action) => {
        state.updatePartnerUserStatus = 'completed';
        state.updatePartnerUserSuccess = action.payload.message;
      })
      .addCase(updatePartnerUserAction.rejected, (state, action) => {
        state.updatePartnerUserStatus = 'failed';

        if (action.payload) {
          state.updatePartnerUserError = action.payload.message;
        } else state.updatePartnerUserError = action.error.message;
      });
  },
});

export const {
  clearGetUsersStatus,
  clearGetUserStatus,
  clearCreateRoleStatus,
  clearCreateUserStatus,
  clearCreatePartnerUserStatus,
  clearUpdateUserPartnerStatus,
  clearDeleteUserStatus,
  clearUpdateStatusUserStatus
} =
  userSlice.actions;
export default userSlice.reducer;
