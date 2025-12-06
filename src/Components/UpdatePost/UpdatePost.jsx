import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { createPortal } from "react-dom"

export default function UpdatePost({postId , postBody}) {

    let [isOpen , setIsOpen] = useState(false)
    let queryClient = useQueryClient()
    let toastLoadingId
    let [preview, setPreview] = useState(null)

    function openModal() {
        setIsOpen(true)
        reset({ body: postBody })
        resetMutation()
        setPreview(null)
    }

    function closeModal() {
        setIsOpen(false)
    }

    useEffect(()=>{
        if(isOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = "unset"
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    const acceptImageTypes = ["image/jpeg", "image/jpg", "image/png"]

    let schema = z.object({
        body: z.string().optional(),
        image: z.any().refine((files) => {
            if (!files || files.length === 0) return true
            return acceptImageTypes.includes(files?.[0]?.type)
        } , "Only .jpg, .jpeg, and .png formats are allowed"),
    }).refine((data) => {
        let hasText = data.body && data.body.trim().length > 0
        let hasImage = data.image && data.image.length == 1
        return hasText || hasImage
    } , {
        error: "Post cannot be empty.",
        path: ["body"]
    })

    let form = useForm({
        defaultValues: { body: "", image: "" },
        resolver: zodResolver(schema),
    })

    let {register , handleSubmit , reset , formState} = form

    function handleUpdatePost(values) {
        let myFormData = new FormData()
        if(values.body) myFormData.append("body" , values.body)
        if(values.image && values.image.length == 1) myFormData.append("image" , values.image[0])

        return axios.put(`https://linked-posts.routemisr.com/posts/${postId}` , myFormData , {
            headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {mutate , isPending , isError , error , reset:resetMutation} = useMutation({
        mutationFn: (values) => handleUpdatePost(values),
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Post Updated Successfully")
            reset()
            queryClient.invalidateQueries({queryKey: ["getPosts"]})
            queryClient.invalidateQueries({queryKey: ["getUserPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPostDetails", postId]})
            closeModal()
        },
        onError: (error) => {
            toast.dismiss(toastLoadingId)
            toast.error(error.response.data.error)
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Updating post...")
        },
    })

    return (
        <>
            <li 
                onClick={openModal} 
                className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 cursor-pointer transition-all duration-200"
            >
                <i className="fa-regular fa-pen-to-square text-indigo-600 group-hover:text-indigo-600 transition-colors"></i>
                <span className="font-medium">Edit Post</span>
            </li>

            {
                isOpen ? (
                    createPortal(
                        <div onClick={closeModal} className="bg-gray-900/50 backdrop-blur-sm fixed inset-0 z-50 flex justify-center items-center p-4">
                            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">

                                {/* Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Update Post
                                    </h3>
                                    <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors">
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <form onSubmit={handleSubmit(mutate)}>
                                        
                                        {/* Text Area */}
                                        <textarea 
                                            {...register("body")} 
                                            rows="3"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 mb-4 resize-none" 
                                            placeholder="What's on your mind?"
                                        ></textarea>

                                        {/* Image Upload Area */}
                                        <div className="flex items-center justify-center w-full mb-4">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                                                {
                                                    preview ? (
                                                        <div className="w-full h-full relative">
                                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm text-xs">
                                                                    Change Photo
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-400 mb-2"></i>
                                                            <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                                            <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                                                        </div>
                                                    )
                                                }
                                                <input id="dropzone-file" type="file" {...register("image" , {onChange: (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) setPreview(URL.createObjectURL(file));
                                                    else setPreview(null);
                                                }})} className="hidden" />
                                            </label>
                                        </div>

                                        {/* Validation Messages */}
                                        {(formState.errors.image || formState.errors.body) && (
                                            <div className="mb-4 text-sm text-red-600 font-medium flex flex-col gap-1">
                                                {formState.errors.image && <p><i className="fa-solid fa-circle-exclamation mr-1"></i>{formState.errors.image.message}</p>}
                                                {formState.errors.body && <p><i className="fa-solid fa-circle-exclamation mr-1"></i>{formState.errors.body.message}</p>}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button 
                                            type="submit" 
                                            disabled={isPending} 
                                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {isPending ? "Updating..." : "Update Post"}
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