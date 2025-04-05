const express = require('express');
const router = express.Router();
const {
    signin,google,signup,google1,signout,store,getOrdersByCustomerId,allitems
  } = require('../controllers/clothauth.controller.js');
  


router.post("/signup", signup); // register
router.post("/signin", signin); // login
router.post("/google", google);
router.post("/google1", google1);
router.get('/signout', signout);

router.post("/rating_store", store);
router.get("/raiting_user/:id", getOrdersByCustomerId);
router.get("/rating_users/items", allitems);

module.exports = router;
