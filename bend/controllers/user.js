import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

import User from "../models/user.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select("-password -readers -reading");
        if (!user) {
            return res.status(404).json({error: "user not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getting user profile: ", error.message);
        res.status(500).json({error: error.message});
    }
};

export const readUnreadUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) {
            return res.status(400).json({ error: "can't you read yourself already?" });
        }

        if(!userToModify || !currentUser) {
            return res.status(400).json({ error: "user not found"});
        }
        
        const isReading = currentUser.reading.includes(id);
        

        if(isReading) {
            await User.findByIdAndUpdate(id, { $pull: { readers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $pull: { reading: id} });
            res.status(200).json({ message: "not reading the user anymore" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { readers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $push: { reading: id} });
            res.status(200).json({ message: "reading user" });
        }
    } catch (error) {
        console.log("error in read, unread: ", error.message);
        res.status(500).json({ error: error.message});
    }
};

export const updateUser = async (req, res) => {
    const {username, email, currentPassword, newPassword, about, link} = req.body;
    let {picture, banner} = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({ error: "user not found"});
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "we need both passwords"});
        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({ error: "this is not your current password"});
            if(newPassword.length < 6) {
                return res.status(400).json({ error: "you need to give me at least 6 characters"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(picture) {
            if(user.picture){
                await cloudinary.uploader.destroy(user.picture.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(picture);
            picture = uploadedResponse.secure_url; 
        }

        if(banner) {
            if(user.banner){
                await cloudinary.uploader.destroy(user.banner.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(banner);
            banner = uploadedResponse.secure_url;
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.about = about || user.about;
        user.link = link || user.link;
        user.picture = picture || user.picture;
        user.banner = banner || user.banner;

        user = await user.save();

        // hiding critical data to user response
        user.password = null;
        user.readers = null;
        user.reading = null;

        return res.status(200).json(user);

    } catch (error) {
        console.log("error in updating the user: ", error.message);
        res.status(500).json({ error: error.message});
    }
}