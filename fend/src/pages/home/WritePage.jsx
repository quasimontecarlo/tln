import Write from "../../components/common/Write";
import { isMobile } from "react-device-detect";
import classNames from "../../components/common/classNames";

const WritePage = () => {
	
	return (
		<>
			<div className={classNames("flex-[4_4_0]", isMobile && "mb-16" || "mt-16")}>

				{/*  CREATE PAGE INPUT */}
				<Write />

			</div>
		</>
	);
};
export default WritePage;