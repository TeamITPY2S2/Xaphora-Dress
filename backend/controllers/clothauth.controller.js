const UserCloth = require("../models/clothuser.model.js");
const Raitings =require( "../models/clothraiting.model.js");
const bcryptjs =require( 'bcryptjs');
const { errorHandler } = require("../utils/error.js");
const jwt =require( 'jsonwebtoken');

exports.signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashPassword=bcryptjs.hashSync(password,10)
    const newUser=new UserCloth({username,email,password:hashPassword});
    try{
        await newUser.save();
        res.status(201).json({message:"user created successfully"});
    }catch(error){
        next(error);
    }
   
}
//login 
exports.signin =async(req,res,next)=>{
    const{email,password}=req.body
    try{
        const validUser=await UserCloth.findOne({email})
        if(!validUser) return next(errorHandler(404,'user not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,'wrong credentials'))
            const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        const{password:hashedPassword,...rest}=validUser._doc;

        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);

    }catch(error){
        next(error)
    }
}


//item register
exports.store=async(req,res,next)=>{
    const {userId,
        productid,
        customerid,
        reviewText,
        reviewDate,
        averageRating,
        commentReview,
     
        }=req.body;

    //create auto id for orderid
    function idGen(userId){
        const randomString=Math.random().toString(36).substring(2,10);
        const id='ORD'+randomString+userId;
        return id;
    }
    const petId=idGen(userId)
   console.log(petId)

    const newItem=new Raitings({petId,userId,
        productid,
        customerid,
        reviewText,
        reviewDate,
        averageRating,
        commentReview,
        });
    try{
        await newItem.save();
        res.status(202).json({message:"item created successfully"});
    }catch(error){
        next(error);
    }
   
}





//get items by userid
exports.getOrdersByCustomerId = async (req, res, next) => {
    try{
       const customerId=req.params.id;
        const orders=await Raitings.find({userId:customerId})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


//all items
module.exports.allitems = async (req, res, next) => {
    try{
    
        const orders=await Raitings.find({})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


exports.google=async(req,res,next)=>{
    try{
        const user=await UserCloth.findOne({email:req.body.email})

        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:hashedPassword, ...rest}=user._doc;
            const expiryDate=new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);
       
        }else{
            const generatedPassword=
            Math.random().toString(36).slice(-8)+
            Math.random().toString(36).slice(-8)

            const hashedPassword=bcryptjs.hashSync
            (generatedPassword,10);

            const newUser=new UserCloth({username:req.body.name.split(' ').join('').toLowerCase()+
                Math.random().toString(36).slice(-8),
                email:req.body.email,password:hashedPassword,profilePicture:req.body.photo,
            });
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:hashedPassword2, ...rest}=newUser._doc;
            const expiryDate=new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);


        }
    }catch(error){
        next(error)
    }
}


 // Adjust the path as needed
//images
exports. google1 = async (req, res, next) => {
    try {
        const user = await Item.findOne({ email: req.body.itemId });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new Item({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.itemId,
                password: hashedPassword,
                profilePicture: req.body.photo
            });
            
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};






exports. signout=(req,res)=>{
    res.clearCookie('access_token').status(200).json('Signout Success')
}