import React from "react"
import style from "./Home.module.css"
import testPhoto from "../../assets/react.svg"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Comment from "./../Comment/Comment";
import { Link } from "react-router-dom"
import CreateComment from "./../CreateComment/CreateComment";
import Post from "../Post/Post"
import CreatePost from "../CreatePost/CreatePost"

export default function Home() {
    
    function getAllPosts() {
        return axios.get(`https://linked-posts.routemisr.com/posts?limit=50&sort=-createdAt`, {
            headers: {
                token: localStorage.getItem("userToken")
            }
        })
    }

    let {data , isError ,isLoading , error} = useQuery({
        queryKey: ["getPosts"],
        queryFn: getAllPosts,
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


    return (
        <>
            <div className="w-full md:w-[80%] lg:w-[60%] mx-auto">
                <CreatePost />
                {
                    data.map((post) => {
                        return (
                            <Post postData={post} key={post.id} />
                        )
                    })
                }
            </div>
        </>
    )
}
