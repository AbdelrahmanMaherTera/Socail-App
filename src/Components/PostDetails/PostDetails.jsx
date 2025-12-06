import React from "react"
import style from "./PostDetails.module.css"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useParams } from "react-router-dom"
import Comment from "../Comment/Comment"
import Post from "../Post/Post"

export default function PostDetails() {

    let {id} = useParams()

    function getPostDetails() {
        return (
            axios.get(`https://linked-posts.routemisr.com/posts/${id}` , {
                headers: {
                    token: localStorage.getItem("userToken")
                }
            })
        )
    }

    let {data , isLoading , isError , error} = useQuery({
        queryKey: ["getPostDetails", id],
        queryFn: getPostDetails,
        select: (data) => data?.data?.post,
    })

    if(isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen pt-[71px]">
                <h2 className="text-2xl font-bold text-red-600">Post not found</h2>
                <p>This post has been deleted or does not exist.</p>
                <Link to="/" className="text-blue-500 underline">Go Home</Link>
            </div>
        )
    }
    
    if(isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-dvh pt-[71px]">
                <span className="loader-loading"></span>
            </div>
        )
    }

    return (
        <>
            <div className="w-full mx-auto md:w-[80%] lg:w-[60%]">
                {
                    data? (
                        <Post postData={data} showViewMoreCommentBtn={false}/>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-screen pt-[71px]">
                            <h2 className="text-2xl font-bold text-red-600">Post not found</h2>
                            <p>This post has been deleted or does not exist.</p>
                            <Link to="/" className="text-blue-500 underline">Go Home</Link>
                        </div>
                    )
                }
            </div>
        </>
    )
}
