import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { createPortal } from "react-dom"

export default function UploadProfilePicture() {

    let [isOpen , setIsOpen] = useState(false)
    let queryClient = useQueryClient()
    let toastLoadingId
    let [preview, setPreview] = useState(null)

    function openModal() {
        setIsOpen(true)
        reset()
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

    const maxFileSize = 4000000; // 4MB
    const acceptImageTypes = ["image/jpeg", "image/jpg", "image/png"]

    let schema = z.object({
        photo: z.any()
        .refine((files) => files?.length == 1 , "Please select a profile picture")
        .refine((files) => files?.[0]?.size <= maxFileSize , "Image size must be less than 4MB")
        .refine((files) => acceptImageTypes.includes(files?.[0]?.type) , "Only .jpg, .jpeg, and .png formats are allowed"),
    })

    let form = useForm({
        defaultValues: { photo: "" },
        resolver: zodResolver(schema),
    })

    let {register , handleSubmit , reset , formState} = form

    function handleUploadProfilePicture(values) {
        let myData = new FormData()
        myData.append("photo" , values.photo[0])
        return axios.put(`https://linked-posts.routemisr.com/users/upload-photo` , myData , {
            headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {mutate , isPending , isError , error , reset: resetMutation} = useMutation({
        mutationFn: (values) => handleUploadProfilePicture(values),
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Profile Picture Uploaded Successfully")
            queryClient.invalidateQueries({queryKey: ["getProfileData"]})
            queryClient.invalidateQueries({queryKey: ["getUserPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPostDetails"]})
            closeModal()
        },
        onError: (error) => {
            toast.dismiss(toastLoadingId)
            toast.error(error.response.data.error)
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Uploading...")
        },
    })

    return (
        <>
            {/* Trigger Button (Camera Icon for Avatar Overlay) */}
            <button 
                type="button" 
                onClick={openModal} 
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-white bg-gray-800 hover:bg-gray-900 rounded-full border-2 border-white shadow-md transition-all hover:scale-105 cursor-pointer"
                title="Change Profile Picture"
            >
                <i className="fa-solid fa-camera text-sm"></i>
            </button>

            {
                isOpen ? (
                    createPortal(
                        <div onClick={closeModal} className="bg-gray-900/50 backdrop-blur-sm fixed inset-0 z-50 flex justify-center items-center p-4">
                            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">

                                {/* Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Update Profile Picture
                                    </h3>
                                    <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors">
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <form onSubmit={handleSubmit(mutate)}>
                                        <div className="flex flex-col items-center justify-center w-full mb-6">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                                                {
                                                    preview ? (
                                                        <div className="w-full h-full relative">
                                                            <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                                                                    Change Photo
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <div className="bg-indigo-50 p-4 rounded-full mb-3">
                                                                <i className="fa-solid fa-cloud-arrow-up text-2xl text-indigo-600"></i>
                                                            </div>
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-gray-900">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 4MB)</p>
                                                        </div>
                                                    )
                                                }
                                                <input id="dropzone-file" type="file" {...register("photo" , {onChange: (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) setPreview(URL.createObjectURL(file));
                                                    else setPreview(null);
                                                }})} className="hidden" />
                                            </label>
                                            
                                            {formState.errors.photo && <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {formState.errors.photo.message}</p>}
                                        </div>

                                        {isError && (
                                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 text-center" role="alert">
                                                {error.response.data.error}
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            disabled={isPending} 
                                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {isPending ? "Uploading..." : "Upload Photo"}
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