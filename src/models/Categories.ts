import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ISubCategory } from "./SubCategories";
import { IProduct } from "./Product";

export interface ICategory extends Document {
  name: string,
  orderN: number,
  subCategories: PopulatedDoc<ISubCategory & Document>[],
  products: PopulatedDoc<IProduct & Document>[]
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String, 
    requird: true,
    trim: true
  },
  orderN: {
    type: Number, 
    required: true, 
    default: 0
  },
  subCategories: [
    {
      type: Types.ObjectId,
      ref: "SubCategory"
    }
  ],
  products: [
    {
      type: Types.ObjectId,
      ref: "Product"
    }
  ]
  }, {timestamps: true})
  
const Category = mongoose.model<ICategory>("Category", CategorySchema)
export default Category