import { Loader2, LocateIcon, Mail, MapPin, MapPinned, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRef, useState } from "react"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";




const Profile = () => {
    const {user,updateProfile} = useUserStore();
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [profileData, setProfileData] = useState({
        fullname:user?.fullname || "",
        email:user?.email || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        profilePicture: user?.profilePicture || "",
    });

    const imageRef = useRef<HTMLInputElement | null>(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture || "");


    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedProfilePicture(result);
                setProfileData((prev) => ({
                    ...prev,
                    profilePicture: result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value })
    };

    const updateProfileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            //update profile api implementation start
            await updateProfile(profileData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
        
    }

    return (
        <form  onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Avatar className="md:w-28 relative md:h-28 w-20 h-20">
                        <AvatarImage src={selectedProfilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                        <input type="file"
                            ref={imageRef}
                            accept="image/*"
                            onChange={fileChangeHandler}
                            className="hidden" />
                        <div
                            onClick={() => imageRef.current?.click()}
                            className="flex items-center absolute inset-0 justify-center opacity-0 hover:opacity-100
             transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input type="text"
                        name="fullname"
                        value={profileData.fullname}
                        onChange={changeHandler}
                        className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent"
                    />
                </div>
            </div>
            {/* all input fields */}
            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
                <div className="flex items-center gap-4 rounded-md p-2 bg-gray-200">
                    <Mail className="text-gray-500" />
                    <div className="w-full">
                        <Label>Email</Label>
                        <input type="text"
                        name="email"
                        disabled
                        value={profileData.email}
                        onChange={changeHandler}
                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 
                        focus-visible:border-transparent outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-md p-2 bg-gray-200">
                    <LocateIcon className="text-gray-500" />
                    <div className="w-full">
                        <Label>Address</Label>
                        <input type="text"
                        name="address"
                        value={profileData.address}
                        onChange={changeHandler}
                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 
                        focus-visible:border-transparent outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-md p-2 bg-gray-200">
                    <MapPin className="text-gray-500" />
                    <div className="w-full">
                        <Label>City</Label>
                        <input type="text"
                        name="city"
                        value={profileData.city}
                        onChange={changeHandler}
                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 
                        focus-visible:border-transparent outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-md p-2 bg-gray-200">
                    <MapPinned className="text-gray-500" />
                    <div className="w-full">
                        <Label>Country</Label>
                        <input type="text"
                        name="country"
                        value={profileData.country}
                        onChange={changeHandler}
                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 
                        focus-visible:border-transparent outline-none"
                        />
                    </div>
                </div>
            </div>
            {/* button */}
            <div className="text-center">
            {
                isLoading ? (
                    <Button disabled>
                        <Loader2 className="font-semibold animate-spin"/>
                        Please Wait
                    </Button>
                )
                : (
                    <Button 
                    type="submit"
                    className="bg-green-500 hover:bg-green-600">
                        Update
                    </Button>
                )
            }
            </div>
        </form>
    )
};

export default Profile
