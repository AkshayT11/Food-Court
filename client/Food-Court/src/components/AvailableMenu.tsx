import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";


const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const {addToCart} = useCartStore();

  const navigate = useNavigate();

  
  return (
    <div className="md:p-4">
      <h2 className="md:text-2xl text-xl font-bold mb-6">Available Menus</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-4 md:space-y-0">
        {
          menus?.map((menu:MenuItem) => (
            <Card 
            key={menu._id}
            className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
              <img src={menu.image}
                alt="shev bhaji"
                className="w-full object-cover h-40"
              />
              <CardContent>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-white">{menu.name} </h2>
                <p className="text-sm text-gray-600 mt-2">{menu.description} </p>
                <h3 className="mt-4 font-semibold text-lg">
                  Price: <span className="text-[#df6734]">₹{menu.price}</span>
                </h3>
              </CardContent>
              <CardFooter className="p-4">
                <Button 
                onClick={()=> {
                  addToCart(menu);
                  navigate("/cart");
                } }
                className="bg-orange w-full hover:bg-hoverOrange">
                  Add To Cart
                </Button>
              </CardFooter>
            </Card>
          ))
        }

      </div>
    </div>
  )
};

export default AvailableMenu;
