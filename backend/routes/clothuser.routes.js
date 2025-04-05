const express = require('express');
const router = express.Router();
const {  updateUser, deleteUser, updateItem, getItem, deleteItem } = require('../controllers/clothuser.controller.js');
const { verifyToken } = require('../utils/verifyUser.js');




router.post("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

// Items
router.get('/getitem/:id', getItem); // for update fetch data
router.delete("/delete_raiting/:id", deleteItem);
router.put("/updateitem", updateItem);

module.exports = router;
