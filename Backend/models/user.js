//schema

const mongoose=require("mongoose")

const validator=require("validator") //

const bcrypt=require("bcryptjs")

const jwt=require("jsonwebtoken")

const crypto=require("crypto")

//2.create schema

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please Enter your name"],
        maxlength:[30,"Name cannot exceed 30 characters"]
    },
    email:{
        type:String,
        required:[true],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Enter a valid email Id"]
    },
    password:{
        type:String,
        required:[true,"Please enter the password"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"Confirm password"],
        validate:{
            validator: function(e1){
                return e1 === this.password
            },
            message: "Passwords are not same"
        }
    },
    phoneNumber:{
        type:String,
        required:true,
        match: [/^[0-9]{10}$/,"Enter valid phone number"]
    },
    role:{
        type:String,
        enum:["user","admin"],
        default: "user"
    },
    avatar:{
        public_id:String, //both public id & url are from cloudinary
        url:String
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date
},
{timestamps:true} //keeps track of db when created and whenever updated
);

//creating function for hash password
//pre("save") - a func of mongoDB that runs before the data is saved

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,12) //length of the password - 12
    this.passwordConfirm=undefined
})

//pass compare at login time
userSchema.methods.correctPassword=async function(
    candidatePassword, userPassword   //login, sign in 
){
    return await bcrypt.compare(candidatePassword,userPassword)
}

//checks whether the user;s password was changed after getting jwt token
//if yes, the old token is invalid and user must log in again
userSchema.methods.changePasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime()/1000, 10
        )
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//custom method to generate jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    )
}

module.exports=mongoose.model("User",userSchema)