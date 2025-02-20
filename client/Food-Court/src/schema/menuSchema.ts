import {z} from "zod";

export const menuSchema = z.object({
    name:z.string().nonempty({message:"Name is Required"}),
    description:z.string().nonempty({message:"Description is Required"}),
    price:z.number().min(0,{message:"Price can not be negative"}),
    image:z.instanceof(File).optional().refine((file)=> file?.size !== 0, {message:"Image File is Required"} )
})

export type MenuFormSchema = z.infer<typeof menuSchema>