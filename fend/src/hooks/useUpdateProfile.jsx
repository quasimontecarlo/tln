import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const useUpdateUserProfile = () => {


    const queryClient = useQueryClient();
    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await fetch(`/api/users/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: async () => {
            toast.success("profile updated successfully");
            await queryClient.invalidateQueries({ queryKey: ["authUser"] })
            await queryClient.invalidateQueries({ queryKey: ["userProfile"] })
            await queryClient.invalidateQueries({ queryKey: ["pages"] })
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;