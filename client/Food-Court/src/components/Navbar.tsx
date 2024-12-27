import { Link } from "react-router-dom"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, } from "./ui/menubar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { HandPlatter, Loader2, Menu, Moon, PackageCheck, ShoppingCart, ShoppingCartIcon, SquareMenu, Sun, User, Utensils } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";



const Navbar = () => {
    const { user, loading, logout } = useUserStore();
    const { cart } = useCartStore();
    const {setTheme} = useThemeStore();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-14">
                <Link to="/">
                    <h2 className="font-bold text-2xl">Food Court  </h2>
                </Link>
                {/* menu */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-6">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/order/status">Order</Link>

                        {
                            user?.admin && (
                                <Menubar>
                                    <MenubarMenu>
                                        <MenubarTrigger>
                                            DashBoard
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            <Link to="/admin/restaurant">
                                                <MenubarItem>
                                                    Restaurant
                                                </MenubarItem>
                                            </Link>
                                            <Link to="/admin/menu">
                                                <MenubarItem>
                                                    Menu
                                                </MenubarItem>
                                            </Link>
                                            <Link to="/admin/orders">
                                                <MenubarItem>
                                                    Order
                                                </MenubarItem>
                                            </Link>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            )
                        }
                    </div>

                    <div className="flex items-center gap-4">
                        {/* dropdown div */}
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem  onClick={()=>setTheme('light') }>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>setTheme('dark') }>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem >
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Link to="/cart" className="relative cursor-pointer">
                            <ShoppingCartIcon />
                            {
                                cart.length > 0 && (
                                    <Button size={"icon"}
                                        className="absolute -inset-y-3 left-2 text-xs rounded-full
                                                     bg-red-500 h-4 w-4">
                                        {cart.length}
                                    </Button>
                                )
                            }

                        </Link>
                        {/* avatar */}
                        <div>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt="profilePicture" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        {/* lgout  */}
                        <div>
                            {
                                loading ? (
                                    <Button className="bg-red-500 hover:bg-red-600">
                                        <Loader2 className="mr-2 animate-spin" /> Please Wait</Button>
                                )
                                    : (
                                        <Button
                                            onClick={logout}
                                            className="bg-red-500 hover:bg-red-600">Logout </Button>
                                    )
                            }

                        </div>
                    </div>
                </div>
                {/* mobile responsive */}
                <div className="md:hidden">
                    <MobileNavbar />
                </div>
            </div>
        </div>
    )
}

export default Navbar;

const MobileNavbar = () => {
    const { user, logout, loading } = useUserStore();

    const {setTheme} = useThemeStore();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size={'icon'}
                    className="rounded-full bg-gray-300 text-black">
                    <Menu size={'18'} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle>Food Court</SheetTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=>setTheme('light') } >
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>setTheme('dark') } >
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SheetHeader>
                <Separator className="my-2" />
                <SheetDescription className="flex-1">
                    {/* menu links */}
                    <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-300 px-3
                    py-2 rounded-lg hover:text-gray-900 cursor-pointer font-medium">
                        <User />
                        <span>Profile</span>
                    </Link>
                    <Link to="/order/status" className="flex items-center gap-4 hover:bg-gray-300 px-3
                    py-2 rounded-lg hover:text-gray-900 cursor-pointer font-medium">
                        <HandPlatter />
                        <span>Order</span>
                    </Link>
                    <Link to="/cart" className="flex items-center gap-4 hover:bg-gray-300 px-3
                    py-2 rounded-lg hover:text-gray-900 cursor-pointer font-medium">
                        <ShoppingCart />
                        <span>Cart (0)</span>
                    </Link>
                    {/* adminn Menu */}

                    {
                        user?.admin && (
                            <>
                                <Link to="admin/menu" className="flex items-center gap-4 hover:bg-gray-300 px-3
                    py-2 rounded-lg hover:text-gray-900 cursor-pointer font-medium">
                                    <SquareMenu />
                                    <span>Menu</span>
                                </Link>
                                <Link to="/admin/restaurant" className="flex items-center gap-4 hover:bg-gray-300 px-3
                    py-2 rounded-lg hover:text-gray-900 cursor-pointer font-medium">
                                    <Utensils />
                                    <span>Restaurant</span>
                                </Link>
                                <Link to="/admin/orders" className="flex items-center gap-4 hover:bg-gray-300 px-3
                    py-2 rounded-lg hover:text-gray-900 cursor-pointer font-medium">
                                    <PackageCheck />
                                    <span>Restaurant Orders</span>
                                </Link>
                            </>
                        )
                    }



                </SheetDescription>
                <SheetFooter className="flex flex-col gap-4">

                    <>
                        <div className="flex flex-row items-center gap-2">
                            <Avatar>
                                <AvatarImage />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h2 className="font-bold text-2xl">Dua Lipa</h2>
                        </div>
                    </>

                    <SheetClose asChild>
                        {
                            loading ? (
                                <Button className="bg-red-500 hover:bg-red-600">
                                    <Loader2 className="mr-2 animate-spin" /> Please Wait</Button>
                            )
                                : (
                                    <Button
                                        onClick={logout}
                                        className="bg-red-500 hover:bg-red-600">Logout </Button>
                                )
                        }

                    </SheetClose>


                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
