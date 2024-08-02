import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { isMobile } from "react-device-detect";
import classNames from "./classNames";


const Write = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data:authUser } = useQuery({queryKey: ["authUser"]});
	const queryClient = useQueryClient();

	const {mutate:writePage, isPending, isError, error} = useMutation({
		mutationFn: async ({text}) => {
			try {
				const res= await fetch("/api/pages/write", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({text}),
				});
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "something went wrong");
				}
				return data;
			} catch(error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("page written");
			queryClient.invalidateQueries({queryKey: ["pages"]});
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		writePage({text});
	};

	function placeholderText() {
		let text = "tell me something ";
		for(let i = 0; i <= 1000; i++) {
			text += "_";
		}
		return text;
	};

	const pt = placeholderText();

	return (
		<div className="flex p-4 items-start gap-4 border-secondary">
			<form className={classNames("flex flex-col gap-2 w-full", isMobile && "h-[calc(100vh-154px)]")} onSubmit={handleSubmit}>
				<textarea autoFocus
			className="textarea w-full h-[calc(100vh-154px)] p-0 caret-base-content text-lg resize-none border-none focus:outline-none placeholder-secondary"
					placeholder={pt}
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div className={classNames("flex justify-end py-2 border-secondary", !isMobile && "border-t")}>
					<button className="btn btn-primary font-normal font-m1m_bold underline underline-offset-2 btn-ghost btn-sm text-secondary-content hover:bg-base-100 pe-0">
						{isPending ? "publishing..." : "publish"}
					</button>
				</div>
				{isError && <div className="text-error">{error.message}</div>}
			</form>
		</div>
	);
};
export default Write;