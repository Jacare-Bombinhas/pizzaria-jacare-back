import type { Request, Response } from "express"
import Category from "../models/Categories"
import SubCategory from "../models/SubCategories"


export class CategoryController {
  static createCategory = async (req: Request, res: Response) => {
    const category = new Category(req.body)

    try {
      await category.save()
      res.send("Categoría creada correctamente")
    } catch (error) {
      console.log(error)
    }
  }
  
  static getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await Category.find({}).populate("subCategories").populate("products")
      res.json(categories)      
    } catch (error) {
      console.log(error)
    }
  }

  static getCategoryById = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
      const category = await Category.findById(id).populate("subCategories")

      if(!category) {
        const error = new Error('Categoría no encontrada')
        res.status(404).json({error: error.message})
        return
      }

      res.json(category)
    } catch (error) {
      console.log(error)
    }
  }

  static updateCategory = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
      const category = await Category.findByIdAndUpdate(id, req.body)
      
      if(!category) {
        const error = new Error('Categoría no encontrada')
        res.status(404).json({error: error.message})
        return
      }

      await category.save()
      res.send("Categoría actualizada correctamente")
    } catch (error) {
      console.log(error)
    }
  }

  static deleteCategorie = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
      const category = await Category.findById(id)

      if(!category) {
        const error = new Error('Categoría no encontrada')
        res.status(404).json({error: error.message})
        return
      }

      const subCats = category.subCategories

      const deletePromises = subCats.map(subcatId => {
        const subCatDelete = SubCategory.findByIdAndDelete(subcatId)
        return subCatDelete
      })

      await Promise.all(deletePromises)
      await category.deleteOne()
      res.send("Categoría eliminada")
    } catch (error) {
      console.log(error)
    }
  }
}