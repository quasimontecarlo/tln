import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import classNames from "./classNames";


const Navbar = () => {

	const queryClient = useQueryClient();
    let location = useLocation();

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

	const { data } = useQuery({queryKey: ["authUser"]});

    function isMatchingLocation(url) {
        if(url === location.pathname)
            return true
        else {
            return false
        }
    };

    const home = "/";
    const write = "/write";
    const reading = "/reading";

	return (
		<div className="navbar bg-base-100 flex max-w-6xl mx-auto p-0">
            <div className="flex-1 justify-start btn btn-ghost hover:bg-base-100">
                <Link to={`/`} className="text-xl">
                    thelonelynetwork
                </Link>
            </div>
            <div role="tablist" className="flex-1 tabs tabs-bordered">
                <Link to={home}
                role="tab"
                className={classNames("tab", isMatchingLocation(home) && "tab-active")}
                >
                    discovery
                </Link>
                <Link to={write}
                role="tab"
                className={classNames("tab", isMatchingLocation(write) && "tab-active")}
                >
                    write
                </Link>
                <Link to={reading}
                role="tab"
                className={classNames("tab", isMatchingLocation(reading) && "tab-active")}
                >
                    reading
                </Link>
            </div>

            <div className="flex-1 justify-end mr-auto">
                {data && (
					<Link
						to={`/profile/${data.username}`}
						className="mt-auto mb-auto flex transition-all duration-100 rounded-full"
					>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-square avatar hover:bg-base-100">
                            <div className="w-8 rounded-full">
                                <img src={data?.picture || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                    </Link>
                    )}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="flex">
                        <button className="btn btn-ghost hover:bg-base-100 justify-end ps-1 pe-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                        </button>
                    </div>
                    <ul tabIndex={0} className="z-[1] shadow-l menu items-end menu-sm dropdown-content w-auto">
                        {/*<li><a>Settings</a></li>*/}
                        <li><a
                        onClick={(e) => {
                        e.preventDefault();
                        logout();
                        }}>logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
	);
};
export default Navbar;