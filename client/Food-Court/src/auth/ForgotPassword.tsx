import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom";


const ForgotPassword = () => {
    const [email, setEmail] = useState<string> ("");
    const loading:boolean = false;

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <form className="w-full flex flex-col max-w-md gap-5 md:border md:p-8 p-4 rounded-md mx-4">
        <div className="text-center">
            <h1 className="text-2xl mb-2 font-bold">Forgot Password</h1>
            <p className="text-sm text-gray-600">Enter your Email address to reset password</p>
        </div>
        {/* input field */}
        <div className="relative">
        <input type="text"
        value={email}
        placeholder="Enter your Email Id"
        className="pl-10 py-2 mx-2 w-full border"
         onChange={(e)=> setEmail(e.target.value) }
        />
        <Mail className="absolute top-2 inset-y-2 left-3
        pointer-events-none text-gray-600"/>
        </div>
        {
            loading ? (
                <Button disabled> <Loader2 className="h-4 w-4 animate-spin mr-2"/>Please Wait</Button>
            ) : (
                <Button>Send Reset Link</Button>
            )
        }
        <span className="text-center font-semibold">
            Back To 
            <Link className="font-semibold text-blue-600 mx-2" to="/login" >Login</Link>
        </span>
      </form>
    </div>
  )
}

export default ForgotPassword
