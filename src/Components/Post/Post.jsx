import React, { useEffect } from "react"
import Comment from "../Comment/Comment"
import CreateComment from "../CreateComment/CreateComment"
import { Link } from "react-router-dom"
import { initFlowbite } from "flowbite"
import UpdatePost from "../UpdatePost/UpdatePost"
import DeletePost from "../DeletePost/DeletePost"
import PostImage from "../PostImage/PostImage"

export default function Post({postData , showViewMoreCommentBtn = true}) {

    useEffect(() => {
        initFlowbite();
    }, []);

    let isMyPost = postData?.user?._id == localStorage.getItem("userId")
    let editPostDate = new Date(postData?.createdAt).toLocaleString("en-US" , {year: 'numeric' , month: 'numeric' , day: 'numeric', hour: 'numeric' , minute: 'numeric' , hour12: true})

    return (
        <>
            {/* التغيير: خلفية بيضاء، بوردر خفيف، ظل ناعم */}
            <div className="bg-white border border-gray-200 my-6 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar with Ring */}
                        <img src={postData?.user?.photo} className="size-12 rounded-full object-cover border border-gray-100 p-0.5" alt="user photo" />
                        <div>
                            <p className="text-gray-900 font-bold text-base capitalize">{postData?.user?.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{editPostDate}
                                
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        {isMyPost && (
                            <>
                                <button id="dropdownMenuIconButton" data-dropdown-toggle={`dropdownDots${postData?.id}`} className="text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-full p-2 transition-colors focus:outline-none" type="button">
                                    <i className="fa-solid fa-ellipsis text-lg"></i>
                                </button>

                                {/* Dropdown menu */}
                                <div 
                                    id={`dropdownDots${postData?.id}`} 
                                    className="z-50 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-xl w-40 border border-gray-100 overflow-hidden"
                                >
                                    <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownMenuIconButton">
                                        <UpdatePost postId={postData?.id} postBody={postData?.body} />
                                        <DeletePost postId={postData?.id} />
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Body Text */}
                {postData?.body && (
                    <p className="mb-4 text-gray-700 text-lg leading-relaxed font-normal">
                        {postData?.body}
                    </p>
                )}

                {/* Image */}
                {postData?.image && (
                    // <div className="rounded-lg overflow-hidden border border-gray-100 mb-4">
                    //     <img src={postData?.image} className="w-full h-auto object-cover max-h-[500px]" alt="post content" />
                    // </div>
                    <PostImage postImage={postData?.image} postBody={postData?.body} />
                )}

                {/* Divider */}
                <hr className="h-px my-4 bg-gray-200 border-0" />

                {/* Actions Section */}
                <CreateComment postId={postData?.id} />

                {/* Comments Section */}
                <div className="mt-4 space-y-4">
                    {postData?.comments?.length !== 0 && (
                        showViewMoreCommentBtn ? (
                            <Comment comment={postData?.comments[0]} />
                        ) : (
                            postData?.comments?.map((currentComment) => (
                                <Comment comment={currentComment} key={currentComment._id} />
                            ))
                        )
                    )}

                    {postData?.comments?.length > 1 && showViewMoreCommentBtn && (
                        <Link to={`/postdetails/${postData.id}`} className="block text-center w-full py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors">
                            View all comments
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}