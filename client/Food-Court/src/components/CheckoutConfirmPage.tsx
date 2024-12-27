import { Dispatch, SetStateAction, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useUserStore } from "@/store/useUserStore"
import { useRestaurantStore } from "@/store/useRestaurantStore"
import { CheckoutSessionRequest } from "@/types/orderType"
import { useCartStore } from "@/store/useCartStore"
import { useOrderStore } from "@/store/useOrderStore"
import { Loader2 } from "lucide-react"



const CheckoutConfirmPage = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {

    const { user } = useUserStore();
    const { cart } = useCartStore();
    const { restaurant } = useRestaurantStore();
    const {createCheckoutSession, loading} = useOrderStore();

    const [input, setInput] = useState({
        name: user?.fullname || "",
        email: user?.email || "",
        contact: user?.contact.toString() || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || ""
    });


    const changeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const chckoutHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // APi implementation start from here
        try {
            const checkoutData: CheckoutSessionRequest = {
                cartItems: cart.map((cartItem) => ({
                    menuId: cartItem._id,
                    name: cartItem.name,
                    image: cartItem.image,
                    price: cartItem.price.toString(),
                    quantity: cartItem.quantity.toString(),
                })),
                deliveryDetails: input,
                restaurantId: restaurant?._id as string,
            };
             await createCheckoutSession(checkoutData);
        } catch (error) {
            console.log(error);
            
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle className="font-bold">Review Your Order</DialogTitle>
                <DialogDescription className="text-xs">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero atque animi porro earum ipsam explicabo ut molestias quod? Ea enim esse laboriosam voluptatum odit, fugiat eius a quos accusantium ab.
                </DialogDescription>
                <form onSubmit={chckoutHandler}
                    className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
                    <div >
                        <Label>Fullname</Label>
                        <Input type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEvent}
                        />
                    </div>
                    <div >
                        <Label>Email Id</Label>
                        <Input type="text"
                            disabled
                            name="email"
                            value={input.email}
                            onChange={changeEvent}
                        />
                    </div>
                    <div >
                        <Label>Contact</Label>
                        <Input type="text"
                            name="contact"
                            value={input.contact}
                            onChange={changeEvent}
                        />
                    </div>
                    <div >
                        <Label>Address</Label>
                        <Input type="text"
                            name="address"
                            value={input.address}
                            onChange={changeEvent}
                        />
                    </div>
                    <div >
                        <Label>City</Label>
                        <Input type="text"
                            name="city"
                            value={input.city}
                            onChange={changeEvent}
                        />
                    </div>
                    <div >
                        <Label>Country</Label>
                        <Input type="text"
                            name="country"
                            value={input.country}
                            onChange={changeEvent}
                        />
                    </div>
                    <DialogFooter className="col-span-2 pt-5">
                        {
                            loading ? (
                                <Button disabled className="bg-green-500 hover:bg-green-600">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                </Button> 
                            ) : (
                                <Button type="submit"
                                className="bg-green-500 hover:bg-green-600">Continue To Payment</Button>
                            )
                        }
                        
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CheckoutConfirmPage
