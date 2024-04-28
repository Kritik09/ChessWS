import { Request, Response, response } from "express"
import { SIGNUP_SUCCESS } from "../utils/constants"
import { db } from "../db"
const login=async (req:Request,res:Response)=>{

   res.status(200).json({message:"ok"})
}
const signup=async(req:Request,res:Response)=>{
   const {email,username,password}=req.body
   console.log(email,username,password)
   await db.user.create({
      data:{
         username,
         email,
         password
      }
   })
   res.status(200).json(
      {
         type:SIGNUP_SUCCESS
      }
   )
}
export {
   login,
   signup
}