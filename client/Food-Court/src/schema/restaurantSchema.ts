import {z} from "zod";

export const restaurantFromSchema = z.object({
    restaurantName:z.string().nonempty({message:"Restaurant name is Required"}),
    city:z.string().nonempty({message:"City is Rquired"}),
    country:z.string().nonempty({message:"Country is Rquired"}),
    deliveryTime:z.number().min(0, {message:"Delivery time can not be negative"}),
    cuisines:z.array(z.string()),
    imageFile:z.instanceof(File).optional().refine((file)=> file?.size !== 0, {message:"Image File is Required"} )
}) ;

export type RestaurantFormSchema = z.infer<typeof restaurantFromSchema>;