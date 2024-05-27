import mongoose, { mongo } from "mongoose";

const pageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
        link: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Page",
                default: [],
            }
        ],
        latest: {
            type: Boolean,
            default: true,
        },
    }, { timestamps:true}
);

const Page = mongoose.model("Page", pageSchema);

export default Page;