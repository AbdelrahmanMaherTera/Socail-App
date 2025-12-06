import React from "react"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"

export default function DeletePost({postId}) {

    let queryClient = useQueryClient()
    let toastLoadingId
    let navigate = useNavigate()
    let location = useLocation()

    function handleDeletePost() {
        return axios.delete(`https://linked-posts.routemisr.com/posts/${postId}` , {
            headers: { token: localStorage.getItem("userToken") }
        })
    }

    let {mutate , isPending} = useMutation({
        mutationFn: handleDeletePost,
        onSuccess: () => {
            toast.dismiss(toastLoadingId)
            toast.success("Post Deleted Successfully")
            queryClient.invalidateQueries({queryKey: ["getUserPosts"]})
            queryClient.invalidateQueries({queryKey: ["getPosts"]})
            if(location.pathname.includes(postId)) {
                navigate(-1)
            }
        },
        onError: (error) => {
            toast.dismiss(toastLoadingId)
            toast.error(error.response.data.error)
        },
        onMutate: () => {
            toastLoadingId = toast.loading("Deleting Post...")
        },
    })

    return (
        <li 
            onClick={isPending ? undefined : mutate} 
            className={`
                group flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-200
                ${isPending 
                    ? "text-gray-400 cursor-not-allowed bg-gray-50" 
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                }
            `}
        >
            {isPending ? (
                <i className="fa-solid fa-spinner fa-spin text-gray-400"></i>
            ) : (
                <i className="fa-regular fa-trash-can text-red-600 group-hover:text-red-600 transition-colors"></i>
            )}
            
            <span className="font-medium">{isPending ? "Deleting..." : "Delete Post"}</span>
        </li>
    )
}