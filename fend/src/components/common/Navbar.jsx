import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


const Navbar = () => {

	const queryClient = useQueryClient();

	const { mutate:logout } = useMutation({
		mutationFn: async() => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				})
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				}

			} catch(error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
		onError: () => {
			toast.error("logout failed");
		},
	});

	const { data } = useQuery({queryKey: ["authUser"]})

	return (
		<div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to={`/`} className="mt-auto flex gap-2 items-start">
                    <a className="btn btn-ghost text-xl">thelonelynetwork</a>
                </Link>
            </div>

            <div role="tablist" className="tabs tabs-bordered">
                <Link to={`/write`} className="flex tab">
                    <a role="tab" className="tab">write</a>
                </Link>
                <Link to={`/`} className="flex tab tab-active">
                    <a role="tab" className="">discovery</a>
                </Link>
                <Link to={`/reading`} className="flex tab">
                    <a role="tab" className="tab tab-active">reading</a>
                </Link>
            </div>

            <div className="flex-none mr-auto border-r border-gray-700">
                {data && (
					<Link
						to={`/profile/${data.username}`}
						className="mt-auto mb-auto flex gap-2 transition-all duration-300 hover:bg-[#181818] p-2 rounded-full"
					>
						<div className="avatar hidden md:inline-flex">
							<div className="w-8 rounded-full">
								<img src={data?.picture || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className="flex justify-between flex-1">
							<div className="hidden md:block">
								<p className="text-white font-bold text-sm w-20 truncate">{data?.username}</p>
								{/*<p className="text-slate-500 text-sm">@{data?.username}</p>*/}
							</div>
							<BiLogOut
							className='w-5 h-5 cursor-pointer'
							onClick={(e) => {
								e.preventDefault();
								logout();
							}}
						/>
						</div>
					</Link>
				)}
            </div>
        </div>
	);
};
export default Navbar;