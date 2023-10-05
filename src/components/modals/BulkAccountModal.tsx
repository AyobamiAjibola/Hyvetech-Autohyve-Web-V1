import React from 'react';
import { Add, Close, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import CloseIcon from "../../assets/svgs/close-circle.svg";
import { useState, useRef, useEffect } from 'react';
import BulkTransaction from '../../pages/auth/BulkTransfer/BulkTransaction';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { clearAccountHolderDetail } from '../../store/reducers/autoHyveReducer';

function BulkAccountModal({openBulkModal, setOpenBulkModal}: any) {
  const [tabs, setTabs] = useState(['Transfer 1']);
  const [activeTab, setActiveTab] = useState<any>('Transfer 1');
  const dispatch = useAppDispatch();
  const initialInputValues = tabs.reduce((acc: any, tab: any) => {
    acc[tab] = {
      accountNumber: "",
      bank: {
        label: "",
        value: "",
      },
      accountName: "",
      amount: "",
      narration: "",
      saveAsBeneficiary: false,
      nameEnquirySessionId: ""
    };
    return acc;
  }, {});
  const [inputValues, setInputValues] = useState<any>(initialInputValues);
  const state = useAppSelector((state) => state.autoHyveReducer);
 
  const tabsRef = useRef<any>(null);
  const scrollLeftRef = useRef<any>(null);
  const scrollRightRef = useRef<any>(null);

  // useEffect(() => {
  //   // Handle scrolling buttons' visibility based on scroll position
  //   if (tabsRef.current) {
  //     const container = tabsRef.current;
  //     scrollLeftRef.current.style.visibility =
  //       container.scrollLeft > 0 ? 'visible' : 'hidden';
  //     scrollRightRef.current.style.visibility =
  //       container.scrollLeft < container.scrollWidth - container.clientWidth
  //         ? 'visible'
  //         : 'hidden';
  //   }
  // }, [tabs]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  const handleAddTab = () => {
    const newTabIndex = tabs.length + 1;
    const newTabName = `Transfer ${newTabIndex}`;
    setTabs([...tabs, newTabName]);
    setActiveTab(newTabName);

    dispatch(clearAccountHolderDetail())
  
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [newTabName]: {
        accountNumber: "",
        bank: {
          label: "",
          value: "",
        },
        accountName: "",
        amount: "",
        narration: "",
        saveAsBeneficiary: false,
        nameEnquirySessionId: ""
      },
    }));
  };

  const handleDeleteTab = (tab: any) => {
    const updatedTabs = tabs.filter((t) => t !== tab);
    setTabs(updatedTabs);
  
    // Remove the tab's data from the inputValues state
    setInputValues((prevValues: any) => {
      const updatedInputValues = { ...prevValues };
      delete updatedInputValues[tab];
      return updatedInputValues;
    });
  
    // Automatically select the first tab if the active tab was deleted
    if (activeTab === tab) {
      setActiveTab(updatedTabs[0]);
    }
  };

  const handleScrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft -= 100; // Adjust the scroll amount as needed
    }
  };

  const handleScrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += 100; // Adjust the scroll amount as needed
    }
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [activeTab]: {
        ...prevValues[activeTab],
        [name]: value,
      },
    }));
  };

  const handleInputChangeSelect = (selectedOption: any) => {
    const name = 'bank'; 
  
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [activeTab]: {
        ...prevValues[activeTab],
        [name]: selectedOption,
      },
    }));
  };
  
  const handleInputChangeCheckBox = (e: any) => {
    const name = 'saveAsBeneficiary'; 
  
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [activeTab]: {
        ...prevValues[activeTab],
        [name]: e.target.checked
      },
    }));
  };

  const handleBeneficiaryInputChangeSelect = (selectedOption: any) => {
    const name = 'beneficiary'; 
  
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [activeTab]: {
        ...prevValues[activeTab],
        [name]: selectedOption,
      },
    }));
  };

  if (openBulkModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e: any) => {
    if (e.target.id === "modalWrapperId") {
      // setOpenSingleModal(!modal);
    }
  };

  const handleCloseModal = () => {
    const resetInputValues = { ...initialInputValues };
    const resetTabs = [tabs[0]];

    setInputValues(resetInputValues);
    dispatch(clearAccountHolderDetail());
    setTabs(resetTabs);
    setOpenBulkModal(false)
  };

  useEffect(() => {
    if(state.performBulkAccountTransferRequestStatus === 'completed') {
      const resetInputValues = { ...initialInputValues };
      const resetTabs = [tabs[0]];

      setInputValues(resetInputValues);
      dispatch(clearAccountHolderDetail());
      setTabs(resetTabs);
    }
  },[state.performBulkAccountTransferRequestStatus]);

  return (
    <>
      {openBulkModal && <div
        id="modalWrapperId"
        className="fixed top-0 inset-0 bg-black bg-opacity-70 flex justify-center items-center customModal"
        onClick={toggleModal}
      >
        <div
          className="bg-white p-2 relative w-[90%] md:w-[50%] xs:w-[30%] overflow-y-auto pb-5 xs:pb-2 xs:h-[80%] rounded-md"
          style={{ maxWidth: 600 }}
        >
          <div className="body">

            <div className="flex justify-end w-full">
              <button onClick={handleCloseModal}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>
            <div>
              <h5 className="text-center heading-five mb-5">
                Transfer Funds
              </h5>
            </div>

            <div className="flex items-center mb-2 justify-center">
              <IconButton onClick={handleScrollLeft} ref={scrollLeftRef} >
                <NavigateBefore />
              </IconButton>
              <div
                className="flex gap-2 overflow-x-auto w-[90%] mx-4 scrollbar-thin items-center"
                ref={tabsRef}
                style={{ maxWidth: 'calc(100% - 100px)' }}
              >
                {tabs.map((tab) => (
                  <div key={tab} className="cursor-pointer min-w-[6rem] flex items-center justify-center">
                    <span
                      className={`${
                        activeTab === tab
                          ? 'active-tab text-[#FAA21B]'
                          : ''
                      }`}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </span>
                    {tab !==  'Transfer 1' && <IconButton onClick={() => handleDeleteTab(tab)}
                      sx={{width: '1rem', height: '1rem', ml: 0.4}}
                    >
                      <Close sx={{fontSize: '13px'}} />
                    </IconButton>}
                  </div>
                ))}
                <IconButton onClick={handleAddTab}
                  disabled={!inputValues[activeTab].narration}
                  sx={{
                    backgroundColor: '#FAA21B',
                    '&:hover': {color: '#FAA21B'},
                    width: '1.3rem', 
                    height: '1.3rem', ml: 1
                  }}
                >
                  <Add sx={{fontSize: '14px'}}/>
                </IconButton>
              </div>
              <IconButton onClick={handleScrollRight} ref={scrollRightRef} >
                <NavigateNext />
              </IconButton>
            </div>
          <BulkTransaction
            activeTab={activeTab}
            inputValues={inputValues}
            setInputValues={setInputValues}
            handleInputChange={handleInputChange}
            handleInputChangeSelect={handleInputChangeSelect}
            handleBeneficiaryInputChangeSelect={handleBeneficiaryInputChangeSelect}
            setOpenBulkModal={setOpenBulkModal}
            handleInputChangeCheckBox={handleInputChangeCheckBox}
          />
        
          </div>
        </div>
      </div>}
    </>
  );
}

export default BulkAccountModal;
