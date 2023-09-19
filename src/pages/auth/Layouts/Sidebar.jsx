import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import "../../../assets/css/layout.css";
import hyvePay from "../../../assets/images/Hypelogo.png";
import HyveIcon from "../../../assets/images/hyvBlackLogo.png";
import logoutLogo from "../../../assets/images/logoutLogo.png";
import ArrowCircleLeft from "../../../assets/svgs/arrowcircleleft.svg";
import { Link, NavLink, useMatch, useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import LogoutModal from "../../../components/modals/LogoutModal";
import { sidebarItems } from "../../../contsants/sidebar";

const Sidebar = ({ show, setShow, openNav, setOpenNav }) => {
  const navigation = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);
  const [active, setActive] = useState(localStorage?.getItem("active"));

  useEffect(() => {
    if (active != 0) {
      localStorage.setItem("active", active);
    }
  }, [active]);

  useEffect(() => {
    localStorage.setItem("active", 0);
  }, []);

  return (
    <>
      <div
        className={`side-navbar  ${openNav ? "show-mobile" : null} relative ${
          show ? "small-sidebar" : null
        } `}
      >
        <div className="shortcut-links">
          <Link to="/dashboard" className="flex items-center pl-[10px]">
            <img
              src={hyvePay}
              alt=""
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
            src={ArrowCircleLeft}
            alt=""
            className="absolute top-20 -right-3 cursor-pointer  w-[30px] md:block hidden"
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
            {sidebarItems.map((item, index) => {
              return (
                <NavLink
                  to={item.path}
                  key={index}
                  className={`flex items-center mb-2 font-montserrat text-white  cursor-pointer ${
                    index === active ? "active" : null
                  }`}
                  onClick={() => {
                    setActive(index);
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
                    className={` ml-4 font-montserrat text-sm text-white ${
                      show ? "item-text" : null
                    } `}
                  >
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

            <hr />
            <div
              onClick={() => setLogoutModal(!logoutModal)}
              className="flex items-center font-montserrat  mb-10 text-white pl-[10px] cursor-pointer"
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
