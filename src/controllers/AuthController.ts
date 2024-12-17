import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../models/User";
import { generateJWT } from "../utils/jwt";

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
      res.json("Usuario creado correctamente")
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }
  
  //User for loging in and creating token to stay loged
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
        return
      }
      const token = generateJWT({id: user.id})

      res.json(token)
    } catch (error) {
      res.status(500).json({error: "Hubo un error"})
    }
  }

  //Used to verify if user is alowed to be in the page
  static user = async (req: Request, res: Response) => {
    res.json(req.user)
  }

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({}).select("_id name rank")
      res.json(users)
    } catch (error) {
      console.log(error)
    }
  }

  static getUserById = async (req: Request, res: Response) => {
    const {userById} = req.params

    try {
      const user = await User.findById(userById).select("_id name rank")

      if(!user) {
        const error = new Error('Usuario no encontrado')
        res.status(404).json({error: error.message})
        return
      }

      res.json(user)
    } catch (error) {
      console.log(error)
    }
  }

  static UpdateUser = async (req: Request, res: Response) => {
    const {editUser} = req.params
    const currentUser = req.user

    if(currentUser.rank !== 1) {
      res.send("Acción no permitida")
      return
    }

    try {
      const userToUpdate = await User.findById(editUser)

      if(!userToUpdate) {
        const error = new Error('Usuario inexistente')
        res.status(404).json({error: error.message})
        return
      }

      if(req.body.isPass) {
        const {password} = req.body

        //Hash Password
        const salt = await bcrypt.genSalt(10)
        userToUpdate.password = await bcrypt.hash(password, salt)
      }

      userToUpdate.name = req.body.name
      userToUpdate.rank = req.body.rank
      
      await userToUpdate.save()
      res.send("Usuario actualizado")
    } catch (error) {
      console.log(error)
    }
  }

  static deleteUser = async (req: Request, res: Response) => {
    const {deleteUser} = req.params
    const user = req.user

    if(user.rank !== 1) {
      res.send("Acción no permitida")
      return
    }

    try {
      const userToDelete = await User.findById(deleteUser)

      if(!userToDelete) {
        const error = new Error('Usuario inexistente')
        res.status(404).json({error: error.message})
        return
      }

      await userToDelete.deleteOne()
      res.send("Usuario eliminada")
    } catch (error) {
      console.log(error)
    }
  }
}