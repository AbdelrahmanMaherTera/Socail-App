import React, { useContext, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { UserContext } from "../../Context/UserContext"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { initFlowbite } from "flowbite"
import userImage from "../../assets/tl.webp"
import SocialAppLogo from "../SocialAppLogo/SocialAppLogo"

export default function Navbar() {

    useEffect(() => {
        initFlowbite();
    }, []);

    let {userToken , setUserToken} = useContext(UserContext)
    let navigate = useNavigate()

    function signOut() {
        localStorage.removeItem("userToken")
        setUserToken(null)
        localStorage.removeItem("userId")
        navigate("/login")
    }

    function getProfileData() {
        return axios.get(`https://linked-posts.routemisr.com/users/profile-data` , {
            headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {data} = useQuery({
        queryKey: ["getProfileData"],
        queryFn: getProfileData,
        select: (data) => data?.data?.user,
        enabled: !!userToken, // عشان ميشتغلش لو مفيش توكين
    })

    return (
        <nav className="bg-white/80 backdrop-blur-md fixed w-full z-40 top-0 start-0 border-b border-gray-200 h-[71px]">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
                
                {/* Logo Section */}
                {
                    userToken? (
                        <Link to="/" className="flex items-center gap-2 group">
                            <SocialAppLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-200" />
                            <span className="self-center text-xl font-bold text-gray-900 tracking-tight">Social App</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 group">
                            <SocialAppLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-200" />
                            <span className="self-center text-xl font-bold text-gray-900 tracking-tight">Social App</span>
                        </Link>
                    )
                }

                {/* Right Side Actions */}
                <div className="flex gap-6 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {
                        userToken != null ? (
                            <>
                                {/* User Menu Button */}
                                <button 
                                    type="button" 
                                    className="flex text-sm bg-gray-100 rounded-full md:me-0 focus:ring-4 focus:ring-indigo-100 cursor-pointer border border-gray-200 p-0.5 transition-all hover:border-indigo-300" 
                                    id="navbar-user-menu-button" 
                                    aria-expanded="false" 
                                    data-dropdown-toggle="navbar-user-dropdown" 
                                    data-dropdown-placement="bottom"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    {
                                        data?.photo === "https://linked-posts.routemisr.com/uploads/undefined" ? (
                                            <img src={userImage} className="w-9 h-9 rounded-full object-cover" alt="user" />
                                        ) : (
                                            <img className="w-9 h-9 rounded-full object-cover" src={data?.photo} alt="user"/>
                                        )
                                    }
                                </button>

                                {/* Dropdown Menu */}
                                <div className="z-50 hidden bg-white divide-y divide-gray-100 rounded-xl shadow-xl w-56 border border-gray-100 overflow-hidden" id="navbar-user-dropdown">
                                    
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                        <span className="block text-sm font-bold text-gray-900 capitalize truncate">{data?.name}</span>
                                        <span className="block text-xs font-medium text-gray-500 truncate">{data?.email}</span>
                                    </div>
                                    
                                    {/* Menu Items */}
                                    <ul className="py-2" aria-labelledby="navbar-user-menu-button">
                                        <li>
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                                <i className="fa-regular fa-user"></i>
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <span 
                                                onClick={signOut} 
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                            >
                                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                                Sign out
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Login / Register Buttons */}
                                <ul className="flex items-center gap-3">
                                    <li>
                                        <NavLink 
                                            to="/login" 
                                            className="text-sm font-medium transition-colors text-gray-600 hover:text-indigo-600"
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/register" 
                                            className="text-sm font-medium transition-colors text-gray-600 hover:text-indigo-600"
                                        >
                                            Register
                                        </NavLink>
                                    </li>
                                </ul>
                            </>
                        )
                    }    
                </div>
            </div>
        </nav>
    )
}