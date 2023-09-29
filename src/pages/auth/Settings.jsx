import React, { useEffect, useRef, useState } from "react";

import DownloadIcon from "../../assets/svgs/download-icon.svg";
import SearchIcon from "../../assets/svgs/vuesax/linear/search-normal.svg";
import TrashIcon from "../../assets/svgs/vuesax/linear/trash.svg";
import AppBtn from "../../components/AppBtn/AppBtn";
import TabBtn from "../../components/TabBtn/TabBtn";
import AppInput from "../../components/AppInput/AppInput";
import AccountSettings from "../../components/AccountSettings/AccountSettings";
import { HiChevronDown } from "react-icons/hi";
import SingleSort from "../../components/SingleSort/SingleSort";
import DeleteModal from "../../components/modals/DeleteModal";
import AddRoleModal from "../../components/modals/AddRoleModal";
import AddUserModal from "../../components/modals/AddUserModal";
import ReadUserModal from "../../components/modals/ReadUserModal";
import EditRoleModal from "../../components/modals/EditRoleModal";
import AppSwitch from "../../components/AppSwitch/AppSwitch";
import { GrEdit } from "react-icons/gr";
import EditUserModal from "../../components/modals/EditUserModal";

const Settings = () => {
  const [deletemodal, setDeletemodal] = useState(false);
  const [addrolemodal, setAddrolemodal] = useState(false);
  const [addusermodal, setAddusermodal] = useState(false);
  const [readusermodal, setReadusermodal] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeDeleteModal = () => setDeletemodal(!deletemodal);

  const [openSort, setOpenSort] = useState(false);
  const dropdownRef = useRef(null);
  const [select, setSelect] = useState("Sort by");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="mb-20 mt-20 w-full mx-3">
        <div className="py-14 border-none rounded-3xl">
          <h5 className="font-bold font-montserrat mb-5">Roles</h5>
          <div className="flex items-center justify-between">
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center border-[1px] cursor-pointer border-[#CACACA] p-3 rounded-[20px] px-5"
                onClick={() => setOpenSort(!openSort)}
              >
                <span className="font-montserrat inline-block mr-2 font-medium ">
                  Sort by
                </span>
                <HiChevronDown size={20} />
              </div>
              {openSort && (
                <SingleSort
                  openSort={openSort}
                  setOpenSort={setOpenSort}
                  select={select}
                  setSelect={setSelect}
                />
              )}
            </div>

            <span
              onClick={() => setAddrolemodal(!addrolemodal)}
              className="flex items-center border-[1px] cursor-pointer border-[#CACACA] p-3 rounded-[20px] px-5"
            >
              ADD ROLE
            </span>
          </div>

          {/* TABLE */}

          <div className="flex justify-between mt-8 flex-wrap items-center">
            <div className="search w-full md:w-2/4 mb-3">
              <form action="">
                <div className="prepend">
                  <img src={SearchIcon} alt="" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 w-full md:w-2/3 searchInput"
                    style={{ border: 0 }}
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center font-montserrat text-sm gap-4 text-gray-500">
              Showing 12 results out of 56
            </div>
          </div>

          <div className="mt-4 mb-24" style={{ overflowX: "scroll" }}>
            <table
              border={1}
              style={{ borderRadius: 20, overflow: "clip" }}
            >
              <thead style={{ textAlign: "left" }}>
                <th className="font-montserrat text-center w-10">
                  <input type="checkbox" name="" id="" />
                </th>
                <th className="font-montserrat">ID</th>
                <th className="font-montserrat">Role Name</th>
                <th className="font-montserrat">Permission</th>
                <th className="font-montserrat w-10">Action</th>
              </thead>
              <tbody>
                <tr>
                  <td className="font-montserrat text-center">
                    <input type="checkbox" name="" id="" />
                  </td>
                  <td className="font-montserrat">13</td>
                  <td className="font-montserrat">Default</td>
                  <td className="font-montserrat">
                    delete_expense,view_analytics,read_customer
                  </td>
                  <td className="flex gap-3">
                    <GrEdit
                      size={18}
                      onClick={() => setEditRole(!editRole)}
                      className="cursor-pointer"
                    />

                    <button onClick={() => setDeletemodal(true)}>
                      <img src={TrashIcon} alt="" />
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="font-montserrat text-center">
                    <input type="checkbox" name="" id="" />
                  </td>
                  <td className="font-montserrat">16</td>
                  <td className="font-montserrat">Super</td>
                  <td className="font-montserrat">
                    delete_expense,view_analytics,read_customer
                  </td>
                  <td className="flex gap-3">
                    <GrEdit
                      size={18}
                      onClick={() => setEditRole(!editRole)}
                      className="cursor-pointer"
                    />

                    <button onClick={() => setDeletemodal(true)}>
                      <img src={TrashIcon} alt="" />
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="font-montserrat text-center">
                    <input type="checkbox" name="" id="" />
                  </td>
                  <td className="font-montserrat">9</td>
                  <td className="font-montserrat">Test</td>
                  <td className="font-montserrat">
                    delete_expense,view_analytics,read_customer
                  </td>
                  <td className="flex gap-3">
                    <GrEdit
                      size={18}
                      onClick={() => setEditRole(!editRole)}
                      className="cursor-pointer"
                    />

                    <button onClick={() => setDeletemodal(true)}>
                      <img src={TrashIcon} alt="" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between mt-4 ">
              <button className="flex gap-1 btn btn-secondary">
                <img
                  src={DownloadIcon}
                  className="mr-3 font-montserrat"
                  alt=""
                />
                Export Items
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h5 className="heading-five block mb-4">User</h5>

            <div className="flex justify-center gap-3 items-center">
              {/* <AppBtn
                className="btn-secondary"
                title="READ USER"
                onClick={() => setReadusermodal(!readusermodal)}
              /> */}
              <AppBtn
                className="btn-secondary"
                title="ADD USER"
                onClick={() => setAddusermodal(!addusermodal)}
              />
            </div>
          </div>

          {/* TABLE */}

          <div className="flex justify-end mt-8 flex-wrap items-center">
            <div className="search w-full md:w-2/4 mb-3"></div>

            <div className="flex items-center font-montserrat text-sm gap-4 text-gray-500">
              Showing 12 results out of 56
            </div>
          </div>

          <div className="mt-4" style={{ overflowX: "scroll" }}>
            <table
              border={1}
              style={{ borderRadius: 20, overflow: "clip" }}
            >
              <thead style={{ textAlign: "left" }}>
                <th className="font-montserrat text-center w-10">
                  <input type="checkbox" name="" id="" />
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  ID
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  Full Name
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  Email
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  Role
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  Status
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  Phone Number
                </th>
                <th className="font-montserrat text-xs font-semibold">
                  Action
                </th>
              </thead>
              <tbody>
                <tr>
                  <td className="font-montserrat text-center">
                    <input type="checkbox" name="" id="" />
                  </td>
                  <td className="font-montserrat">13</td>
                  <td className="font-montserrat">David James</td>
                  <td className="font-montserrat">demo@myautohyve.com</td>
                  <td className="font-montserrat">Garage Admin Role</td>
                  <td className="font-montserrat">
                    <span
                      className="py-2 bg-gray-300 px-4"
                      style={{ borderRadius: 10 }}
                    >
                      Inactive
                    </span>
                  </td>
                  <td className="font-montserrat">08144246273</td>
                  <td className="flex items-center gap-3">
                    <GrEdit
                      size={18}
                      onClick={() => setEditUser(!editUser)}
                      className="cursor-pointer"
                    />

                    <AppSwitch />

                    <button onClick={() => setDeletemodal(true)}>
                      <img src={TrashIcon} alt="" className="w-[22px]" />
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="font-montserrat text-center">
                    <input type="checkbox" name="" id="" />
                  </td>
                  <td className="font-montserrat">16</td>
                  <td className="font-montserrat">Mr Ejike Emmanuel</td>
                  <td className="font-montserrat">demo@myautohyve.com</td>
                  <td className="font-montserrat">Garage Admin Role</td>
                  <td className="font-montserrat">
                    <span
                      className="py-2 bg-primary px-4"
                      style={{ borderRadius: 10 }}
                    >
                      Active
                    </span>
                  </td>
                  <td className="font-montserrat">08144246273</td>
                  <td className="flex items-center gap-3">
                    <GrEdit
                      size={18}
                      onClick={() => setEditUser(!editUser)}
                      className="cursor-pointer"
                    />

                    <AppSwitch />

                    <button onClick={() => setDeletemodal(true)}>
                      <img src={TrashIcon} alt="" className="w-[22px]" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button className="flex gap-1 btn btn-secondary">
                <img
                  src={DownloadIcon}
                  className="mr-3 font-montserrat"
                  alt=""
                />
                Export Items
              </button>
            </div>
          </div>
        </div>
        
      </div>

      <DeleteModal
        deletemodal={deletemodal}
        title={"Are you sure you want to delete this User?"}
        description=""
        closeDeleteModal={closeDeleteModal}
      />

      <AddRoleModal
        addrolemodal={addrolemodal}
        title={"Add Role"}
        description=""
        setAddrolemodal={setAddrolemodal}
      />

      <AddUserModal
        addusermodal={addusermodal}
        title={"Add User"}
        description=""
        setAddusermodal={setAddusermodal}
      />

      <ReadUserModal
        readusermodal={readusermodal}
        title={"Read Users"}
        description=""
        setReadusermodal={setReadusermodal}
      />

      <EditUserModal
        editUser={editUser}
        setEditUser={setEditUser}
        title={"Edit User"}
      />

      <EditRoleModal editRole={editRole} setEditRole={setEditRole} />
    </>
  );
};

export default Settings;
