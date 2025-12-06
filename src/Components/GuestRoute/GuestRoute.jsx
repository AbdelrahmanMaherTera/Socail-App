import React, { useContext } from "react"
import style from "./GuestRoute.module.css"
import { UserContext } from "../../Context/UserContext"
import { Navigate } from "react-router-dom"

export default function GuestRoute({children}) {
    
    let {userToken} = useContext(UserContext)
    if(!userToken){
        return children
    }
    else{
        return <Navigate to={"/"} />
    }

}
