import AppBtn from "../../components/AppBtn/AppBtn";
import AppInput from "../../components/AppInput/AppInput";

function HyvePaySecurity () {
    return (
        <>
            <div className="p-5 md:p-14 hyvepay-setting rounded-3xl">
                <h5 className="font-bold font-montserrat">AutoHyve Pin</h5>
                <p className="font-montserrat">
                  Please set your password for AutoHyve
                </p>

                <div className="mt-10 ">
                  <div className="flex flex-col md:flex-row rounded-none gap-4 w-full">
                    <div className="w-full relative">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop="AutoHyve Pin"
                        placeholder="Enter a pin for your HyvePay account"
                        className="bg-[#F5F5F5] border-[#F5F5F5]"
                      />
                      <small className="absolute font-montserrat top-[85px] text-[#A5A5A5]">
                        Your pin must be minimum of 4 digits
                      </small>
                    </div>

                    <div className="w-full relative">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop="Confirm AutoHyve Pin"
                        placeholder="Enter a pin for your HyvePay account"
                        className="bg-[#F5F5F5] border-[#F5F5F5]"
                      />
                      <small className="absolute font-montserrat top-[85px] text-[#A5A5A5]">
                        Your pin must be minimum of 4 digits
                      </small>
                    </div>
                  </div>

                  <div className="md:w-[50%] w-full mt-14 relative">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="AutoHyve Account Password"
                      placeholder="Enter your AutoHyve account password"
                      className="bg-[#F5F5F5] border-[#F5F5F5]"
                    />
                    <small className="absolute font-montserrat top-[85px] text-[#A5A5A5]">
                      Your pin must be minimum of 4 digits
                    </small>
                  </div>

                  <div className="flex justify-end ">
                    <AppBtn
                      title="submit"
                      className="font-medium uppercase mt-5"
                    />
                  </div>
                </div>
              </div>
        </>
    )
}