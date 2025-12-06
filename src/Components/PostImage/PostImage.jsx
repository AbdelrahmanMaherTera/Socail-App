import React, { useEffect, useState } from "react"
import style from "./PostImage.module.css"
import { createPortal } from "react-dom"

export default function PostImage({postImage , postBody}) {

    let [isOpen , setIsOpen] = useState(false)

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(()=>{
        if(isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    return (
        <>
            <div onClick={openModal} className="rounded-lg overflow-hidden border border-gray-100 mb-4 cursor-pointer">
                <img src={postImage} className="w-full h-auto object-cover max-h-[500px]" alt={postBody} />
            </div>

            {
                isOpen ? (
                    createPortal(
                        // Backdrop with Blur
                        <div className="bg-gray-900/50 backdrop-blur-sm fixed inset-0 z-40">
                            <div onClick={closeModal} className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
                                
                                {/* Modal Content */}
                                <div onClick={(e) => e.stopPropagation()} className="relative p-4 w-full sm:max-w-2xl max-h-full">

                                    <img src={postImage} alt={postBody} className="w-full rounded-2xl" />

                                </div>
                            </div>
                        </div>
                    , document.body)
                ) : ("")
            }
        </>
    )
}
