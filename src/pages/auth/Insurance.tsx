import React, { useEffect, useState } from 'react';
import DashboardWrapper from '../../components/DashboardWrapper/DashboardWrapper';
// import loading from '../../assets/images/loading.jpeg';
import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import useAdmin from '../../hooks/useAdmin';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getUserAction } from '../../store/actions/userActions';
import { showMessage } from '../../helpers/notification';

const API_ROOT = settings.api.rest;

function Insurance () {
    const [yes, setYes] = useState<boolean>(false);
    const [no, setNo] = useState<boolean>(false);
    const {user} = useAdmin();
    const dispatch = useAppDispatch()

    const vote = yes ? 'yes' : no ? 'no' : ''

    const handleVote = async () => {
        const response = await axiosClient.post(`${API_ROOT}/vote`, { vote: vote });
        if(response.data.code === 200) {
            dispatch(getUserAction(user?.id as number));
            showMessage('', response.data.message, 'success')
        }
    }

    useEffect(() => {
        if(yes || no) {
            handleVote()
        }

        return () => {
            setNo(false)
            setYes(false)
        }
    },[yes, no]);

    return (
        <DashboardWrapper>
            <div className='flex justify-center items-center flex-col'>
                <div className='flex justify-center font-montserrat font-bold md:text-xl text-sm text-center md:w-[50%] w-[100%] mb-8'>
                    How would you like to resell auto insurance to customers, and make a percentage of their premium for every sale:
                </div>

                <div className='flex flex-col gap-6 justify-center items-center w-full'>
                    <div className="flex items-center gap-3 w-[80%] md:w-[30%] justify-center">
                        <div onClick={user?.partner?.upVote === null ? () => setYes(!yes) : undefined} 
                            className={`w-[10%] ${user?.partner?.upVote === null ? 'cursor-pointer' : 'cursor-arrow'} `}
                        >
                        {user?.partner?.upVote === 'yes' ? (
                            <div className="w-[20px] h-[18px] flex items-center justify-center border-[green] border-[1px] rounded-[5px]">
                            <div className="w-[15px] h-[15px] rounded-[6px] bg-[green] border-[1px]"></div>
                            </div>
                        ) : (
                            <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                        )}
                        </div>
                        <span className="font-montserrat font-medium text-sm w-[90%]">
                          Yes, I would love it!
                        </span>
                    </div>
                    <div className="flex items-center gap-3 w-[80%] md:w-[30%]">
                        <div onClick={user?.partner?.upVote === null ? () => setNo(!no) : undefined} 
                            className={`w-[10%] ${user?.partner?.upVote === null ? 'cursor-pointer' : 'cursor-arrow'} `}
                        >
                        {user?.partner?.upVote === 'no' ? (
                            <div className="w-[20px] h-[18px] flex items-center justify-center border-[green] border-[1px] rounded-[5px]">
                            <div className="w-[15px] h-[15px] rounded-[6px] bg-[green] border-[1px]"></div>
                            </div>
                        ) : (
                            <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                        )}
                        </div>
                        <span className="font-montserrat font-medium text-sm w-[90%]">
                            No, I wouldn't be interested
                        </span>
                    </div>
                </div>
                {/* <img
                    src={ loading }
                    alt="loading"
                    className="w-[400px] h-[400px] rounded-full" 
                /> */}

            </div>
            
        </DashboardWrapper>
    )
}

export default Insurance;