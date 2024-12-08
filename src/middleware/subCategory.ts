import type {Request, Response, NextFunction} from "express"
import SubCategory, { ISubCategory } from "../models/SubCategories"

declare global {
  namespace Express {
    interface Request {
      subCat: ISubCategory
    }
  }
}

export async function validateSubCategoryExist(req: Request, res:Response, next: NextFunction) {
  try {
    const {subId} = req.params
    const subCategory = await SubCategory.findById(subId)
    
    if(!subCategory) {
      const error = new Error('Sub-Categoría no encontrada')
      res.status(404).json({error: error.message})
      return
    }
    req.subCat = subCategory
    next()
  } catch (error) {
    res.status(500).json({error: "Hubo un error"})
  }
}