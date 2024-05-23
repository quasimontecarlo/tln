import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        readers:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        reading:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        picture:{
            type: String,
            default: "",
        },
        banner:{
            type: String,
            default: "",
        },
        about:{
            type: String,
            default: "",
        },
        link:{
            type: String,
            default: "",
        }
    }, 
    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);

export default User;