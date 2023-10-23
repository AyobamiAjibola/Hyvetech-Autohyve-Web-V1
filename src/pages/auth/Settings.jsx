import React, { useCallback, useEffect, useRef, useState } from "react";
import DownloadIcon from "../../assets/svgs/download-icon.svg";
import SearchIcon from "../../assets/svgs/vuesax/linear/search-normal.svg";
import TrashIcon from "../../assets/svgs/vuesax/linear/trash.svg";
import AppBtn from "../../components/AppBtn/AppBtn";
import TabBtn from "../../components/TabBtn/TabBtn";
import AppInput from "../../components/AppInput/AppInput";
import AccountSettings from "../../components/BusinessProfile/BusinessProfile";
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
import {getPermissionsActions, getRoleActions, getUsersAction, updateUserStatusAction } from "../../store/actions/userActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import AddUserModall from "../../components/modals/AddUserModalOld";
import UserAppSwitch from "../../components/AppSwitch/UserAppSwitch";
import { Edit, ToggleOff, ToggleOn } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { clearCreateUserStatus, clearUpdateStatusUserStatus } from "../../store/reducers/userReducer";
import useAdmin from "../../hooks/useAdmin";
import { showMessage } from "../../helpers/notification";

const Settings = () => {
  const [deletemodal, setDeletemodal] = useState(false);
  const [addrolemodal, setAddrolemodal] = useState(false);
  const [addusermodal, setAddusermodal] = useState(false);
  const [readusermodal, setReadusermodal] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch()
  const store = useAppSelector(item => item.userReducer);
  const [permissions, setPermissions] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [roleId, setRoleId] = useState(-1);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(-1);
  const [role, setRole] = useState("");
  const [delId, setDelId] = useState(-1);

  const getUsers = useCallback(() => {
    dispatch(getUsersAction());
    dispatch(getPermissionsActions());
    dispatch(getRoleActions());
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

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

  const handleRoleEdit = (role) => {
    setRoleName(role.name);
    setEditMode(true);
    setRoleId(role.id);
    setPermissions(role.permissions.map(item => item.name));

    // setShowCreateRole(true);
  };

  const handleOnEditUser = (user) => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRoleId(user.roles[0]?.id);
    setRole(user.roles[0].name)
    setPhone(user.phone);
    // setShowCreateUser(true);
    setEditMode(true);
    setUserId(user.id);
  };

  const parsePhone = (phone) => {
    if (!phone) {
      return "";
    }

    if (phone.startsWith("234")) return phone.replace("234", "0");

    return phone;
  };

  const handleDisableUser = (user) => {
    setEditMode(true);
    dispatch(updateUserStatusAction({userId: user.id}));
  };

  useEffect(() => {
    if(store.updateStatusUserStatus === 'completed') {
      dispatch(getUsersAction())
    } else if (store.updateStatusUserStatus === 'failed') {
      showMessage(
        "",
        store.updateStatusUserError,
        "error"
      )
    }

    return () => {
      dispatch(clearUpdateStatusUserStatus());
    }
  },[store.updateStatusUserStatus]);

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
              onClick={() => setEditRole(!addrolemodal)}
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
              {store.roles.map((role, index) => {
                return (
                  <tbody key={role.id}>
                    <tr>
                      <td className="font-montserrat text-center">
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td className="font-montserrat">{role.id}</td>
                      <td className="font-montserrat">{role.name}</td>
                      <td className="font-montserrat max-w-2xl px-4 py-2 whitespace-normal break-words">
                        {role.permissions.map(item => item.name).join(', ')}
                      </td>
                      <td className="flex gap-3">
                        <GrEdit
                          size={18}
                          onClick={() => {
                            setEditRole(!editRole)
                            handleRoleEdit(role)
                          }}
                          className="cursor-pointer"
                        />

                        <button onClick={() => setDeletemodal(true)}>
                          <img src={TrashIcon} alt="" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                )
              })
              }
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
              <AppBtn
                className="btn-secondary"
                title="ADD USER"
                onClick={() => {setAddusermodal(!addusermodal), setShowPassword(true)}}
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
                {store.users.map((user, index) => {
                  return (
                    <tr key={user.id}>
                      <td className="font-montserrat text-center">
                        <input type="checkbox" name="" id="" />
                      </td>
                      <td className="font-montserrat">{user.id}</td>
                      <td className="font-montserrat">{user.firstName} {user.lastName}</td>
                      <td className="font-montserrat">{ user.email }</td>
                      <td className="font-montserrat">{user.roles[0].name}</td>
                      <td className="font-montserrat">
                        <span
                          className={`py-2 ${!user.active ? 'bg-gray-300' : 'bg-[#FAA21B]'}  px-4`}
                          style={{ borderRadius: 10 }}
                        >
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="font-montserrat">{parsePhone(user.phone)}</td>
                      <td className="flex items-center gap-1 justify-center">
                        <GrEdit
                          size={15}
                          onClick={() => {
                            setAddusermodal(!addusermodal)
                            handleOnEditUser(user)
                          }}
                          className="cursor-pointer"
                        />
                        <IconButton
                          onClick={() => handleDisableUser(user)}
                        >
                          {user.active 
                            ? <ToggleOn
                                color="success" 
                                sx={{fontSize: '24px', color: "#FAA21B"}} 
                              /> 
                            : <ToggleOff
                                color="warning" 
                                sx={{fontSize: '24px', color: "#424242"}} 
                              />}
                        </IconButton>

                        {/* <button onClick={() => {setDeletemodal(true), setDelId(user.id)}}>
                          <img src={TrashIcon} alt="" className={`w-[20px] `} />
                        </button> */}
                      </td>
                    </tr>
                  )
                })}
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
        delId={delId}
        setDelId={setDelId}
        setDeletemodal={setDeletemodal}
      />

      <AddUserModal
        addusermodal={addusermodal}
        setAddusermodal={setAddusermodal}
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        email={email}
        roleId={roleId}
        password={password}
        setPassword={setPassword}
        store={store}
        setRole={setRole}
        roleName={role}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        setPhone={setPhone}
        editMode={editMode}
        setEditMode={setEditMode}
        userId={userId}
        setUserId={setUserId}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <EditRoleModal
        editRole={editRole}
        setEditRole={setEditRole}
        permissions={permissions}
        roleName={roleName}
        store={store}
        setRoleName={setRoleName}
        setPermissions={setPermissions}
        editMode={editMode}
        roleId={roleId}
        setRoleId={setRoleId}
        setEditMode={setEditMode}
        setAddrolemodal={setAddrolemodal}
        addrolemodal={addrolemodal}
      />
    </>
  );
};

export default Settings;
