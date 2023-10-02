import { Modal } from "antd";
import { Form, Formik } from "formik";
import { createPartnerUserAction, updatePartnerUserAction } from "../../store/actions/userActions";
import { MyTextInput } from "../AppInput/AppInput";
import * as Yup from "yup";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { useEffect, useState } from "react";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import AppBtn from "../AppBtn/AppBtn";

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

const AddUserModall = ({
    setAddusermodal, addusermodal, setFirstName, setLastName,
    setEmail, setPhone, setEditMode, editMode, firstName, lastName,
    email, phone, roleName, store, showPassword, setShowPassword,
    setPassword
}) => {

    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    const handleCloseModal = () => {
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setPassword("")
        setAddusermodal(false)
        setEditMode(false)
        setShowPassword(false)
    }

    const parsePhone = (phone) => {
        if (!phone) {
          return "";
        }
    
        if (phone.startsWith("234")) return phone.replace("234", "0");
    
        return phone;
    };

    const handleUpdateUser = ({phone, ...rest }) => {

        const newPhone = `${phone}`.startsWith("234")
                            ? phone
                            : `${phone}`.startsWith("0")
                              ? `${phone}`.replace("0", "234")
                              : `${phone}`.replace("", "234") //`234${phone}`;
        const values = { ...rest, phone: newPhone };

        console.log(values, 'values')
        dispatch(updatePartnerUserAction({userId: store.id, ...values}));
    };

    const handleCreateUser = ({phone, ...rest }) => {

        const newPhone = `${phone}`.startsWith("234")
                            ? phone
                            : `${phone}`.startsWith("0")
                              ? `${phone}`.replace("0", "234")
                              : `${phone}`.replace("", "234") //`234${phone}`;
        const values = { ...rest, phone: newPhone };

        console.log(values, 'values')
        dispatch(createPartnerUserAction(values));
    };

    return (
        <>
            <Formik
                initialValues={{
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    role: roleName,
                    phone: parsePhone(phone),
                    password: ""
                }}
                onSubmit={editMode ? handleUpdateUser : handleCreateUser}
                enableReinitialize
                validationSchema={editMode ? editUserSchema : createUserSchema}
            >
                {({ setFieldValue, values, handleChange, handleBlur }) => (
                    <Form>
                        <div
                            className="h-screen w-screen flex fixed justify-center items-center"
                        >
                            <Modal
                                title={<span className='font-montserrat text-xl'>{editMode ? 'Edit User' : 'Add New User'}</span>}
                                footer={null}
                                open={addusermodal}
                                onCancel={() => handleCloseModal()}
                            >
                                <div className="mt-8 flex gap-8 flex-col justify-center">
                                    <div className="flex flex-col md:flex-row  w-full gap-6">
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

                                    <div className="flex flex-col md:flex-row  w-full gap-6">
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
                                                onChange={(event) => {
                                                    setFieldValue("phone", event?.target?.value);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.phone}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row  w-full gap-6">
                                        <div className="w-full">
                                            <MyTextInput
                                                hasPLaceHolder={true}
                                                placeholderTop="Password"
                                                placeholder={showPassword ? "Enter password" : "*************"}
                                                name="password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                // value={values.password}
                                                type="password"
                                                disabled={!showPassword}
                                            />
                                        </div>

                                        <div className="w-full flex flex-col">
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
                                    <div className=" flex gap-4 mt-8 justify-center md:justify-end items-center">
                                        <AppBtn
                                            title="SUBMIT"
                                            className="font-medium w-[90%] md:w-[200px] "
                                        />
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default AddUserModall;