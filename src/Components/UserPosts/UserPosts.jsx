import React from "react"
import style from "./UserPosts.module.css"
import Comment from "../Comment/Comment"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import Post from "../Post/Post"

export default function UserPosts({id}) {

    function getUserPosts() {
        return (
            axios.get(`https://linked-posts.routemisr.com/users/${id}/posts` , {
                headers: {
                    token: localStorage.getItem("userToken")
                }
            })
        )
    }

    let {data , isLoading , isError , error} = useQuery({
        queryKey: ["getUserPosts"],
        queryFn: getUserPosts,
        select: (data) => data?.data?.posts
    })

    if(isError) {
        return (
            <h3>{error.message}</h3>
        )
    }

    if(isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-dvh pt-[71px]">
                <span className="loader-loading"></span>
            </div>
        )
    }

    // console.log(data)

    return (
        <>
            {
                data.length != 0 ? (
                    data.map((post) => {
                        return (
                            <Post postData={post} key={post.id} />
                        )
                    })
                ) : ("")
            }
        </>
    )
}
