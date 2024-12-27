import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


const VerifyEmail = () => {
    const [otp, setOtp] = useState<string[]>(["","","","","",""]);

    const inputRef = useRef<any>([]);
    const navigate = useNavigate();
    const {loading,verifyEmail} = useUserStore();

   

    const handleChange = (index:number,value:string)=>{
        const myOtp = [...otp];
        if(/^[a-zA-Z0-9]$/.test(value) || value === "" ){
            myOtp[index] = value;
            setOtp(myOtp)
        }
        // move to the next input field
        if(value !== "" && index < 5){

            inputRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index:number,e:React.KeyboardEvent<HTMLInputElement>)=>{

           if(e.key == "Backspace" && !otp[index] && index > 0){
                inputRef.current[index - 1].focus()
           } 
    };

    const submitHandler = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const verificationCode : string = otp.join("")
        
        try {
            await verifyEmail(verificationCode);
            navigate("/") 
        } catch (error) {
            console.log(error);
            
        }
        
    }

  return (
    <div className="h-screen w-full flex justify-center items-center">
       <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10
       border border-gray-400">
        <div className="text-center">
            <h1 className="text-2xl font-bold my-2">Verify Your Email</h1>
            <p className="capitalize text-sm text-gray-700">Enter the 6 digit code sent to the your Email Address</p>
        </div>
            <form onSubmit={submitHandler}>
                <div className=" flex justify-between">
                    {
                        otp.map((letter:string,index:number)=>(
                            <input 
                            key={index}
                            className="border border-gray-500 mx-1 w-10 h-10 md:w-12 md:h-12 rounded-md text-center
                            text-sm md:text-2xl font-normal md:font-semibold focus:outline-none focus:ring-2"
                            maxLength={1}
                            ref={(curr)=> (inputRef.current[index]= curr) }
                            onChange={(e:React.ChangeEvent<HTMLInputElement>)=> handleChange(index,e.target.value)}
                            onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>)=> handleKeyDown(index,e) }
                            value={letter}
                            type="text" />
                        ))
                    }
                </div>
                {
                    loading ? (
                        <Button className="bg-green-600 hover:bg-green-500 mt-6 w-full text-lg">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin"/>Please Wait </Button>
                    )
                    :(
                        <Button className="bg-green-600 hover:bg-green-500 mt-6 w-full text-lg">
                        Verify
                        </Button>
                    )
                }
               
            </form>
       </div>
    </div>
  )
}

export default VerifyEmail;
