import React, { useContext } from "react"
import style from "./Notfound.module.css"
import { Link } from "react-router-dom"
import { UserContext } from "../../Context/UserContext"

export default function Notfound() {

    let {userToken} = useContext(UserContext)

    return (
        <>
            <section className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                    
                    {/* 404 Big Number */}
                    <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">
                        404
                    </h1>
                    
                    {/* Badge */}
                    <div className="bg-indigo-100 text-indigo-700 px-2 text-sm rounded rotate-12 absolute inline-block -ml-5 -mt-5">
                        Page Not Found
                    </div>

                    {/* Message */}
                    <div className="mt-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Oops! There's nothing here
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                        
                        {/* Action Button */}
                        {
                            userToken? (
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                                >
                                    <i className="fa-solid fa-house"></i>
                                    Go Back Home
                                </Link>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                                >
                                    <i className="fa-solid fa-house"></i>
                                    Go Back Login
                                </Link>
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
