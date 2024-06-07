import Page from "./Page";
import PageSkeleton from "../skeletons/PageSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";

const Pages = ({ feedType, username }) => {

	const [ items, setItems ] = useState([]);
	const [ index, setIndex ] = useState(0);


	const getPageEndpoint = () => {
		switch (feedType) {
			case "random":
				return `/api/pages/random?index=${index}`;
			case "reading":
				return "/api/pages/reading";
			case "mine":
				return `/api/pages/user/${username}?index=${index}`;
			default:
				return `/api/pages/random`;
		}
	};


	const PAGES_ENDPOINT = getPageEndpoint(index);
	
	const { data , isLoading, refetch, isRefetching }= useQuery({
		queryKey: ["pages"],
		queryFn: async () => {
			try {
				
				const res = await fetch(PAGES_ENDPOINT);
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				};
				if(data.length > 0)	{

					setItems( prevItems => [...prevItems, ...data]);
					setIndex( prevIndex => prevIndex +1);
				};

				return data;
			} catch(error) {
				throw new Error(error)
			}
		}
	});

	const appendPages = async () => {
		const res = await fetch(PAGES_ENDPOINT);
		const temp = [...items];
		const updatedData = await res.json();
		const appended = temp.concat(updatedData);
		setItems(appended);
		setIndex( prevIndex => prevIndex + 1);
	}

	//useEffect(() => {
	//	refetch();
	//}, [feedType, refetch, username);

	const observerTarget = useRef(null);

	useEffect(() => {
	  const observer = new IntersectionObserver(
		entries => {
		  	if (entries[0].isIntersecting) {
				appendPages();
		  	}
		},
		{ threshold: 1 }
	  );
	
	  if (observerTarget.current) {
		observer.observe(observerTarget.current);
	  }
	
	  return () => {
		if (observerTarget.current) { 
		  	observer.unobserve(observerTarget.current);
		}
	  };
	}, [observerTarget, feedType, username, index]);


	return (

		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PageSkeleton />
					<PageSkeleton />
					<PageSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && items?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && items && (
				<div>
					<ul>
						{items.map(item => (
							<Page key={item._id} page={item} />
						))}
					</ul>
					<div ref={observerTarget}></div>
				</div>
			)}
		</>
	);
};
export default Pages;