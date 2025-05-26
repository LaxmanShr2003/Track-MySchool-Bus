import { Admin } from "typeorm";
import { AppDataSource } from "../config/orm.config";
import { Driver } from "../models/Driver";
import { Student } from "../models/Student";
import { messageFormater } from "./messageFormater";



export const generateUniqueUsername = async(firstName:string,MobileNumber:string)=>{
    const uniqueUserName = firstName+ MobileNumber.slice(6);
    return uniqueUserName;
}