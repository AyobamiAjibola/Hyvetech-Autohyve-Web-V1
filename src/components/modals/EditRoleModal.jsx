import { Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Button, Modal } from 'antd';
import CapitalizeWord from '../../utils/capitalizeWord';
import AppInput, { MyTextInput } from '../AppInput/AppInput';
import AppBtn from '../AppBtn/AppBtn';
import { Formik } from 'formik';
import { createRoleAction, getRoleActions, updateRoleAction } from '../../store/actions/userActions';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { useCallback, useEffect } from 'react';
import { showMessage } from '../../helpers/notification';
import { clearCreateRoleStatus } from '../../store/reducers/userReducer';

const EditRoleModal = ({ 
  editRole, setEditRole, editMode, setAddrolemodal,
  roleName, permissions, store, addrolemodal,
  setRoleName, setPermissions, roleId, setEditMode
}) => {

  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPermissions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleRoleUpdate = () => {
    dispatch(updateRoleAction({ id: roleId, permissions }));
  };

  useEffect(() => {
    if(userReducer.createRoleStatus === 'completed') {
      showMessage(
        "Role",
        editMode ? "Role updated successfully" : "Role created successfully",
        "success"
      )
      dispatch(getRoleActions());
      setEditRole(false)
      
      dispatch(clearCreateRoleStatus());
    } else if(userReducer.createRoleStatus === 'failed') {
      showMessage(
        "Role",
        userReducer.createRoleError,
        "error"
      )
      dispatch(clearCreateRoleStatus());
    }

    return () => {
      dispatch(clearCreateRoleStatus());
    };
  },[userReducer.createRoleStatus]);

  const clearState = () => {
    setEditMode(false);
    setRole(-1);
    setUserId(-1);
  };

  useEffect(() => {
    if (setEditRole) return;

    clearState();
  }, [setEditRole]);

  const handleCreateRole = useCallback(() => {
    if (roleName.trim() === '') return showMessage('Role', 'Role name is required', 'error' );
    if (permissions.length === 0) return showMessage('Role', 'Please select atleast one permission', 'error');

    dispatch(createRoleAction({ name: roleName, permissions }));
  }, [roleName, permissions]);

  return (
    <>
      <Formik
        initialValues={{}}
        onSubmit={(values, formikHelpers) => {
          console.log(values, formikHelpers, 'testing');
        }}
        enableReinitialize
        validateOnChange
      >
        <div
          className="h-screen w-screen flex fixed justify-center items-center"
        >
          <Modal
            title={<span className='font-montserrat text-xl'>Edit Role</span>}
            footer={null}
            open={editRole}
            onCancel={() => {setEditRole(false), setPermissions([]), setAddrolemodal(false)}}
            className='rounded-2xl md:w-[40%] w-[90%] md:h-auto'
          >

            <div className="mt-8 flex gap-8 flex-col justify-center">
              <div className="w-full">
                <MyTextInput
                  hasPLaceHolder={true}
                  placeholderTop="Role Name"
                  placeholder="Super"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  value={roleName}
                  name="role"
                  disabled={editMode}
                  onChange={e => setRoleName(e.target.value)}
                />
              </div>
              <div className="w-full">
                <span 
                    className='font-montserrat '
                >Permissions</span>
                <Select
                    id="demo-multiple-checkbox"
                    multiple
                    fullWidth
                    value={permissions}
                    style={{ borderRadius: '1rem' }}
                    label="Role Permission Selection"
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={selected => selected.join(', ')}>
                    {(store.permissions || []).map(item => (
                    <MenuItem key={item.permission_id} value={item.name}>
                        <Checkbox checked={permissions.indexOf(item.name) > -1} />
                        <ListItemText primary={CapitalizeWord.capitalize(item.name.replace(/_/g, ' '))} />
                    </MenuItem>
                    ))}
                </Select>
              </div>
              <div
                className='font-montserrat text-sm'
              >
                Permission Count: <span style={{fontWeight: 'bold'}}>{ permissions.length }</span>
              </div>
              <div className=" flex md:mt-5 justify-center md:justify-end items-center">
                <AppBtn
                  title="SUBMIT"
                  onClick={editMode ? handleRoleUpdate : handleCreateRole}
                  className="font-medium w-[80%] md:w-[200px] "
                />
              </div>
            </div>
          </Modal>
        </div>
      </Formik>
    </>
  )
}

export default EditRoleModal