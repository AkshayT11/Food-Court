import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";


import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// type LoginInputState = {
//     email:string;
//     password:string;
// }

const Login = () => {
    const [input, setInput] = useState <LoginInputState> ({
        email:"",
        password:""
    });

    const [errors,setErrors] = useState<Partial<LoginInputState>>({});
    
    const {loading, login} = useUserStore();
    const navigate = useNavigate();

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target;
        setInput({...input,[name]:value})
    };

    const loginSubmitHandler = async (e:FormEvent)=>{
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        await login(input)
        setInput({email:"",password:""});
        navigate("/")
        
    }


    

    return (
        <div className=" min-h-screen flex justify-center items-center  ">
            <form 
            onSubmit={loginSubmitHandler}
            className="md:p-8 w-full max-w-md md:border border-gray-300 
             mx-4 rounded-lg shadow-2xl">

                <div className="mb-4 my-1">
                    <h2 className="text-2xl text-center py-2 font-bold">FoodWalaa</h2>
                </div>
                {/* input starts */}
                <div className="relative my-2">
                    <Input
                        type="email"
                        className="pl-10 focus-visible:ring-1"
                        value={input.email}
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter Email Id" />
                    <Mail className="absolute text-gray-500 left-2 pointer-events-none inset-y-2" />
                    {errors && <span className="text-red-500 text-sm my-1 font-semibold">{errors.email} </span> }
                </div>
                <div className="relative my-2">
                    <Input
                        type="text"
                        className="pl-10 focus-visible:ring-1"
                        value={input.password}
                        name="password"
                        onChange={handleChange}
                        placeholder="Enter your Password" />
                    <LockKeyhole className="absolute text-gray-500 left-2 pointer-events-none inset-y-2" />
                    {errors && <span className="text-red-500 text-sm my-1 font-semibold">{errors.password} </span> }
                </div>

                <div className="my-10">
                    {
                        loading ? <Button disabled
                        className="bg-green-600 hover:bg-green-500 w-full">
                            <Loader2  className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                        </Button>
                            : <Button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-500 w-full">
                                Login
                            </Button>
                    }
                    <div className="mt-3 text-center">
                    <Link to="/forgot-password"
                    className=" font-semibold"
                    > Forgot Password </Link>
                    </div>
                    

                </div>
                 <Separator/>
                 <p>
                    Don't have an Account ? 
                    <Link to="/signup" 
                    className="text-blue-600 font-semibold ml-1"
                    >Signup</Link>
                 </p>
            </form>
        </div>
    )
}

export default Login;
