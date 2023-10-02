import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import AppDropDown, { RoleAppDropDown } from "../AppDropDown/AppDropDown";
import { Form, Formik } from "formik";
import { createPartnerUserAction, createUserAction, getUsersAction, updatePartnerUserAction, updateUserAction, updateUserStatusAction } from "../../store/actions/userActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import { clearCreatePartnerUserStatus, clearCreateUserStatus, clearUpdateUserPartnerStatus } from "../../store/reducers/userReducer";
import * as Yup from "yup";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { Select } from "antd";

const createUserSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email(),
  phone: Yup.string()
  .matches(/^[0-9]+$/, "Phone number should be numbers")
  .min(11, "Phone number should be 11 digits")
  .max(11, "Phone number should be 11 digits"),
  role: Yup.string(),
  password: Yup.string()
  .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
      'Password does not meet requirement.'
  )
  .required('Password is required')
  .label('Password')
});

const editUserSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email(),
  phone: Yup.string()
  .matches(/^[0-9]+$/, "Phone number should be numbers")
  .min(11, "Phone number should be 11 digits")
  .max(11, "Phone number should be 11 digits"),
  role: Yup.string(),
  password: Yup.string()
  .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
      'Password does not meet requirement.'
  )
  .label('Password')
});

const AddUserModal = ({
  addusermodal,
  setAddusermodal, store,
  firstName, lastName, email,
  phone, setPassword, password, roleName, setRole,
  setFirstName, setLastName, setEmail, setPhone,
  editMode, setEditMode, userId, setUserId,
  showPassword, setShowPassword
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer);
  const [roles, setRoles] = useState([]);
  
  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  useEffect(() => {
    const _roles = store.roles.map((item => item.name));
    setRoles(_roles)
  },[store]);

  useEffect(() => {
    if (userReducer.createPartnerUserStatus === 'completed') {
      showMessage(
        "User",
        userReducer.createPartnerUserSuccess,
        "success"
      )
      dispatch(getUsersAction());
      setAddusermodal(false);
      dispatch(clearCreatePartnerUserStatus());
      setEditMode(false);
      setPassword('');
      setShowPassword(false)
    } else if (store.createPartnerUserStatus === 'failed') {
      showMessage(
        "User",
        userReducer.createPartnerUserError,
        "error"
      )
      dispatch(clearCreatePartnerUserStatus());
      setShowPassword(false)
      setEditMode(false);
      setPassword('');
    }

    return () => {
      dispatch(clearCreatePartnerUserStatus());
    };
  }, [store.createPartnerUserStatus]);

  useEffect(() => {
    if (userReducer.updatePartnerUserStatus === 'completed') {
      showMessage(
        "User",
        userReducer.updatePartnerUserSuccess,
        "success"
      )
      dispatch(getUsersAction());
      setAddusermodal(false);
      dispatch(clearCreatePartnerUserStatus());
      setEditMode(false);
      setPassword('');
      setShowPassword(false)
    } else if (store.updatePartnerUserStatus === 'failed') {
      showMessage(
        "User",
        userReducer.updatePartnerUserError,
        "error"
      )
      dispatch(clearUpdateUserPartnerStatus());
      setShowPassword(false)
      setEditMode(false);
      setPassword('');
    }

    return () => {
      dispatch(clearUpdateUserPartnerStatus());
    };
  }, [store.updatePartnerUserStatus]);

  const clearState = () => {
    setEditMode(false);
    setRole(-1);
    setUserId(-1);
  };

  useEffect(() => {
    if (setAddusermodal) return;

    clearState();
  }, [setAddusermodal]);

  const handleUpdateUser = ({phone, ...rest }) => {

    const newPhone = `${phone}`.startsWith("234")
                        ? phone
                        : `${phone}`.startsWith("0")
                          ? `${phone}`.replace("0", "234")
                          : `${phone}`.replace("", "234")
    const values = { ...rest, phone: newPhone };

    dispatch(updatePartnerUserAction({userId, ...values}));
};

const handleCreateUser = ({phone, ...rest }) => {

    const newPhone = `${phone}`.startsWith("234")
                        ? phone
                        : `${phone}`.startsWith("0")
                          ? `${phone}`.replace("0", "234")
                          : `${phone}`.replace("", "234")
    const values = { ...rest, phone: newPhone };

    dispatch(createPartnerUserAction(values));
};

  const handleCloseModal = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setPassword("")
    setAddusermodal(false)
    setEditMode(false)
    setShowPassword(false)(false)
}

  const parsePhone = (phone) => {
    if (!phone) {
      return "";
    }

    if (phone.startsWith("234")) return phone.replace("234", "0");

    return phone;
  };

  return (
    <>
      {addusermodal && (
        <Formik
          enableReinitialize
          initialValues={{
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: roleName,
            phone: parsePhone(phone),
            password: ''
          }}
          onSubmit={editMode ? handleUpdateUser : handleCreateUser}
          validationSchema={editMode ? editUserSchema : createUserSchema}
        >
          {({ setFieldValue, values, handleChange, handleBlur }) => (
            <Form>
              <div
                className="overlay h-screen w-screen flex fixed justify-center items-center"
                style={{ zIndex: 4000 }}
              >
                <div className="rounded-lg md:w-[50%] w-[90%] h-[700px] md:h-auto overflow-y-auto bg-white py-8 px-3">
                  <div className="modal-header pt-0 bg-white px-8">
                    <div className="flex justify-between w-full">
                      <h5 className="text-center font-semibold font-montserrat">
                        {editMode ? 'Edit User' : 'Add New User'}
                      </h5>
                      <button onClick={() => handleCloseModal()}>
                        <img src={CloseIcon} alt="" />
                      </button>
                    </div>

                    <div className="mt-8 flex gap-8 flex-col justify-center">
                      <div className="flex flex-col md:flex-row  w-full gap-4">
                        <div className="w-full">
                          <MyTextInput
                            hasPLaceHolder={true}
                            placeholderTop="First Name"
                            placeholder="Enter last name"
                            name="firstName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstName}
                          />
                        </div>

                        <div className="w-full">
                          <MyTextInput
                            hasPLaceHolder={true}
                            placeholderTop="Last Name"
                            placeholder="Enter last name"
                            name="lastName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastName}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row  w-full gap-4">
                        <div className="w-full">
                          <MyTextInput
                            hasPLaceHolder={true}
                            placeholderTop="Email"
                            placeholder="Enter a valid email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                        </div>

                        <div className="w-full">
                          <AppInputWithPhone
                            placeholderTop="Phone Number"
                            placeholder="Phone Number"
                            hasPLaceHolder={true}
                            type="text"
                            name="phone"
                            // onChange={handleChange}
                            onChange={(event) => {
                              setFieldValue("phone", event?.target?.value);
                            }}
                            onBlur={handleBlur}
                            value={values.phone}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row  w-full gap-4">
                        <div className="w-full">
                          <MyTextInput
                            hasPLaceHolder={true}
                            placeholderTop="Password"
                            placeholder={showPassword ? "Enter a valid password" : "*************"}
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // value={values.password}
                            type="password"
                            disabled={!showPassword}
                          />
                        </div>

                        <div className="w-full">
                          <span 
                              className='font-montserrat '
                          >Role</span>
                          <select 
                              className={`w-full h-[3.5rem] mt-0.4 
                              rounded-[20px] p-2 bg-[#f5f5f5] color: #000000;
                              transition: all 300ms ease-out;`}
                              onChange={handleChange}
                              name="role"
                              value={values.role }
                          >
                              {store.roles.map((role, index) => {
                                  return (
                                      <option key={role.id}>{role.name}</option>
                                  )
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="body">
                    {/* view */}
                    <div className=" flex gap-4 mt-8 justify-center md:justify-end items-center px-4 md:px-10">
                      <AppBtn
                        title="SUBMIT"
                        className="font-medium w-[90%] md:w-[100px]"
                        spinner={editMode 
                          ? userReducer.updatePartnerUserStatus === 'loading'
                          : userReducer.createPartnerUserStatus === 'loading'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default AddUserModal;
