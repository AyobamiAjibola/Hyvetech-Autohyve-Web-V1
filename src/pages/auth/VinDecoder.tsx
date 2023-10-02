import React, { useEffect, useRef, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getVehicleVINAction } from '../../store/actions/vehicleActions';
import useAppSelector from '../../hooks/useAppSelector';
import { SearchAppBtn } from '../../components/AppBtn/AppBtn';
import { SearchAppInput } from '../../components/AppInput/AppInput';
import { showMessage } from '../../helpers/notification';
import { formatCamelCase } from '../../utils/generic';
import { BASIC_VEHICLE_INFO, ENGINE, MANUFACTURER, VEHICLE_SETUP } from '../../config/constants';

function VinDecoder () {
    const [vin, setVin] = useState<string>('');
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.vehicleReducer)

    const handleVin = () => {
        dispatch(getVehicleVINAction(vin))
    }

    useEffect(() => {
        if(state.getVehicleVINStatus === 'failed') {
            showMessage(
                "VIN error",
                state.getVehicleVINError,
                "error"
            );
        }
    },[state.getVehicleVINStatus]);

    const tableRef = useRef(null);

    useEffect(() => {
        if (state.vehicleVINDetails && tableRef.current) {
            //@ts-ignore
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [state.vehicleVINDetails]);

    const basicInfo = state.vehicleVINDetails.filter((detail: any) => BASIC_VEHICLE_INFO.includes(detail.label));
    const engine = state.vehicleVINDetails.filter((detail: any) => ENGINE.includes(detail.label));
    const manufacturer = state.vehicleVINDetails.filter((detail: any) => MANUFACTURER.includes(detail.label));
    const vehicleSetup = state.vehicleVINDetails.filter((detail: any) => VEHICLE_SETUP.includes(detail.label));

    return (
        <React.Fragment>
            <div className="md:mt-25 w-full flex justify-center align-center flex-col">
                <div className={`flex flex-col w-full h-screen justify-center mt-[-2rem]
                    items-center mb-5 bg-[#DFDFDF] border radius-[20px]`}
                >
                    <span className='font-montserrat md:text-[2.5rem] text-[2rem] md:my-3 font-bold mt-[-10rem] mb-[1rem] md:mb-[10px]'>VIN Decoder</span>
                    <span className='font-montserrat text-sm mb-1'>Enter your Vehicle Identification Number (VIN)</span>
                    <span className='font-montserrat text-sm mb-4 text-center'>to access detailed information about your vehicle.</span>
                    <div className='flex flex-row md:w-[40%] w-[80%] justify-center align-center py-10'>
                        <SearchAppInput
                            placeholder={'Enter 17-character VIN number'}
                            hasPLaceHolder
                            className=''
                            onChange={(e: any) => setVin(e.target.value.toUpperCase())}
                        />
                        <SearchAppBtn
                            title={'Search'}
                            className="h-[55px]"
                            onClick={handleVin}
                            spinner={state.getVehicleVINStatus === 'loading'}
                        />
                        
                    </div>
                    
                </div>
                {state.vehicleVINDetails.length !== 0 &&
                   ( <div ref={tableRef}>
                        <table className="table-fixed w-full">
                            <thead className="w-[100%]">
                                <span className='font-montserrat px-4 md:text-[1.5rem] xs:text-[14px] font-bold'>Basic Vehicle Information</span>
                            </thead>
                            <tbody>
                                {basicInfo.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="w-1/3 font-semibold md:text-[14px] xs:text-[12px]">{formatCamelCase(item.label)}</td>
                                        <td className="w-2/3 md:text-[14px] xs:text-[12px]">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <thead className="w-3/3 pt-3 pb-6 ">
                                <span className='font-montserrat pl-4 md:text-[1.5rem] xs:text-[14px] font-bold md:text-[1.5rem] xs:text-[14px]' >Engine</span>
                            </thead>
                            <tbody>
                                {engine.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="w-1/3 font-semibold  md:text-[14px] xs:text-[12px]">{formatCamelCase(item.label)}</td>
                                        <td className="w-2/3  md:text-[14px] xs:text-[12px]">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <thead className="w-3/3 pt-3 pb-6 ">
                                <span className='font-montserrat xs:text-[14px] pl-4 md:text-[1.5rem] font-bold'>Manufacturer</span>
                            </thead>
                            <tbody>
                                {manufacturer.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="w-1/3 font-semibold text-[14px] md:text-[14px] xs:text-[12px]">{formatCamelCase(item.label)}</td>
                                        <td className="w-2/3 md:text-[14px] xs:text-[12px]">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <thead className="w-3/3 pt-3 pb-6 ">
                                <span className='font-montserrat xs:text-[14px] pl-4 md:text-[1.5rem] font-bold'>Vehicle Setup</span>
                            </thead>
                            <tbody>
                                {vehicleSetup.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="w-1/3 font-semibold md:text-[14px] xs:text-[12px]">{formatCamelCase(item.label)}</td>
                                        <td className="w-2/3 md:text-[14px] xs:text-[12px]">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>)
                }
            </div>
            
        </React.Fragment>
    )
}

export default VinDecoder;