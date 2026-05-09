import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()
export async function connect () {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connesso al database")
    }
    catch(err) {
        console.error("errore nella connessione al database:", err)
    }
}