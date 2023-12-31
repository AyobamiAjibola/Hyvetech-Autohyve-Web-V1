import React, { useContext, useEffect, useMemo, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import "../../../assets/css/layout.css";
import hyvePay from "../../../assets/images/Hypelogo.png";
import HyveIcon from "../../../assets/images/hyvBlackLogo.png";
import logoutLogo from "../../../assets/images/logoutLogo.png";
import support from "../../../assets/svgs/support.svg";
import feedback from "../../../assets/svgs/feedback.svg";
import ArrowCircleLeft from "../../../assets/svgs/arrowcircleleft.svg";
import ArrowCircleRight from "../../../assets/svgs/arrowcircleRight.svg";
import { Link, NavLink, useLocation, useMatch, useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import LogoutModal from "../../../components/modals/LogoutModal";
import { sidebarItemsCooperate, sidebarItemsIndividual, subSidebarItems } from "../../../contsants/sidebar";
import workshopIcon from "../../../assets/svgs/workshopIcon.svg";
import { Add, KeyboardArrowDown, KeyboardArrowUp, Remove } from "@mui/icons-material";
import jwt_decode from "jwt-decode";
import settings from "../../../config/settings";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { setAction } from "../../../store/reducers/vehicleReducer";
import { Divider } from "@mui/material";

const Sidebar = ({ show, setShow, openNav, setOpenNav, active, setActive }) => {
  const navigation = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);
  // const [active, setActive] = useState(localStorage?.getItem("active"));
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const token = useMemo(() => sessionStorage.getItem(settings.auth.admin), []);
  const [accountType, setAccountType] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (active != 0) {
      localStorage.setItem("active", active);
    }
  }, [active]);

  //**** USE THIS WHEN WE DECIDE ON HOME PAGE */
  // useEffect(() => {
  //   if(location.pathname === '/dashboard') { // THIS SHOULD BE /home ONCE WE DECIDE
  //     localStorage.setItem("active", "Dashboard");
  //   }
  // }, []);

  const openWhatsAppChat = () => {
    const phoneNumber = "2349167934817"
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    window.open(whatsappURL);
  };

  useEffect(() => {
    if(location.pathname === '/vin-decoder') {
      localStorage.setItem("active", "VIN Decoder");
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if(token) {
      const payload = jwt_decode(token);
      setAccountType(payload.accountType)
    }
  },[token]);

  return (
    <>
      <div
        className={`side-navbar  ${openNav ? "show-mobile" : null} relative ${
          show ? "small-sidebar" : null
        } `}
      >
        <div className="shortcut-links">
          <Link to="/vin-decoder" className="flex items-center pl-[10px]">
            <img
              src={hyvePay}
              alt="autohyve-logo"
              className={show ? "small-logo" : "logo-img "}
            />
            <span
              className={`heading-five ml-4 font-montserrat text-white ${
                show ? "item-text" : null
              } `}
            >
              AutoHyve
            </span>
          </Link>

          {/* <div
            onClick={() => setShow(!show)}
            className="flex top-20 text-center ml-30 justify-center items-center rounded-full  cursor-pointer  w-[30px] h-[30px] bg-slate-500 md:flex"
          >
            <BiChevronLeft color="#fff" size={25} />
          </div> */}

          <img
            src={!show ? ArrowCircleLeft : ArrowCircleRight}
            alt=""
            className="absolute top-20 -right-2.5 cursor-pointer  w-[30px] md:block hidden"
            onClick={() => setShow(!show)}
            style={{ zIndex: 9999 }}
          />

          <VscChromeClose
            color="#fff"
            className="md:hidden block absolute top-3  right-3 cursor-pointer"
            size={20}
            onClick={() => setOpenNav(!openNav)}
          />

          <div className="mt-14 flex flex-col gap-5">
            {accountType === "cooperate" || accountType === null 
              ? (
                sidebarItemsCooperate.map((item, index) => {
                  return (
                    <NavLink
                      to={item.path}
                      key={index}
                      className={`flex items-center mb-2 font-montserrat text-white cursor-pointer ${
                        item.name === active ? "active" : null
                      }`}
                      onClick={() => {
                        setActive(item.name);
                        setOpenNav(false);
                      }}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        style={{ height: 27, width: 24 }}
                        className="ml-5"
                      />
                      <span
                        className={`ml-4 font-montserrat text-sm text-white ${
                          show ? "item-text" : null
                        } `}
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })
              ) 
              : (
                sidebarItemsIndividual.map((item, index) => {
                  return (
                    <NavLink
                      to={item.path}
                      key={index}
                      className={`flex items-center mb-2 font-montserrat text-white cursor-pointer ${
                        item.name === active ? "active" : null
                      }`}
                      onClick={() => {
                        setActive(item.name);
                        setOpenNav(false);
                      }}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        style={{ height: 27, width: 24 }}
                        className="ml-5"
                      />
                      <span
                        className={`ml-4 font-montserrat text-sm text-white ${
                          show ? "item-text" : null
                        } `}
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })
              )
            }

            {accountType === "cooperate" || accountType === null ? (<div>
              <div
                className={`flex items-center font-montserrat text-white cursor-pointer ${showDropdown ? 'mb-4' : 'mb-[-20px]'}`}
                onClick={toggleDropdown}
              >
                <img
                  src={workshopIcon}
                  alt=""
                  style={{ height: 27, width: 24 }}
                  className="ml-5"
                />
                <span
                  className={`ml-4 font-montserrat text-sm text-white`}
                >
                  {!show
                    ? 'Workshop' 
                    : ''} &nbsp; &nbsp;
                </span>
                {showDropdown ? <KeyboardArrowUp sx={{fontSize: '20px'}} /> : <KeyboardArrowDown sx={{fontSize: '20px'}} />}
              </div>

              <div className={`${showDropdown && 'bg-[#5B5B5B]'} py-4`}>
                {showDropdown && (
                  subSidebarItems.map((item, index) => {
                    return (
                      <NavLink
                        to={item.path}
                        key={index}
                        className={`flex items-center mb-5 font-montserrat text-white  cursor-pointer ${
                          index === active ? "active" : null
                        }`}
                        onClick={() => {
                          setActive(item.name);
                          setOpenNav(false);
                        }}
                      >
                        <img
                          src={item.icon}
                          alt=""
                          style={{ height: 23, width: 20 }}
                          className="ml-7"
                        />
                        <span
                          className={` ml-2 font-montserrat text-[12px] text-white ${
                            show ? "item-text" : null
                          } `}
                        >
                          {item.name}
                        </span>
                      </NavLink>
                    );
                  })
                )}
              </div>
            </div>) : <div></div>}

            <Divider sx={{backgroundColor: '#808080'}} />
            <div
              onClick={openWhatsAppChat}
              className="flex items-center font-montserrat mb-2 text-white pl-[10px] cursor-pointer"
            >
              <img
                src={support}
                alt="contact support"
                style={{ height: 27, width: 30 }}
                className="ml-2"
              />

              <span
                className={` ml-5 font-montserrat text-xs text-white ${
                  show ? "item-text" : null
                } `}
              >
                Support
              </span>
            </div>
            <div
              onClick={openWhatsAppChat}
              className="flex items-center font-montserrat mb-2 text-white pl-[10px] cursor-pointer"
            >
              <img
                src={feedback}
                alt="feedback"
                style={{ height: 27, width: 30 }}
                className="ml-2"
              />

              <span
                className={` ml-5 font-montserrat text-xs text-white ${
                  show ? "item-text" : null
                } `}
              >
                Feedback
              </span>
            </div>

            <Divider sx={{backgroundColor: '#808080'}} />
            <div
              onClick={() => setLogoutModal(!logoutModal)}
              className="flex items-center font-montserrat mb-10 text-white pl-[10px] cursor-pointer"
            >
              <img
                src={logoutLogo}
                alt=""
                style={{ height: 27, width: 30 }}
                className="ml-2"
              />

              <span
                className={` ml-5 font-montserrat text-white ${
                  show ? "item-text" : null
                } `}
              >
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal logoutModal={logoutModal} setLogoutModal={setLogoutModal} />
    </>
  );
};

export default Sidebar;
