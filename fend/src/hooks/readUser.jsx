import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const readUser =() => {
    
    const queryClient = useQueryClient();

    const { mutate:read, isPending } = useMutation ({
        mutationFn: async(userId) => {
            try {
                const res = await fetch(`/api/users/read/${userId}`, {
                    method: "POST",
                });
    
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "something went wrong");
                }
                return data;
            } catch(error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["authUser"]});
        },
        onError: (error) => {
           toast.error(error.message);
        },
    });
    return { read, isPending };
};

export default readUser;