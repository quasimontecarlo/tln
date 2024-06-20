import { useState } from "react";
import { isMobile } from "react-device-detect";
import Pages from "../../components/common/Pages";
import classNames from "../../components/common/classNames";

const HomePage = () => {
	const [feedType] = useState("random");
	
	return (
		<>
			<div className={classNames("flex-[4_4_0]", isMobile && "mb-16" || "mt-16")}>

				{/* PAGES */}
				<Pages feedType={feedType}/>
			</div>
		</>
	);
};
export default HomePage;