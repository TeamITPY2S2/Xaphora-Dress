const UserCloth = require("../models/clothuser.model.js");
const Raitings =require( "../models/clothraiting.model.js");
const { errorHandler } = require("../utils/error.js");

const bcryptjs =require( 'bcryptjs');


//register

module.exports.updateUser =async (req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorHandler(401,'you can update only your account!'))

    }
    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser=await UserCloth.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    pasword:req.body.password,
                    profilePicture:req.body.profilePicture,
                },
            },
            {new:true}
        );
        const {password, ...rest}=updateUser._doc;
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

module.exports.deleteUser=async(req,res,next)=>{
    if(req.user.id !==req.params.id){
        return next(errorHandler(401,'you can delete only ypur account'));

    }try{
        await UserCloth.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted....')
    }catch(error){
        next(error)

    }
}





//







module.exports.updateItem =async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Raitings.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}

module.exports.deleteItem = async (req, res, next) => {
    let petId=req.params.id;
    console.log(petId)
    try {
        await Raitings.findByIdAndDelete(petId);
        res.status(200).json('The Order has been deleted');
    } catch (error) {
        next(error);
    }
}


module.exports. getItem= async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await Raitings.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({ success: true, message: "User fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};


































     

