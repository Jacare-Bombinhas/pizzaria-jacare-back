import type {Request, Response, NextFunction} from "express"
import Category, { ICategory } from "../models/Categories"

declare global {
  namespace Express {
    interface Request {
      category: ICategory
    }
  }
}

export async function validateCategoryExist(req: Request, res:Response, next: NextFunction) {
  try {
    const {categoryId} = req.params
    const category = await Category.findById(categoryId)
    
    if(!category) {
      const error = new Error('Categoría no encontrada')
      res.status(404).json({error: error.message})
      return
    }
    req.category = category
    next()
  } catch (error) {
    res.status(500).json({error: "Hubo un error"})
  }
}