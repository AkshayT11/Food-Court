import axios from "axios";
import { toast } from "sonner";
import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT = "http://localhost:8000/api/v1/menu";
axios.defaults.withCredentials=true;

type MenuState = {
    loading:boolean,
    menu: null,
    createMenu: (formData:FormData)=> Promise<void>;
    editMenu: (menuId:string,formData:FormData)=> Promise<void>;
}

export const useMenuStore = create<MenuState>()(persist((set)=>({
    loading: false,
    menu: null,
    createMenu: async(formData:FormData)=>{
        try {
            set({loading:true});
            const res = await axios.post(`${API_END_POINT}/`,formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(res.data.success){
                toast.success(res.data.message);
               set({loading: false,menu:res.data.menu});
            };
            // after creating menu update to get real time menu display
            useRestaurantStore.getState().addMenuToRestaurant(res.data.menu);

        } catch (error:any) {
            toast.error(error.res.data.message);
            set({loading:false});
        }
    },
    // edit the Menu

    editMenu: async(menuId:string,formData:FormData)=>{
        try {
            set({loading: true});
            const res = await axios.put(`${API_END_POINT}/${menuId}`,formData, {
                headers:{
                    "Content-Type":'multipart/form-data'
                }
            });

            if(res.data.success){
                toast.success(res.data.message);
                set({loading:false, menu:res.data.menu});
            }
            // update menu restaurant
            useRestaurantStore.getState().updateMenuToResturant(res.data.menu);

        } catch (error:any) {
            toast.error(error.res.data.message);
            set({loading:false});
        }
    },
}),{
    name: "menu-name",
    storage: createJSONStorage(()=> localStorage)
}))