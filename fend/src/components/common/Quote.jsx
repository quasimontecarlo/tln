import { Link } from "react-router-dom";
import Content from "./ReadMore";

const Quote = ({ page }) => {

    return (
        <div className="flex gap-2 items-center py-10 px-32">
            <div className="flex flex-col flex-1 mt-0.5">
                <div className="flex flex-col gap-3 justify-center text-start text-4xl overflow-hidden italic">
                    <p></p>
                    <span>
                        <Content text={`" ${page.text} "`} />
                    </span>
                </div>
                <div className="flex gap-2 justify-end text-2xl">
                    <Link to={`/profile/${page.user.username}`} className="font-bold text-secondary italic">
                        {page.user.username}
                    </Link>
                </div>
            </div>
        </div>
                
	);
};

export default Quote;