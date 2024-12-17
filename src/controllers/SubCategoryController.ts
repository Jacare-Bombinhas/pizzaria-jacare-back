import type { Request, Response } from "express"
import SubCategory from "../models/SubCategories"
import Product from "../models/Product"

export class SubCategoryController {
  static createSubCategory = async (req: Request, res: Response) => {
    const subCat = new SubCategory(req.body)
    
    try {
      subCat.category = req.category.id
      req.category.subCategories.push(subCat.id)
      await Promise.allSettled([subCat.save(), req.category.save()])
      res.send("Sub Categoría creada correctamente")     
    } catch (error) {
      console.log(error)
    }
  }

  //gets all the sub catgories that belong to the category in params
  static getCategorySubs = async (req: Request, res: Response) => {
    try {
      const subCat = await SubCategory.find({category: req.category.id})
      res.json(subCat)
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }
 
  static getSubCategoryById = async (req: Request, res: Response) => {
    try {
      if(req.subCat.category.toString() !== req.category.id) {
        const error = new Error("Sub-Categoría no pertenece a la Categoría")
        res.status(400).json({error: error.message})
        return
      }

      res.json(req.subCat)
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }

  static updateSubCategory = async (req: Request, res: Response) => {
    try {
      if(req.subCat.category.toString() !== req.category.id) {
        const error = new Error("Sub-Categoría no pertenece a la Categoría")
        res.status(400).json({error: error.message})
        return
      }

      const {subId} = req.params
      const subCategory = await SubCategory.findByIdAndUpdate(subId, req.body)
      
      if(!subCategory) {
        const error = new Error('Categoría no encontrada')
        res.status(404).json({error: error.message})
        return
      }

      res.send("Sub-Categoría actualizada correctamente")
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }

  static deleteSubCategory = async (req: Request, res: Response) => {
    try {
      const products = await Product.find({subcategory: req.subCat.id})

      if(req.subCat.category.toString() !== req.category.id) {
        const error = new Error("Sub-Categoría no pertenece a la Categoría")
        res.status(400).json({error: error.message})
        return
      }

      //deletes the subcat from the category.subcategorys array
      req.category.subCategories = req.category.subCategories.filter(subcat => subcat.toString() !== req.subCat.id.toString())

      const UpdateProductsPromises = products.map(async (product) => {
        product.subcategory = null
        return await product.save()
      })      

      await Promise.allSettled([req.subCat.deleteOne(), req.category.save(), ...UpdateProductsPromises])

      res.send("Sub-Categoría eliminada")
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }
}
