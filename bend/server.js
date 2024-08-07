import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import pageRoutes from "./routes/page.js"

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(express.json({limit:"5mb"}));    // middleware to parse req.body
app.use(express.urlencoded({ extended: true})); // middleware to parse form data
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pages", pageRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/fend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "fend", "dist", "index.html"));
	});
}


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
});