import React, { useContext } from "react"
import style from "./Footer.module.css"
import { Link } from "react-router-dom"
import { UserContext } from "../../Context/UserContext"

export default function Footer() {

    let {userToken} = useContext(UserContext)

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto py-6">
            <div className="container mx-auto px-4 flex justify-center items-center">
                <span className="text-sm text-gray-500 font-medium">
                    © 2025 {userToken? (<Link to="/" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">Social App™</Link>) : (<Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">Social App™</Link>)}. All Rights Reserved.
                </span>
            </div>
        </footer>
    )
}
