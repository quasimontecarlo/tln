import { useState } from "react";

import Pages from "../../components/common/Pages";

const HomePage = () => {
	const [feedType, setFeedType] = useState("random");
	
	return (
		<>
			<div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
				{/* Header */}
				<div className="flex w-full border-b border-gray-700">
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("random")}
					>
						random
						{feedType === "random" && (
							<div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
						)}
					</div>
					<div
						className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						onClick={() => setFeedType("reading")}
					>
						reading
						{feedType === "reading" && (
							<div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
						)}
					</div>
				</div>

				{/* POSTS */}
				<Pages feedType={feedType}/>
			</div>
		</>
	);
};
export default HomePage;