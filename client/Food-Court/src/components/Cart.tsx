import { Minus, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"
import { useState } from "react"
import CheckoutConfirmPage from "./CheckoutConfirmPage"
import { useCartStore } from "@/store/useCartStore"

import { CartItem } from "@/types/cartType"


const Cart = () => {
    const [open, setOpen] = useState<boolean>(false);

    const { cart, incrementQuantity, decrementQuantity,removeFromTheCart } = useCartStore();
    console.log("From Cart Page for Cart",cart);
    
    
    cart.map((item)=>{
        console.log(item.quantity);
        
    })

    let totalAmount = cart.reduce((acc,ele)=>{
        return acc + ele.price*ele.quantity;
    },0)

    return (
        <div className="max-w-7xl mx-auto flex flex-col my-10">
            <div className="flex justify-end">
                <Button variant="link">Clear All</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Items</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Remove</TableHead>
                    </TableRow>
                </TableHeader>
                {/* tbody */}
                <TableBody>
                    {
                        cart.map((item:CartItem) => (
                           
                            
                            <TableRow key={item._id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={item.image} alt={item.name} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{item.name} </TableCell>
                                <TableCell>{item.price} </TableCell>
                                <TableCell>
                                    <div className="w-fit flex items-center rounded-full border border-gray-200 
                        dark:border-gray-800 shadow-md">
                                        <Button 
                                        onClick={()=> decrementQuantity(item._id) }
                                        size={"icon"}
                                            variant={"outline"}
                                            className="rounded-full bg-gray-200"><Minus /> </Button>
                                        <Button disabled
                                            variant={'outline'}
                                            size={'icon'}
                                            className="font-bold border-none"
                                        >
                                            {item.quantity}</Button>
                                        <Button
                                            onClick={() => incrementQuantity(item._id)}
                                            variant={'outline'}
                                            size={'icon'}
                                            className="rounded-full bg-orange hover:bg-hoverOrange"
                                        ><Plus /></Button>
                                    </div>
                                </TableCell>
                                <TableCell>{item.price * item.quantity} </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                    onClick={()=>removeFromTheCart(item._id)}
                                    size={'sm'} className="bg-red-500">Remove</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }

                </TableBody>
                {/* footer */}
                <TableFooter>
                    <TableRow className="text-2xl font-bold">
                        <TableCell colSpan={5} className="">Total</TableCell>
                        <TableCell className="text-right">{totalAmount} </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex justify-end my-5">
                <Button onClick={() => setOpen(true)}
                    className="bg-green-500 hover:bg-green-600">Proceed To Checkout</Button>
            </div>
            <CheckoutConfirmPage open={open} setOpen={setOpen} />
        </div>
    )
}

export default Cart
