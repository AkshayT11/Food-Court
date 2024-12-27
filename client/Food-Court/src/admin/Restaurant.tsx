import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RestaurantFormSchema, restaurantFromSchema } from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";

import React, { FormEvent, useEffect, useState } from "react";


const Restaurant = () => {
    const [input, setInput] = useState<RestaurantFormSchema>({
        restaurantName: "",
        city: "",
        country: "",
        cuisines: [],
        deliveryTime: 0,
        imageFile: undefined
    })

    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});
    const {  createRestaurant, updateRestaurant, restaurant,getRestaurant } = useRestaurantStore();




    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === 'number' ? Number(value) : value })
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = restaurantFromSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<RestaurantFormSchema>);
            return;
        }

        // we are creating formData bcz sending or using Images
        try {
            const formData = new FormData();
            formData.append("restaurantName", input.restaurantName);
            formData.append("city", input.city);
            formData.append("country", input.country);
            formData.append("deliveryTime", input.deliveryTime.toString());
            formData.append("cuisines", JSON.stringify(input.cuisines));

            if (input.imageFile) {
                formData.append("imageFile", input.imageFile);
            };

            // if there is existing restaurant already there then update it or  create it
            if (restaurant) {
                // update
                await updateRestaurant(formData);
            } else {
                // create
                await createRestaurant(formData);
            }
        } catch (error) {
            console.log(error);

        }

    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            await getRestaurant()

            setInput({
                restaurantName:restaurant?.restaurantName || "",
                city:restaurant?.city || "",
                country: restaurant?.country || "",
                cuisines: restaurant?.cuisines ? restaurant.cuisines.map((cuisine:string)=> cuisine) : [],
                deliveryTime: restaurant?.deliveryTime || 0,
                imageFile: undefined
            })
        };

        fetchRestaurant();
 
        
    }, [])

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <div>
                    <h1 className="font-bold text-2xl mb-5">Add Restaurants</h1>
                    <form onSubmit={submitHandler}>
                        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                            {/* Restaurant Name */}
                            <div className="my-1">
                                <Label>Restaurant Name</Label>
                                <Input
                                    type="text"
                                    name="restaurantName"
                                    onChange={changeEventHandler}
                                    value={input.restaurantName}
                                    placeholder="Enter Restaurant Name"
                                />
                                {errors && <span className="font-semibold text-sm text-red-500">{errors.restaurantName} </span>}
                            </div>
                            <div className="my-1">
                                <Label>City</Label>
                                <Input
                                    type="text"
                                    name="city"
                                    onChange={changeEventHandler}
                                    value={input.city}
                                    placeholder="Enter City"
                                />
                                {errors && <span className="font-semibold text-sm text-red-500">{errors.city} </span>}
                            </div>
                            <div className="my-1">
                                <Label>Country</Label>
                                <Input
                                    type="text"
                                    name="country"
                                    value={input.country}
                                    onChange={changeEventHandler}
                                    placeholder="Country Name"
                                />
                                {errors && <span className="font-semibold text-sm text-red-500">{errors.country} </span>}
                            </div>

                            <div className="my-1">
                                <Label>Estimated Delivery Time (mintutes)</Label>
                                <Input
                                    type="number"
                                    name="deliveryTime"
                                    value={input.deliveryTime}
                                    onChange={changeEventHandler}
                                    placeholder="Delivery Time"
                                />
                                {errors && <span className="font-semibold text-sm text-red-500">{errors.deliveryTime} </span>}
                            </div>
                            <div className="my-1">
                                <Label>Cuisines</Label>
                                <Input
                                    type="text"
                                    name="cuisines"
                                    onChange={(e) => setInput({ ...input, cuisines: e.target.value.split(",") })}
                                    value={input.cuisines}
                                    placeholder="Favourite Cuisines"
                                />
                                {errors && <span className="font-semibold text-sm text-red-500">{errors.cuisines} </span>}
                            </div>
                            <div className="my-1">
                                <Label>Upload Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    name="imageFile"
                                    onChange={(e) => setInput({ ...input, imageFile: e.target.files?.[0] || undefined })}
                                />
                                {errors && <span className="font-semibold text-sm text-red-500">
                                    {errors.imageFile?.name} </span>}
                            </div>
                        </div>
                        {/*button  */}
                        <div className="my-5 w-fit">

                            <Button className="bg-violet-500 hover:bg-violet-600">
                                {restaurant ? "Update" : "Add New Restaurant"}
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Restaurant;
