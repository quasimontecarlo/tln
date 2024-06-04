import { useState } from "react";
 
const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="text">
            {isReadMore ? text.slice(0, 500) : text}
            <span
                onClick={toggleReadMore}
                className="read-or-hide text-accent"
                //style={{ color: "green" }}
            >
                {text.length > 500 && isReadMore ? "...read more" : ""}
            </span>
        </p>
    );
};
 
const Content = ({text}) => {
    const content = text;
    return (
        <div className="container">
            {/* <h2> */}
                <ReadMore>
                    {content}
                </ReadMore>
            {/* </h2> */}
        </div>
    );
};
 
export default Content;