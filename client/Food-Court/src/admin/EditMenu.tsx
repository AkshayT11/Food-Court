import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem } from "@/types/restaurantType";
import { Loader2 } from "lucide-react";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";


const EditMenu = ({selectedMenu,editOpen,setEditOpen}:{selectedMenu:MenuItem, editOpen:boolean, setEditOpen:Dispatch<SetStateAction<boolean>>}) => {
  const [input, setInput] = useState<MenuFormSchema>({
          name:"",
          description:"", 
          price:0,
          image:undefined
      });

  const [error, setError] = useState<Partial<MenuFormSchema>>({})    

  const {loading, editMenu} = useMenuStore();

  const submitHandler = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
     const result = menuSchema.safeParse(input);
            if(!result.success){
                const fieldErrors = result.error.formErrors.fieldErrors;
                setError(fieldErrors as Partial<MenuFormSchema>);
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
              await editMenu(selectedMenu._id,formData);
          } catch (error) {
              console.log("Submit Add Menu",error);
              
          }     

  
    // api start here
  };

  useEffect(()=>{
    
    
    setInput({
    name:selectedMenu?.name,
    description:selectedMenu?.description,
    price:selectedMenu?.price || 0,
    image:undefined
    })
    
  },[selectedMenu]);

  const changeEventHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value,type} = e.target;
    setInput({...input, [name]: type === 'number' ? Number(value) : value })
  }

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update your menu to keep your offering fresh and exciting!
          </DialogDescription>
        </DialogHeader>
       {/* Form */}
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
                                {error && <span className="text-red-500 font-semibold text-sm">{error.name} </span>}
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
                                {error && <span className="text-red-500 font-semibold text-sm">{error.description} </span>}
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
                                {error && <span className="text-red-500 font-semibold text-sm">{error.price} </span>}
                            </div>
                            <div>
                                <Label>Upload Menu</Label>
                                <Input
                                    type="file"
                                    name="image"
                                    onChange={(e)=> setInput({...input, image:e.target.files?.[0] || undefined}) }
                                    placeholder="Enter Menu Name"
                                />
                                {error && <span className="text-red-500 font-semibold text-sm">{error.image?.name } </span>}
                            </div>
                            <DialogFooter className="mt-5">
                                {
                                    loading ? (
                                        <Button className="bg-green-500 hover:bg-green-600">
                                            <Loader2 className="font-medium animate-spin" /> Please Wait </Button>
                                    )
                                        : <Button className="bg-green-500 hover:bg-green-600">Submit</Button>
                                }

                            </DialogFooter>
                        </form>
      </DialogContent>
    </Dialog>
  )
};

export default EditMenu;
