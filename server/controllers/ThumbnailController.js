import Thumbnail from "../models/Thumbnail.js";
import { HarmBlockThreshold, HarmCategory } from "@google/genai";
import ai from "../configs/ai.js";
import path from "path";
import fs from 'fs'
import { v2 as cloudinary } from "cloudinary";

const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style'
}

const colorSchemeDescription={
  vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
  sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
  forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
  neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
  purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
  monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
  ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
  pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic'
}

export const GenerateThumbnail = async (req, res) => {
    try {
        const { userId } = req.session;
        const { title, style, aspect_ratio, color_scheme, text_overlay, prompt: user_prompt } = req.body;

        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true
        })

        const model = 'gemini-3-pro-image-preview'
        const generationConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspect_ratio || '16:9',
                imageSize: '1k',

            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF

                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF
                }, {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF
                }
            ]
        }

        let prompt = `create a ${stylePrompts[style]} for: "${title}" `

        if(color_scheme){
            prompt+=`use a ${colorSchemeDescription[color_scheme]} color scheme`
        }
        if(user_prompt){
            prompt+=`Additional details: ${user_prompt}`
        }

        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;

        //generate the image using ai model

        const response=await ai.models.generateContent({
            model,
            contents:prompt,
            config:generationConfig,
        
        })

        // check if the response is valide
        if(!response?.candidates?.[0]?.content?.parts){
            throw new Error("unexpected response")
        }

        const parts=response.candidates[0].content.parts;
        let finalBuffer = null;

        for(const part of parts){
             if(part.inlineData){
                finalBuffer=Buffer.from(part.inlineData.data,'base64')
             }
        }

        const filename=`final-output-${Date.now()}.png`
        const filepath=path.join('images',filename)
        
        // create the image directory if not exits
    fs.mkdirSync('images',{
        recursive:true
    })

    //write the final image to the file
    fs.writeFileSync(filepath,finalBuffer);
    const uploadResult=await cloudinary.uploader.upload(filepath,{
        resource_type:'image'
    })

    thumbnail.image_url=uploadResult.url;

    thumbnail.isGenerating=false;

    await thumbnail.save()

    res.json({message:"Thumbnail Generated",thumbnail})

    //remove image file from disk

    fs.unlinkSync(filepath)

    } catch (error) {   
        console.log(error);
        
        // Handle specific error types with user-friendly messages
        let userMessage = "Failed to generate thumbnail. Please try again.";
        
        if (error.message && typeof error.message === 'string') {
            const errorMsg = error.message.toLowerCase();
            
            // Handle quota/rate limit errors
            if (errorMsg.includes('quota') || errorMsg.includes('rate limit') || error.code === 429) {
                userMessage = "AI service is temporarily unavailable due to high demand. Please try again in a few moments.";
            }
            // Handle invalid API key
            else if (errorMsg.includes('api key') || errorMsg.includes('invalid_argument')) {
                userMessage = "Service configuration error. Please contact support.";
            }
            // Handle network errors
            else if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
                userMessage = "Network error. Please check your connection and try again.";
            }
        }
        
        res.status(500).json({message: userMessage})
    }
}

export const deleteThumbnail=async (req, res)=>{
    try {
        const {id}=req.params;
        const userId=req.session;

        await Thumbnail.findOneAndDelete({_id:id,userId})

        res.json({message:"Thumbnail deleted Successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
}