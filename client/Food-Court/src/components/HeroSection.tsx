import { useState } from "react"
import { Input } from "./ui/input"
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HeroImg from "../assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchText, setSearchText] = useState<string>("");

  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg 
    items-center m-4 gap-20">
      <div className="flex flex-col gap-10 md:w-[40%]">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-4xl md:text-5xl">Order Food Anytime & Anywhere</h1>
          <p className="text-gray-500 capitalize">Hey! Our delicius food is waiting for you, we are always near to you.</p>
        </div>
        {/* search bar */}
        <div className="relative flex items-center gap-2">
         
            <Input type="text"
              value={searchText}
              placeholder="search restaurant by name,city"
              onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 border-2 shadow-lg"
            />
            <Search className="text-gray-500 absolute inset-y-2 left-2" />
         
        <Button 
        onClick={()=>navigate(`/search/${searchText}`) }
        className="bg-blue-500 hover:bg-blue-600 ">
          Search
        </Button>

        </div>
      </div>
      {/* image */}
        <div>
          <img 
          className="w-full object-cover  max-h-[500px]"
          src={HeroImg}
           alt="HeroImg" />
        </div>
    </div>
  )
}

export default HeroSection
