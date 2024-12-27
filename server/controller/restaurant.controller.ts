import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";

export const createRestaurant = async (req: Request ,res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        

        const restaurant = await Restaurant.findOne({ user: req.id });
        // if (restaurant) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Restaurant alredy exist for this user"
        //     })
        // }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is Required"
            })
        }

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl
        })
        return res.status(201).json({
            success: true,
            message: "Restaurant Added"
        })

    } catch (error) {
        console.log("Create Restaurant Error", error);
        return res.status(500).json({ message: "internal server Error" })
    }
};

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant:[],
                message: "Restaurant not Found"
            })
        };

        return res.status(200).json({ success: true, restaurant })

    } catch (error) {
        console.log("Get Restaurant Error", error);
        return res.status(500).json({ message: "internal server Error" })
    }
}

// Update Restaurant

export const updateRestaurant = async (req: Request, res: Response) => {
    try {

        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });

        if (!restaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant not Found"
            })
        };

        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }

        await restaurant.save();
        return res.status(200).json({
            success: true,
            message: "Restaurant Updated",
            restaurant
        })

    } catch (error) {
        console.log("Update Restaurant Error", error);
        return res.status(500).json({ message: "internal server Error" })
    }
};

// Get restaurant Order

export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not Found"
            })
        };

        const orders = await Order.find({ restaurant: restaurant._id })
            .populate('restaurant').populate('user');

        return res.status(200).json({
            success: true,
            orders
        })

    } catch (error) {
        console.log("Get Restaurant Order Error", error);
        return res.status(500).json({ message: "internal server Error" })
    }
};

// update Order 

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not Found"
            })
        }

        order.status = status;
        await order.save();
        return res.status(200).json({
            success: true,
            status:order.status,
            message: "Status Updated"
        })

    } catch (error) {
        console.log("Update Order Error", error);
        return res.status(500).json({ message: "internal server Error" })
    }
};

//Search the Restaurant

export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);

        const query: any = {};
        // basic search based on searchText(name,city,country)
        
     
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
        ]
    }

    // Filter on the basis of SearchQuery

    if(searchQuery){
        query.$or = [
            {restaurantName: {$regex: searchQuery, $options: 'i'} },
            {cuisines: {$regex: searchQuery, $options: 'i'} },
        ]
    }


    if(selectedCuisines.length > 0){
        query.cuisines = {$in:selectedCuisines}
    }

    const restaurants = await Restaurant.find(query);
    
    return res.status(200).json({
        success:true,
        message:"Restaurant Find From SearchRestaurant",
        data:restaurants
    });

    } catch (error) {
    console.log("searchRestaurant Error", error);
    return res.status(500).json({ message: "internal server Error" })
}
};

// get single Resturants

export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path:'menus',
            options:{createdAt:-1}
        });

        if(!restaurant){
            return res.status(404).json({
                success: false,
                message: "Restaurant not Found"
            })
        };
        return res.status(200).json({
            success:true,
             restaurant
        })
        
    } catch (error) {
        console.log("getSingleRestaurant Error", error);
        return res.status(500).json({ message: "internal server Error" })
    }
}