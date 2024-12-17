import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
  name: string
  password: string
  rank: number
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rank: {
    type: Number
  }
})

const User = mongoose.model<IUser>("User", userSchema)
export default User