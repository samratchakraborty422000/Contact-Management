const mongoose =require("mongoose");
const bcrypt = require("bcrypt");

const userSchema=new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email:{
        type: String, 
        required: true,
        unique: true 
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
},
{
    timestamps:true
}
);

userSchema.pre("save", async function (next){
    try{
        if (!this.isModified("password")) {
            return next();
           }
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(this.password, salt);
           this.password = hashedPassword;
           next();
    }
    catch(error){
        throw new Error(error);
    }
});
userSchema.methods.matchPassword= async function (password){
    try{
        await bcrypt.compare(password,this.password);
        return true;
    }
    catch(error){
        throw new Error(error);
    }
};
const User=mongoose.model("User",userSchema);
module.exports=User;