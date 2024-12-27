import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import { Orders } from "@/types/orderType";



const API_END_POINT="http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;


export const useRestaurantStore = create<RestaurantState>()(persist((set, get)=> ({
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
    singleRestaurant:  null ,
    restaurantOrder: [],
    
    createRestaurant: async(formData:FormData)=>{
        try {
            set({loading: true});
            const res  = await axios.post(`${API_END_POINT}/`,formData,{
                headers:{
                    'Content-Type':"multipart/form-data"
                }
            });

            if(res.data.success){
                toast.success(res.data.message);
                set({loading: false});
            }

        } catch (error:any) {
            toast.error(error.res.data.message);
            set({loading: false});
        }
    },

    getRestaurant: async() =>{
        try {
            set({loading: true});
            const res  = await axios.get(`${API_END_POINT}/`);
            if(res.data.success){
              
                set({loading: false, restaurant:res.data.restaurant})
            }
        } catch (error:any) {
            if (error.res.status === 404){
                set({restaurant: null});
            }    
            set({loading: false});
        }
    },

    updateRestaurant: async (formData: FormData)=>{
        try {
            set({loading: true});
            const res = await axios.put(`${API_END_POINT}/`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            if(res.data.success){
                toast.success(res.data.message);
                set({loading: false});
            }
        } catch (error:any) {
            toast.error(error.res.data.message);
                set({loading: false});
        }
    },
  // Search Restaurant 
    searchRestaurant: async(searchText:string,searchQuery:string, selectedCuisines:any)=>{
        try {
            set({loading: true});
            const params = new URLSearchParams();
            params.set("searchQuery",searchQuery);
            params.set("selectedCuisines",selectedCuisines.join(","));

            const res = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            
            if(res.data.success){                          
                set({loading: false, searchedRestaurant:res.data});
            }       
        } catch (error) {
            set({loading:false});
        }
    },

    // To add Menu
    addMenuToRestaurant: (menu:MenuItem)=>{
        set((state:any)=>({
            restaurant:state.restaurant ? {...state.restaurant, menus:[...state.restaurant.menus , menu]} : null
        }))
    },

    // to update the menu
    updateMenuToResturant: (updateMenu:MenuItem)=>{
        set((state:any)=>{
            if(state.restaurant){
                const updateMenuList = state.restaurant.menus.map((item:any)=> item._id === updateMenu._id 
            ? updateMenu : item);
            return {
                restaurant : {
                    ...state.restaurant,
                    menus:updateMenuList
                }
            } 
            }
            return state;
        });
    },

     setAppliedFilter: (value:string)=>{
        set((state)=>{
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item)=> item !== value) 
            : [...state.appliedFilter,value];
            return {appliedFilter: updatedFilter}
        })
     },
     
     resetAppliedFilter:()=>{
        set({appliedFilter:[]})
     },

     getSingleRestaurant: async(restaurantId:string)=>{
        try {
           const res = await axios.get(`${API_END_POINT}/${restaurantId}`);
          
           if(res.data.success){          
                set({singleRestaurant: res.data.restaurant})
           } 
        } catch (error) {
            
        }
     },

     getRestaurantOrders: async ()=>{
        try {
           const res = await axios.get(`${API_END_POINT}/order`);
           
           if(res.data.success){
             set({restaurantOrder: res.data.orders});
           }
        } catch (error) {
            console.log("getRestaurantOrders",error);
            
        }
     },

     updateRestaurantOrder: async (orderId:string, status:string)=>{
        try {
            const res = await axios.put(`${API_END_POINT}/order/${orderId}/status`, {status},{
                headers:{
                    'Content-Type':"application/json"
                }
            });
            if(res.data.success){
                const updatedOrder = get().restaurantOrder.map((order:Orders)=> {
                    return order._id === orderId ? {...order, status: res.data.status} : order;
                })
                set({restaurantOrder:updatedOrder});
                toast.success(res.data.messsage);
            }
        } catch (error:any) {
            toast.error(error.res.data.message);
        }
     }

}),{
    name: 'restaurant-name',
    storage: createJSONStorage(()=> localStorage)
}))
