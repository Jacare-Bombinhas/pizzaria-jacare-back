import { Router } from "express";
import { body, param } from "express-validator";
import { ProductController } from "../controllers/ProductControler";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post("/", 
  body("name")
    .notEmpty().withMessage("El nombre es obligatorio"),
  body("category")
    .notEmpty().withMessage("La categoría es obligatorio"),
  body("price")
    .notEmpty().withMessage("El precio es obligatorio"),

  handleInputErrors,
  ProductController.createProduct
)

router.get("/", ProductController.getAllProducts)

router.get("/:id", 
  param("id").isMongoId().withMessage("ID no valido"),

  handleInputErrors,
  ProductController.getProductById
)

router.put("/:id", 
  body("name")
    .notEmpty().withMessage("El nombre es obligatorio"),
  body("category")
    .notEmpty().withMessage("La categoría es obligatorio"),
  body("price")
    .notEmpty().withMessage("El precio es obligatorio"),

  handleInputErrors,
  ProductController.updateProduct
)

router.delete("/:id", 
  param("id").isMongoId().withMessage("ID no valido"),

  handleInputErrors,
  ProductController.deleteProduct
)

export default router