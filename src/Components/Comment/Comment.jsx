import React, { useEffect } from "react"
import userImage from "../../assets/tl.webp"
import UpdateComment from "../UpdateComment/UpdateComment"
import DeleteComment from "../DeleteComment/DeleteComment"
import { initFlowbite } from "flowbite"

export default function Comment({comment}) {

    useEffect(() => {
        initFlowbite();
    }, []);

    let {content , commentCreator , createdAt , _id , post} = comment
    let isMyComment = commentCreator?._id == localStorage.getItem("userId")
    let editCommentDate = new Date(createdAt).toLocaleString("en-US" , {year: 'numeric' , month: 'numeric' , day: 'numeric', hour: 'numeric' , minute: 'numeric' , hour12: true})

    return (
        <div className="flex items-start gap-3 group">
            {/* Avatar */}
            <div className="shrink-0">
                 {
                    commentCreator.photo === "https://linked-posts.routemisr.com/uploads/undefined" ? (
                        <img src={userImage} className="w-9 h-9 rounded-full object-cover border border-gray-200" alt="user" />
                    ) : (
                        <img src={commentCreator.photo} className="w-9 h-9 rounded-full object-cover border border-gray-200" alt="user" />
                    )
                }
            </div>

            <div className="grow">
                {/* The Bubble */}
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none inline-block min-w-[200px] relative">
                    
                    {/* Header inside bubble */}
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-gray-900 capitalize">
                            {commentCreator.name}
                        </span>
                        
                        {/* Options Menu (Dropdown) */}
                        {isMyComment && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button id="commentOptions" data-dropdown-toggle={`commentDropdownDots${_id}`} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200" type="button">
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button>
                                
                                <div 
                                    id={`commentDropdownDots${_id}`} 
                                    className="z-50 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-xl w-40 border border-gray-100 overflow-hidden" // وسعنا العرض لـ w-40 وظبطنا الظل
                                >
                                    <ul className="py-1 text-sm text-gray-700" aria-labelledby="commentOptions">
                                        {/* المكونات اللي جوا */}
                                        <UpdateComment commentId={_id} postId={post} currentCommentContent={content} />
                                        <DeleteComment commentId={_id} postId={post} />
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 text-sm leading-snug">
                        {content}
                    </p>
                </div>

                {/* Footer (Time) */}
                <div className="ml-2 mt-1">
                    <span className="text-xs text-gray-400 font-medium">{editCommentDate}</span>
                </div>
            </div>
        </div>
    )
}