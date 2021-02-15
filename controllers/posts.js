import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPost = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        // console.log(postMessages);
        res.status(200).json(postMessages);
    
    } catch(err) {
        res.status(404).json({message: err.message}); 
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()}); 

    try {
        await newPost.save();
        console.log(`post created by ${req.userId}`);
        res.status(201).json(newPost);
    } catch(err) {
        res.status(409).json({message: err.message}); 
    }
}

export const updatePost = async (req, res) => {
    const {id : _id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("No post with that id");

    // updated post will have new _id so change id    {...post, _id}
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true})

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const {id: _id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("No post with that id");

    await PostMessage.findByIdAndRemove(_id);
    res.json({message: "Post deleted successfully"});

}

export const likePost = async (req, res) => {
    const {id : _id} = req.params;
    // console.log(req.userId);

    if(!req.userId)
        return res.json({message: "user unauthenticated."})

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("No post with that id");

    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1) {
        //like the post
        post.likes.push(req.userId)
    } else {
        // dislike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});

    res.json(updatedPost);
}