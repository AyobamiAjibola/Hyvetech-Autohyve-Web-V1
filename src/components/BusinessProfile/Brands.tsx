import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import AppBtn from '../AppBtn/AppBtn';
import AppInput from '../AppInput/AppInput';
import { HiOutlineTrash } from 'react-icons/hi';
import { createPartnerSettingsAction } from '../../store/actions/partnerActions';
import useAppDispatch from '../../hooks/useAppDispatch';

interface IProps {
    brands: any;
    partner: any;
}

function Brands ({brands, partner}: IProps) {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            brands: brands
        },
        onSubmit: (values) => {
            handleSubmitForm(values)
        }
    })
    const values = formik.values;
    const setFieldValue = formik.setFieldValue;

    useEffect(() => {
        setFieldValue('brands', brands)
    },[brands])

    const removeBrand = (index: number) => {
        const newBrands = [...values.brands];
        newBrands.splice(index, 1);
      
        setFieldValue('brands', newBrands);
    };

    const addBrand = () => {
        const newBrand = {
          model: "",
          from: "",
          to: ""
        };
      
        const newBrands = [...values.brands, newBrand];
        setFieldValue('brands', newBrands)
    };

    const handleSubmitForm = (values: any) => {
        dispatch(createPartnerSettingsAction({
          partnerId: partner.id,
          data: {
            ...partner,
            brands: values
          }
        }))
      }

    return (
        <>
            <form
                autoComplete="off" autoCorrect="off"
                onSubmit={formik.handleSubmit}
            >
                <div className="p-5 md:p-14  hyvepay-setting rounded-3xl mt-14">
                    <div className="flex items-center justify-between">
                        <h5 className="font-bold font-montserrat">Brands</h5>
                        <AppBtn title="SAVE" className="font-medium hidden md:flex" />
                    </div>

                    {values?.brands?.length > 0 &&
                    values?.brands?.map((brand: any, index: number) => (
                        <div className="flex flex-col md:flex-row   mb-4 gap-4 w-full mt-5" key={index}>
                            <div className="w-full">
                                <AppInput
                                    hasPLaceHolder={true}
                                    placeholderTop={"Model"}
                                    placeholder={"Model"}
                                    className="bg-[#F5F5F5] border-[#F5F5F5]"
                                    name={`brands.${index}.model`}
                                    onChange={formik.handleChange}
                                    value={brand.model}
                                />
                            </div>
                            <div className="w-full">
                                <AppInput
                                    hasPLaceHolder={true}
                                    placeholderTop={"From"}
                                    placeholder={"From"}
                                    className="bg-[#F5F5F5] border-[#F5F5F5]"
                                    name={`brands.${index}.from`}
                                    onChange={formik.handleChange}
                                    value={brand.from}
                                />
                            </div>
                            <div className="w-full">
                                <AppInput
                                    hasPLaceHolder={true}
                                    placeholderTop={"To"}
                                    placeholder={"To"}
                                    className="bg-[#F5F5F5] border-[#F5F5F5]"
                                    name={`brands.${index}.to`}
                                    onChange={formik.handleChange}
                                    value={brand.to}
                                />
                            </div>
                            <button className="bg-red-500 h-[50px] w-32  items-center justify-center mt-6 rounded-lg hidden md:flex"
                                onClick={() => removeBrand(index)} type="button"
                              >
                                <HiOutlineTrash size={20} color="#fff" className="text-center" />
                            </button>
                        </div>
                    ))}
                    <AppBtn
                        title="Add New Brand"
                        onClick={addBrand}
                        type="button"
                    />
                </div>
            </form>
        </>
    )
} 

export default Brands;