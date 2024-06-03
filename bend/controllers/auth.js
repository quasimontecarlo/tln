import { generateTokenAndSetCookie  } from "../lib/utils/generateToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "invalid email format" });
        }        

        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400).json({ error: "username is taken"});
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({ error: "email is registered"});
        }

        if(password.length < 6) {
            return res.status(400).json({ error: "passw must be at least 6 char long"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);        

        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({ 
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
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
			email: user.email,
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
        console.log( "erro' in getme controller", error.message );
        res.status(500).json({ error: "internal server error"});
    }
};