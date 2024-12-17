import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"

import { corsConfig } from "./config/cors"
import {connectDB} from "./config/db"
import productRoutes from "./routes/productRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import cloudinaryRoutes from "./routes/cloudinaryRoutes"
import authRoutes from "./routes/authRoutes"

dotenv.config()

connectDB()

const app = express()

app.use(cors(corsConfig))

// Logging
app.use(morgan("dev"))
 
// Leer datos de form
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/cloudinary", cloudinaryRoutes)


export default app