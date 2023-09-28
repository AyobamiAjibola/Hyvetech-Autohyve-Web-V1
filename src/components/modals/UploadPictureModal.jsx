import React, { useEffect, useRef, useState } from "react";
import "./modal.css";
import AppInput from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpModal from "./OtpModal";
import { Form, Formik } from "formik";
import useAdmin from "../../hooks/useAdmin";
import { showMessage } from "../../helpers/notification";
import axiosClient from "../../config/axiosClient";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useAppDispatch from "../../hooks/useAppDispatch";
import { updateUserAction } from "../../store/actions/userActions";
import profilePicx from "../../assets/images/profilePicx.png";
import { Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons'

const validationSchema = Yup.object().shape({
  profileImageUrl: Yup.mixed().required('Image is required'),
});

export default function UploadPictureModal({ setOpenProfile, openProfile, data }) {

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAdmin();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (value) => {
    dispatch(updateUserAction({
      ...data,
      profileImageUrl: value.profileImageUrl,
      id: user?.id
    }))
    setImagePreview(null)
    setOpenProfile(false)
    navigate('/profile')
  }

  if (openProfile) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setOpenProfile(!openProfile);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {openProfile && (
        <div
          className="overlay h-screen w-screen flex  fixed justify-center items-center"
          onClick={toggleModal}
        >
          <Formik
            enableReinitialize
            initialValues={{ profileImageUrl: null }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({values, handleChange, setFieldValue }) => (
              <Form className=" bg-white w-[90%] md:w-[30%] rounded-md py-8 px-20">
                  <div className="modal-header bg-white p-8 py-2 relative">
                    <button
                      onClick={() => setOpenProfile(!openProfile)}
                      className="flex justify-end w-full absolute  -top-3 -right-12 md:-right-10"
                    >
                      <img src={CloseIcon} alt="" />
                    </button>

                    {/* <div>
                      <h5 className="text-center heading-five">Transfer Fund</h5>
                    </div> */}
                  </div>

                  <div className="flex justify-center items-center flex-col">
                    <h2 className="font-montserrat font-bold text-sm">
                      Edit your profile Image
                    </h2>
                    <input
                      name="profileImageUrl"
                      type="file"
                      id="profileImageUrl"
                      accept="image/*"
                      onChange={(event) => {
                        const previewURL = URL.createObjectURL(event.target.files[0]);
                        setImagePreview(previewURL);
                        setFieldValue("profileImageUrl", event.currentTarget.files[0])
                      }}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                      {imagePreview && (
                      <img
                        src={imagePreview}
                        alt=""
                        className="w-[100px] h-[100px] rounded-[50%] mt-5"
                      />)}
                      {!imagePreview && (
                        <div
                          className={`w-[100px] h-[100px] rounded-[50%] mt-5
                          border-[1px] flex justify-center items-center
                          hover:border-[1px] hover:border-[#faa21b] border-dashed`}
                        >
                          <div className="flex flex-col justify-center items-center">
                            <PlusOutlined />
                            <div className="mt-4">Upload</div>
                          </div>
                          
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between gap-5 mt-5">
                      <AppBtn
                        className="text-[#000] w-[100px] border-[1px] bg-white border-[#D9D9D9] mt-1 font-medium"
                        title="CLEAR"
                        onClick={() => {setImagePreview(false), setOpenProfile(false)}}
                      />
                      <AppBtn
                        className=" bg-[#FAA21B] w-[100px] text-[#000] "
                        title="UPLOAD"
                      />
                    </div>
                  </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
}
