import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { LuSettings2 } from 'react-icons/lu';
import { BsChevronDown } from 'react-icons/bs';

function YearPicker({ setSelectedYear }: any) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPageReloading, setIsPageReloading] = useState(false);
  const [isBackButtonClicked, setIsBackButtonClicked] = useState(false);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ITEM_HEIGHT = 48;

  const [years, setYears] = useState<any>([]);

  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const twoYearsAgo = currentYear - 2;
    const yearList: any = [];

    for (let year = currentYear; year >= twoYearsAgo; year--) {
      yearList.push(year);
    }

    return yearList;
  };

  useEffect(() => {
    setYears(generateYearList());
  }, []);

  const handleYearSelect = (year: any) => {
    setSelectedYear(year);
    setAnchorEl(null);
    sessionStorage.setItem('selectedYear', year);
  };

  useEffect(() => {
    // Check if the page is reloading
    const handleBeforeUnload = () => {
      setIsPageReloading(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check if the user clicks the back button
    const handlePopstate = () => {
      setIsBackButtonClicked(true);
    };

    window.addEventListener('popstate', handlePopstate);

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (isPageReloading) {
      sessionStorage.removeItem('selectedYear')
    }

    if (isBackButtonClicked) {
        sessionStorage.removeItem('selectedYear')
    }
  }, [isPageReloading, isBackButtonClicked]);


  return (
    <div>
      <div
        className={`border-[#CACACA] border-[1px] 
        cursor-pointer gap-2 flex p-3 relative py-4 
        rounded-2xl items-center w-[15%] flex justify-between`}
        onClick={handleClick}
      >
            <LuSettings2 />
            <span className="text-sm text-[#000]">
                {sessionStorage.getItem('selectedYear') || "Filter"}
            </span>
            <BsChevronDown color="#A5A5A5" />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {years.map((year: any) => (
          <MenuItem key={year} onClick={() => handleYearSelect(year)}>
            {year}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default YearPicker;

