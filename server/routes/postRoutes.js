import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POST
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

//CREATE A POST
router.route('/').post(async (req, res) => {

  console.log("📩 Incoming POST request:", req.body); // Log incoming request

  try {
    const { name, prompt, photo } = req.body;

    // ✅ Check if any required field is missing
    if (!name || !prompt || !photo) {
      console.log("⚠️ Missing fields:", { name, prompt, photo });
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    console.log("📤 Uploading photo to Cloudinary...");

    const photoUrl = await cloudinary.uploader.upload(photo);

    console.log("✅ Cloudinary Upload Successful:", photoUrl);
    console.log("📝 Creating new post in MongoDB...");

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    console.log("🎉 New Post Created Successfully:", newPost);

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

export default router;