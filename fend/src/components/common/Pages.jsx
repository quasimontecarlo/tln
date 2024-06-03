import Page from "./Page";
import PageSkeleton from "../skeletons/PageSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Pages = ({ feedType, username }) => {

	const getPageEndpoint = () => {
		switch (feedType) {
			case "random":
				return "/api/pages/random";
			case "reading":
				return "/api/pages/reading";
			case "mine":
				return `/api/pages/user/${username}`;
			default:
				return "/api/pages/random";
		}
	};

	const PAGES_ENDPOINT = getPageEndpoint();

	const { data:pages , isLoading, refetch, isRefetching }= useQuery({
		queryKey: ["pages"],
		queryFn: async () => {
			try {
				
				const res = await fetch(PAGES_ENDPOINT);
				const data = await res.json();
				console.log(res);
				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				}
				return data;
			} catch(error) {
				throw new Error(error)
			}
		}
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	
	return (

		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PageSkeleton />
					<PageSkeleton />
					<PageSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && pages?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && pages && (
				<div>
					{pages.map((page) => (
						<Page key={page._id} page={page} />
					))}
				</div>
			)}
		</>
	);
};
export default Pages;