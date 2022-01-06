const User= require('../models/Users')
const jwt=require('jsonwebtoken')


//Handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code)
    let errors={email:'',password:''}

    if(err.message === 'Invalid Email')
    errors.email = err.message
    
    if(err.message === 'Invalid Password')
    errors.password = err.message

    //duplicate error
    if(err.code===11000)
    {
        errors[email]='This email is already registered'
        return errors
    }

    // validation error
    if(err.message.includes('user validation failed'))
    (Object.values(err.errors)).forEach( ({properties}) =>{
        errors[properties.path]=properties.message
    })

    return errors
}

const maxAge=60*60*24;

// create jwt token
const createjwt=(id)=>{
    return jwt.sign({id},'this is my secret password',{expiresIn:maxAge})
}

// signup get
module.exports.signup_get= (req, res) => { 
    res.render('signup')
}


// signup post
module.exports.signup_post = async (req,res) => {
const { email, password } = req.body

try {
    const user = await User.create({email,password})
    const token=createjwt(user._id)
    res.cookie('jwt',token,{expiresIn:maxAge*1000})
    res.status(201).json({user:user._id})
}
catch(err) {
    const errors=handleErrors(err)
    res.status(400).json({errors})
}
}

//Login get

module.exports.login_get= (req,res) =>{
res.render('login');
}


// Login Post
module.exports.login_post= async (req,res) =>{

const {email,password} = req.body
try{
    const user = await User.login(email,password)
    const token=createjwt(user._id)
    res.cookie('jwt',token,{expiresIn:maxAge*1000})
    res.status(200).json({user:user._id})
}

catch(err){
    const errors= handleErrors(err)
    res.status(400).json({errors})
}
}