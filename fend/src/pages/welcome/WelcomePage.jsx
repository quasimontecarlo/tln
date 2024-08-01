import { Link } from "react-router-dom";

const WelcomePage = () => {
	
	return (
		<>
			<div className="flex-[4_4_0] w-full">
                <div className="h-16 flex justify-evenly content-center">
                    <Link to="/login" className="self-center">
                        <button className="btn btn-primary font-normal font-m1m_mid underline underline-offset-2 btn-ghost btn-sm text-info text-md hover:bg-base-100">
					    log in
                        </button>
                    </Link>
                    <Link to="/signup" className="self-center">
                        <button className="btn btn-primary font-normal font-m1m_mid underline underline-offset-2 btn-ghost btn-sm text-success text-md hover:bg-base-100">
					    sign up
                        </button>
                    </Link>
                </div>
                <div className="bg-page-pattern bg-[length:8.49px_8.49px] lg:flex justify-between">
                    <div className="p-4 self-center">
                        <p>&gt;_</p>
                        <p>the text based anti social network</p>
                        <p>where no one, human nor synthetic</p>
                        <p>can interfere with your will to express</p>
                        <p>yourself</p>
                    </div>
                    <div className="p-4 self-center text-end font-m1m_mid text-7xl lg:text-9xl tracking-wide">
                        <p className="translate-y-3 lg:translate-y-5">the</p>
                        <div className="pt-0 flex text-base-200">
                            <p className="grow translate-x-2">lone</p>
                            <p className="flex tracking-tighter">ly</p>
                        </div>
                        <div className="pe-4 lg:pe-7 flex justify-end -translate-y-2 lg:-translate-y-5">
							<p className="-translate-x-2">ne</p>
							<p className="-translate-x-2">t</p>
							<p className="-translate-x-1">w</p>
							<p className="">ork</p>
                        </div>
                    </div>
                </div>
                <div>
                    <br></br>
                    <h1 className="text-center text-4xl lg:text-5xl font-m1m_thin">wait -- what ?</h1>
                    <br></br>
                    <p>is anyone reading?</p>
                    <p className="font-m1m_mid">no comments, likes, advertisements, AI, judgement nor censorship</p>
                    <p>you might be the most read in the platform</p>
                    <p>... no one will ever know</p>
                    <div className="text-right">
                        <p>sign up to join,<br></br>you'll gain your personal account</p>
                        <p>be anonymous and use a password manager</p>
                        <p>as you can't get your password back once lost</p>
                        <p className="font-m1m_thin">~·~·~</p>
                        <p>once joined,</p>
                        <p>you'll be greated by three sections</p>
                        <p>write -|- discovery -|- reading</p>
                        <p>and your profile page, of course</p>
                        <p className="font-m1m_thin">~·~·~</p>
                        <p>in write you write your articles,<br></br>no distractions</p>
                        <p>in discovery you will get the most recent,<br></br>randomly served, set of articles</p>
                        <p>no silly AI algo that tailors your needs</p>
                        <p>just pure randomization,<br></br>like mother nature intended</p>
                        <p>in reading you get who, you decided,<br></br> was worth to keep reading</p>
                        <p className="font-m1m_thin">~·~·~</p>
                        <p>now here comes the quirky side</p>
                        <p>when you're reading someone, only you will know, they won't</p>
                        <p>don't cheer too quickly, the same goes for you</p>
						<p className="font-m1m_thin">~·~·~</p>
						<br></br>
                    </div>
                </div>
			</div>
		</>
	);
};
export default WelcomePage;