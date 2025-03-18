import OpenAI from 'openai';
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E');
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await openai.images.generate({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        // Properly access the response data
        const image = aiResponse?.data[0]?.b64_json;
        if (!image) throw new Error("Failed to generate image");

        res.status(200).json({ photo: image });

    } catch (error) {
        console.error("DALL-E API Error:", error);
        res.status(500).send({ error: error.response?.data?.error?.message || "An error occurred while generating the image." });
    }
});

export default router;

