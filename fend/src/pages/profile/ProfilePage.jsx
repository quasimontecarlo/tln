import { forwardRef, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Pages from "../../components/common/Pages";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import { isMobile } from "react-device-detect";
import classNames from "../../components/common/classNames";

import readUser from "../../hooks/readUser";
import useUpdateUserProfile from "../../hooks/useUpdateProfile";
import Banner from "../../components/common/Banner";

import Cropper from "react-easy-crop";
import getCroppedImg from "../../components/common/cropImage";

const ProfilePage = () => {

	const [banner, setCoverImg] = useState(null);
	const [picture, setProfileImg] = useState(null);

	const bannerRef = useRef(null);
	const pictureRef = useRef(null);

	const navigate = useNavigate();

	const { username } = useParams();

	const { read, isPending } = readUser();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const {data: user, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				}
				return data;
 			} catch(error) {
			throw new Error(error);
			}
		},

	});

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();


	const isMyProfile = authUser._id === user?._id;
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);
	const amIReading = authUser?.reading.includes(user?._id);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				document.getElementById("crop_picture_modal").showModal();
				state === "picture" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		refetch();
	}, [username, refetch]);

	function formatUrl(url) {
		if(!url.includes("http://") && !url.includes("https://")) {
			if (!url.includes("www.")){
                return `https://www.${url}`;
				
			} else {
				return `https://${url}`;
			}
		} else {
			return url;
		}
	};


	// Crop Picture Modal
	const [crop, setCrop] = useState({ x: 128, y: 128 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);
	
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels)
	};

	const onClose = () => {
		setCroppedImage(null)
	};

	const showCroppedImage = async () => {
		try {
		  const croppedImage = await getCroppedImg(
			picture,
			croppedAreaPixels,
		  )
		  document.getElementById("crop_picture_modal").close();
		  setProfileImg(croppedImage);
		} catch (e) {
		  console.error(e)
		}
	};

	return (
		<>
			<div className={classNames("flex-[4_4_0]", isMobile && "mb-16" || "mt-16")}>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
				{(!isLoading || !isRefetching) && !user && <p className="text-center text-lg mt-4">user not found</p>}
				<div className="flex flex-col">
					{!isLoading && !isRefetching && user && (
						<>
							{/* COVER IMG */}
							<div className="group/cover h-72">
								<Banner userId={user?._id}/>
								{/*isMyProfile && (
									<div
										className="relative -top-[calc(14rem-25px)] -right-[calc(100%-30px)] cursor-pointer"
										onClick={() => bannerRef.current.click()}
									>
										<MdEdit className="w-5 h-5 text-base-100" />
									</div>
								)*/}
								<input
									type="file"
									hidden
                                    accept="image/*"
									ref={bannerRef}
									onChange={(e) => handleImgChange(e, "banner")}
								/>
								<input
									type="file"
									hidden
                                    accept="image/*"
									ref={pictureRef}
									onChange={(e) => handleImgChange(e, "picture")}
								/>

								{/* PICTURE MODAL */}
								<dialog id="crop_picture_modal" className="modal">
									<div className="modal-box border rounded-md border-primary shadow-md w-2/3">
										<h3 className="font-m1m-mid text-secondary text-start text-lg mb-3">-·-·-·-</h3>
										<div className="crop-container relative w-full h-96">
											<Cropper
												image={picture}
												crop={crop}
												zoom={zoom}
												zoomSpeed={4}
												aspect={4 / 4}
												showGrid={true}
												zoomWithScroll={true}
												restrictPosition={false}
												onCropChange={setCrop}
												onCropComplete={onCropComplete}
												onZoomChange={setZoom}
												/>
										</div>
										<div className="flex justify-end">
											<button className="focus-visible:outline-none btn-ghost outline-base-100 btn-sm font-normal font-m1m_bold underline underline-offset-2 text-secondary-content hover:bg-base-100 mt-2 p-0" 
													onClick={showCroppedImage}>
													crop
											</button>
										</div>
									</div>
								</dialog>

								{/* USER AVATAR */}
								<div className="relative z-0 bottom-20 left-4">
									<div className="w-32">
									<img className="rounded-md" src={picture || user?.picture || "/avatar-placeholder.png"} />
										<div className="relative -top-[calc(8rem-8px)] -right-[calc(7rem-8px)] cursor-pointer">
											{isMyProfile && (
												<MdEdit
													className="w-4 h-4 text-base-100"
													onClick={() => pictureRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="flex">
								<div className="flex-auto gap-4 px-4">
									<div className="flex">
										<span className="text-md font-m1m_mid">{user?.username}</span>
									</div>
									<span className="text-sm my-1 text-secondary">{user?.about}</span>
									<div className="flex gap-2">
										{user?.link && (
											<div className="flex gap-1 items-center ">
												<>
													<FaLink className="w-3 h-3 text-secondary" />
													<a
														href={formatUrl(user?.link)}
														target="_blank"
														rel="noreferrer"
														className="text-sm text-info hover:underline"
													>
														{user?.link}
													</a>
												</>
											</div>
										)}
										<div className="flex gap-2 items-center">
											<IoCalendarOutline className="w-4 h-4 text-secondary" />
											<span className="text-sm text-secondary">
												{memberSinceDate}
											</span>
										</div>
									</div>
								</div>
								<div className="flex-auto text-end">
									{isMyProfile && <EditProfileModal authUser= { authUser }/>}
									{!isMyProfile && (
										<button
											className="btn btn-primary font-normal font-m1m_bold underline underline-offset-2 btn-ghost btn-sm text-secondary-content hover:bg-base-100 pe-0"
											onClick={() => read(user?._id)}
										>
											{isPending && "loading..."}
											{!isPending && amIReading && "un/read"}
											{!isPending && !amIReading && "read" }
										</button>
									)}
									{(banner || picture) && (
										<button
											className="btn btn-primary font-normal font-m1m_bold underline underline-offset-2 btn-ghost btn-sm text-info hover:bg-base-100 pe-0"
											onClick={ async () => {
												await updateProfile({ banner, picture });
												setProfileImg(null);
												setCoverImg(null);
												navigate(0);
											}}
										>
											{isUpdatingProfile ? "updating..." : "update"}
										</button>
									)}
								</div>
							</div>
							<div className="flex w-full border-b border-primary border-dashed mt-8">
							</div>
						</>
					)}

					<Pages feedType={"mine"} username={ username }/>
				</div>
			</div>
		</>
	);
};
export default ProfilePage;