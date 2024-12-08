import { type Request, type Response } from "express"
import { Error } from "mongoose";
import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary";

dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_APIKEY, 
  api_secret: process.env.CLOUDINARY_SECRET
})

export class CloudinaryController {
  static updateImage = async (req: Request, res: Response) => {
    const {image} = req.body
    await cloudinary.uploader.upload(image, 
      {
        resource_type: "image",
        upload_preset: "pizzaria-jacare",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"]
      },
      function(error: Error, result: any) {
        if(error) {
          console.log("error subiendo imagen")
        }
        try {
          console.log(result)
          res.status(200).json(result.public_id)
        } catch (error) {
          console.log("error de respuesta")
        }
      }
    )  
  }
  
  static deleteImage = async (req: Request, res: Response) => {
    const {public_id} = req.params

    await cloudinary.uploader.destroy(public_id,       
      function(error: Error, result: any) {
        if(error) {
          console.log("error subiendo imagen")
        } else {
          console.log(result)
        }
        
      }
    )  
  }
}

