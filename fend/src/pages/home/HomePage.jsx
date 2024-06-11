import { useState } from "react";

import Pages from "../../components/common/Pages";

const HomePage = () => {
	const [feedType, setFeedType] = useState("random");
	
	return (
		<>
			<div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">

				{/* POSTS */}
				<Pages feedType={feedType}/>
			</div>
		</>
	);
};
export default HomePage;