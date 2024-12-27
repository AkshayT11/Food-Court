
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import AvailableMenu from "./AvailableMenu";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


const RestaurantDetail = () => {
  const params = useParams();
  const {singleRestaurant, getSingleRestaurant} = useRestaurantStore();
  

  useEffect(()=>{
    getSingleRestaurant(params.id!);
    console.log(singleRestaurant);
    
  },[params.id])

  return ( 
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        {/* banner image */}
        <div className="relative w-full h-32 md:h-64 lg:h-72">
            <img src={singleRestaurant?.imageUrl || "Loading..."} alt="image"
            className="w-full object-cover h-full rounded-lg shadow-lg"
            />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
            <div className="my-5">
                <h2 className="font-medium text-xl">{singleRestaurant?.restaurantName || "Loading..."} </h2>
                <div className="flex gap-2 my-2">
                {
                   singleRestaurant?.cuisines?.map((cuisine:string, index:number)=>(
                        <Badge key={index}>{cuisine} </Badge>
                    ))
                }
                </div>
                {/* Deliver TIme */}
                <div className="flex md:flex-row flex-col gap-2 my-5">
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5" />
                        <h2>Delivery Time: {" "}</h2>
                        <span className="text-gray-500">
                            {singleRestaurant?.deliveryTime || "NA"} mins
                        </span>
                    </div>
                </div>
            </div>
        </div>
        {/* Available Menus */}
        <AvailableMenu menus = {singleRestaurant?.menus!} />
      </div>
    </div>
  )
}

export default RestaurantDetail
