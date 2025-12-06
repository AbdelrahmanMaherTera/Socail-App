import React from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import UserPosts from "../UserPosts/UserPosts"
import ChangePassword from "../ChangePassword/ChangePassword"
import UploadProfilePicture from "../UploadProfilePicture/UploadProfilePicture"
import CreatePost from "../CreatePost/CreatePost"
import userImage from "../../assets/tl.webp" // تأكد إنك عامل import للصورة الاحتياطية

export default function Profile() {

    function getProfileData() {
        return axios.get(`https://linked-posts.routemisr.com/users/profile-data` , {
                headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {data , isLoading , isError , error} = useQuery({
        queryKey: ["getProfileData"],
        queryFn: getProfileData,
        select: (data) => data?.data?.user
    })

    if(isError) return <div className="text-center mt-10 text-red-600 font-bold">{error.message}</div>

    if(isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-dvh pt-[71px]">
                <span className="loader-loading"></span>
            </div>
        )
    }

    return (
        <>
            <div className="w-full md:w-[90%] lg:w-[70%] mx-auto px-4 pb-10">
                
                {/* 1. Profile Card Header */}
                <div className="bg-white mt-8 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* Cover Photo Area (Optional aesthetic touch) */}
                    <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600 relative"></div>

                    <div className="px-6 pb-6 relative">
                        
                        {/* Avatar & Upload Button Group */}
                        <div className="flex justify-between items-end -mt-12 mb-4">
                            <div className="relative group">
                                <img 
                                    src={data.photo !== "https://linked-posts.routemisr.com/uploads/undefined" ? data.photo : userImage} 
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-md bg-white" 
                                    alt="profile" 
                                />
                                {/* Upload Icon Positioned on Avatar */}
                                <div className="absolute bottom-0 right-0">
                                     <UploadProfilePicture />
                                </div>
                            </div>

                            {/* Change Password Button (Top Right) */}
                            <div className="mb-2">
                                <ChangePassword />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
                                    {data.name}
                                    {data.gender === 'male' ? <i className="fa-solid fa-mars text-blue-500 text-lg"></i> : <i className="fa-solid fa-venus text-pink-500 text-lg"></i>}
                                </h1>
                                <p className="text-gray-500 text-sm font-medium">{data.email}</p>
                            </div>

                            {/* Additional Details (Birthday) */}
                            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                                <i className="fa-solid fa-cake-candles text-indigo-500"></i>
                                <span>Born {data.dateOfBirth}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Create Post Section */}
                <CreatePost />

                {/* 3. User Posts Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">My Posts</h2>
                    <UserPosts id={data._id} />
                </div>
            </div>
        </>
    )
}