import React from "react"
import style from "./Layout.module.css"
import Navbar from './../Navbar/Navbar';
import { Outlet } from "react-router-dom";
import Footer from './../Footer/Footer';

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto pt-[71px] px-4 overflow-auto bg-gray-50">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
