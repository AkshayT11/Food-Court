import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react"
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";


const AddMenu = () => {
    const [input, setInput] = useState<MenuFormSchema>({
        name:"",
        description:"",
        price:0,
        image:undefined
    })
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});
    const [editOpen, setEditOpen] = useState<boolean>(false)
    const [selectedMenu, setSelectedMenu] = useState<any>();

    const {loading, createMenu} = useMenuStore();
    const {restaurant} = useRestaurantStore();

    const changeEventHandler = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value,type} = e.target;
        setInput({...input,[name]: type === 'number' ? Number(value) : value});
    }

    const submitHandler = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        

        const result = menuSchema.safeParse(input);
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<MenuFormSchema>);
            return;
        }   

        // API start here

        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("price", input.price.toString());
            if(input.image){
                formData.append("image", input.image);
            }
            await createMenu(formData);
        } catch (error) {
            console.log("Submit Add Menu",error);
            
        }      
    }

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between items-center">
                <h1 className="font-bold md:text-2xl text-lg">Available Menus</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange hover:bg-hoverOrange my-5">
                            <Plus className="mr-2" /> Add Menus
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Menu</DialogTitle>
                            <DialogDescription>
                                Create a new menu that will make your restaurant stand out.
                            </DialogDescription>
                        </DialogHeader>
                        <form  onSubmit={submitHandler}
                        className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    placeholder="Enter Menu Name"
                                />
                                {errors && <span className="text-red-500 text-sm font-semibold">{errors.name} </span>}
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Enter description Here"
                                />
                                 {errors && <span className="text-red-500 text-sm font-semibold">{errors.description} </span>}
                            </div>
                            <div>
                                <Label>Price in (Rupees)</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={input.price}
                                    onChange={changeEventHandler}
                                    placeholder="Enter price of Menu"
                                />
                                {errors && <span className="text-red-500 text-sm font-semibold">{errors.price} </span>}
                            </div>
                            <div>
                                <Label>Upload Menu</Label>
                                <Input
                                    type="file"
                                    name="image"
                                    onChange={(e)=> setInput({...input, image:e.target.files?.[0] || undefined}) }
                                    placeholder="Enter Menu Name"
                                />
                                {errors && <span className="text-red-500 text-sm font-semibold">{errors.image?.name } </span>}
                            </div>
                            <DialogFooter className="mt-5">
                                {
                                    loading ? (
                                        <Button className="bg-green-500 hover:bg-green-600">
                                            <Loader2 className="font-medium animate-spin" /> Please Wait </Button>
                                    )
                                        : <Button type="submit" className="bg-green-500 hover:bg-green-600">Submit</Button>
                                }

                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {/* display menu */}
    
           { restaurant?.menus.map((menu:any,index:number)=>(
            <div key={index} className="mt-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md
           rounded-lg border ">
                    <img src={menu.image}
                        alt="image"
                        className="md:h-24 md:w-24 h-16 object-cover w-full rounded-md"
                    />
                    {/* MEnu Content */}
                    <div className="flex-1">
                        <h1 className="text-lg font-medium text-gray-800">{menu.name}</h1>
                        <p className="text-sm text-gray-700 mt-1">{menu.description} </p>
                        <h2 className="text-md font-semibold my-2">
                            Price: <span>{menu.price} </span>
                        </h2>
                    </div>
                    <Button size={'sm'}
                    onClick={()=>{
                        setSelectedMenu(menu);
                        setEditOpen(true);
                    }  }
                        className="bg-blue-400 hover:bg-blue-500 text-black">Edit</Button>
                </div>
            </div>
            ))}


            <EditMenu selectedMenu={selectedMenu} editOpen={editOpen} setEditOpen={setEditOpen} />
        </div>
    )
}

export default AddMenu
