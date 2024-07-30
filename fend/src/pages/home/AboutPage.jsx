import { isMobile } from "react-device-detect";
import classNames from "../../components/common/classNames";

const AboutPage = () => {
	
	return (
	<>
		<div className={classNames("flex-[4_4_0]", isMobile && "mb-16" || "mt-16")}>
		    <div className="content-center grid">
				<p>thelonelynetwork is a product of dissatisfaction with social media</p>
				<p>first and foremost, [i] needed it, [i] needed a product where [i] could share my thoughts</p>
				<p>without being sold, or sold something</p>
				<p>[i] mourn the death of the "early internet"</p>
				<p>before corporations realised how much profitable it is</p>
				<p>[i] wanted to recreate a corner of that world</p>
				<p>a space for the outcast, free from profit, influence and judgement</p>
				<br></br>
				<p>what follows is the f.a.q. section</p>
				<br></br>
				<p className="text-end font-m1m_light">this website is opensource, you can find it's github <a className="underline underline-offset-2" href="https://github.com/quasimontecarlo/tln" target="_blank" rel="noopener noreferrer">here</a></p>
				<p className="text-end font-m1m_light">as noted in the sign_up agreement, it comes as it is</p>
				<p className="text-end font-m1m_light">for security reasons, please refrain to share your personal data here</p>
				<p className="text-end font-m1m_light">that said, rest assured, until [i] will be the one running it</p>
				<p className="text-end font-m1m_light">no data will be sold and tln will run self funded & not for profit</p>
				<p className="text-end font-m1m_light">depending on the amount of traffic [i] might have to resort to</p>
				<p className="text-end font-m1m_light">ceasing the service and run it privately to keep cost manageble</p>
				<p className="text-end font-m1m_light">tln was built following various sources, for some [i] am going to credit and thanks here below</p>
				<p className="text-end font-m1m_light">the backbone of the website was built following this <a className="underline underline-offset-2" href="https://github.com/burakorkmez/twitter-clone" target="_blank" rel="noopener noreferrer">source</a></p>
				<p className="text-end font-m1m_light">the default profile picture is a generative artwork generated with your userid ...</p>
				<p className="text-end font-m1m_light">... it uses many algorithms, from circle packing to convex/concave hulls, thanks to <a className="underline underline-offset-2" href="https://thecodingtrain.com" target="_blank" rel="noopener noreferrer">Daniel Shiffman</a> && <a className="underline underline-offset-2" href="https://www.gorillasun.de" target="_blank" rel="noopener noreferrer">Ahmad Moussa</a> ...</p>
				<p className="text-end font-m1m_light">...for the precious invaluable information</p>
				<p className="text-end font-m1m_light">the banner follows a similar approach, [i] "borrowed" ideas and code from <a className="underline underline-offset-2" href="https://matthewstrom.com" target="_blank" rel="noopener noreferrer">Matthew Ström</a> to give birth to it.</p>
		    </div>
	    </div>
	</>
	);
};
export default AboutPage;