import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

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

	return (
		<div className="flex p-4 items-start gap-4 border-b border-gray-700 h-full">
			<div className="avatar">
				<div className="w-8 rounded-full">
					<img src={authUser.picture || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className="flex flex-col gap-2 h-full w-full" onSubmit={handleSubmit}>
				<textarea
					className="textarea w-full h-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
					placeholder="tell me something..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div className="flex justify-end border-t py-2 border-t-gray-700">
					<button className="btn btn-primary rounded-full btn-sm text-white px-4">
						{isPending ? "writing..." : "write"}
					</button>
				</div>
				{isError && <div className="text-red-500">{error.message}</div>}
			</form>
		</div>
	);
};
export default Write;