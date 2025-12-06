import React, { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {

    let navigate = useNavigate()
    let [apiError , setApiError] = useState(null)
    let [isLoading , setIsLoading] = useState(false)

    // Regex Check
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const passwordErrorMsg = "At least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 symbol";

    let schema = z.object({
        name: z.string().min(1 , "Name is required").max(20 , "Max length is 20 chars"),
        email: z.email("Invalid email address"),
        password: z.string().regex(passwordRegex , passwordErrorMsg),
        rePassword: z.string(),
        dateOfBirth: z.string().regex(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/ , "Invalid date").refine((date) => {
            let userDate = new Date(date).setHours(0,0,0,0)
            let now = new Date().setHours(0,0,0,0)
            return userDate < now
        } , "Date cannot be in the future."),
        gender: z.enum(["male" , "female"] , "Gender is required"),
    }).refine((data) => data.password === data.rePassword , {
        message: "Passwords do not match",
        path: ["rePassword"]
    })

    let form = useForm({
        defaultValues: { name: "", email: "", password: "", rePassword: "", dateOfBirth: "", gender: "" },
        resolver: zodResolver(schema)
    })

    let {register , handleSubmit , formState} = form

    async function handleRegister(data) {
        setIsLoading(true)
        setApiError(null)
        try {
            let response = await axios.post(`https://linked-posts.routemisr.com/users/signup` , data)
            if (response.data.message === "success") {
                setIsLoading(false)
                navigate("/login")
            }
        } catch (error) {
            setIsLoading(false)
            setApiError(error.response?.data?.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fa-solid fa-user-plus text-indigo-600 text-xl"></i>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleRegister)}>
                    
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" {...register("name")} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="John Doe" />
                        {formState.errors.name && <p className="mt-1 text-sm text-red-600">{formState.errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" {...register("email")} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="name@company.com" />
                        {formState.errors.email && <p className="mt-1 text-sm text-red-600">{formState.errors.email.message}</p>}
                    </div>

                    {/* Password & RePassword Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" {...register("password")} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••" />
                            {formState.errors.password && <p className="mt-1 text-xs text-red-600">{formState.errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" {...register("rePassword")} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••" />
                            {formState.errors.rePassword && <p className="mt-1 text-xs text-red-600">{formState.errors.rePassword.message}</p>}
                        </div>
                    </div>

                    {/* Date of Birth & Gender Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" {...register("dateOfBirth")} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            {formState.errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{formState.errors.dateOfBirth.message}</p>}
                        </div>
                        
                        {/* Custom Gender Radio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" {...register("gender")} value="male" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" defaultChecked />
                                    <span className="ml-2 text-sm text-gray-700">Male</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" {...register("gender")} value="female" className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                                    <span className="ml-2 text-sm text-gray-700">Female</span>
                                </label>
                            </div>
                            {formState.errors.gender && <p className="mt-1 text-sm text-red-600">{formState.errors.gender.message}</p>}
                        </div>
                    </div>

                    {apiError && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="shrink-0"><i className="fa-solid fa-circle-xmark text-red-400"></i></div>
                                <div className="ml-3"><h3 className="text-sm font-medium text-red-800">{apiError}</h3></div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg mt-6"
                    >
                        {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    )
}