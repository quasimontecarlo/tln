import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import Content from "./ReadMore";

const Page = ({ page }) => {
	//const [comment, setComment] = useState("");
	const {data: authUser} = useQuery({queryKey: ["authUser"]});
	const queryClient = useQueryClient();
	const pageOwner = page.user;
	const isMyPage = authUser._id === page.user._id;
	const formattedDate = formatPostDate(page.createdAt);
	//const isLiked = false;
	
	const {mutate:deletePage, isPending: isDeleting} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/pages/${page._id}`,{
					method: "DELETE",
				})
				const data = await res.json();

				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				}
				return data;
			} catch(error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("page deleted");
			queryClient.invalidateQueries({queryKey: ["pages"]});
		},
	})


	//const isCommenting = false;

	const handleDeletePage = () => {
		deletePage();
	};

	//const handlePostComment = (e) => {
	//	e.preventDefault();
	//};

	//const handleLikePost = () => {};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${pageOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={pageOwner.picture || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${pageOwner.username}`} className='font-bold'>
							{pageOwner.username}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							{/*<Link to={`/profile/${postOwner.username}`}>{postOwner.about}</Link>*/}
							<span>!=!</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPage && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePage} />
								)}

								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<p></p>
						<span>
							<Content text={page.text} />
						</span>
						{/*post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)*/}
					</div>
					{/*
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{"post.comments.length"}
								</span>
							</div>
							{ We're using Modal Component from DaisyUI }
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{"post.comments.length" === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}

									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{"post.likes.length"}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
					*/}
				</div>
			</div>
		</>
	);
};
export default Page;