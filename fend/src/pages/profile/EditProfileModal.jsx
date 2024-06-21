import { useState, useEffect } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState(
		{
		username: "",
		email: "",
		about: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});


	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();


	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				username: authUser.username,
				email: authUser.email,
				about: authUser.about,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className="btn btn-primary font-normal font-m1m_bold underline underline-offset-2 btn-ghost btn-sm text-secondary-content hover:bg-base-100 pe-0"
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				edit
			</button>
			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box border rounded-md border-primary shadow-md">
					<h3 className="font-m1m-mid text-secondary text-start text-lg mb-3">-·-·-·-</h3>
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className="flex flex-wrap gap-2 caret-base-content">
							<input
								type="text"
								placeholder="username"
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md"
								value={formData.username}
								name="username"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2 caret-base-content ">
							<input
								type="email"
								placeholder="email"
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md placeholder-secondary"
								value={formData.email}
								name="email"
								onChange={handleInputChange}
							/>
							<textarea
								placeholder="about"
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md placeholder-secondary scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-primary scrollbar-track-base-100"
								value={formData.about}
								name="about"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2 caret-base-content">
							<input
								type="password"
								placeholder="current password"
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md placeholder-secondary"
								value={formData.currentPassword}
								name="currentPassword"
								onChange={handleInputChange}
							/>
							<input
								type="password"
								placeholder="new password"
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md placeholder-secondary"
								value={formData.newPassword}
								name="newPassword"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2 caret-base-content">
							<input
								type="text"
								placeholder="link"
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md placeholder-secondary"
								value={formData.link}
								name="link"
								onChange={handleInputChange}
							/>
						</div>
						<button onClick={() => {window.location.href=`/profile/${formData.username}`}} className="justify-end btn btn-primary font-normal font-m1m_bold underline underline-offset-2 btn-ghost btn-sm text-secondary-content hover:bg-base-100 pe-0">update</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;