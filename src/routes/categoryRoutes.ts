import { Router } from "express";
import { body, param } from "express-validator";
import { CategoryController } from "../controllers/CategoryControler";
import { handleInputErrors } from "../middleware/validation";
import { SubCategoryController } from "../controllers/SubCategoryController";
import { validateCategoryExist } from "../middleware/category";
import { validateSubCategoryExist } from "../middleware/subCategory";

const router = Router()

//Categories

router.post("/", 
  body("name")
    .notEmpty().withMessage("La categoría es obligatoria"),

  handleInputErrors,
  CategoryController.createCategory
)

router.get("/", CategoryController.getAllCategories)

router.get("/:id", 
  param("id").isMongoId().withMessage("ID no valido"),

  handleInputErrors,
  CategoryController.getCategoryById
)

router.put("/:id", 
  body("name")
    .notEmpty().withMessage("La categoría es obligatoria"),

  handleInputErrors,
  CategoryController.updateCategory
)

router.delete("/:id", 
  param("id").isMongoId().withMessage("ID no valido"),

  handleInputErrors,
  CategoryController.deleteCategorie
)

//Sub-Categories

//makes every router with "categoryId" use validateCategoryExist at start
router.param("categoryId", validateCategoryExist)
router.param("subId", validateSubCategoryExist)

router.post("/:categoryId/subCategory",
  body("nameSub")
    .notEmpty().withMessage("El nombre es obligatorio"),

  SubCategoryController.createSubCategory
)

router.get("/:categoryId/subCategory", 
  SubCategoryController.getCategorySubs
)

router.get("/:categoryId/subCategory/:subId", 
  param("subId").isMongoId().withMessage("ID no valido"),

  SubCategoryController.getSubCategoryById
)

router.put("/:categoryId/subCategory/:subId", 
  param("subId").isMongoId().withMessage("ID no valido"),
  body("nameSub")
  .notEmpty().withMessage("El nombre es obligatorio"),

  handleInputErrors,
  SubCategoryController.updateSubCategory
)

router.delete("/:categoryId/subCategory/:subId", 
  param("subId").isMongoId().withMessage("ID no valido"),

  handleInputErrors,
  SubCategoryController.deleteSubCategory
)

export default router