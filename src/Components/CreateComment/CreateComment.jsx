import React from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

export default function CreateComment({postId}) {
    
    let queryClient = useQueryClient()
    let toastLoadingId

    let schema = z.object({
        content: z.string().min(2, "Comment must be at least 2 characters"),
        post: z.string(),
    })

    let form = useForm({
        defaultValues: { content: "", post: postId },
        resolver: zodResolver(schema),
    })

    let {register , handleSubmit , reset} = form

    function addComment(values) {
        return axios.post(`https://linked-posts.routemisr.com/comments` , values , {
                headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {mutate , isPending} = useMutation({
        mutationFn: (values) => addComment(values),
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Comment Added Successfully")
            reset()
            queryClient.invalidateQueries({queryKey: ["getPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPostDetails", postId]})
            queryClient.invalidateQueries({queryKey: ["getUserPosts"]})
        },
        onError: (error) => {
            toast.dismiss(toastLoadingId)
            toast.error(error.response.data.error)
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Posting comment...")
        }
    })

    function onValidationError(errors) {
        if(errors.content) toast.error(errors.content.message)
    }

    return (
        <div className="mt-4 mb-2">
            <form onSubmit={handleSubmit(mutate , onValidationError)} className="flex items-center gap-2 relative">
                
                {/* Input Field */}
                <input 
                    type="text" 
                    {...register("content")} 
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-indigo-500 focus:border-indigo-500 block pl-4 pr-12 py-2.5 shadow-sm transition-all" 
                    placeholder="Write a comment..." 
                />
                
                {/* Submit Button (Inside or next to input - styling as standalone button here) */}
                <button 
                    type="submit" 
                    disabled={isPending} 
                    className="absolute right-1.5 top-1.5 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-full text-sm p-2 px-4 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isPending ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fa-regular fa-paper-plane"></i>
                    )}
                </button>
            </form>
        </div>
    )
}