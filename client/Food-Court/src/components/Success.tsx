
import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { CartItem } from "@/types/cartType";

const Success = () => {
    const {orders,getOrderDetails} = useOrderStore();

    useEffect(()=>{
        getOrderDetails()
    },[]);


    if (orders.length === 0) 
           
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">Orders Not found</h1>
            </div>
        );

        

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 
        dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-lg
            p-6 w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Order Status: {" "}
                        <span className="text-[#FF5A5A]">{"confirm".toUpperCase()} </span>
                        </h1>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Order Summary</h2>
                    {/* order items displayed */}
                    {
                        orders.map((order:any,index:number)=>(
                            <div key={index}>
                                {
                                    order.cartItems.map((item:CartItem)=>(
                                        <div className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <img src={item.image} 
                                                alt="PizzaImg" 
                                                className="w-14 h-14 rounded-md object-cover"
                                                />
                                                <h3 className="ml-4 text-gray-800 dark:text-gray-300">{item.name} </h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex text-gray-800 dark:text-gray-200 items-center">
                                                    <IndianRupee/>
                                                    <span className="text-lg font-medium">{item.price} </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator className="my-4"/>
                                            </div>
                                    ))
                                }
                            </div>

                           
                        ))
                    }
                    
                </div>
                <Link to="/cart">
                    <Button className="bg-blue-600 hover:bg-blue-500 w-full py-3 shadow-md ">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    )

};

export default Success
