import type { Request, Response } from "express"

import Product from "../models/Product"
import Category from "../models/Categories"
import SubCategory from "../models/SubCategories"

export class ProductController {
  static createProduct = async (req: Request, res: Response) => {
    const { category, subcategory } = req.body

    const product = new Product(req.body)
    const categ = await Category.findById(category)
    
    try {
      categ.products.push(product.id)

      await product.save()
      await categ.save()
      
      if(subcategory) {
        const subCat = await SubCategory.findById(subcategory)
        subCat.products.push(product.id)
        await subCat.save()
      }
      
      res.send("Producto creado correctamente")
    } catch (error) {
      console.log(error)
    }
  }
  
  static getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await Product.find({})
      res.json(products)
    } catch (error) {
      console.log(error)
    }
  }
  
  static getProductById = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
      const product = await Product.findById(id)

      if(!product) {
        const error = new Error('Producto no encontrado')
        res.status(404).json({error: error.message})
        return
      }

      res.json(product)
    } catch (error) {
      console.log(error)
    }
  }
  
  static updateProduct = async (req: Request, res: Response) => {
    const {id} = req.params
    const { category, subcategory } = req.body

    try {
      const product = await Product.findByIdAndUpdate(id, req.body)
      
      if(!product) {
        const error = new Error('Producto no encontrado')
        res.status(404).json({error: error.message})
        return
      }
      //Updates in category.products
      if(category !== product.category) {
        await Category.findByIdAndUpdate(product.category, {
          $pull: {products: id}
        })
        await Category.findByIdAndUpdate(category, {
          $push: {products: id}
        })
      }
      //Updates in SubCategory.products
      if(subcategory !== product.subcategory) {
        await SubCategory.findByIdAndUpdate(product.subcategory, {
          $pull: {products: id}
        })
        await SubCategory.findByIdAndUpdate(subcategory, {
          $push: {products: id}
        })
      }
      //Saves update in products
      await product.save()
      res.send("Producto actualizado correctamente")
    } catch (error) {
      console.log(error)
    }
  }
  
  static deleteProduct = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
      const product = await Product.findById(id)

      if(!product) {
        const error = new Error('Producto no encontrado')
        res.status(404).json({error: error.message})
        return
      }

      const { category, subcategory } = product

      await Category.findByIdAndUpdate(category, {
        $pull: {products: product._id}
      })
      if(subcategory) {
        await SubCategory.findByIdAndUpdate(subcategory, {
          $pull: {products: product._id}
        })
      }
      await product.deleteOne()
      res.send("Producto eliminado")
    } catch (error) {
      console.log(error)
    }
  }
}


