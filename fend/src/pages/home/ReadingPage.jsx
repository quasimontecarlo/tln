import { useState } from "react";
import { isMobile } from "react-device-detect";
import classNames from "../../components/common/classNames";

import Pages from "../../components/common/Pages";

const ReadingPage = () => {
	const [feedType] = useState("reading");
	
	return (
		<>
			<div className={classNames("flex-[4_4_0]", isMobile && "mb-16" || "mt-16")}>

				{/* PAGES */}
				<Pages feedType={feedType}/>
			</div>
		</>
	);
};
export default ReadingPage;