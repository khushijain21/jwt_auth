const mongoose = require('mongoose')
const {isEmail}= require('validator')
const brcypt= require('bcrypt')
const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email address']
    },
    password:{
        type:String,
        required:[true,'Please enter the password'],
        unique:true,
        minlength:[6,'Minimum password length is 6']
    }
})

userSchema.pre('save',async function(next){
const salt= await brcypt.genSalt()
this.password = await brcypt.hash(this.password,salt)
next()
})


userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth=await brcypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error('Invalid Password')
    }
    throw Error('Invalid Email')
}
const User= mongoose.model('user',userSchema)

module.exports = User   