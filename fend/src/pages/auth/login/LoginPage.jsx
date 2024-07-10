import { useState } from "react";
import { Link } from "react-router-dom";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa";


const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();
	const { mutate:login, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || "something went wrong");
				}
			} catch(error) {
				throw new Error(error);
			}
		},
		
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto h-screen content-center grid grid-cols-1">
			<div className="flex flex-col justify-center items-center">
				<form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
					<h1 className="text-4xl text-center font-m1m text-primary-content mb-2">-| you're back |-</h1>
					<label className="flex input border border-primary border-dotted rounded items-center gap-2 placeholder-secondary caret-base-content">
						<FaUser />
						<input
							type="text"
							className="grow"
							placeholder="username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>
					<label className="flex input border border-primary border-dotted rounded items-center gap-2 placeholder-secondary caret-base-content">
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
					{isError && <p className="justify-start text-error">{error.message}</p>}
					<button className="justify-end btn btn-primary font-normal font-m1m_mid underline underline-offset-2 btn-ghost btn-sm text-secondary-content text-lg hover:bg-base-100 pe-0">
						{isPending ? "loading..." : "log in"}
					</button>
				</form>
			</div>
			<div className="flex flex-col mt-4">
				<p className="justify-start">no account ?</p>
				<Link to="/signup">
					<button className="btn-primary font-normal font-m1m_mid underline underline-offset-2 btn-ghost btn-sm text-primary-content text-md hover:bg-base-100 p-0">sign up</button>
				</Link>
			</div>
		</div>
	);
};
export default LoginPage;