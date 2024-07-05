import { generateTokenAndSetCookie  } from "../lib/utils/generateToken.js";
import User from "../models/user.js";
import Page from "../models/page.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary } from "cloudinary";


export const signup = async (req, res) => {
    try {
        const {username, password} = req.body;

        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400).json({ error: "username is taken"});
        }

        if(password.length < 6) {
            return res.status(400).json({ error: "passw must be at least 6 char long"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);        

        const newUser = new User({
            username,
            password:hashedPassword,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({ 
                _id: newUser._id,
                username: newUser.username,
                readers: newUser.readers,
                reading: newUser.reading,
                picture: newUser.picture,
                banner: newUser.banner,
                })
        } else {
            res.status(400).json({ error: "invalid user data"});
        }

    } catch (error) {
        console.log( "error in signgup controller")
        res.status(500).json({ error: "internal server error"});
    }
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			username: user.username,
			//readers: user.readers,
			//reading: user.reading,
			picture: user.picture,
			banner: user.banner,
		});
	} catch (error) {
		console.log("error in login controller", error.message);
		res.status(500).json({ error: "internal server error" });
	}
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({ message: "logged out"});
    } catch (error) {
        console.log( "error in logout controller", error.message);
        res.status(500).json({ error: "internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -readers");
        res.status(200).json(user);
    } catch (error) {
        console.log( "error in getme controller", error.message );
        res.status(500).json({ error: "internal server error"});
    }
};

export const deleteUser = async (req, res) => {
    try {
        // delete user pages
        const pages = await Page.find({user: req.user._id});
        if (pages) {
            for(let pgId in pages) {
                if(pages[pgId].img) {
                    const imgId = pages[pgId].img.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(imgId);
                };
                await Page.findByIdAndDelete(pages[pgId]._id);
            };
        };
        // delete user from other's reading list
        const readers = await User.find({reading: req.user._id});
        if(readers) {
            for(let reader in readers) {
                await User.findByIdAndUpdate(readers[reader]._id, { $pull: { reading: req.user._id} });
            };
        };
        // delete user from other's readers list
        const readings = await User.find({readers: req.user._id});
        if(readings) {
            for(let reading in readings) {
                await User.findByIdAndUpdate(readings[reading]._id, { $pull: { readers: req.user._id} });
            };
        };
        // delete user picture
        const user = await User.findById(req.user._id);
        if(user.picture) {
            const imgId = user.picture.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        };
        // delete user
        await User.findByIdAndDelete(req.user._id);
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json("user deleted");

    } catch (error) {
        console.log( "error in deleteUser controller", error.message );
        res.status(500).json({ error: "internal server error "+ error.message});
    }
};