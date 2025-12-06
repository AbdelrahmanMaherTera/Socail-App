import React, { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export default function CreatePost() {

    let queryClient = useQueryClient()
    const acceptImageTypes = ["image/jpeg", "image/jpg", "image/png"]
    let toastLoadingId
    
    // State للمعاينة
    const [preview, setPreview] = useState(null)

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
        error: "Post cannot be empty. Please add text or an image.",
        path: ["body"]
    })

    let form = useForm({
        defaultValues: { body: "", image: "" },
        resolver: zodResolver(schema),
    })

    let {register , handleSubmit , reset , formState} = form

    function handleCreatePost(values) {
        let myFormData = new FormData()
        if(values.body) myFormData.append("body" , values.body)
        if(values.image && values.image.length == 1) myFormData.append("image" , values.image[0])

        return axios.post(`https://linked-posts.routemisr.com/posts` , myFormData , {
            headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {mutate , isPending} = useMutation({
        mutationFn: (values) => handleCreatePost(values),
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Post Added Successfully")
            reset()
            setPreview(null) // تصفير المعاينة
            queryClient.invalidateQueries({queryKey: ["getPosts"]})
            queryClient.invalidateQueries({queryKey: ["getUserPosts"]})
        },
        onError: (error) => {
            toast.dismiss(toastLoadingId)
            toast.error(error.response?.data?.error || "Something went wrong")
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Posting...")
        },
    })

    function onValidationError(errors) {
        if(errors.body) toast.error(errors.body.message)
        if(errors.image) toast.error(errors.image.message)
    }

    // دالة لحذف الصورة المختارة قبل النشر
    const removeImage = () => {
        setPreview(null)
        reset({ image: null }) // تصفير حقل الصورة في الفورم
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 mt-8">
            <h3 className="text-gray-500 font-semibold mb-3 border-b border-gray-100 pb-2">Create Post</h3>
            
            <form onSubmit={handleSubmit(mutate , onValidationError)}>
                
                {/* 1. Text Area Area */}
                <div className="mb-4">
                    <textarea 
                        {...register("body")} 
                        className="w-full bg-gray-50 border-0 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:ring-0 resize-none text-lg min-h-20" 
                        placeholder="What's on your mind?" 
                        rows="2"
                    ></textarea>
                </div>

                {/* 2. Image Preview Area (بيظهر بس لو فيه صورة) */}
                {preview && (
                    <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={preview} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
                        <button 
                            type="button" 
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-gray-900/50 hover:bg-gray-900/70 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center transition-colors"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}

                {/* 3. Footer Actions (Icon Left, Button Right) */}
                <div className="flex items-center justify-between mt-2 pt-2">
                    
                    {/* Image Upload Icon */}
                    <div className="flex items-center">
                        <label htmlFor="photo" className="flex items-center gap-2 cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-green-600 px-3 py-2 rounded-lg transition-colors">
                            <i className="fa-regular fa-image text-xl"></i>
                            <span className="text-sm font-medium">Photo</span>
                            
                            <input 
                                type="file" 
                                id="photo" 
                                className="hidden"
                                {...register("image", {
                                    onChange: (e) => {
                                        const file = e.target.files[0];
                                        if (file) setPreview(URL.createObjectURL(file));
                                    }
                                })} 
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isPending} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm px-6 py-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPending && <i className="fa-solid fa-spinner fa-spin"></i>}
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    )
}