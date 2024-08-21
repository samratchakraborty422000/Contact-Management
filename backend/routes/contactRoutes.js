const express = require('express');
const  {getContact,getContacts,createContact,updateContact,deleteContact} = require('../controllers/contactController');
//const authMiddleware=require("../middlewares/authMiddleware");
const router=express.Router();

//router.use(authMiddleware);
router.get('/contacts',getContacts);
router.post('/contacts',createContact);
router.get('/contacts/:id',getContact);
router.put('/contacts/:id',updateContact);
router.delete('/contacts/:id',deleteContact);

module.exports=router;