import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { createPortal } from "react-dom"

export default function UpdateComment({commentId , postId , currentCommentContent}) {
    let [isOpen , setIsOpen] = useState(false)
    let queryClient = useQueryClient()
    let toastLoadingId

    function openModal() {
        setIsOpen(true)
        reset({ content: currentCommentContent })
        resetMutation()
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

    let schema = z.object({
        content: z.string().min(1 , "Comment cannot be empty."),
    })

    let form = useForm({
        defaultValues: { content: "" },
        resolver: zodResolver(schema),
    })

    let {register , handleSubmit , reset , formState} = form

    function handleUpdatePost(values) {
        return axios.put(`https://linked-posts.routemisr.com/comments/${commentId}` , values , {
            headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {mutate , isPending , isError , error , reset:resetMutation} = useMutation({
        mutationFn: (values) => handleUpdatePost(values),
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Comment Updated Successfully")
            reset()
            queryClient.invalidateQueries({queryKey: ["getUserPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPostDetails", postId]})
            closeModal()
        },
        onError: (error) => {
            toast.dismiss(toastLoadingId)
            toast.error(error.response.data.error)
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Updating comment...")
        },
    })

    return (
        <>
            {/* Trigger Button */}
            <li 
                onClick={openModal} 
                className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 cursor-pointer transition-all duration-200"
            >
                <i className="fa-regular fa-pen-to-square text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
                <span className="font-medium">Edit</span>
            </li>

            {
                isOpen ? (
                    createPortal(
                        // Backdrop with Blur
                        <div onClick={closeModal} className="bg-gray-900/50 backdrop-blur-sm fixed inset-0 z-50 flex justify-center items-center p-4">
                            
                            {/* Modal Content */}
                            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">

                                {/* Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Update Comment
                                    </h3>
                                    <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors">
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <form onSubmit={handleSubmit(mutate)}>
                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Your Comment</label>
                                            
                                            {/* Input Field (Clean Style) */}
                                            <input 
                                                type="text" 
                                                {...register("content")} 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-shadow" 
                                                placeholder="Type your new comment..." 
                                            />

                                            {formState.errors.content && (
                                                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <i className="fa-solid fa-circle-exclamation"></i>
                                                    {formState.errors.content.message}
                                                </p>
                                            )}
                                        </div>

                                        {isError && (
                                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                                <span className="font-medium">Error!</span> {error.response.data.error}
                                            </div>
                                        )}
                                        
                                        {/* Submit Button */}
                                        <button 
                                            type="submit" 
                                            disabled={isPending} 
                                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {isPending ? "Updating..." : "Update Comment"}
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