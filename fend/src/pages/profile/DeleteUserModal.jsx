import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const DeleteUserModal = ({ authUser }) => {
    
    const queryClient = useQueryClient();

    const [value, setValue] = useState("");
    const placeholder = `delete ${authUser.username} account`;



    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/delete/", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("user deleted successfully");
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
                queryClient.invalidateQueries({ queryKey: ["pages"] }),
            ]);
		},
	});

    function checkDeleteUser() {
        if(placeholder === value) {
            document.getElementById("delete_user_modal").close();
            deleteUser();
        } else {
            toast.error("please type what you see in the placeholder text");
        };

    };

	return (
		<>
            <li><a
                className="hover:bg-base-100 focus:bg-base-100 text-error"
                onClick={(e) => {
                    document.getElementById("delete_user_modal").showModal()
                }}>close_account</a></li>
			<dialog id="delete_user_modal" className="modal">
				<div className="modal-box border rounded-md border-primary shadow-md">
					<h3 className="font-m1m-mid text-secondary text-start text-lg mb-3">-·-·-·-</h3>
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
                        <p>type what you see in the placeholder text</p>
						<div className="flex flex-wrap gap-2 caret-base-content">
							<input
								type="text"
								placeholder={placeholder}
								className="flex-1 input border border-primary border-dotted rounded p-2 input-md placeholder-secondary"
								value={value}
                                onChange={(e) => setValue(e.target.value)} />
						</div>

						<button id="delte" onClick={checkDeleteUser} className="justify-end btn btn-primary font-normal font-m1m_bold underline underline-offset-2 btn-ghost btn-sm text-error hover:bg-base-100 pe-0">
							delete
						</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
			</dialog>
		</>
	);
};
export default DeleteUserModal;