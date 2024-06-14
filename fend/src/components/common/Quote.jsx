import { Link } from "react-router-dom";
import Content from "./ReadMore";

const Quote = ({ page }) => {

    return (
        <div className="flex flex-col gap-2 items-center py-10 px-32">
            <div className="flex gap-6 justify-center overflow-hidden italic">
                <p className="flex font-basker text-start text-4xl md:text-6xl lg:text-9xl rotate-180">,,</p>
                <Link className="flex font-m1m text-2xl md:text-4xl lg:text-6xl" to={`/profile/${page.user.username}`}>
                    <Content className="flex" text={` ${page.text}`} />
                </Link>
                <p className="flex font-basker text-end text-4xl md:text-6xl lg:text-9xl">,,</p>
            </div>
        </div>
                
	);
};

export default Quote;