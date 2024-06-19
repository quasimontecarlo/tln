import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import classNames from "./classNames";
import { isMobile } from "react-device-detect";


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
		<div className={classNames("navbar bg-base-100 max-w-6xl p-0 flex fixed z-10", isMobile && "bottom-0" || "top-0")}>
            <div className="flex-auto pe-2 justify-start btn btn-ghost font-m1m_mid font-normal hover:bg-base-100">
                <Link to={`/`} className="flex text-xl">
                    <p className="hidden md:block">the</p>
                    <p className="hidden md:block text-base-200">lonely</p>
                    <p className="hidden md:block">network</p>
                    <p className="md:hidden">t</p>
                    <p className="md:hidden text-base-200">l</p>
                    <p className="md:hidden">n</p>
                </Link>
            </div>
            <div role="tablist" className="flex-auto tabs tabs-bordered">
                <Link to={write}
                role="tab"
                className={classNames("tab", isMatchingLocation(write) && "tab-active")}
                >
                    write
                </Link>
                <Link to={home}
                role="tab"
                className={classNames("tab", isMatchingLocation(home) && "tab-active")}
                >
                    discovery
                </Link>
                <Link to={reading}
                role="tab"
                className={classNames("tab", isMatchingLocation(reading) && "tab-active")}
                >
                    reading
                </Link>
            </div>

            <div className="flex-auto justify-end me-0">
                {data && (
					<Link
						to={`/profile/${data.username}`}
						className="mt-auto mb-auto flex transition-all duration-100"
					>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-square avatar hover:bg-base-100">
                            <div className="w-8 rounded-md">
                                <img src={data?.picture || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                    </Link>
                    )}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="flex">
                        <button className="btn btn-ghost hover:bg-base-100 justify-end ps-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                            </svg>
                      </button>
                    </div>
                    <ul tabIndex={0} className="z-[1] shadow-l bg-base-100 menu items-end menu-sm rounded-md dropdown-content w-auto">
                        {/*<li><a>Settings</a></li>*/}
                        <li><a
                        className="hover:bg-base-100"
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