import Page from "./Page";
import Quote from "./Quote";
import PageSkeleton from "../skeletons/PageSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";

const Pages = ({ feedType, username }) => {

	const [ items, setItems ] = useState([]);
	const [ index, setIndex ] = useState(0);
	const [ quote, setQuote ] = useState("");


	const getPageEndpoint = () => {
		switch (feedType) {
			case "random":
				return `/api/pages/random?index=${index}`;
			case "reading":
				return `/api/pages/reading?index=${index}`;
			case "mine":
				return `/api/pages/user/${username}?index=${index}`;
			default:
				return `/api/pages/random`;
		}
	};


	const PAGES_ENDPOINT = getPageEndpoint(index);
	
	const { data , isLoading, isRefetching, refetch } = useQuery({
		queryKey: ["pages"],
		queryFn: async (index, quote, items) => {
			try {
				const res = await fetch(PAGES_ENDPOINT);
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				};
				if(data.length > 0)	{

					const quotes = getQuote(data);
					setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

					if(feedType === "random"){
						setItems( prevItems => [...prevItems, ...shuffle(data)]);
					} else {
						setItems( prevItems => [...prevItems, ...data]);
					}
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
		let appended = []

		if(feedType === "random"){
			appended = temp.concat(shuffle(updatedData));
		} else {
			appended = temp.concat(updatedData);
		}
		setItems(appended);
		setIndex( prevIndex => prevIndex + 1);
	}

	function shuffle(pages) {
		return [...pages].sort(() => 0.5 - Math.random());
	};

	function getQuote(data) {
		const quotes = [];
		const min_len = 25;
		const max_len = 85;
		data.forEach(item => item.text.length >= min_len && item.text.length <= max_len && quotes.push(item));
		return quotes;
	};

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
	}, [observerTarget, feedType, username, refetch, index]);

	
	function isEven(n) {
		if(n % 2 == 0) {
			return true
		} else {
			return false
		}
	};


	return (

		<>
			{(isLoading || isRefetching) && (
				<div className="flex flex-col justify-center">
					<PageSkeleton />
					<PageSkeleton />
					<PageSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && items?.length === 0 && <p className="text-center my-4">this page intentionally left blank<br></br>read someone, write something</p>}
			{!isLoading && !isRefetching && items && (
				<div>
					{quote && (
						<ul>
							<Quote key={quote._id} page={quote} />
						</ul>

					)}
					<ul>
						{items.map((item, index) => (
							<Page key={item._id} page={item} dotted={isEven(index+1) && true} />
						))}
					</ul>
					<div ref={observerTarget}></div>
				</div>
			)}
		</>
	);
};
export default Pages;