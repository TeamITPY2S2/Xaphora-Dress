import express from 'express'
import { test, updateUser,deleteUser,updateItem,getItem ,deleteItem} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();

router.get('/',test)
router.post("/update/:id",verifyToken,updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)




//items

router.get('/getitem/:id', getItem);//for update fetch data
router.delete("/delete_raiting/:id",verifyToken,deleteItem)

router.put("/updateitem",verifyToken,updateItem)







export default router