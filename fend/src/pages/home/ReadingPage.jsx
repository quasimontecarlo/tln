import { useState } from "react";

import Pages from "../../components/common/Pages";

const ReadingPage = () => {
	const [feedType, setFeedType] = useState("reading");
	
	return (
		<>
			<div className="flex-[4_4_0] mt-16 mr-auto border-r border-gray-700 min-h-screen">

				{/* POSTS */}
				<Pages feedType={feedType}/>
			</div>
		</>
	);
};
export default ReadingPage;