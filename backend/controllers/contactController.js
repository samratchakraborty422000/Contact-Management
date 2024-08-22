const asyncHandler = require('express-async-handler');
const Contact=require('../models/contact');
const logger=require('../config/logger');

/*
@desc Get all user contacts
@route GET /api/user/contacts
@access Private
*/
const getContacts=asyncHandler(async (req,res)=>{
    const contacts= await Contact.find({user:req.userId}); //check authMiddleware
    logger.info("all Contacts retrieved");
    res.json(contacts);
});

/*
@desc Get single contact
@route GET /api/user/contacts/:id
@access Private
*/
const getContact=asyncHandler(async (req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(contact && contact.user.toString()===req.userId.toString()) {
        logger.info("Contact retrieved");
        res.json(contact);
    }
    else{
        logger.warn("contact not found or unauthorised access");
        res.status(404);
        throw new Error("Contact not found");
    }
});

/*
@desc Create a new contact
@route POST /api/user/contacts
@access Private
*/
const createContact=asyncHandler(async (req,res)=>{
    const {name,email,phone}=req.body;
    if(!name ||!email ||!phone){
        logger.warn("missing required fields");
        res.status(400);
        throw new Error("Missing required fields");
    }
    const contact=new Contact({
        user:req.userId,
        name,
        email,
        phone
    });
    const createdContact=await contact.save();
    logger.info("new contact created");
    res.status(201).json(createdContact);
});

/*
@desc Update an existing contact
@route PUT /api/user/contacts/:id   (contactSchema ObjectId)
@access Private
*/
const updateContact= asyncHandler(async (req, res)=>{
    const {name,email,phone}=req.body;
    const contact=await Contact.findById(req.params.id);
    if(contact && contact.user.toString()===req.userId ){
        contact.name= name || contact.name;
        contact.email=email || contact.email;
        contact.phone=phone || contact.phone;

        const updatedContact= await contact.save();
        logger.info("contact updated");
        res.json(updatedContact);
    }
    else{
        logger.warn("contact not found or unauthorised access");
        res.status(404);
        throw new Error("Contact not updated");
    }
});

/*
@desc Delete a contact
@route DELETE /api/user/contacts/:id  (contactSchema ObjectId)
@access Private
*/

const deleteContact=asyncHandler(async (req, res)=>{
    const contact=await Contact.findById(req.params.id);
    if(contact && contact.user.toString()===req.userId){
        await Contact.findByIdAndDelete(req.params.id);
        logger.info("contact deleted");
        res.json({message:"Contact deleted"});
    }
    else{
        logger.warn("contact not found or unauthorised access");
        res.status(404);
        throw new Error("Contact not deleted");
    }
});

module.exports={
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
 };
