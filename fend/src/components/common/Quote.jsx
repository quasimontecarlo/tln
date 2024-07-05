import { Link } from "react-router-dom";
import Content from "./ReadMore";

const Quote = ({ page }) => {

    return (
        <div className="flex flex-col gap-2 items-center my-2 md:my-4 lg:my-8 mx-12 md:mx-16 lg:mx-32">
            <div className="flex md:gap-auto gap-auto lg:py-20 md:py-14 py-8 justify-center italic">
                <p className="flex font-basker text-start text-4xl md:text-7xl lg:text-9xl lg:-translate-y-20 md:-translate-y-12 -translate-y-8 rotate-180">,,</p>
                <Link className="flex font-m1m text-2xl md:text-4xl lg:text-6xl break-all" to={`/profile/${page.user.username}`}>
                    <Content className="flex" text={` ${page.text}`} />
                </Link>
                <p className="flex font-basker text-end text-4xl md:text-7xl lg:text-9xl lg:translate-y-20 md:translate-y-12 translate-y-8">,,</p>
            </div>
        </div>
                
	);
};

export default Quote;