import Page from "./Page";
import PageSkeleton from "../skeletons/PageSkeleton";
import { POSTS } from "../../utils/db/dummy";

const Pages = () => {
	const isLoading = false;

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PageSkeleton />
					<PageSkeleton />
					<PageSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Page key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Pages;