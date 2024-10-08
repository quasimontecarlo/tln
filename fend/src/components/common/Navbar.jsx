import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import classNames from "./classNames";
import { isMobile } from "react-device-detect";
import DeleteUserModal from "../../pages/profile/DeleteUserModal";


const Navbar = () => {

	const queryClient = useQueryClient();
    let location = useLocation();

    const { data } = useQuery({queryKey: ["authUser"]});

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
    const pp = `/profile/${data?.username}`;

	return (
        <div className={classNames("fixed w-full z-10", isMobile && "bottom-0" || "top-0")}>
            <div className="navbar max-w-[1095px] mx-auto justify-between bg-base-100">
                <div className="btn btn-ghost font-m1m_mid font-normal hover:bg-base-100">
                    <Link to={`/`} className="flex text-xl pe-1">
                        <p className="hidden md:block">the</p>
                        <p className="hidden md:block text-base-200">lonely</p>
                        <p className="hidden md:block">network</p>
                        <p className="md:hidden text-base-200">&gt;</p>
                        <p className="md:hidden">_</p>
                    </Link>
                </div>
                <div role="tablist" className="tabs tabs-bordered">
                    <Link to={write}
                    role="tab"
                    className={classNames(classNames("tab", isMatchingLocation(write) && "tab-active"), !isMobile && "w-28")}
                    >
                        write
                    </Link>
                    <Link to={home}
                    role="tab"
                    className={classNames(classNames("tab", isMatchingLocation(home) && "tab-active"), !isMobile && "w-28")}
                    >
                        discovery
                    </Link>
                    <Link to={reading}
                    role="tab"
                    className={classNames(classNames("tab", isMatchingLocation(reading) && "tab-active"), !isMobile && "w-28")}
                    >
                        reading
                    </Link>
                </div>

                <div className="">
                    {data && (
                        <Link
                            to={pp}
                            reloadDocument
                            className="mt-auto mb-auto flex transition-all duration-100"
                        >
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-square avatar hover:bg-base-100">
                                <div className="w-8 rounded-md">
                                    <img src={data?.picture || "/avatar-placeholder.png"} />
                                </div>
                            </div>
                        </Link>
                        )}
                    <div className={classNames("dropdown", !isMobile ? "dropdown-end" : "dropdown-top dropdown-left")}>
                        <div tabIndex={0} className="flex">
                            <button className="btn btn-ghost hover:bg-base-100 ps-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                </svg>
                        </button>
                        </div>
                        <ul tabIndex={0} className={classNames("z-[1] shadow-l bg-base-100 menu items-end menu-sm rounded-md dropdown-content w-auto", isMobile && "translate-x-8")}>
                            <li><Link
                                    to= {"/about"}
                                    className="hover:bg-base-100 focus:bg-base-100">
                                    credits
                            </Link></li>
                            <DeleteUserModal authUser= { data }/>
                            <li><a
                            className="hover:bg-base-100 focus:bg-base-100"
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}>logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
	);
};
export default Navbar;