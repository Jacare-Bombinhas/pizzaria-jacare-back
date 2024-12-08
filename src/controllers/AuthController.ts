import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../models/User";

export class AuthController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body)
      const {name, password} = req.body

      const userExist = await User.findOne({name})
      if(userExist) {
        const error = new Error("El usuario ya existe")
        res.status(409).json({error: error.message})
        return
      }

      //Hash Password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      
      await user.save()
      res.json("Usuario creado")
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }
  
  static login = async (req: Request, res: Response) => {
    try {
      const {name, password} = req.body
      const user = await User.findOne({name})

      //checks if user exist in db
      if(!user) {
        const error = new Error("Usuario no encontrado")
        res.status(404).json({error: error.message})
        return
      }

      //compares db password with input passpword
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if(!isPasswordCorrect) {
        const error = new Error("Contraseña incorrecta")
        res.status(401).json({error: error.message})
      }

      res.json("autenticado")
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }
}