import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const navigate = useNavigate();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "failed to create account");
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: (data) => {
			toast.success("account created successfully");
			navigate(`/pic/${data._id}`);
		},
	});


	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className="max-w-screen-xl mx-auto h-screen content-center grid grid-cols-1">
			<div className="flex flex-col justify-center items-center">
				<form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
					<h1 className="text-4xl text-center font-m1m text-primary-content mb-2">-·- join -·-</h1>
					<details className="collapse collapse-plus">
  						<summary className="collapse-title text-info">before signing up, read here</summary>
 						<div className="collapse-content">
							<p>this is a passion project ...</p>
							<p>... done by a clueless newbie</p>
							<p>use a password manager as you ...</p>
							<p className="text-warning">... can't recover your password</p>
							<p>feed me only fake information ...</p>
							<p>... you are willing to loose</p>
							<br></br>
							<p className="text-success">by signing up ...</p>
							<p className="text-success">... you agree to all these terms</p>
 						</div>
					</details>
					<div className="flex gap-4 flex-wrap caret-base-content">
						<label className="flex flex-1 items-center gap-2 input border border-primary border-dotted rounded placeholder-secondary">
							<FaUser />
							<input
								type="text"
								className="grow "
								placeholder="username"
								name="username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					</div>
					<label className="flex items-center gap-2 input border border-primary border-dotted rounded placeholder-secondary">
						<MdPassword />
						<input
							type="password"
							className="grow"
							placeholder="password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					{isError && <p className='justify-start text-error'>{error.message}</p>}
					<button className='justify-end btn btn-primary font-normal font-m1m_mid underline underline-offset-2 btn-ghost btn-sm text-secondary-content text-lg hover:bg-base-100 pe-0'>
						{isPending ? "loading..." : "sign up"}
					</button>
				</form>
			</div>
			<div className="flex-1 flex flex-col mt-6">
				<p className="justify-start">already have an account ?</p>
				<Link className="" to="/login">
					<button className="justify-end btn-primary font-normal font-m1m_mid underline underline-offset-2 btn-ghost btn-sm text-primary-content text-md hover:bg-base-100 p-0">log in</button>
				</Link>
			</div>
		</div>
	);
};
export default SignUpPage;