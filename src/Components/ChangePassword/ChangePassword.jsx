import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../Context/UserContext"
import { createPortal } from "react-dom"

export default function ChangePassword() {

    let [isOpen , setIsOpen] = useState(false)
    let navigate = useNavigate()
    let {setUserToken} = useContext(UserContext)
    let toastLoadingId

    function openModal() {
        setIsOpen(true)
        reset()
        resetMutation()
    }

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(()=>{
        if(isOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = "unset"
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    // Regex Check
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const passwordErrorMsg = "Password must be at least 8 chars, include uppercase, lowercase, number & special char.";

    let schema = z.object({
        password: z.string().regex(passwordRegex , passwordErrorMsg),
        newPassword: z.string().regex(passwordRegex , passwordErrorMsg),
    })

    let form = useForm({
        defaultValues: { password: "", newPassword: "" },
        resolver: zodResolver(schema),
    })

    let {register , handleSubmit , reset , formState} = form

    function handleChangePassword(values) {
        return axios.patch(`https://linked-posts.routemisr.com/users/change-password` , values , {
            headers: { token: localStorage.getItem("userToken") },
        })
    }

    let {mutate , isPending , isError , error , reset: resetMutation} = useMutation({
        mutationFn: (values) => handleChangePassword(values),
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Password Changed Successfully")
            navigate("/login")
            setUserToken(null)
            localStorage.removeItem("userToken")
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Changing Password...")
        },
        onError: () => {
            toast.dismiss(toastLoadingId)
        },
    })

    return (
        <>
            {/* Trigger Button (Stylish Outline) */}
            <button 
                type="button" 
                onClick={openModal} 
                className="flex items-center gap-2 text-gray-700 bg-white border border-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
                <i className="fa-solid fa-key text-gray-500"></i>
                <span className="hidden sm:inline">Change Password</span>
            </button>
            
            {
                isOpen ? (
                    createPortal(
                        <div onClick={closeModal} className="bg-gray-900/50 backdrop-blur-sm fixed inset-0 z-50 flex justify-center items-center p-4">
                            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">

                                {/* Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Change Password
                                    </h3>
                                    <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors">
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <form onSubmit={handleSubmit(mutate)}>
                                        
                                        {/* Current Password */}
                                        <div className="mb-4">
                                            <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                                            <input 
                                                type="password" 
                                                id="currentPassword"
                                                {...register("password")} 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-shadow" 
                                                placeholder="••••••••" 
                                            />
                                            {formState.errors.password && <p className="mt-2 text-xs text-red-600 font-medium">{formState.errors.password.message}</p>}
                                        </div>

                                        {/* New Password */}
                                        <div className="mb-4">
                                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                                            <input 
                                                type="password" 
                                                id="newPassword"
                                                {...register("newPassword")} 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-shadow" 
                                                placeholder="••••••••" 
                                            />
                                            {formState.errors.newPassword && <p className="mt-2 text-xs text-red-600 font-medium">{formState.errors.newPassword.message}</p>}
                                        </div>

                                        {/* Server Error */}
                                        {isError && (
                                            <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 text-center" role="alert">
                                                {error?.response?.data?.message || "The current password is incorrect."}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button 
                                            type="submit" 
                                            disabled={isPending} 
                                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {isPending ? "Changing..." : "Change Password"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    , document.body)
                ) : ("")
            }
        </>
    )
}