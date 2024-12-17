import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import { IProduct } from "./Product";

export interface ISubCategory extends Document {
  nameSub: string, 
  orderNSub: number,
  category: Types.ObjectId,
  products: PopulatedDoc<IProduct & Document>[]
}

const SubCategorySchema: Schema = new Schema({
  nameSub: {
    type: String,
    require: true,
    trim: true
  }, 
  orderNsub: {
    type: Number,
    require: true,
    default: 0
  },
  category: {
    type: Types.ObjectId,
    ref: "Category"
  },
  products: [
    {
      type: Types.ObjectId,
      ref: "Product"
    }
  ]
}, {timestamps: true})

const SubCategory = mongoose.model<ISubCategory>("SubCategory", SubCategorySchema)
export default SubCategory