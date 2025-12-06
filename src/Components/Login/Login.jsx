import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../../Context/UserContext"
import { jwtDecode } from "jwt-decode"

export default function Login() {
    
    let navigate = useNavigate()
    let [apiError , setApiError] = useState(null)
    let [isLoading , setIsLoading] = useState(false)
    let {setUserToken} = useContext(UserContext)

    let schema = z.object({
        email: z.email("Please enter a valid email address"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ , "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."),
    })

    let form = useForm({
        defaultValues: { email: "", password: "" },
        resolver: zodResolver(schema)
    })

    let {register , handleSubmit , formState} = form

    async function handleLogin(data) {
        setIsLoading(true)
        setApiError(null)
        try {
            let response = await axios.post(`https://linked-posts.routemisr.com/users/signin` , data)
            let responseData = response.data
            if (responseData.message === "success") {
                localStorage.setItem("userToken" , responseData.token)
                setUserToken(responseData.token)
                const decoded = jwtDecode(responseData.token)
                localStorage.setItem("userId", decoded.user)
                setIsLoading(false)
                navigate("/")
            }
        } catch (error) {
            setIsLoading(false)
            setApiError(error.response?.data?.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fa-solid fa-right-to-bracket text-indigo-600 text-xl"></i>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
                    <div className="space-y-5">
                        
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input 
                                id="email" 
                                type="email" 
                                {...register("email")}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-shadow" 
                                placeholder="name@company.com" 
                            />
                            {formState.errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {formState.errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                id="password" 
                                type="password" 
                                {...register("password")}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-shadow" 
                                placeholder="••••••••" 
                            />
                            {formState.errors.password && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {formState.errors.password.message}</p>}
                        </div>
                    </div>

                    {apiError && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="shrink-0">
                                    <i className="fa-solid fa-circle-xmark text-red-400"></i>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{apiError}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                    >
                        {isLoading ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}