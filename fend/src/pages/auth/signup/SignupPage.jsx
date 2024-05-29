import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10">
			<div className="flex-1 hidden lg:flex items-center  justify-center">
        		<p className=' lg:w-2/3 fill-white'>thelonelynetwork</p>
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
					<p className='w-24 lg:hidden fill-white'>thelonelynetwork</p>
					<h1 className="text-4xl font-extrabold text-primary-content">join today__</h1>
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdOutlineMail />
						<input
							type="email"
							className="grow"
							placeholder="Email"
							name="email"
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<FaUser />
							<input
								type="text"
								className="grow "
								placeholder="Username"
								name="username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					</div>
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword />
						<input
							type="password"
							className="grow"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className="btn btn-primary">sign up</button>
					{isError && <p className="text-error">Something went wrong</p>}
				</form>
				<div className="flex flex-col lg:w-2/3 gap-2 mt-4">
					<p className="text-primary-content text-lg">have an account?</p>
					<Link to="/login">
						<button className="btn btn-outline w-full">sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;