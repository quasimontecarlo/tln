import User from "../models/user.js";
import Page from "../models/page.js";
import {v2 as cloudinary } from "cloudinary";


export const writePage = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ error : "who are you? user not found"});
        if(!text && !img) {
            return res.status(400).json({ error: "blank pages aren't allowed"});
        }

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPage = new Page({
            user: userId,
            text,
            img,
        });

        await newPage.save();
        res.status(201).json(newPage);
    } catch (error) {
        res.status(500).json({ error: "internal server error"});
        console.log("error in writing a page controller ", error);
    }
};

export const deletePage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if(!page) {
            return res.status(404).json({ error: "can't find the page to delete"})
        }
        if(page.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "you can't delete somone else page"})
        }
        if(!page.latest) {
            return res.status(401).json({error: "can't delete an edited page, find the latest"})
        }

        let pagesToDelete = page.link;
        pagesToDelete.push(req.params.id);
        for(let pgId in pagesToDelete) {
            const pg = await Page.findById(pagesToDelete[pgId]);
            if(pg.img) {
                const imgId = pg.img.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(imgId);
            }
            await Page.findByIdAndDelete(pagesToDelete[pgId]);
        }

        res.status(200).json({ message: "page/s deleted"});
    } catch (error) {
        res.status(500).json({ error: "internal server error"});
        console.log("error in deleting a post controller: ", error);
        
    }
};

export const editPage = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        const page = await Page.findById(req.params.id);
        if(!page) {
            return res.status(404).json({ error: "can't find the page to edit"})
        }
        if(page.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "you can't edit someone else page"})
        }
        if(!page.latest) {
            return res.status(401).json({ error: "you can only edit the latest page"})
        }
        const newPage = new Page({
            user: userId,
            text,
            img,
            link: page.link,
        });
        newPage.link.push(page._id);
        await newPage.save();
        await Page.findByIdAndUpdate(req.params.id, { latest: false} );

        await res.status(201).json(newPage);
    } catch (error) {
        res.status(500).json({ error: "internal server error"});
        console.log("error in editing a page controller: ", error);
    }
};

// will have to eventually rewamp this depending on what i want to support in the UI
export const previousPage = async (req, res) => {
    try{
        const page = await Page.findById(req.params.id);
        if(!page) {
            return res.status(404).json({ error: "can't find the page"});
        }
        
        if(page.link.length > 0) {
            const ppId = page.link[page.link.length -1];
            const ppage = await Page.findById(ppId);
            return res.status(201).json(ppage.text);
        } else {
            return res.status(404).json({ error: "this page was never edited"});
        }
                
    } catch (error) {
        res.status(500).json({ error: "internal server error"});
        console.log("error in finding previous page controller: ", error);

    }
};

export const isEdited = async (req, res) => {
    try{
        const page = await Page.findById(req.params.id);
        if(!page) {
            return res.status(404).json({ error: "can't find the page"});
        }
        if(page.link.length > 0) {
            return res.status(201).json(true);
        } else {
            return res.status(201).json(false);
        }
    } catch (error) {
        res.status(500).json({ error: "internal server error"});
        console.log("error in checking if page was edited controller: ", error);
    }
};

export const getAllPages = async (req, res) => {
    try {
        const pages = await Page.find({latest: true}).sort({ createAt: -1 }).populate({
            path: "user",
            select: "-password -readers -reading -email -createdAt -updatedAt"
        });

        if(pages.length === 0) {
            return res.status(200).json([])
        }
        res.status(200).json(pages);
    } catch(error) {
        console.log("error in getting all pages controller: ", error);
        res.status(500).json({ error: "internal server error" });
    }
};

export const getMyPages = async (req, res) => {
    try {
        const pages = await Page.find({  user: req.params.id, latest: true }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password -readers -reading -email -createdAt -updatedAt"
        });

        if(pages.length === 0) {
            return res.status(200).json([])
        }
        res.status(500).json(pages);
    } catch(error) {
        console.log("error in getting all users pages controller: ", error);
        res.status(500).json({ error: "internal server error" });
    }
};

export const getRandomPages = async (req, res) => {
    try {
        const many = 4;
        const pages = await Page.find({latest: true}).sort({ createAt: -1 }).populate({
            path: "user",
            select: "-password -readers -reading -email -createdAt -updatedAt"
        });

        if(pages.length === 0) {
            return res.status(200).json([])
        }

        const shuffle = [...pages].sort(() => 0.5 - Math.random());
        const randomPages = shuffle.slice(0, many);

        res.status(200).json(randomPages);
    } catch(error) {
        console.log("error in getting random pages controller: ", error);
        res.status(500).json({ error: "internal server error" });
    }
};

export const getReadingPages = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ error: "user not found"});

        const reading = user.reading;
        const readingPages = await Page.find({ user: { $in: reading }, latest: true}).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password -readers -reading -email -createdAt -updatedAt"
        });
        res.status(200).json(readingPages);
    } catch(error) {
        console.log("error in getting the reading pages controller: ", error);
        res.status(500).json({  error: "internal server error"});
    }
};

export const getUserPages = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if(!user) return res.status(404).json({ error: "user not found" });
        const pages = await Page.find({ user: user._id, latest: true }).sort({ createdAt: -1}).populate({
            path: "user",
            select: "-password -readers -reading -email -createdAt -updatedAt"
        });
        if(pages.length === 0) {
            return res.status(200).json([])
        }
        res.status(200).json(pages);
    } catch(error) {
        console.log("error in finding user pages controller: ", error);
        res.status(500).json({ error: "internal server error" });
    }
};