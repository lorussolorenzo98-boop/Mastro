import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    firstname: String,
    surname: String, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String, 
        enum: ['client', 'professional'],
        default: 'client'
    }
},{timestamps: true})

//prima che venga salvato nel db esegui questa funzione
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})

const User = mongoose.model('User', UserSchema) // diciamo a mongoose di creare nel db come definito nello schema

export default User