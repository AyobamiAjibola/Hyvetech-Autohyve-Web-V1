import React, { useEffect, useState } from "react";
import Logo from "../../assets/svgs/hyve_logo.svg";
import Quote from "../../assets/svgs/blockquote.svg";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import AppBtn from "../../components/AppBtn/AppBtn";
import NewPasswordModal from "../../components/modals/NewPasswordModal";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { veryfyTokenAction } from "../../store/actions/authenicationActions";
import { showMessage } from "../../helpers/notification";
import { clearPreSignUpStatus, clearVerifyTokenStatus } from "../../store/reducers/authenticationReducer";

const Verification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [newPasswordModal, setNewPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const authReducer = useAppSelector(state => state.authenticationReducer)

  const handleSubmit = () => {
    dispatch(veryfyTokenAction({
      token: otp
    }))
  }

  // useEffect(() => {
  //   if(authReducer.preSignUpStatus === 'completed') {
  //     showMessage(
  //       "Sign up",
  //       authReducer.preSignUpSuccess,
  //       "success"
  //     )
  //   }
  //   dispatch(clearPreSignUpStatus())
  // },[authReducer.preSignUpStatus]);

  useEffect(() => {
    if(authReducer.verifyTokenStatus === 'completed') {
      showMessage(
        "Verify token",
        "Your token is valid",
        "success"
      )
      setNewPasswordModal(true)
      dispatch(clearVerifyTokenStatus())
    }else if(authReducer.verifyTokenStatus === 'failed') {
      showMessage(
        "Verify token",
        authReducer.verifyTokenError,
        "error"
      )
      dispatch(clearVerifyTokenStatus())
    }
    
    return () => {
      dispatch(clearVerifyTokenStatus())
    } 
  },[authReducer.verifyTokenStatus])
  // const handleSubmit = async (values) => {
  //   setLoading(true)
  //   try {

  //     const response = await axios.post(`${API_ROOT}/api/v1/garage-sign-up`, {
  //       token: otp,
  //     })

  //     if(response.data.code === 200) {
  //       handleSubmit(true)
  //     }

  //     setLoading(false)
      

  //   } catch (error) {
  //     showMessage(
  //       "Sign up",
  //       error.response.data.message,
  //       "error"
  //     )
  //     setLoading(false)
  //   }
  // }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* login form */}
        <div className="flex flex-col justify-between py-10 items-center px-4">
          <nav className="w-full flex justify-center md:justify-start">
            <img src={Logo} alt="logo" className="" />
          </nav>

          <div
            className="w-full flex flex-col justify-center items-center"
            style={{ maxWidth: 440 }}
          >
            <div className="text-center mt-20 md:mt-1">
              <h2 className="heading-two font-montserrat text-center">
                AutoHyve
              </h2>
              <h2
                className="heading-two text-center font-montserrat"
                style={{ marginTop: -30 }}
              >
                Account Verification
              </h2>
              <h5 className="font-montserrat text-sm gray-color">
                We have send you four digit OTP to your registered phone number.
                Please enter the code within the next 5 minutes to complete the
                verification process.
              </h5>
            </div>

            <div className="otp-inputs flex gap-4 mt-8">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                inputType={"number"}
                renderSeparator={<span className="mr-3"> </span>}
                // renderInput={(props) => <input {...props} />}
                renderInput={(props) => <input {...props} />}
              />
            </div>

            <AppBtn
              title="Verify & Create Account"
              className={
                otp.length == 4
                  ? "btn btn-primary w-[80%] mt-10 md:mt-24 md:mb-10"
                  : "btn btn-primary disabled w-[80%] mt-10 md:mt-24 md:mb-10"
              }
              onClick={handleSubmit}
              spinner={authReducer.verifyTokenStatus === 'loading'}
            />
          </div>
        </div>

        {/* image slider */}
        <div className="verification_bg  hidden md:flex sticky top-0 flex-col justify-between py-24 items-center px-24">
          <div className="w-full flex justify-between items-center">
            <img src={Quote} alt="" />
            <hr style={{ borderWidth: 0.5, width: 100 }} />
          </div>

          <div>
            <p className="base-text text-white slider-text">
              The automobile has not merely taken over the street, it has
              dissolved the living tissue of the city. Its appetite for space is
              absolutely insatiable; moving and parked, it devours urban land,
              leaving the buildings as mere islands of habitable space in a sea
              of dangerous and ugly traffic.
            </p>

            <div className="w-full flex justify-between items-center mt-8">
              <p className="base-text primary-color">James Marston Fitch</p>

              <div className="nav-btns flex gap-8">
                <button className="nav-left-btn">
                  {/* <img src={ArrowLeft} alt="" /> */}
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1528 9.39062L5.54199 19.0015L15.1528 28.6123"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M32.458 19H5.81055"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <button className="nav-right-btn">
                  {/* <img src={ArrowRight} alt="" /> */}
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.8472 9.39062L32.458 19.0015L22.8472 28.6123"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.54195 19H32.1895"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <NewPasswordModal 
          newPasswordModal={newPasswordModal}
          setNewPasswordModal={setNewPasswordModal}
        />
      </div>
    </>
  );
};

export default Verification;
