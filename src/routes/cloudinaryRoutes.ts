import { Router } from "express";
import { CloudinaryController } from "../controllers/CloudinaryControler";

const router = Router()

router.post("/", CloudinaryController.updateImage)

router.delete("/:public_id", CloudinaryController.deleteImage)

export default router