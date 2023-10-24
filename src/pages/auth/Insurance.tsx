import React from 'react';
import DashboardWrapper from '../../components/DashboardWrapper/DashboardWrapper';
import loading from '../../assets/images/loading.jpeg';

function Insurance () {
    return (
        <DashboardWrapper>
            <div className='flex justify-center items-center flex-col'>
                <div className='flex justify-center font-montserrat font-bold text-xl text-center'>
                    Resell insurance to your customers. <br/>
                    Coming Soon
                </div>
                <img
                    src={ loading }
                    alt="loading"
                    className="w-[400px] h-[400px] rounded-full" 
                />
            </div>
            
        </DashboardWrapper>
    )
}

export default Insurance;