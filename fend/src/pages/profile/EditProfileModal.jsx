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
				<div className="modal-box border rounded-md border-gray-700 shadow-md">
					<h3 className="font-bold text-lg my-3">update</h3>
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className="flex flex-wrap gap-2">
							<input
								type="text"
								placeholder="username"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.username}
								name="username"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="email"
								placeholder="email"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.email}
								name="email"
								onChange={handleInputChange}
							/>
							<textarea
								placeholder="about"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.about}
								name="about"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="password"
								placeholder="current password"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.currentPassword}
								name="currentPassword"
								onChange={handleInputChange}
							/>
							<input
								type="password"
								placeholder="new password"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.newPassword}
								name="newPassword"
								onChange={handleInputChange}
							/>
						</div>
						<input
							type="text"
							placeholder=""
							className="flex-1 input border border-gray-700 rounded p-2 input-md"
							value={formData.link}
							name="link"
							onChange={handleInputChange}
						/>
						<button className="btn btn-primary rounded-full btn-sm text-white">Update</button>
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